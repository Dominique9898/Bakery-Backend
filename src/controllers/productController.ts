import { Request, Response, RequestHandler } from 'express';
import { ProductService } from '../services/productService';
import { ApiResponse, ApiResponsePaginated } from '../types/response';
import { Product } from '../models/Product';
import LOG from '../config/Logger';
import fs from 'fs';
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
    
    const uploadedImagePath = req.file?.path;

    try {
      // 基本验证
      if (!req.body.productName?.trim()) {
        throw new Error('商品名称不能为空');
      }

      const price = parseFloat(req.body.price);
      const categoryId = parseInt(req.body.categoryId);

      if (isNaN(price) || price <= 0) {
        throw new Error('商品价格必须大于0');
      }

      if (isNaN(categoryId) || categoryId <= 0) {
        throw new Error('无效的分类ID');
      }

      // 解析标签数据（如果存在）
      let tags;
      if (req.body.tags) {
        try {
          tags = JSON.parse(req.body.tags);
          if (!Array.isArray(tags)) {
            throw new Error('标签数据格式错误');
          }
          // 验证标签数据格式
          for (const tag of tags) {
            if (!tag.tagId || !Array.isArray(tag.optionIds)) {
              throw new Error('标签数据格式错误');
            }
          }
        } catch (e) {
          throw new Error('标签数据解析失败');
        }
      }

      const productData = {
        name: req.body.productName.trim(),
        description: req.body.description?.trim(),
        price,
        stock: parseInt(req.body.stock) || 0,
        categoryId,
        status: req.body.status as 'active' | 'inactive' || 'active',
        imageFile: req.file,
        tags  // 可选参数
      };

      const { product } = await ProductService.createProduct(productData);
      
      res.status(201).json({
        success: true,
        data: product,
        message: '产品创建成功'
      } as ApiResponse<Product>);
    } catch (error: any) {
      LOG.error(`ProductController: createProduct error: ${error}`);
      
      // 删除临时上传的文件
      if (uploadedImagePath && fs.existsSync(uploadedImagePath)) {
        fs.unlinkSync(uploadedImagePath);
        LOG.info(`ProductController: Deleted uploaded image at ${uploadedImagePath}`);
      }

      res.status(400).json({
        success: false,
        message: '创建产品失败',
        error: error.message
      } as ApiResponse);
    } finally {
      LOG.info('ProductController: createProduct End');
    }
  }

  // 更新产品
  static async updateProduct(req: Request, res: Response) {
    LOG.info(`ProductController: updateProduct Start`);
    LOG.info(`ProductController: updateProduct params: ${JSON.stringify(req.params)}`);
    
    // 保存上传的图片路径，以便失败时删除
    const uploadedImagePath = req.file?.path;

    try {
        const { productId } = req.params;
        
        // 1. 数据验证
        const productName = req.body.productName?.trim();
        if (productName !== undefined && !productName) {
            throw new Error('商品名称不能为空');
        }

        const price = req.body.price ? parseFloat(req.body.price) : undefined;
        const categoryId = req.body.categoryId ? parseInt(req.body.categoryId) : undefined;

        // 2. 价格验证
        if (price !== undefined && (isNaN(price) || price <= 0)) {
            throw new Error('商品价格必须大于0');
        }

        // 3. 分类ID验证
        if (categoryId !== undefined && (isNaN(categoryId) || categoryId <= 0)) {
            throw new Error('无效的分类ID');
        }

        const updates = {
            name: productName,
            description: req.body.description?.trim(),
            price,
            stock: req.body.stock ? Number(req.body.stock) : undefined,
            categoryId,
            status: req.body.status as 'active' | 'inactive' | undefined
        };

        const updatedProduct = await ProductService.updateProduct(
            productId,
            updates,
            req.file
        );
        
        LOG.info(`ProductController: updateProduct updatedProduct: ${JSON.stringify(updatedProduct)}`);
        res.status(200).json({
            success: true,
            data: updatedProduct,
            message: '产品更新成功'
        } as ApiResponse<Product>);
    } catch (error: any) {
        LOG.error(`ProductController: updateProduct error: ${error}`);
        
        // 删除原始上传的临时文件
        if (uploadedImagePath && fs.existsSync(uploadedImagePath)) {
            fs.unlinkSync(uploadedImagePath);
            LOG.info(`ProductController: Deleted uploaded image at ${uploadedImagePath}`);
        }

        res.status(400).json({
            success: false,
            message: '更新产品失败',
            error: error.message
        } as ApiResponse);
    } finally {
        LOG.info('ProductController: updateProduct End');
    }
  }

  // 删除产品
  static async deleteProduct(req: Request, res: Response) {
    LOG.info(`ProductController: deleteProduct Start`);
    const productId: string = req.params.productId;
    LOG.info(`ProductController: deleteProduct params: ${JSON.stringify(req.params)}`);
    
    if (!productId || typeof productId !== 'string') {
        res.status(400).json({
            success: false,
            message: '无效的商品ID',
        } as ApiResponse);
    }

    try {
        await ProductService.deleteProduct(productId);
        LOG.info(`ProductController: deleteProduct productId: ${productId}`);
        res.status(200).json({
            success: true,
            message: '产品删除成功'
        } as ApiResponse<Product>);
    } catch (error: any) {
        LOG.error(`ProductController: deleteProduct error: ${error}`);
        res.status(400).json({
            success: false,
            message: '删除产品失败',
            error: error.message
        } as ApiResponse);
    } finally {
        LOG.info('ProductController: deleteProduct End');
    }
  }

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