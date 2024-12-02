import AppDataSource from '../config/ormconfig';
import { ProductTagOption } from '../models/ProductTagOption';

export const OptionRepo = AppDataSource.getRepository(ProductTagOption).extend({
  async findByOptionId(optionId: number): Promise<ProductTagOption | null> {
    return await this.findOne({
      where: { optionId }
    });
  },

  async findByTagId(tagId: number): Promise<ProductTagOption[]> {
    return await this.find({
      where: { tagId }
    });
  },

  async findByProductIdAndTagId(productId: string, tagId: number): Promise<ProductTagOption[]> {
    return await this.createQueryBuilder('option')
      .innerJoin('product_tag_option_relations', 'ptor', 'ptor.option_id = option.option_id')
      .where('ptor.product_id = :productId', { productId })
      .andWhere('option.tag_id = :tagId', { tagId })
      .getMany();
  },

  async addProductTagOption(productId: string, optionId: number, isDefault: boolean = false) {
    return await this.createQueryBuilder()
      .insert()
      .into('product_tag_option_relations')
      .values({
        productId,
        optionId,
        isDefault
      })
      .execute();
  },

  async removeProductTagOption(productId: string, optionId: number) {
    return await this.createQueryBuilder()
      .delete()
      .from('product_tag_option_relations')
      .where('product_id = :productId', { productId })
      .andWhere('option_id = :optionId', { optionId })
      .execute();
  }
}); 