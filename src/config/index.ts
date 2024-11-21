import 'dotenv/config';

const isProduction = process.env.NODE_ENV === 'production';
console.log(`Running in ${isProduction ? 'Production' : 'Development'} Mode`);

interface Config {
  dbHost: string | undefined;
  dbPort: number;
  jwtSecret: string;
  dbUser: string;
  dbPassword: string;
  dbName: string;
  port: number;
  env: string;
  uploadPath: string;
  host: string | undefined;
}

const config: Config = {
  dbHost: process.env.DB_HOST,
  dbPort: parseInt(process.env.DB_PORT || '5432', 10),
  jwtSecret: process.env.JWT_SECRET || 'default_secret_key', // 设置默认值，避免未配置时报错
  dbUser: process.env.DB_USER || 'dominikwei',
  dbPassword: process.env.DB_PASSWORD || '123456',
  dbName: process.env.DB_NAME || 'bakery_app',
  port: parseInt(process.env.PORT || '3000', 10),
  env: process.env.NODE_ENV || 'development',
  uploadPath: process.env.UPLOAD_DIR || '/uploads',
  host: isProduction ? process.env.PROD_HOST: process.env.DEV_HOST,
};

export default config;