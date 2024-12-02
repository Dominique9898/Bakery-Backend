import { Request, Response } from 'express';
import { AdminService } from '../services/adminService';
import LOG from '../config/Logger';
import { ApiResponse } from '../types/response';
import { Admin } from '../models/Admin';

export class AdminController {
  getAllAdmins = async (req: Request, res: Response): Promise<void> => {
    LOG.info('AdminController: getAllAdmins Start');
    try {
      const admins = await AdminService.getAllAdmins();
      res.status(200).json({
        success: true,
        data: admins,
        message: 'success'
      } as ApiResponse<Admin[]>);
    } catch (error) {
      LOG.error(`AdminController: getAllAdmins error: ${error}`);
      const errorMessage = error instanceof Error ? error.message : 'unknown error';
      res.status(500).json({ success: false, message: errorMessage } as ApiResponse);
    } finally {
      LOG.info('AdminController: getAllAdmins End');
    }
  };

  login = async (req: Request, res: Response) => {
    LOG.info('AdminController: login Start');
    try {
      const { username, password } = req.body;
      LOG.info(`AdminController: login username: ${username}, password: ${password}`);
      const result = await AdminService.loginAdmin(username, password);
      res.status(200).json(result);
    } catch (error) {
      LOG.error(`AdminController: login error: ${error}`);
      const errorMessage = error instanceof Error ? error.message : 'unknown error';
      res.status(401).json({ success: false, message: errorMessage } as ApiResponse);
    } finally {
      LOG.info('AdminController: login End');
    }
  };

  register = async (req: Request, res: Response) => {  
    LOG.info('AdminController: register Start');
    try {
      const { username, password } = req.body;
      LOG.info(`AdminController: register username: ${username}, password: ${password}`);
      const admin = await AdminService.createAdmin(username, password);
      res.status(201).json({
        success: true,
        data: admin,
        message: 'success'
      } as ApiResponse<Admin>);
    } catch (error) {
      LOG.error(`AdminController: register error: ${error}`);
      const errorMessage = error instanceof Error ? error.message : 'unknown error';
      res.status(400).json({ success: false, message: errorMessage } as ApiResponse);
    } finally {
      LOG.info('AdminController: register End');
    } 
  };

  updateAdmin = async (req: Request, res: Response): Promise<void> => {
    LOG.info('AdminController: updateAdmin Start');
    try {
      const { adminId } = req.params;
      const updates = req.body;
      LOG.info(`AdminController: updateAdmin adminId: ${adminId}, updates: ${JSON.stringify(updates)}`);
      const updatedAdmin = await AdminService.updateAdmin(parseInt(adminId), updates);
      res.status(200).json({
        success: true,
        data: updatedAdmin,
        message: 'success'
      } as ApiResponse<Admin>);
    } catch (error) {
      LOG.error(`AdminController: updateAdmin error: ${error}`);
      const errorMessage = error instanceof Error ? error.message : 'unknown error';
      res.status(400).json({ success: false, message: errorMessage } as ApiResponse);
    } finally {
      LOG.info('AdminController: updateAdmin End');
    }
  };

  deleteAdmin = async (req: Request, res: Response): Promise<void> => {
    LOG.info('AdminController: deleteAdmin Start');
    try {
      const { adminId } = req.params;
      LOG.info(`AdminController: deleteAdmin adminId: ${adminId}`);
      await AdminService.deleteAdmin(parseInt(adminId));
      res.status(200).json({
        success: true,
        message: 'success'
      } as ApiResponse);
    } catch (error) {
      LOG.error(`AdminController: deleteAdmin error: ${error}`);
      const errorMessage = error instanceof Error ? error.message : 'unknown error';
      res.status(400).json({ success: false, message: errorMessage } as ApiResponse);
    } finally { 
      LOG.info('AdminController: deleteAdmin End');
    }
  };
}
