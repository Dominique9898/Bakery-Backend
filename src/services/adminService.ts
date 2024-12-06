import { hashPassword, verifyPassword } from '../security/bcryptUtils';
import { AdminRepo } from '../repositories';
import { generateAdminToken } from '../security/jwt';
import { Admin } from '../models/Admin';
import { ValidationError, NotFoundError } from '../types/errors';

export class AdminService {
  static async loginAdmin(username: string, password: string): Promise<{ token: string; admin: Partial<Admin> }> {
    const admin = await AdminRepo.findOneByUsername(username);
  
    if (!admin) {
      throw new ValidationError('用户名或密码错误');
    }
  
    const isPasswordValid = await verifyPassword(password, admin.passwordHash);
    if (!isPasswordValid) {
      throw new ValidationError('用户名或密码错误');
    }
  
    const token = generateAdminToken(admin);
    
    // 返回安全的管理员信息（排除敏感字段）
    const safeAdmin = {
      adminId: admin.adminId,
      username: admin.username,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    };
    
    return { token, admin: safeAdmin };
  }

  static async getAllAdmins(): Promise<Partial<Admin>[]> {
    const admins = await AdminRepo.find();
    // 排除敏感信息
    return admins.map(admin => ({
      adminId: admin.adminId,
      username: admin.username,
      createdAt: admin.createdAt,
      updatedAt: admin.updatedAt
    }));
  }

  static async createAdmin(username: string, password: string): Promise<Partial<Admin>> {
    const existingAdmin = await AdminRepo.findOneByUsername(username);
    if (existingAdmin) {
      throw new ValidationError('用户名已存在');
    }

    const hashedPassword = await hashPassword(password, 10);
    const newAdmin = await AdminRepo.createAdmin({
      username,
      passwordHash: hashedPassword,
    });

    const savedAdmin = await AdminRepo.save(newAdmin);
    
    // 返回安全的管理员信息
    return {
      adminId: savedAdmin.adminId,
      username: savedAdmin.username,
      createdAt: savedAdmin.createdAt,
      updatedAt: savedAdmin.updatedAt
    };
  }

  static async updateAdmin(adminId: number, updates: Partial<Admin>): Promise<Partial<Admin>> {
    const admin = await AdminRepo.findByAdminId(adminId);
    if (!admin) {
      throw new NotFoundError('管理员不存在');
    }
    Object.assign(admin, updates);
    const updatedAdmin = await AdminRepo.save(admin);
    return { adminId: updatedAdmin.adminId, ...updates };
  }

  static async deleteAdmin(adminId: number): Promise<void> {
    const admin = await AdminRepo.findByAdminId(adminId);
    if (!admin) {
      throw new NotFoundError('管理员不存在');
    }

    await AdminRepo.remove(admin);
  }
}
