import bcrypt from 'bcrypt';

// 哈希密码
export async function hashPassword(password: string, saltRounds: number): Promise<string> {
  return await bcrypt.hash(password, saltRounds);
}

// 验证密码
export async function verifyPassword(password: string, hash: string): Promise<boolean> {
  return await bcrypt.compare(password, hash);
} 