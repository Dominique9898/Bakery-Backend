import { Router } from 'express';
import { upload } from '../middlewares/upload';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Products
 *   description: 商品管理接口
 * 
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - productId
 *         - name
 *         - price
 *         - categoryId
 *       properties:
 *         productId:
 *           type: string
 *           description: 商品ID
 *           example: "P202403150001"
 *         name:
 *           type: string
 *           description: 商品名称
 *           example: "巧克力蛋糕"
 *         description:
 *           type: string
 *           description: 商品描述
 *           example: "美味的巧克力蛋糕"
 *         price:
 *           type: number
 *           description: 商品价格
 *           example: 68.00
 *         stock:
 *           type: number
 *           description: 库存数量
 *           example: 100
 *         categoryId:
 *           type: number
 *           description: 分类ID
 *           example: 1
 *         status:
 *           type: string
 *           enum: [active, inactive]
 *           description: 商品状态
 *           example: "active"
 *         imageUrl:
 *           type: string
 *           description: 商品图片URL
 *           example: "http://example.com/uploads/products/1/cake.jpg"
 * 
 *     ApiResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         message:
 *           type: string
 *         data:
 *           type: object
 *         error:
 *           type: string
 * 
 * /api/v1/products/listAllProducts:
 *   get:
 *     tags: [Products]
 *     summary: 获取所有商品
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: 页码
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: 每页数量
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     items:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *                     total:
 *                       type: number
 *                     page:
 *                       type: number
 *                     pageSize:
 *                       type: number
 *                     totalPages:
 *                       type: number
 * 
 * /api/v1/products/getById/{productId}:
 *   get:
 *     tags: [Products]
 *     summary: 获取单个商品
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 * 
 * /api/v1/products/create:
 *   post:
 *     tags: [Products]
 *     summary: 创建商品
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - productName
 *               - price
 *               - categoryId
 *             properties:
 *               productName:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               categoryId:
 *                 type: number
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: 创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 * 
 * /api/v1/products/update/{productId}:
 *   put:
 *     tags: [Products]
 *     summary: 更新商品
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               productName:
 *                 type: string
 *                 description: 商品名称
 *               description:
 *                 type: string
 *                 description: 商品描述
 *               price:
 *                 type: number
 *                 description: 商品价格
 *               stock:
 *                 type: number
 *                 description: 库存数量
 *               categoryId:
 *                 type: number
 *                 description: 分类ID
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *                 description: 商品状态
 *               image:
 *                 type: string
 *                 format: binary
 *                 description: 商品图片
 *     responses:
 *       200:
 *         description: 更新成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 * 
 * /api/v1/products/delete/{productId}:
 *   delete:
 *     tags: [Products]
 *     summary: 删除商品
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 删除成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

router.get('/listAllProducts', getAllProducts);
router.get('/getById/:productId', getProductById);
router.post('/create', upload.single('image'), createProduct);
router.put('/update/:productId', upload.single('image'), updateProduct);
router.delete('/delete/:productId', deleteProduct);

export default router;