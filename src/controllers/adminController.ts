import { Request, Response } from 'express';
import { AdminService } from '../services/adminService';
import LOG from '../config/Logger';
import { ErrorHandler } from '../utils/errorHandler';
import { NotFoundError, ValidationError } from '../types/errors';
import { ResponseHandler } from '../utils/responseHandler';

export class AdminController {
  static getAllAdmins = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    LOG.info('AdminController: getAllAdmins Start');
    const admins = await AdminService.getAllAdmins();
    ResponseHandler.success(res, admins);
  });

  static login = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      throw new ValidationError('用户名和密码不能为空');
    }
    
    const result = await AdminService.loginAdmin(username, password);
    ResponseHandler.success(res, result, '登录成功');
  });

  static register = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    const { username, password } = req.body;
    
    if (!username || !password) {
      throw new ValidationError('用户名和密码不能为空');
    }
    
    const admin = await AdminService.createAdmin(username, password);
    ResponseHandler.created(res, admin, '管理员创建成功');
  });

  static updateAdmin = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    const { adminId } = req.params;
    const updates = req.body;
    
    const updatedAdmin = await AdminService.updateAdmin(parseInt(adminId), updates);
    ResponseHandler.success(res, updatedAdmin, '管理员信息更新成功');
  });

  static deleteAdmin = ErrorHandler.handleAsync(async (req: Request, res: Response) => {
    const { adminId } = req.params;
    await AdminService.deleteAdmin(parseInt(adminId));
    ResponseHandler.success(res, undefined, '管理员删除成功');
  });
}
