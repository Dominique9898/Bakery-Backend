import { Request, Response, NextFunction } from 'express';
import { NotFoundError, AuthenticationError } from '../types/errors';
import { AdminRepo } from '../repositories';
import { verifyToken } from '../security/jwt';
import { ResponseHandler } from '../utils/responseHandler';

export interface AuthRequest extends Request {
  admin?: any;
}

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return ResponseHandler.unauthorized(res, '未提供认证令牌');
  }

  try {
    const decoded = verifyToken(token);
    const admin = await AdminRepo.findByAdminId(decoded.adminId);

    if (!admin) {
      return ResponseHandler.notFound(res, '管理员不存在');
    }

    req.admin = {
      adminId: admin.adminId,
      username: admin.username,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    };
    
    next();
  } catch (error: any) {
    if (error.name === 'JsonWebTokenError') {
      return ResponseHandler.unauthorized(res, '无效的认证令牌');
    } else if (error.name === 'TokenExpiredError') {
      return ResponseHandler.unauthorized(res, '认证令牌已过期');
    } else {
      return ResponseHandler.error(res, error, '认证失败', 500);
    }
  }
}; 