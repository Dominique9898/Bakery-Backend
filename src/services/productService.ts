import { ProductRepo } from '../repositories';
import { Product } from '../models/Product';
import { PRODUCT_UPLOAD_DIR } from '../config/paths';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { ensureDirectoryExists } from '../utils/fileUtils';
import { IdGenerator } from '../utils/idGenerator';
import { PaginatedData } from '../types/response';
import config from '../config';
import LOG from '../config/Logger';

// 工具函数：获取文件扩展名
const getFileExtension = (filename: string): string => {
  return filename.slice((filename.lastIndexOf(".") - 1 >>> 0) + 2);
}

// 工具函数：生成安全的文件名
const generateSafeFileName = (originalName: string): string => {
  const ext = getFileExtension(originalName);
  const baseName = originalName
    .replace(/\.[^/.]+$/, "") // 移除扩展名
    .replace(/[^a-zA-Z0-9-_]/g, "-") // 替换非法字符为连字符
    .toLowerCase(); // 转为小写

  return `${baseName}-${Date.now()}.${ext}`;
}

export class ProductService {
    // 根据环境获取基础URL
    private static getBaseUrl(): string {
      const isProduction = process.env.NODE_ENV === 'production';
      if (isProduction) {
          // 生产环境使用 NGINX 代理 URL
          return process.env.NGINX_PROXY_URL || 'http://114.132.42.5/uploads';
      } else {
          // 开发环境使用本地地址
          const host = config.host || 'localhost';
          const port = config.port || 30100;
          return `http://${host}:${port}/uploads`;
      }
  }
  /**
   * 
   * @param imageFile 
   * @param categoryId 
   * @returns url: 压缩后的图片URL
   * @returns path: 压缩后的图片路径
   */
    private static async uploadAndCompressImage(
      imageFile: Express.Multer.File,
      categoryId: number
    ): Promise<{ url: string; path: string }> {
      // 确保分类目录存在
      const categoryPath = path.join(PRODUCT_UPLOAD_DIR, categoryId.toString());
      ensureDirectoryExists(categoryPath);

      // 使用原始文件名生成新文件名
      const originalName = imageFile.originalname;
      const filename = generateSafeFileName(originalName);
      const filePath = path.join(categoryPath, filename);

      // 使用 Sharp 压缩图片
      await sharp(imageFile.path)
        .resize(800) // 调整图片大小为宽度800px
        .jpeg({ quality: 80 }) // 压缩为JPEG格式，质量80%
        .toFile(filePath);

      // 删除原始上传的文件
      fs.unlinkSync(imageFile.path);

      // 生成相对路径
      const relativePath = `products/${categoryId}/${filename}`;
      
      return {
        url: `${this.getBaseUrl()}/${relativePath}`,
        path: filePath
      };
    }

    // 获取所有商品（带分页）
    static async getAllProducts(page: number = 1, pageSize: number = 10): Promise<PaginatedData<Product>> {
      const [items, total] = await ProductRepo.findAndCount({
        relations: ['category'],
        skip: (page - 1) * pageSize,
        take: pageSize,
        order: {
          createdAt: 'DESC'
        }
      });

      return {
        items,
        total,
        page,
        pageSize,
        totalPages: Math.ceil(total / pageSize)
      };
    }
  
    // 根据 ID 获取商品
    static async getProductById(productId: string): Promise<Product | null> {
      return await ProductRepo.findOne({
        where: { productId },
        relations: ['category']
      });
    }

    // 根据名称获取商品
    static async getProductByName(name: string): Promise<Product | null> {
      return await ProductRepo.findOne({
        where: { name },
        relations: ['category']
      });
    }
  
    // 创建商品
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
      await queryRunner.connect();
      await queryRunner.startTransaction();

      let compressedImagePath: string | undefined;

      try {
        let imageUrl: string | undefined;

        if (data.imageFile) {
          const imageResult = await this.uploadAndCompressImage(data.imageFile, data.categoryId);
          imageUrl = imageResult.url;
          compressedImagePath = imageResult.path;
        }

        const newProduct = queryRunner.manager.create(Product, {
          productId: IdGenerator.generateProductId(),
          name: data.name,
          description: data.description,
          price: data.price,
          stock: data.stock,
          categoryId: data.categoryId,
          status: data.status || 'active',
          imageUrl
        });

        const savedProduct = await queryRunner.manager.save(newProduct);
        await queryRunner.commitTransaction();
        
        return {
          product: savedProduct,
          compressedImagePath
        };
      } catch (error) {
        await queryRunner.rollbackTransaction();
        // 如果发生错误，删除已压缩的图片
        if (compressedImagePath && fs.existsSync(compressedImagePath)) {
          fs.unlinkSync(compressedImagePath);
        }
        throw error;
      } finally {
        await queryRunner.release();
      }
    }
  
    // 更新商品
    static async updateProduct(
      productId: string,
      updates: Partial<Omit<Product, 'productId'>>,
      imageFile?: Express.Multer.File
    ): Promise<Product> {
      const product = await ProductRepo.findOneBy({ productId });
      if (!product) {
        throw new Error('商品不存在');
      }

      const queryRunner = ProductRepo.manager.connection.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();

      try {
        if (imageFile) {
          // 确保使用有效的 categoryId
          const categoryId = updates.categoryId ?? product.categoryId;
          if (!categoryId) {
            throw new Error('商品必须属于一个分类');
          }

          const imageResult = await this.uploadAndCompressImage(imageFile, categoryId);
          updates.imageUrl = imageResult.url;
          LOG.info(`ProductService: updateProduct updates.imageUrl: ${updates.imageUrl}`);
          // 删除旧图片（仅在新图片上传成功后）
          if (product.imageUrl) {
            // 从完整URL中提取相对路径
            const urlParts = product.imageUrl.split('/uploads/');
            LOG.info(`ProductService: updateProduct urlParts: ${urlParts}`);
            if (urlParts.length > 1) {
              const relativePath = urlParts[1];
              const oldImagePath = path.join(PRODUCT_UPLOAD_DIR, relativePath);
              if (fs.existsSync(oldImagePath)) {
                fs.unlinkSync(oldImagePath);
              }
            }
          }
        }

        // 合并更新
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
  
    // 删除商品
    static async deleteProduct(productId: string): Promise<void> {
      const product = await ProductRepo.findOneBy({ productId });
      if (!product) {
        throw new Error('商品不存在');
      }

      // 删除商品图片
      if (product.imageUrl) {
        const imagePath = path.join(PRODUCT_UPLOAD_DIR, product.imageUrl);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }
  
      await ProductRepo.remove(product);
    }

    // 更新商品库存
    static async updateStock(productId: string, quantity: number): Promise<Product> {
      const product = await ProductRepo.findOneBy({ productId });
      if (!product) {
        throw new Error('商品不存在');
      }

      product.stock += quantity;
      if (product.stock < 0) {
        throw new Error('库存不足');
      }

      return await ProductRepo.save(product);
    }
}