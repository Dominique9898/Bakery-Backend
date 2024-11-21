import { Request, Response } from 'express';

declare global {
  namespace Express {
    // 用户接口定义
    interface User {
      userId: string;
      phone: string;
      name?: string;
      role: string;
      birthday?: Date;
      pointsBalance: number;
      createdAt: Date;
      updatedAt: Date;
      orders?: any[];
      deliveries?: any[];
      userCoupons?: any[];
      pointsLogs?: any[];
    }

    // 扩展 Request 接口以包含用户
    interface Request {
      user?: User;
    }
  }
}

export {}; 