import { TagRepo, OptionRepo } from '../repositories';
import { ProductTag } from '../models/ProductTag';
import { ProductTagOption } from '../models/ProductTagOption';

export class ProductTagService {
  static async getTagById(tagId: number): Promise<ProductTag | null> {
    return await TagRepo.findByTagId(tagId);
  }

  static async validateTagOptions(tagId: number, optionIds: number[]): Promise<boolean> {
    const options = await OptionRepo.findByTagId(tagId);
    const validOptionIds = new Set(options.map(opt => opt.optionId));
    
    return optionIds.every(id => validOptionIds.has(id));
  }

  static async getOptionsByTagId(tagId: number): Promise<ProductTagOption[]> {
    return await OptionRepo.findByTagId(tagId);
  }

  static async getOptionById(optionId: number): Promise<ProductTagOption | null> {
    return await OptionRepo.findByOptionId(optionId);
  }

  static async getAllTags(): Promise<ProductTag[]> {
    return await TagRepo.find() as unknown as ProductTag[];
  }

  static async getProductTags(productId: string): Promise<ProductTag[]> {
    return await TagRepo.findByProductId(productId);
  }

  static async getProductTagOptions(productId: string, tagId: number): Promise<ProductTagOption[]> {
    return await OptionRepo.findByProductIdAndTagId(productId, tagId);
  }

  static async addProductTags(
    productId: string, 
    tags: Array<{ tagId: number; optionIds: number[] }>
  ): Promise<void> {
    const queryRunner = TagRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const tagData of tags) {
        const tag = await this.getTagById(tagData.tagId);
        if (!tag) {
          throw new Error(`标签不存在: tagId=${tagData.tagId}`);
        }

        const isValid = await this.validateTagOptions(tagData.tagId, tagData.optionIds);
        if (!isValid) {
          throw new Error(`无效的标签选项: tagId=${tagData.tagId}`);
        }

        // 使用 Repository 方法替代直接的 SQL 查询
        await TagRepo.addProductTag(productId, tagData.tagId);

        // 添加选项关联
        for (const optionId of tagData.optionIds) {
          await OptionRepo.addProductTagOption(productId, optionId, false);
        }
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  static async removeProductTags(
    productId: string, 
    tagIds: number[]
  ): Promise<void> {
    const queryRunner = TagRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const tagId of tagIds) {
        const options = await OptionRepo.findByTagId(tagId);
        // 删除所有相关的选项关联
        for (const option of options) {
          await OptionRepo.removeProductTagOption(productId, option.optionId);
        }
        // 删除标签关联
        await TagRepo.removeProductTag(productId, tagId);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  static async removeProductTagOption(
    productId: string,
    tagId: number,
    optionId: number
  ): Promise<void> {
    const queryRunner = TagRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await OptionRepo.removeProductTagOption(productId, optionId);
      
      // 检查是否还有其他选项
      const remainingOptions = await OptionRepo.findByProductIdAndTagId(productId, tagId);
      
      // 如果没有其他选项，也删除标签关联
      if (remainingOptions.length === 0) {
        await TagRepo.removeProductTag(productId, tagId);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
} 