import { Request, Response, RequestHandler } from 'express';
import { ProductService } from '../services/productService';
import { ApiResponse, ApiResponsePaginated } from '../types/response';
import { Product } from '../models/Product';
import LOG from '../config/Logger';
import { ProductTagService } from '../services/productTagService';

export class ProductController {
  // 获取所有产品（支持分页）
  static async getAllProducts(req: Request, res: Response) {
    LOG.info(`ProductController: getAllProducts Start`);
    LOG.info(`ProductController: getAllProducts params: ${JSON.stringify(req.query)}`);
    try {
        const page = parseInt(req.query.page as string) || 1;
        const pageSize = parseInt(req.query.pageSize as string) || 10;
        
        const products = await ProductService.getAllProducts(page, pageSize);
        LOG.info(`ProductController: getAllProducts products: ${JSON.stringify(products)}`);
        res.status(200).json({
            success: true,
            data: products
        } as ApiResponsePaginated<Product>);
    } catch (error: any) {
        LOG.error(`ProductController: getAllProducts error: ${error}`);
        res.status(500).json({
            success: false,
            message: '获取产品列表失败',
            error: error.message
        } as ApiResponse);
    } finally {
        LOG.info('ProductController: getAllProducts End');
    }
  }

  // 获取单个产品
  static async getProductById(req: Request, res: Response): Promise<void> {
    LOG.info(`ProductController: getProductById Start`);
    LOG.info(`ProductController: getProductById params: ${JSON.stringify(req.params)}`);
    const { productId } = req.params;
    try {
        const product = await ProductService.getProductById(productId);
        LOG.info(`ProductController: getProductById product: ${JSON.stringify(product)}`);
        if (!product) {
             res.status(404).json({
                success: false,
                message: '未找到该产品'
            } as ApiResponse);
        }
        res.status(200).json({
            success: true,
            data: product
        } as ApiResponse<Product>);
    } catch (error: any) {
        LOG.error(`ProductController: getProductById error: ${error}`);
        res.status(500).json({
            success: false,
            message: '获取产品详情失败',
            error: error.message
        } as ApiResponse);
    } finally {
        LOG.info('ProductController: getProductById End');
    }
  }

  // 创建产品
  static async createProduct(req: Request, res: Response) {
    LOG.info(`ProductController: createProduct Start`);
    LOG.info(`ProductController: createProduct params: ${JSON.stringify(req.body)}`);
    
    try {
      // 数据验证和转换
      const productData = await this.validateAndTransformProductData(req);
      
      // 创建产品
      const { product } = await ProductService.createProduct(productData);
      
      res.status(201).json({
        success: true,
        data: product,
        message: '产品创建成功'
      });
    } catch (error) {
      LOG.error(`ProductController: createProduct error: ${error}`);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : '创建产品失败'
      });
    }
  }

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

    // 基础验证
    if (!productName?.trim()) {
      throw new Error('商品名称不能为空');
    }

    const parsedPrice = parseFloat(price);
    const parsedCategoryId = parseInt(categoryId);
    const parsedStock = parseInt(stock) || 0;

    if (isNaN(parsedPrice) || parsedPrice <= 0) {
      throw new Error('商品价格必须大于0');
    }

    if (isNaN(parsedCategoryId) || parsedCategoryId <= 0) {
      throw new Error('无效的分类ID');
    }

    // 解析标签数据
    let parsedTags;
    if (tags) {
      try {
        parsedTags = JSON.parse(tags);
        if (!Array.isArray(parsedTags)) {
          throw new Error('标签数据格式错误');
        }
        // 验证每个标签的数据格式
        for (const tag of parsedTags) {
          if (!tag.tagId || !Array.isArray(tag.optionIds)) {
            throw new Error('标签数据格式错误');
          }
        }
      } catch (e) {
        throw new Error('标签数据解析失败');
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

  // 更新产品
  static async updateProduct(req: Request, res: Response) {
    LOG.info(`ProductController: updateProduct Start`);
    LOG.info(`ProductController: updateProduct params: ${JSON.stringify(req.params)}`);
    
    try {
      const { productId } = req.params;
      const updates = req.body;
      
      const updatedProduct = await ProductService.updateProduct(
        productId,
        updates,
        req.file
      );

      res.json({
        success: true,
        data: updatedProduct
      });
    } catch (error) {
      LOG.error(`ProductController: updateProduct Error: ${error}`);
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : '更新产品失败'
      });
    }
  }

  // 删除产品
  static async deleteProduct(req: Request, res: Response) {
    const { productId } = req.params;
    
    LOG.info(`ProductController: deleteProduct Start - productId: ${productId}`);
    
    try {
      // 验证产品ID
      if (!productId?.trim()) {
        res.status(400).json({
          success: false,
          message: '无效的商品ID'
        });
      }

      // 删除产品
      await ProductService.deleteProduct(productId);
      
      LOG.info(`ProductController: deleteProduct Success - productId: ${productId}`);
      res.status(200).json({
        success: true,
        message: '产品删除成功'
      });
      
    } catch (error) {
      LOG.error(`ProductController: deleteProduct Error - ${error}`);
      
      // 区分不同类型的错误
      if (error instanceof Error && error.message.includes('商品不存在')) {
        res.status(404).json({
          success: false,
          message: '商品不存在'
        });
      }
      
      res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : '删除产品失败'
      });
    }
  }

  // 获取所有标签
  static async getAllTags(req: Request, res: Response): Promise<void> {
    try {
      const tags = await ProductTagService.getAllTags();
      res.json({
        success: true,
        data: tags
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: '获取标签失败',
        error: error.message
      });
    }
  }

  // 获取产品标签
  static async getProductTags(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const tags = await ProductTagService.getProductTags(productId);
      
      res.json({
        success: true,
        data: tags
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: '获取商品标签失败',
        error: error.message
      });
    }
  }

  static async getProductTagOptions(req: Request, res: Response): Promise<void> {
    try {
      const { productId, tagId } = req.params;
      const options = await ProductTagService.getProductTagOptions(
        productId, 
        parseInt(tagId)
      );
      
      res.json({
        success: true,
        data: options
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: '获取商品标签选项失败',
        error: error.message
      });
    }
  }

  static async addProductTags(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const { tags } = req.body;
      
      await ProductTagService.addProductTags(productId, tags);
      
      res.json({
        success: true,
        message: '添加商品标签成功'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: '添加商品标签失败',
        error: error.message
      });
    }
  }

  static async removeProductTags(req: Request, res: Response): Promise<void> {
    try {
      const { productId } = req.params;
      const { tagIds } = req.body;

      if (!Array.isArray(tagIds) || tagIds.length === 0) {
        res.status(400).json({
          success: false,
          message: '请提供要删除的标签ID列表'
        });
      }

      await ProductTagService.removeProductTags(productId, tagIds);

      res.json({
        success: true,
        message: '删除商品标签成功'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: '删除商品标签失败',
        error: error.message
      });
    }
  }

  static async removeProductTagOption(req: Request, res: Response): Promise<void> {
    try {
      const { productId, tagId, optionId } = req.params;

      await ProductTagService.removeProductTagOption(
        productId,
        parseInt(tagId),
        parseInt(optionId)
      );

      res.json({
        success: true,
        message: '删除商品标签选项成功'
      });
    } catch (error: any) {
      res.status(500).json({
        success: false,
        message: '删除商品标签选项失败',
        error: error.message
      });
    }
  }
}