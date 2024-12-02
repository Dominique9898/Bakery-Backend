import { Category } from '../models/Category';
import AppDataSource from '../config/ormconfig';

// 创建基础仓库
const baseRepository = AppDataSource.getRepository(Category);

// 扩展基础仓库
export const CategoryRepo = baseRepository.extend({
  // 根据分类名称查找
  async findByCategoryName(categoryName: string): Promise<Category | null> {
    return await this.findOneBy({ categoryName });
  },

  // 根据ID查找
  async findByCategoryId(categoryId: number): Promise<Category | null> {
    return await this.findOneBy({ categoryId });
  },

  // 创建新分类
  async createCategory(categoryName: string): Promise<Category> {
    const category = this.create({ categoryName });
    return await this.save(category);
  },

  // 删除分类
  async deleteCategory(categoryId: number): Promise<void> {
    await this.delete(categoryId);
  }
}); 
