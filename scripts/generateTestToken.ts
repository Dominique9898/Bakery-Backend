import jwt from 'jsonwebtoken';

const JWT_SECRET = '1455639656ef031d318453ad06b54c357db5d9ee133a00edd630803ecb9b4ee0061774aadaa7462d33ba5563c8884873ce1409c74336dda5d84c18348693d329';

// 创建一个测试管理员的 payload
const testAdminPayload = {
  adminId: 1,  // 确保这个 ID 在数据库中存在
  role: 'admin'
};

// 生成一个有效期很长的 token (例如：1年)
const token = jwt.sign(testAdminPayload, JWT_SECRET, { 
  expiresIn: '365d'  // 设置为一年有效期
});

console.log('测试用 Token:');
console.log(token); 