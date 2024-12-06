import { Request, Response } from 'express';
import { CategoryService } from '../services/categoryService';
import LOG from '../config/Logger';
import { ErrorHandler } from '../utils/errorHandler';
import { ResponseHandler } from '../utils/responseHandler';
import { NotFoundError, ValidationError } from '../types/errors';

export class CategoryController {

  static getAllCategories = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    LOG.info('CategoryController: getAllCategories Start');
    const categories = await CategoryService.getAllCategories();
    ResponseHandler.success(res, categories);
  });

  static getCategoryById = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    const categoryId = parseInt(req.params.categoryId, 10);
    LOG.info(`CategoryController: getCategoryById categoryId: ${categoryId}`);
    
    const category = await CategoryService.getCategoryById(categoryId);
    if (!category) {
      throw new NotFoundError('分类不存在');
    }
    
    ResponseHandler.success(res, category);
  });

  static getCategoryByName = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    LOG.info(`CategoryController: getCategoryByName Start`);
    const { categoryName } = req.params;

    LOG.info(`CategoryController: getCategoryByName categoryName: ${categoryName}`);

    const category = await CategoryService.getCategoryByName(categoryName);
    if (!category) {
      throw new NotFoundError('分类不存在');
    }
    LOG.info(`CategoryController: getCategoryByName category: ${JSON.stringify(category)}`);
    ResponseHandler.success(res, category);
  });


  static createCategory = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    const { categoryName } = req.body;
    
    if (!categoryName?.trim()) {
      throw new ValidationError('分类名称不能为空');
    }

    // 验证分类名称格式
    const namePattern = /^[\u4e00-\u9fa5a-zA-Z0-9\s\-_()（）]+$/;
    if (!namePattern.test(categoryName)) {
      throw new ValidationError('分类名称只能包含中文、英文、数字和常用标点');
    }

    if (categoryName.length > 10) {
      throw new ValidationError('分类名称不能超过10个字符');
    }

    const newCategory = await CategoryService.createCategory(categoryName.trim());
    ResponseHandler.created(res, newCategory, '分类创建成功');
  });

  static updateCategory = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    LOG.info(`CategoryController: updateCategory Start`);
    const categoryId = parseInt(req.params.categoryId, 10);
    const updates = req.body;

    LOG.info(`CategoryController: updateCategory categoryId: ${categoryId}, updates: ${JSON.stringify(updates)}`);

    const updatedCategory = await CategoryService.updateCategory(categoryId, updates);
    ResponseHandler.success(res, updatedCategory, '分类更新成功');
  });

  static deleteCategory = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    LOG.info(`CategoryController: deleteCategory Start`);
    const categoryId = parseInt(req.params.categoryId, 10);

    LOG.info(`CategoryController: deleteCategory categoryId: ${categoryId}`);

    await CategoryService.deleteCategory(categoryId);
    ResponseHandler.success(res, undefined, '分类删除成功');
  });
}