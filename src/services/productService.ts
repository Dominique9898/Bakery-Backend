import { ProductRepo } from '../repositories';
import { Product } from '../models/Product';
import { ImageService } from './imageService';
import { IdGenerator } from '../utils/idGenerator';
import { PaginatedData } from '../types/response';

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
      await queryRunner.commitTransaction();
      
      return {
        product: savedProduct,
        compressedImagePath: imageResult?.path
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      if (imageResult?.path) {
        await ImageService.deleteImage(imageResult.path);
      }
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  static async updateProduct(
    productId: string,
    updates: Partial<Omit<Product, 'productId'>>,
    imageFile?: Express.Multer.File
  ): Promise<Product> {
    const product = await ProductService.getProductById(productId);
    const queryRunner = ProductRepo.manager.connection.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (imageFile) {
        const categoryId = updates.categoryId ?? 0;
        const imageResult = await ImageService.uploadAndCompressImage(imageFile, categoryId);
        updates.imageUrl = imageResult.url;
        
        if (product.imageUrl) {
          await ImageService.deleteImageByUrl(product.imageUrl);
        }
      }

      Object.assign(product, updates);
      const updatedProduct = await queryRunner.manager.save(Product, product);
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
    const product = await ProductService.getProductById(productId);
    if (product.imageUrl) {
      await ImageService.deleteImageByUrl(product.imageUrl);
    }
    await ProductRepo.remove(product);
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