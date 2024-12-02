import { Router } from 'express';
import { AdminController } from '../controllers/adminController';

const router = Router();
const adminController = new AdminController();

/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: 管理员相关接口
 */

/**
 * @swagger
 *  /admins/getAllAdmins:
 *   get:
 *     summary: 获取所有管理员
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Admin'
 *       401:
 *         description: 未授权
 */
router.get('/getAllAdmins', adminController.getAllAdmins);

/**
 * @swagger
 * /admins/login:
 *   post:
 *     summary: 管理员登录
 *     tags: [Admins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 description: 管理员用户名
 *               password:
 *                 type: string
 *                 description: 管理员密码
 *     responses:
 *       200:
 *         description: 登录成功
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *       401:
 *         description: 登录失败
 */
router.post('/login', adminController.login);

/**
 * @swagger
 * /admins/register:
 *   post:
 *     summary: 注册管理员
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: 注册成功
 *       400:
 *         description: 请求参数错误
 */
router.post('/register', adminController.register);

/**
 * @swagger
 * /admins/deleteAdmin/:adminId:
 *   delete:
 *     summary: 删除管理员
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: adminId
 *         required: true
 *         schema:
 *           type: string
 *         description: 管理员ID
 *     responses:
 *       200:
 *         description: 删除成功
 *       404:
 *         description: 管理员不存在
 */
router.delete('/deleteAdmin/:adminId', adminController.deleteAdmin);

export default router;
