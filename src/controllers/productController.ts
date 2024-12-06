import { Request, Response } from 'express';
import { ProductService } from '../services/productService';
import LOG from '../config/Logger';
import { ProductTagService } from '../services/productTagService';
import { ResponseHandler } from '../utils/responseHandler';
import { ErrorHandler } from '../utils/errorHandler';
import { ValidationError, NotFoundError } from '../types/errors';

export class ProductController {

  static getProductTagOptions = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    const { productId, tagId } = req.params;
    const options = await ProductTagService.getProductTagOptions(
      productId, 
      parseInt(tagId)
    );
    
    ResponseHandler.success(res, options);
  });

  // 获取所有产品（支持分页）
  static getAllProducts = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    LOG.info(`ProductController: getAllProducts params: ${JSON.stringify(req.query)}`);
    
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 10;
    
    const products = await ProductService.getAllProducts(page, pageSize);
    ResponseHandler.successPaginated(res, products);
  });

  // 获取单个产品
  static getProductById = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    LOG.info(`ProductController: getProductById params: ${JSON.stringify(req.params)}`);
    
    const { productId } = req.params;
    const product = await ProductService.getProductById(productId);
    
    if (!product) {
      throw new NotFoundError('未找到该产品');
    }
    
    ResponseHandler.success(res, product);
  });

  // 创建产品
  static createProduct = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    LOG.info(`ProductController: createProduct params: ${JSON.stringify(req.body)}`);
    
    const productData = await ProductController.validateAndTransformProductData(req);
    const { product } = await ProductService.createProduct(productData);
    
    ResponseHandler.created(res, product, '产品创建成功');
  });

  // 更新产品
  static updateProduct = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    LOG.info(`ProductController: updateProduct params: ${JSON.stringify(req.params)}`);
    
    const { productId } = req.params;
    const updates = req.body;
    
    const updatedProduct = await ProductService.updateProduct(
      productId,
      updates,
      req.file
    );
    
    ResponseHandler.success(res, updatedProduct, '产品更新成功');
  });

  // 删除产品
  static deleteProduct = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    
    if (!productId?.trim()) {
      throw new ValidationError('无效的商品ID');
    }

    await ProductService.deleteProduct(productId);
    ResponseHandler.success(res, undefined, '产品删除成功');
  });

  // 获取所有标签
  static getAllTags = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    const tags = await ProductTagService.getAllTags();
    ResponseHandler.success(res, tags);
  });
  
  // 获取产品标签
  static getProductTags = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const tags = await ProductTagService.getProductTags(productId);
    ResponseHandler.success(res, tags);
  });

  // 添加产品标签
  static addProductTags = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { tags } = req.body;
    
    if (!Array.isArray(tags)) {
      throw new ValidationError('标签数据格式错误');
    }
    
    await ProductTagService.addProductTags(productId, tags);
    ResponseHandler.success(res, undefined, '添加商品标签成功');
  });

  static removeProductTags = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { tagIds } = req.body;

    if (!Array.isArray(tagIds) || tagIds.length === 0) {
      throw new ValidationError('请提供要删除的标签ID列表');
    }

    await ProductTagService.removeProductTags(productId, tagIds);

    ResponseHandler.success(res, undefined, '删除商品标签成功');
  });

  static removeProductTagOption = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    const { productId, tagId, optionId } = req.params;

    await ProductTagService.removeProductTagOption(
      productId,
      parseInt(tagId),
      parseInt(optionId)
    );

    ResponseHandler.success(res, undefined, '删除商品标签选项成功');
  });

  // 私有方法：验证和转换产品数据
  private static async validateAndTransformProductData(req: Request) {
    const { 
      productName,
      description,
      price,
      stock,
      categoryId,
      status,
      tags 
    } = req.body;

    if (!productName?.trim()) {
      throw new ValidationError('商品名称不能为空');
    }

    const parsedPrice = parseFloat(price);
    const parsedCategoryId = parseInt(categoryId);
    const parsedStock = parseInt(stock) || 0;

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      throw new ValidationError('商品价格必须大于0');
    }

    if (isNaN(parsedCategoryId) || parsedCategoryId <= 0) {
      throw new ValidationError('无效的分类ID');
    }

    let parsedTags;
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
        if (!Array.isArray(parsedTags)) {
          throw new ValidationError('标签数据格式错误');
        }
        
        for (const tag of parsedTags) {
          if (!tag.tagId || !Array.isArray(tag.optionIds)) {
            throw new ValidationError('标签数据格式错误');
          }
        }
      } catch (e) {
        throw new ValidationError('标签数据解析失败');
      }
    }

    return {
      name: productName.trim(),
      description: description?.trim(),
      price: parsedPrice,
      stock: parsedStock,
      categoryId: parsedCategoryId,
      status: status as 'active' | 'inactive' || 'active',
      imageFile: req.file,
      tags: parsedTags
    };
  }
}
