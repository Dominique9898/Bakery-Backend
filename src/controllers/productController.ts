import { Request, Response, RequestHandler } from 'express';
import { ProductService } from '../services/productService';
import { ApiResponse, ApiResponsePaginated } from '../types/response';
import { Product } from '../models/Product';
import LOG from '../config/Logger';
import fs from 'fs';
import path from 'path';
import { PRODUCT_UPLOAD_DIR } from '../config/paths';

// 获取所有产品（支持分页）
export const getAllProducts = async (req: Request, res: Response) => {
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
};

// 获取单个产品
export const getProductById = async (req: Request, res: Response): Promise<void> => {
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
};

// 创建产品
export const createProduct = async (req: Request, res: Response) => {
    LOG.info(`ProductController: createProduct Start`);
    LOG.info(`ProductController: createProduct params: ${JSON.stringify(req.body)}`);
    
    // 保存上传的图片路径，以便失败时删除
    const uploadedImagePath = req.file?.path;

    try {
        // 1. 数据验证
        if (!req.body.productName?.trim()) {
            throw new Error('商品名称不能为空');
        }

        const price = parseFloat(req.body.price);
        const categoryId = parseInt(req.body.categoryId);

        // 2. 价格验证
        if (isNaN(price) || price <= 0) {
            throw new Error('商品价格必须大于0');
        }

        // 3. 分类ID验证
        if (isNaN(categoryId) || categoryId <= 0) {
            throw new Error('无效的分类ID');
        }

        const productData = {
            name: req.body.productName.trim(),
            description: req.body.description?.trim(),
            price,
            stock: 0,
            categoryId,
            status: 'active' as const,
            imageFile: req.file
        };

        const { product } = await ProductService.createProduct(productData);
        LOG.info(`ProductController: createProduct newProduct: ${JSON.stringify(product)}`);
        
        res.status(201).json({
            success: true,
            data: product,
            message: '产品创建成功'
        } as ApiResponse<Product>);
    } catch (error: any) {
        LOG.error(`ProductController: createProduct error: ${error}`);
        
        // 删除原始上传的临时文件
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
};

// 更新产品
export const updateProduct = async (req: Request, res: Response) => {
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
};

// 删除产品
export const deleteProduct = async (req: Request, res: Response) => {
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
};