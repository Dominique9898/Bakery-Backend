import { Request, Response } from 'express';
import { validateOrReject } from 'class-validator';
import { CreateOrderDto } from '../dtos/CreateOrderDto';
import { ApiResponse } from '../types/response';
import { Order } from '../models/Order';
import LOG from '../config/Logger';

export const createOrder = async (req: Request, res: Response): Promise<void> => {
  LOG.info(`OrderController: createOrder Start`);
  try {
    // 验证请求数据
    const createOrderDto = new CreateOrderDto();
    Object.assign(createOrderDto, req.body);
    await validateOrReject(createOrderDto);
    LOG.info(`OrderController: createOrder createOrderDto: ${JSON.stringify(createOrderDto)}`);
    if (!req.user) {
      res.status(401).json({ success: false, message: '未授权访问' } as ApiResponse);
      return;
    }

    const userId = (req.user as any).userId;
    LOG.info(`OrderController: createOrder userId: ${userId}`);
    // const newOrder = await OrderService.createOrder(userId, createOrderDto.products, createOrderDto);
    res.status(201).json({
      success: true,
      // data: newOrder,
      message: 'success'
    } as ApiResponse<Order>);
  } catch (error: any) {
    if (error.name === 'BadRequestError') {
      res.status(400).json({ success: false, message: error.message } as ApiResponse);
    } else if (error.name === 'ValidationError') {
      res.status(400).json({ success: false, message: '输入数据验证失败', details: error.errors } as ApiResponse);
    } else {
      res.status(500).json({ success: false, message: '服务器内部错误' } as ApiResponse);
    }
  } finally {
    LOG.info(`OrderController: createOrder End`);
  }
};

export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  LOG.info(`OrderController: getOrderById Start`);
  const { orderId } = req.params;
  LOG.info(`OrderController: getOrderById orderId: ${orderId}`);
  try {
    // const order = await OrderService.getOrderById(orderId);
    // if (!order) {
    //   res.status(404).json({ success: false, message: 'Order not found' } as ApiResponse);
    //   return;
    // }
    res.status(200).json({
      success: true,
      // data: order,
      message: 'success'
    } as ApiResponse<Order>);
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message } as ApiResponse);
  } finally {
    LOG.info(`OrderController: getOrderById End`);
  } 
};

export const updateOrderStatus = async (req: Request, res: Response): Promise<void> => {
  LOG.info(`OrderController: updateOrderStatus Start`);
  const { orderId } = req.params;
  const { status } = req.body;

  try {
    // const updatedOrder = await OrderService.updateOrderStatus(orderId, status);
    res.status(200).json({
      success: true,
      // data: updatedOrder,
      message: 'Order updated successfully'
    } as ApiResponse<Order>);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message } as ApiResponse);
  } finally {
    LOG.info(`OrderController: updateOrderStatus End`);
  } 
};

export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  LOG.info(`OrderController: deleteOrder Start`);
  const { orderId } = req.params;
  LOG.info(`OrderController: deleteOrder orderId: ${orderId}`);
  try {
    // await OrderService.deleteOrder(orderId);
    res.status(200).json({
      success: true,
      message: 'Order deleted successfully'
    } as ApiResponse);
  } catch (error: any) {
    res.status(400).json({ success: false, message: error.message } as ApiResponse);
  } finally {
    LOG.info(`OrderController: deleteOrder End`);
  }
};

export const getAllOrdersByUserId = async (req: Request, res: Response): Promise<void> => {
  LOG.info(`OrderController: getAllOrdersByUserId Start`);
  if (!req.user) {
    res.status(401).json({ success: false, message: '未授权访问' } as ApiResponse);
    return;
  }
  const userId = (req.user as any).userId;
  LOG.info(`OrderController: getAllOrdersByUserId userId: ${userId}`);
  // const orders = await OrderService.getAllOrdersByUserId(userId);
  res.status(200).json({
    success: true,
    // data: orders,
    message: 'success'
  } as ApiResponse<Order[]>);
  LOG.info(`OrderController: getAllOrdersByUserId End`);
};
