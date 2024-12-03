import fs from 'fs';
import path from 'path';
import { FileUtils, PRODUCT_UPLOAD_DIR, URLS } from '../config/paths';
import { ensureDirectoryExists } from '../utils/fileUtils';
import sharp from 'sharp';

export class ImageService {
  // 生成安全的文件名
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
      url: `${URLS.UPLOADS.BASE}/${relativePath}`,
      path: filePath
    };
  }

  static async deleteProductImage(imageUrl: string): Promise<void> {
    try {
      const filename = path.basename(imageUrl);
      const filepath = FileUtils.getStoragePath(filename, 'products');
      
      if (fs.existsSync(filepath)) {
        await fs.promises.unlink(filepath);
      }
    } catch (error) {
      console.error('Error deleting image:', error);
      throw new Error('Failed to delete image');
    }
  }

  static async saveAvatarImage(file: Express.Multer.File): Promise<string> {
    if (!file) throw new Error('No file uploaded');
    
    const filename = path.basename(file.path);
    return FileUtils.getFileUrl(filename, 'avatars');
  }
} 