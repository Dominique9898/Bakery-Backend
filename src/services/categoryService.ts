import { CategoryRepo, ProductRepo } from '../repositories';
import { Category } from '../models/Category';
import { Product } from '../models/Product';

export class CategoryService {
  // 获取所有分类
  static async getAllCategories(): Promise<Category[]> {
    return await CategoryRepo.find();
  }

  // 根据 ID 获取分类
  static async getCategoryById(categoryId: number): Promise<Category | null> {
    return await CategoryRepo.findOneBy({ categoryId });
  }

  // 根据名称获取分类
  static async getCategoryByName(categoryName: string): Promise<Category | null> {
    return await CategoryRepo.findOneBy({ categoryName });
  }

  // 创建分类
  static async createCategory(
    categoryName: string,
  ): Promise<Category> {
    const newCategory = CategoryRepo.create({
      categoryName: categoryName,
    });

    return await CategoryRepo.save(newCategory);
  }

  // 更新分类
  static async updateCategory(
    categoryId: number,
    updates: Partial<Category>
  ): Promise<Category> {
    const category = await CategoryRepo.findOneBy({ categoryId });
    if (!category) {
      throw new Error('Category not found');
    }

    Object.assign(category, updates); // 合并更新字段
    return await CategoryRepo.save(category);
  }

  // 删除分类
  static async deleteCategory(categoryId: number): Promise<void> {
    const category = await CategoryRepo.findOneBy({ categoryId });
    if (!category) {
      throw new Error('Category not found');
    }

    await CategoryRepo.remove(category);
  }

  static async getAllProductsByCategoryId (categoryId: number): Promise<Product[]> {
    return await ProductRepo.findBy({ categoryId });
  }

  static async getAllProductsByCategoryName (categoryName: string): Promise<Product[]> {
    return await ProductRepo.findBy({ category: { categoryName } });
  }
}
