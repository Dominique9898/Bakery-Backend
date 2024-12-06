import winston, { format, transports } from 'winston';
import { encrypt } from '../security/encryptor';
import path from 'path';

// 获取环境变量
const isProduction = process.env.NODE_ENV === 'production';

// 日志格式配置
const logFormat = format.printf(({ level, message, timestamp }) => {
  return `[${timestamp}] ${level.toUpperCase()}: ${message}`;
});

// 日志器配置
const LOG = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
    format.json(), // JSON 格式
    logFormat // 自定义格式
  ),
  transports: isProduction
    ? [
        // 生产模式：加密后保存到文件
        new transports.File({
          filename: path.join(__dirname, '../../logs/app.log'),
          format: format.printf(({ level, message, timestamp }) => {
            return encrypt(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
          }),
        }),
      ]
    : [
        // 开发模式：控制台输出
        new transports.Console({
          format: format.combine(format.colorize(), logFormat),
        }),
      ],
});

export default LOG;
