import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || '';

// 生成 JWT 令牌
export function generateToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '6h' });
} 