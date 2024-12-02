import { Router } from 'express';
import adminRoutes from './adminRoutes';
import productRoutes from './productRoutes';
import categoryRoutes from './categoryRoutes';

const router = Router();

// API 路由前缀
const API_PREFIX = '/api/v1';


router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Service is healthy!' });
});

// 注册路由
router.use('/admins', adminRoutes);
router.use('/products', productRoutes);
router.use('/categories', categoryRoutes);

export default router;