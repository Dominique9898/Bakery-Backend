import { CategoryRepo, ProductRepo } from '../repositories';
import { Category } from '../models/Category';
import { Product } from '../models/Product';

export class CategoryService {
  static async getAllCategories(): Promise<Category[]> {
    return await CategoryRepo.find() as unknown as Category[];
  }

  static async getCategoryById(categoryId: number): Promise<Category> {
    const category = await CategoryRepo.findByCategoryId(categoryId);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  static async getCategoryByName(categoryName: string): Promise<Category> {
    const category = await CategoryRepo.findByCategoryName(categoryName);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  }

  static async createCategory(categoryName: string): Promise<Category> {
    const category = await CategoryRepo.createCategory(categoryName);
    return await CategoryRepo.save(category);
  }

  static async updateCategory(categoryId: number, updates: Partial<Category>): Promise<Category> {
    const category = await CategoryService.getCategoryById(categoryId);
    Object.assign(category, updates);
    return await CategoryRepo.save(category);
  }

  static async deleteCategory(categoryId: number): Promise<void> {
    const category = await CategoryService.getCategoryById(categoryId);
    await CategoryRepo.remove(category);
  }

  static async getProductsByCategoryId(categoryId: number): Promise<Product[]> {
    return await ProductRepo.findBy({ categoryId });
  }

  static async getProductsByCategoryName(categoryName: string): Promise<Product[]> {
    return await ProductRepo.findBy({ category: { categoryName } });
  }
}
