import { Product } from '../models/Product';
import AppDataSource from '../config/ormconfig';

// 创建基础仓库
const baseRepository = AppDataSource.getRepository(Product);

// 扩展基础仓库
export const ProductRepo = baseRepository.extend({
  // 创建新产品
  async createProduct(product: Product): Promise<Product> {
    return await this.save(product);
  },

  // 删除产品
  async deleteProduct(productId: string): Promise<void> {
    await this.delete(productId);
  },

  // 分页获取产品
  async getPaginatedProducts(page: number, pageSize: number): Promise<[Product[], number]> {
    const skip = (page - 1) * pageSize;
    
    return await this.findAndCount({
      skip,
      take: pageSize,
      order: {
        createdAt: 'DESC'
      }
    });
  },

  // 根据ID查找产品
  async findByProductId(productId: string): Promise<Product | null> {
    return await this.findOne({
      where: { productId }
    });
  },

  // 根据名称查找产品
  async findByProductName(productName: string): Promise<Product | null> {
    return await this.findOne({
      where: { name: productName }
    });
  }
}); 
