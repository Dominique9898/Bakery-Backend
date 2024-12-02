import { Router } from 'express';
import { CategoryController } from '../controllers/categoryController';
  
  const router = Router();
  
 /**
 * @swagger
 * tags:
 *   name: Categories
 *   description: 分类相关接口
 */

/**
 * @swagger
 * /categories/getAllCategories:
 *   get:
 *     summary: 获取所有分类
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Category'
 */
router.get('/getAllCategories', CategoryController.getAllCategories);

/**
 * @swagger
 * /categories/getCategoryById/{categoryId}:
 *   get:
 *     summary: 根据ID获取分类
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: 分类ID
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: 分类不存在
 */
router.get('/getCategoryById/:categoryId', CategoryController.getCategoryById);

/**
 * @swagger
 * /categories/getCategoryByName/{name}:
 *   get:
 *     summary: 根据名称获取分类
 *     tags: [Categories]
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         schema:
 *           type: string
 *         description: 分类名称
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       404:
 *         description: 分类不存在
 */
router.get('/getCategoryByName/:name', CategoryController.getCategoryByName);

/**
 * @swagger
 * /categories/createCategory:
 *   post:
 *     summary: 创建新分类
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - categoryName
 *             properties:
 *               categoryName:
 *                 type: string
 *                 description: 分类名称（支持中文、英文、数字和常��标点）
 *                 minLength: 1
 *                 maxLength: 50
 *                 example: "蛋糕"
 *     responses:
 *       201:
 *         description: 分类创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Category'
 *       400:
 *         description: 输入验证错误
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "分类名称不能为空"
 */
router.post('/createCategory', CategoryController.createCategory);

/**
 * @swagger
 * /categories/updateCategory/{categoryId}:
 *   put:
 *     summary: 更新分类信息
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: 分类ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: 分类名称
 *               description:
 *                 type: string
 *                 description: 分类描述
 *     responses:
 *       200:
 *         description: 更新成功
 *       404:
 *         description: 分类不存在
 */
router.put('/updateCategory/:categoryId', CategoryController.updateCategory);

/**
 * @swagger
 * /categories/deleteCategory/{categoryId}:
 *   delete:
 *     summary: 删除分类
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: categoryId
 *         required: true
 *         schema:
 *           type: string
 *         description: 分类ID
 *     responses:
 *       200:
 *         description: 删除成功
 *       404:
 *         description: 分类不存在
 */
router.delete('/deleteCategory/:categoryId', CategoryController.deleteCategory);
  
export default router;
