
import { hashPassword, verifyPassword } from '../utils/bcryptUtils';
import { AdminRepo } from '../repositories';
import { generateToken } from '../utils/jwt';
import { Admin } from '../models/Admin';
export class AdminService {

  static async loginAdmin(username: string, password: string): Promise<{ token: string; admin: Admin }> {
    const admin = await AdminRepo.findOne({ where: { username } });
  
    if (!admin) {
      throw new Error('Invalid username or password');
    }
  
    const isPasswordValid = await verifyPassword(password, admin.passwordHash);
    if (!isPasswordValid) {
      throw new Error('Invalid username or password');
    }
  
    const token = generateToken({ adminId: admin.adminId});
    return { token, admin };
  };

  // 获取所有管理员
  static async getAllAdmins(): Promise<Admin[]> {
    return await AdminRepo.find();
  }

  // 创建新管理员
  static async createAdmin(username: string, password: string): Promise<Admin> {
    const existingAdmin = await AdminRepo.findOneBy({ username });
    if (existingAdmin) {
      throw new Error('Username already exists');
    }

    const hashedPassword = await hashPassword(password, 10);
    const newAdmin = AdminRepo.create({
      username,
      passwordHash: hashedPassword,
    });

    return await AdminRepo.save(newAdmin);
  }

  // 更新管理员信息
  static async updateAdmin(adminId: number, updates: Partial<Admin>): Promise<Admin> {
    const admin = await AdminRepo.findOneBy({ adminId });
    if (!admin) {
      throw new Error('Admin not found');
    }

    if (updates.username) admin.username = updates.username;
    if (updates.passwordHash) admin.passwordHash = await hashPassword(updates.passwordHash, 10);

    return await AdminRepo.save(admin);
  }

  // 删除管理员
  static async deleteAdmin(adminId: number): Promise<void> {
    const admin = await AdminRepo.findOneBy({ adminId });
    if (!admin) {
      throw new Error('Admin not found');
    }

    await AdminRepo.remove(admin);
  }
}
