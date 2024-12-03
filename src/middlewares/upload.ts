import multer from 'multer';
import path from 'path';
import { PRODUCT_UPLOAD_DIR, AVATAR_UPLOAD_DIR } from '../config/paths';

// 配置商品图片上传
const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, PRODUCT_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `product-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// 配置头像上传
const avatarStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, AVATAR_UPLOAD_DIR);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
    cb(null, `avatar-${uniqueSuffix}${path.extname(file.originalname)}`);
  }
});

// 文件类型验证
const imageFilter = (req: any, file: any, cb: any) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

export const productUpload = multer({
  storage: productStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  }
});

export const avatarUpload = multer({
  storage: avatarStorage,
  fileFilter: imageFilter,
  limits: {
    fileSize: 2 * 1024 * 1024 // 2MB
  }
});
