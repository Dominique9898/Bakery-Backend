const dayjs = require('dayjs');
const crypto = require('crypto');

// 创建自定义字母表的随机字符串生成器
function customAlphabet(alphabet: string, size: number): string {
  const bytes = crypto.randomBytes(size);
  let result = '';
  for (let i = 0; i < size; i++) {
    result += alphabet[bytes[i] % alphabet.length];
  }
  return result;
}

// 数字+字母组合的生成器
const generateAlphanumeric = (length: number) => 
  customAlphabet('0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ', length);

// 纯数字生成器
const generateNumeric = (length: number) => 
  customAlphabet('0123456789', length);

export const IdGenerator = {
  // 用户ID: U + 年月日 + 8位数字
  generateUserId: () => {
    const prefix = 'U';
    const date = dayjs().format('YYYYMMDD');
    const random = generateNumeric(8);
    return `${prefix}${date}${random}`;
  },

  // 商品ID: P + 年月 + 6位数字, 例如: P20240300012
  generateProductId: () => {
    const prefix = 'P';
    const date = dayjs().format('YYYYMM');
    const random = customAlphabet('0123456789', 6);
    return `${prefix}${date}${random}`;
  },

  // 优惠券ID: C + 年月 + 8位字母数字组合, 例如: C202403ABC12345
  generateCouponId: () => {
    const prefix = 'C';
    const date = dayjs().format('YYYYMM');
    const random = generateAlphanumeric(8);
    return `${prefix}${date}${random}`;
  },

  // 订单ID: O + 年月日时分 + 6位数字, 例如: O202403151423000123
  generateOrderId: () => {
    const prefix = 'O';
    const date = dayjs().format('YYYYMMDDHHmm');
    const random = customAlphabet('0123456789', 6);
    return `${prefix}${date}${random}`;
  },

  // 订单商品ID: OI + 订单ID后6位 + 3位序号, 例如: OI000123001
  generateOrderItemId: (orderId: string) => {
    const prefix = 'OI';
    const orderSuffix = orderId.slice(-6);
    const sequence = customAlphabet('0123456789', 3);
    return `${prefix}${orderSuffix}${sequence}`;
  },

  // 支付ID: PAY + 年月日 + 10位数字, 例如: PAY20240315123456789
  generatePaymentId: () => {
    const prefix = 'PAY';
    const date = dayjs().format('YYYYMMDD');
    const random = customAlphabet('0123456789', 10);
    return `${prefix}${date}${random}`;
  },

  // 用户优惠券ID: UC + 用户ID后6位 + 优惠券ID后4位, 例如: UC123456ABCD
  generateUserCouponId: (userId: string, couponId: string) => {
    const prefix = 'UC';
    const userSuffix = userId.slice(-6);
    const couponSuffix = couponId.slice(-4);
    return `${prefix}${userSuffix}${couponSuffix}`;
  },

  // 积分日志ID: PL + 年月日 + 8位数字, 例如: PL2024031500012345
  generatePointsLogId: () => {
    const prefix = 'PL';
    const date = dayjs().format('YYYYMMDD');
    const random = generateNumeric(8);
    return `${prefix}${date}${random}`;
  },

  // 配送追踪ID: DT + 订单ID后8位 + 4位序号, 例如: DT12345678001
  generateDeliveryTrackingId: (orderId: string) => {
    const prefix = 'DT';
    const orderSuffix = orderId.slice(-8);
    const sequence = customAlphabet('0123456789', 4);
    return `${prefix}${orderSuffix}${sequence}`;
  },

  // 风险日志ID: RL + 年月日时分 + 6位数字, 例如: RL202403151423000123
  generateRiskLogId: () => {
    const prefix = 'RL';
    const date = dayjs().format('YYYYMMDDHHmm');
    const random = customAlphabet('0123456789', 6);
    return `${prefix}${date}${random}`;
  },

  // 操作日志ID: OL + 年月日时分秒 + 6位数字, 例如: OL20240315142330000123
  generateOperationLogId: () => {
    const prefix = 'OL';
    const date = dayjs().format('YYYYMMDDHHmmss');
    const random = customAlphabet('0123456789', 6);
    return `${prefix}${date}${random}`;
  },

  // 订单状态日志ID: LOG + 时间戳 + 随机字符串
  generateOrderStatusLogId: () => {
    return `LOG${Date.now()}${Math.random().toString(36).substr(2, 4)}`;
  }
};