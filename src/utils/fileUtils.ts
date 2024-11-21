import fs from 'fs';
import path from 'path';

/**
 * 确保指定路径的目录存在
 * @param dirPath 目录路径
 */
export const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};
