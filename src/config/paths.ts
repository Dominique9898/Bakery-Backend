import path from 'path';
import fs from 'fs';

// 环境配置
const isProduction = process.env.NODE_ENV === 'production';
const isDevelopment = process.env.NODE_ENV === 'development';

// 基础配置
export const CONFIG = {
  PROJECT_NAME: 'bakery_backend',
  PORT: process.env.PORT || 30100,
  HOST: isProduction ? 'your-production-domain.com' : 'localhost',
  PROTOCOL: isProduction ? 'https' : 'http'
} as const;

// 文件夹路径配置
export const PATHS = {
  // 项目根目录
  ROOT: path.resolve(__dirname, '../..'),
  
  // 上传文件根目录
  UPLOAD_ROOT: isProduction
    ? `/var/www/${CONFIG.PROJECT_NAME}`
    : path.join(__dirname, '../../uploads', CONFIG.PROJECT_NAME),
  
  // 各类型文件的存储目录
  UPLOADS: {
    PRODUCTS: 'products',
    AVATARS: 'avatars',
    TEMP: 'temp'
  }
} as const;

// 构建实际的存储路径
export const STORAGE_PATHS = {
  PRODUCT_IMAGES: path.join(PATHS.UPLOAD_ROOT, PATHS.UPLOADS.PRODUCTS),
  AVATAR_IMAGES: path.join(PATHS.UPLOAD_ROOT, PATHS.UPLOADS.AVATARS),
  TEMP_FILES: path.join(PATHS.UPLOAD_ROOT, PATHS.UPLOADS.TEMP)
} as const;

// URL 配置
export const URLS = {
  BASE: `${CONFIG.PROTOCOL}://${CONFIG.HOST}${isDevelopment ? `:${CONFIG.PORT}` : ''}`,
  
  UPLOADS: {
    BASE: '/uploads',
    PRODUCTS: '/uploads/products',
    AVATARS: '/uploads/avatars'
  }
} as const;

// 工具函数
export const FileUtils = {
  /**
   * 获取文件的完整 URL
   * @param subPath 文件相对路径
   * @param type 文件类型（products/avatars）
   */
  getFileUrl(subPath: string, type: 'products' | 'avatars' = 'products'): string {
    const baseUrl = `${URLS.BASE}${URLS.UPLOADS.BASE}/${CONFIG.PROJECT_NAME}/${type}`;
    return `${baseUrl}/${subPath}`;
  },

  /**
   * 获取文件的完整存储路径
   * @param filename 文件名
   * @param type 文件类型（products/avatars）
   */
  getStoragePath(filename: string, type: 'products' | 'avatars' = 'products'): string {
    const dir = type === 'products' ? STORAGE_PATHS.PRODUCT_IMAGES : STORAGE_PATHS.AVATAR_IMAGES;
    return path.join(dir, filename);
  }
};

// 导出常用路径常量
export const PRODUCT_UPLOAD_DIR = STORAGE_PATHS.PRODUCT_IMAGES;
export const AVATAR_UPLOAD_DIR = STORAGE_PATHS.AVATAR_IMAGES;
export const BASE_UPLOAD_URL = URLS.BASE + URLS.UPLOADS.BASE;

// 确保必要的目录存在
Object.values(STORAGE_PATHS).forEach(dir => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});
