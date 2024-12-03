import { ProductRepo } from '../repositories';
import { Product } from '../models/Product';
import { ProductTag } from '../models/ProductTag';
import { ImageService } from './imageService';
import { IdGenerator } from '../utils/idGenerator';
import { PaginatedData } from '../types/response';
import { ProductTagService } from './productTagService';
import { TagRepo, OptionRepo } from '../repositories';

export class ProductService {

  static async getAllProducts(page: number = 1, pageSize: number = 10): Promise<PaginatedData<Product>> {
    const [items, total] = await ProductRepo.getPaginatedProducts(page, pageSize);

    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize)
    };
  }

  static async getProductById(productId: string): Promise<Product> {
    const product = await ProductRepo.findByProductId(productId);
    if (!product) {
      throw new Error('商品不存在');
    }
    return product;
  }

  static async getProductByName(name: string): Promise<Product | null> {
    return await ProductRepo.findByProductName(name);
  }

  static async createProduct(data: {
    name: string;
    description?: string;
    price: number;
    stock: number;
    categoryId: number;
    status?: 'active' | 'inactive';
    imageFile?: Express.Multer.File;
    tags?: Array<{
      tagId: number;
      optionIds: number[];
    }>;
  }): Promise<{ product: Product; compressedImagePath?: string }> {
    const queryRunner = ProductRepo.manager.connection.createQueryRunner();
    let imageResult: { url: string; path: string } | undefined;
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      imageResult = data.imageFile 
        ? await ImageService.uploadAndCompressImage(data.imageFile, data.categoryId)
        : undefined;

      const newProduct = queryRunner.manager.create(Product, {
        productId: IdGenerator.generateProductId(),
        ...data,
        imageUrl: imageResult?.url
      });

      const savedProduct = await queryRunner.manager.save(newProduct);

      if (data.tags && data.tags.length > 0) {
        for (const tagData of data.tags) {
          const tag = await TagRepo.findByTagId(tagData.tagId);
          if (!tag) {
            throw new Error(`标签不存在: tagId=${tagData.tagId}`);
          }

          await this.validateTagData(tag, tagData.optionIds);

          await TagRepo.addProductTag(savedProduct.productId, tagData.tagId);

          for (const optionId of tagData.optionIds) {
            await OptionRepo.addProductTagOption(savedProduct.productId, optionId, false);
          }
        }
      }

      await queryRunner.commitTransaction();
      
      return {
        product: savedProduct,
        compressedImagePath: imageResult?.path
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (imageResult?.path) {
        await ImageService.deleteProductImage(imageResult.path);
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  private static async validateTagData(tag: ProductTag, optionIds: number[]): Promise<void> {
    const isValid = await ProductTagService.validateTagOptions(tag.tagId, optionIds);
    if (!isValid) {
      throw new Error(`无效的标签选项: tagId=${tag.tagId}`);
    }

    if (tag.required && optionIds.length === 0) {
      throw new Error(`必选标签未选择选项: ${tag.name}`);
    }

    if (!tag.multiSelect && optionIds.length > 1) {
      throw new Error(`单选标签不能选择多个选项: ${tag.name}`);
    }
  }

  static async updateProduct(
    productId: string,
    updates: Partial<Omit<Product, 'productId'>>,
    imageFile?: Express.Multer.File
  ): Promise<Product> {
    const product = await this.getProductById(productId);
    const queryRunner = ProductRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (imageFile) {
        const categoryId = updates.categoryId ?? product.categoryId;
        if (!categoryId) {
          throw new Error('分类ID不能为空');
        }
        const imageResult = await ImageService.uploadAndCompressImage(imageFile, categoryId);
        updates.imageUrl = imageResult.url;
        
        if (product.imageUrl) {
          await ImageService.deleteProductImage(product.imageUrl);
        }
      }

      Object.assign(product, updates);
      const updatedProduct = await ProductRepo.save(product);
      await queryRunner.commitTransaction();
      
      return updatedProduct;
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  static async deleteProduct(productId: string): Promise<void> {
    const product = await this.getProductById(productId);
    
    if (product.imageUrl) {
      await ImageService.deleteProductImage(product.imageUrl);
    }

    await ProductRepo.deleteProduct(productId);
  }

  static async updateStock(productId: string, quantity: number): Promise<Product> {
    const product = await ProductService.getProductById(productId);
    product.stock += quantity;
    
    if (product.stock < 0) {
      throw new Error('库存不足');
    }

    return await ProductRepo.save(product);
  }
}