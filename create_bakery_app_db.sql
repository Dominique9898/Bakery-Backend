-- 1. 创建用户表 (被多个表引用)
CREATE TABLE users (
    user_id VARCHAR(20) PRIMARY KEY, -- U + 年月日 + 8位数字
    phone VARCHAR(15) NOT NULL UNIQUE,
    name VARCHAR(50),
    role VARCHAR(10) CHECK (role IN ('customer', 'courier')) DEFAULT 'customer',
    birthday DATE,
    points_balance INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. 创建管理员表
CREATE TABLE admins (
    admin_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. 创建商品分类表 (被 products 引用)
CREATE TABLE categories (
    category_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    category_name VARCHAR(50) NOT NULL,
    parent_id INT REFERENCES categories(category_id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. 创建商品表 (被 order_items 引用)
CREATE TABLE products (
    product_id VARCHAR(15) PRIMARY KEY, -- P + 年月 + 6位数字
    name VARCHAR(100) NOT NULL,
    description TEXT,
    price DECIMAL(10, 2) NOT NULL,
    stock INT DEFAULT 0,
    category_id INT REFERENCES categories(category_id) ON DELETE SET NULL,
    status VARCHAR(10) CHECK (status IN ('active', 'inactive')) DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. 创建优惠券表 (被 orders, coupon_rules, user_coupons 引用)
CREATE TABLE coupons (
    coupon_id VARCHAR(20) PRIMARY KEY, -- C + 年月 + 8位字母数字组合
    name VARCHAR(50) NOT NULL,
    discount_type VARCHAR(10) CHECK (discount_type IN ('amount', 'percentage')),
    discount_value DECIMAL(10, 2) NOT NULL,
    usage_limit INT DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- 6. 创建订单表
CREATE TABLE orders (
    order_id VARCHAR(25) PRIMARY KEY, -- O + 年月日时分 + 6位数字
    user_id VARCHAR(20) REFERENCES users(user_id) ON DELETE CASCADE,
    courier_id VARCHAR(20) REFERENCES users(user_id) ON DELETE SET NULL,
    delivery_status VARCHAR(15) CHECK (delivery_status IN ('pending', 'delivering', 'completed')) DEFAULT 'pending',
    delivery_type VARCHAR(10) CHECK (delivery_type IN ('pickup', 'delivery')) NOT NULL,
    address VARCHAR(255),
    eta TIMESTAMP,
    coupon_id VARCHAR(20) REFERENCES coupons(coupon_id) ON DELETE SET NULL,
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    total_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(15) CHECK (status IN ('paid', 'completed', 'canceled')) DEFAULT 'paid',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. 创建订单商品表
CREATE TABLE order_items (
    order_item_id VARCHAR(15) PRIMARY KEY, -- OI + 订单ID后6位 + 3位序号
    order_id VARCHAR(25) REFERENCES orders(order_id) ON DELETE CASCADE,
    product_id VARCHAR(15) REFERENCES products(product_id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price DECIMAL(10, 2) NOT NULL,
    total_price DECIMAL(10, 2) GENERATED ALWAYS AS (quantity * price) STORED
);

-- 8. 创建支付日志表
CREATE TABLE payment_log (
    payment_id VARCHAR(25) PRIMARY KEY, -- PAY + 年月日 + 10位数字
    order_id VARCHAR(25) REFERENCES orders(order_id) ON DELETE CASCADE,
    user_id VARCHAR(20) REFERENCES users(user_id) ON DELETE SET NULL,
    transaction_id VARCHAR(50) UNIQUE NOT NULL,
    payment_amount DECIMAL(10, 2) NOT NULL,
    status VARCHAR(10) CHECK (status IN ('success', 'failed')) DEFAULT 'success',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. 创建优惠券规则表
CREATE TABLE coupon_rules (
    rule_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    coupon_id VARCHAR(20) REFERENCES coupons(coupon_id) ON DELETE CASCADE,
    rule_type VARCHAR(20) CHECK (rule_type IN ('min_spend', 'specific_items', 'first_purchase', 'birthday', 'new_user', 'time_limit')),
    rule_value JSON,
    description VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. 创建用户优惠券表
CREATE TABLE user_coupons (
    user_coupon_id VARCHAR(15) PRIMARY KEY, -- UC + 用户ID后6位 + 优惠券ID后4位
    user_id VARCHAR(20) REFERENCES users(user_id) ON DELETE CASCADE,
    coupon_id VARCHAR(20) REFERENCES coupons(coupon_id) ON DELETE CASCADE,
    is_used BOOLEAN DEFAULT FALSE,
    received_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    used_at TIMESTAMP
);

-- 11. 创建积分日志表
CREATE TABLE points_log (
    points_log_id VARCHAR(20) PRIMARY KEY, -- PL + 年月日 + 8位数字
    user_id VARCHAR(20) REFERENCES users(user_id) ON DELETE CASCADE,
    points INT NOT NULL,
    action_type VARCHAR(20) CHECK (action_type IN ('purchase', 'review', 'signup', 'birthday')),
    related_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 12. 创建配送追踪表
CREATE TABLE delivery_tracking (
    tracking_id VARCHAR(15) PRIMARY KEY, -- DT + 订单ID后8位 + 4位序号
    order_id VARCHAR(25) REFERENCES orders(order_id) ON DELETE CASCADE,
    courier_id VARCHAR(20) REFERENCES users(user_id) ON DELETE CASCADE,
    latitude DECIMAL(10, 6) NOT NULL,
    longitude DECIMAL(10, 6) NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 13. 创建黑名单表
CREATE TABLE blacklist (
    blacklist_id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    user_id VARCHAR(20) REFERENCES users(user_id) ON DELETE CASCADE,
    ip_address VARCHAR(50),
    device_id VARCHAR(100),
    reason VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 14. 创建风险日志表
CREATE TABLE risk_logs (
    risk_log_id VARCHAR(25) PRIMARY KEY, -- RL + 年月日时分 + 6位数字
    user_id VARCHAR(20) REFERENCES users(user_id) ON DELETE CASCADE,
    order_id VARCHAR(25) REFERENCES orders(order_id) ON DELETE SET NULL,
    risk_type VARCHAR(30) CHECK (risk_type IN ('bulk_orders', 'coupon_abuse', 'suspicious_behavior')),
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 15. 创建操作日志表
CREATE TABLE operation_logs (
    log_id VARCHAR(30) PRIMARY KEY, -- OL + 年月日时分秒 + 6位数字
    admin_id INTEGER REFERENCES admins(admin_id) ON DELETE SET NULL,
    action VARCHAR(50) NOT NULL,
    target_id INT,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);