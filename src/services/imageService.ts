import { PRODUCT_UPLOAD_DIR } from '../config/paths';
import sharp from 'sharp';
import path from 'path';
import fs from 'fs';
import { ensureDirectoryExists } from '../utils/fileUtils';
import config from '../config';

export class ImageService {
  private static getBaseUrl(): string {
    const isProduction = process.env.NODE_ENV === 'production';
    return isProduction
      ? (process.env.NGINX_PROXY_URL || 'http://114.132.42.5/uploads')
      : `http://${config.host || 'localhost'}:${config.port || 30100}/uploads`;
  }

  private static generateSafeFileName(originalName: string): string {
    const ext = path.extname(originalName);
    const baseName = originalName
      .replace(/\.[^/.]+$/, "")
      .replace(/[^a-zA-Z0-9-_]/g, "-")
      .toLowerCase();

    return `${baseName}-${Date.now()}${ext}`;
  }

  static async uploadAndCompressImage(
    imageFile: Express.Multer.File,
    categoryId: number
  ): Promise<{ url: string; path: string }> {
    const categoryPath = path.join(PRODUCT_UPLOAD_DIR, categoryId.toString());
    ensureDirectoryExists(categoryPath);

    const filename = this.generateSafeFileName(imageFile.originalname);
    const filePath = path.join(categoryPath, filename);

    await sharp(imageFile.path)
      .resize(800)
      .jpeg({ quality: 80 })
      .toFile(filePath);

    fs.unlinkSync(imageFile.path);

    const relativePath = `products/${categoryId}/${filename}`;
    
    return {
      url: `${this.getBaseUrl()}/${relativePath}`,
      path: filePath
    };
  }

  static async deleteImage(imagePath: string): Promise<void> {
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  static async deleteImageByUrl(imageUrl: string): Promise<void> {
    const urlParts = imageUrl.split('/uploads/');
    if (urlParts.length > 1) {
      const relativePath = urlParts[1];
      const imagePath = path.join(PRODUCT_UPLOAD_DIR, relativePath);
      await this.deleteImage(imagePath);
    }
  }
} 