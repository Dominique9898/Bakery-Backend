import { Router } from 'express';
import adminRoutes from './adminRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';
import orderRoutes from './orderRoutes';

const router = Router();

// 健康检查路由
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Service is healthy!' });
});

// API 路由前缀
const API_PREFIX = '/api/v1';

// 注册路由
router.use(`${API_PREFIX}/admins`, adminRoutes);
router.use(`${API_PREFIX}/products`, productRoutes);
router.use(`${API_PREFIX}/categories`, categoryRoutes);
router.use(`${API_PREFIX}/orders`, orderRoutes);

export default router;