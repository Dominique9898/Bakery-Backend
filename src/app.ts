import express, { Express } from 'express';  // 将 Application 改为 Express
import cors from 'cors';
import path from 'path';
import { UPLOAD_ROOT } from './config/paths';
import { json, urlencoded } from 'body-parser';
import bodyParser from "body-parser";
import { setupSwagger } from './swagger/swagger';
import routes from './routes';
import helmet from 'helmet';

const app: Express = express();

// 基础中间件
app.use(cors());
app.use(json());
app.use(urlencoded({ extended: true }));
app.use(bodyParser.json());

// API 路由 (放在最前面)
app.use('/Bakery-LY/api/v1', routes);

// Swagger 文档
setupSwagger(app);

// 根路由处理
app.get('/', (req, res) => {
  res.redirect('/Bakery-LY');
});

// 安全头部
app.use(helmet());

export default app;
