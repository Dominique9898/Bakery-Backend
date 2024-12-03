import { Router } from 'express';
import { ProductController } from '../controllers/productController';
import { productUpload } from '../middlewares/upload';
const router = Router();

/**
 * @swagger
 * /products/listAllProducts:
 *   get:
 *     summary: 获取所有商品列表
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: 成功获取商品列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       product_id:
 *                         type: string
 *                         example: "P20240301001"
 *                       name:
 *                         type: string
 *                         example: "珍珠奶茶"
 *                       price:
 *                         type: number
 *                         example: 15.00
 *                       stock:
 *                         type: integer
 *                         example: 100
 *                       status:
 *                         type: string
 *                         example: "active"
 *       500:
 *         description: 服务器错误
 */
router.get('/listAllProducts', ProductController.getAllProducts);

/**
 * @swagger
 * /products/getById/{productId}:
 *   get:
 *     summary: 根据ID获取商品详情
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 商品ID
 *     responses:
 *       200:
 *         description: 成功获取商品详情
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     description:
 *                       type: string
 *                     price:
 *                       type: number
 *       404:
 *         description: 商品不存在
 */
router.get('/getById/:productId', ProductController.getProductById);

/**
 * @swagger
 * /products/create:
 *   post:
 *     summary: 创建新商品
 *     tags: [Products]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "珍珠奶茶"
 *               price:
 *                 type: number
 *                 example: 15.00
 *               description:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: 商品创建成功
 *       400:
 *         description: 请求参数错误
 */
router.post('/create', productUpload.single('image'), ProductController.createProduct);

/**
 * @swagger
 * /products/{productId}/tags:
 *   get:
 *     summary: 获取商品的标签列表
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: 成功获取标签列表
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       tag_id:
 *                         type: integer
 *                       name:
 *                         type: string
 */
router.get('/:productId/tags', ProductController.getProductTags);


/**
 * @swagger
 * /products/getTags:
 *   get:
 *     summary: 获取所有标签
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: 成功获取标签列表
 */
router.get('/getTags', ProductController.getAllTags);

/**
 * @swagger
 * /products/{productId}/tag-options/{tagId}:
 *   get:
 *     summary: 获取商品特定标签的选项列表
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: tagId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: 成功获取标签选项
 */
router.get('/:productId/tag-options/:tagId', ProductController.getProductTagOptions);

/**
 * @swagger
 * /products/update/{productId}:
 *   put:
 *     summary: 更新商品信息
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 商品ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "珍珠奶茶"
 *               price:
 *                 type: number
 *                 example: 15.00
 *               description:
 *                 type: string
 *               category_id:
 *                 type: integer
 *               status:
 *                 type: string
 *                 enum: [active, inactive]
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: 商品更新成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     product_id:
 *                       type: string
 *                     name:
 *                       type: string
 *                     price:
 *                       type: number
 *       404:
 *         description: 商品不存在
 *       400:
 *         description: 请求参数错误
 */
router.put('/update/:productId', productUpload.single('image'), ProductController.updateProduct);

/**
 * @swagger
 * /products/delete/{productId}:
 *   delete:
 *     summary: 删除商品
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 商品ID
 *     responses:
 *       200:
 *         description: 商品删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: 商品不存在
 */
router.delete('/delete/:productId', ProductController.deleteProduct);

/**
 * @swagger
 * /products/{productId}/tag-batch:
 *   post:
 *     summary: 批量添加商品标签
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 商品ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: 标签添加成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: 请求参数错误
 */
router.post('/:productId/tag-batch', ProductController.addProductTags);

/**
 * @swagger
 * /products/{productId}/tag-batch:
 *   delete:
 *     summary: 批量删除商品标签
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 商品ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               tagIds:
 *                 type: array
 *                 items:
 *                   type: integer
 *                 example: [1, 2, 3]
 *     responses:
 *       200:
 *         description: 标签删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: 请求参数错误
 */
router.delete('/:productId/tag-batch', ProductController.removeProductTags);

/**
 * @swagger
 * /products/{productId}/tag-options/{optionId}:
 *   delete:
 *     summary: 删除商品标签选项
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: 商品ID
 *       - in: path
 *         name: optionId
 *         required: true
 *         schema:
 *           type: integer
 *         description: 选项ID
 *     responses:
 *       200:
 *         description: 标签选项删除成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *       404:
 *         description: 商品或选项不存在
 */
router.delete('/:productId/tag-options/:optionId', ProductController.removeProductTagOption);

export default router;