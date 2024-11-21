import path from 'path';

const isProduction = process.env.NODE_ENV === 'production';

// 项目文件夹名称
export const PROJECT_FOLDER = 'bakery';

// 静态资源根目录
export const UPLOAD_ROOT = isProduction
  ? `/var/www/${PROJECT_FOLDER}` // 生产环境下存储在 `/var/www/bakery`
  : path.join(__dirname, '../../uploads', PROJECT_FOLDER); // 开发环境存储在项目目录下

// 商品图片的存储目录
export const PRODUCT_UPLOAD_DIR = path.join(UPLOAD_ROOT, 'products');

// 用户头像图片的存储目录
export const AVATAR_UPLOAD_DIR = path.join(UPLOAD_ROOT, 'avatars');

// 图片访问 URL 的基础路径
export const IMAGE_BASE_URL = isProduction
  ? `http://your-production-server-ip/${PROJECT_FOLDER}` // 替换为生产环境的实际服务器IP或域名
  : `http://localhost:30100/uploads/${PROJECT_FOLDER}`;

// 生成完整的图片 URL
export const getFileUrl = (subPath: string): string => `${IMAGE_BASE_URL}/${subPath}`;
