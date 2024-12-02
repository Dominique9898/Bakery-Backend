import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';
import LOG from '../config/Logger';
import { Category } from '../models/Category';
import { ApiResponse } from '../types/response';

export class CategoryController {

  static async getAllCategories(req: Request, res: Response): Promise<void> {
    LOG.info('CategoryController: getAllCategories Start');

    try {
      const categories = await CategoryService.getAllCategories();
      res.status(200).json({
        success: true,
        data: categories,
        message: 'success'
      } as ApiResponse<Category[]>);
    } catch (error: any) {
      LOG.error(`CategoryController: getAllCategories error: ${error}`);
      res.status(500).json({ success: false, message: error.message } as ApiResponse);
    } finally {
      LOG.info('CategoryController: getAllCategories End');
    }
  };

  static async getCategoryById(req: Request, res: Response): Promise<void> {
    LOG.info(`CategoryController: getCategoryById Start`);
    const categoryId = parseInt(req.params.categoryId, 10);

    LOG.info(`CategoryController: getCategoryById categoryId: ${categoryId}`);

    try {
      const category = await CategoryService.getCategoryById(categoryId);
      LOG.info(`CategoryController: getCategoryById category: ${JSON.stringify(category)}`);
      if (!category) {
        res.status(404).json({ success: false, message: 'Category not found' } as ApiResponse);
        return;
      }
      res.status(200).json(category);
    } catch (error: any) {
      LOG.error(`CategoryController: getCategoryById error: ${error}`);
      res.status(500).json({ success: false, message: error.message } as ApiResponse  );
    } finally {
      LOG.info('CategoryController: getCategoryById End');
    }
  };

  static async getCategoryByName(req: Request, res: Response): Promise<void> {
    LOG.info(`CategoryController: getCategoryByName Start`);
    const { categoryName } = req.params;

    LOG.info(`CategoryController: getCategoryByName categoryName: ${categoryName}`);

    try {
      const category = await CategoryService.getCategoryByName(categoryName);
      if (!category) {
        res.status(404).json({ success: false, message: 'Category not found' } as ApiResponse );
        return;
      }
      LOG.info(`CategoryController: getCategoryByName category: ${JSON.stringify(category)}`);
      res.status(200).json(category);
    } catch (error: any) {
      LOG.error(`CategoryController: getCategoryByName error: ${error}`);
      res.status(500).json({ success: false, message: error.message } as ApiResponse);
    } finally {
      LOG.info('CategoryController: getCategoryByName End');
    }
  };

  static async createCategory(req: Request, res: Response): Promise<void> {
    LOG.info(`CategoryController: createCategory Start`);
    const { categoryName } = req.body;
    // 添加输验证
    if (!categoryName || categoryName.trim() === '') {
      res.status(400).json({ success: false, message: '分类名称不能为空' } as ApiResponse );
      return;
    }

    // 验证分类名称格式（允许中文、英文、数字和常用标点）
    const namePattern = /^[\u4e00-\u9fa5a-zA-Z0-9\s\-_()（）]+$/;
    if (!namePattern.test(categoryName)) {
      res.status(400).json({ success: false, message: '分类名称只能包含中文、英文、数字和常用标点' } as ApiResponse );
      return;
    }

    // 限制名称长度
    if (categoryName.length > 10) {
      res.status(400).json({ success: false, message: '分类名称不能超过10个字符' } as ApiResponse );
      return;
    }

    LOG.info(`CategoryController: createCategory categoryName: ${categoryName}`);

    try {
      const newCategory = await CategoryService.createCategory(categoryName.trim());
      LOG.info(`CategoryController: createCategory newCategory: ${JSON.stringify(newCategory)}`);
      res.status(201).json(newCategory);
    } catch (error: any) {
      LOG.error(`CategoryController: createCategory error: ${error}`);
      res.status(400).json({ success: false, message: error.message } as ApiResponse  );
    } finally {
      LOG.info('CategoryController: createCategory End');
    }
  };

  static async updateCategory(req: Request, res: Response): Promise<void> {
    LOG.info(`CategoryController: updateCategory Start`);
    const categoryId = parseInt(req.params.categoryId, 10);
    const updates = req.body;

    LOG.info(`CategoryController: updateCategory categoryId: ${categoryId}, updates: ${JSON.stringify(updates)}`);

    try {
      const updatedCategory = await CategoryService.updateCategory(categoryId, updates);
      LOG.info(`CategoryController: updateCategory updatedCategory: ${JSON.stringify(updatedCategory)}`);
      res.status(200).json(updatedCategory);
    } catch (error: any) {
      LOG.error(`CategoryController: updateCategory error: ${error}`);
      res.status(400).json({ success: false, message: error.message } as ApiResponse  );
    } finally {
      LOG.info('CategoryController: updateCategory End');
    }
  };

  static async deleteCategory(req: Request, res: Response): Promise<void> {
    LOG.info(`CategoryController: deleteCategory Start`);
    const categoryId = parseInt(req.params.categoryId, 10);

    LOG.info(`CategoryController: deleteCategory categoryId: ${categoryId}`);

    try {
      await CategoryService.deleteCategory(categoryId);
      res.status(200).json({
        success: true,
        message: 'Category deleted successfully'
      } as ApiResponse);
    } catch (error: any) {
      LOG.error(`CategoryController: deleteCategory error: ${error}`);
      res.status(400).json({ success: false, message: error.message } as ApiResponse);
    } finally {
      LOG.info('CategoryController: deleteCategory End');
    }
  };
}