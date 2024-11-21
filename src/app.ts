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

// 中间件
app.use(cors());

app.use(json());
app.use(urlencoded({ extended: true }));

// 开发环境提供静态文件服务
if (process.env.NODE_ENV !== 'production') {
  app.use('/uploads', express.static(UPLOAD_ROOT));
}

// 路由
app.use(bodyParser.json());
app.use('/api', routes);

// 添加安全头部
app.use(helmet());

// 设置 Swagger 文档
setupSwagger(app);

export default app;
