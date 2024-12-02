import { Admin } from '../models/Admin';
import AppDataSource from '../config/ormconfig';

// 创建自定义仓库
const baseRepository = AppDataSource.getRepository(Admin);

// 扩展基础仓库
export const AdminRepo = baseRepository.extend({
  // 根据用户名查找管理员
  async findOneByUsername(username: string): Promise<Admin | null> {
    return await this.findOne({ 
      where: { username } 
    });
  },

  // 根据ID查找管理员
  async findByAdminId(adminId: number): Promise<Admin | null> {
    return await this.findOne({ 
      where: { adminId } 
    });
  },

  // 创建新管理员
  async createAdmin(adminData: Partial<Admin>): Promise<Admin> {
    const admin = this.create(adminData);
    return await this.save(admin);
  },

  // 保存管理员
  async saveAdmin(admin: Admin): Promise<Admin> {
    return await this.save(admin);
  },

  // 根据ID删除管理员
  async deleteAdmin(adminId: number): Promise<void> {
    await this.delete(adminId);
  }
}); 