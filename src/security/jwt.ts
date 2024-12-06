import jwt from 'jsonwebtoken';
import { Admin } from '../models/Admin';

const JWT_SECRET = process.env.JWT_SECRET || '';
const JWT_EXPIRES_IN = '24h';  // 可以移到环境变量中

interface JWTPayload {
  adminId: number;
  username: string;
}

export function generateAdminToken(admin: Admin): string {
  const payload: JWTPayload = {
    adminId: admin.adminId,
    username: admin.username
  };
  return jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
}

export function verifyToken(token: string): JWTPayload {
  return jwt.verify(token, JWT_SECRET) as JWTPayload;
} 