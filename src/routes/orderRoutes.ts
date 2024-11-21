import { Router } from 'express';
import {
  createOrder,
  getOrderById,
  updateOrderStatus,
  deleteOrder,
} from '../controllers/orderController';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: 订单相关接口
 */

/**
 * @swagger
 * /api/v1/orders:
 *   post:
 *     summary: 创建新订单
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - products
 *               - totalAmount
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *               totalAmount:
 *                 type: number
 *               note:
 *                 type: string
 *     responses:
 *       201:
 *         description: 订单创建成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       400:
 *         description: 请求参数错误
 */
router.post('/', createOrder);

/**
 * @swagger
 * /api/v1/orders/{orderId}:
 *   get:
 *     summary: 获取订单详情
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: 订单ID
 *     responses:
 *       200:
 *         description: 获取成功
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Order'
 *       404:
 *         description: 订单不存在
 */
router.get('/:orderId', getOrderById);

/**
 * @swagger
 * /api/v1/orders/{orderId}/status:
 *   put:
 *     summary: 更新订单状态
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: 订单ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, processing, completed, cancelled]
 *                 description: 订单状态
 *     responses:
 *       200:
 *         description: 状态更新成功
 *       404:
 *         description: 订单不存在
 */
router.put('/:orderId/status', updateOrderStatus);

/**
 * @swagger
 * /api/v1/orders/{orderId}:
 *   delete:
 *     summary: 删除订单
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: orderId
 *         required: true
 *         schema:
 *           type: string
 *         description: 订单ID
 *     responses:
 *       200:
 *         description: 删除成功
 *       404:
 *         description: 订单不存在
 */
router.delete('/:orderId', deleteOrder);


export default router;
