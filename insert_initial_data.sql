-- insert_initial_data.sql
-- 插入标签
INSERT INTO product_tags (name, required, multi_select) VALUES
('状态', false, false),
('冰量', false, false),
('甜度', false, false),
('做法', false, false),
('小料', false, true);

-- 为"状态"标签添加选项
INSERT INTO product_tag_options (tag_id, value, is_default, recommendation_level) VALUES
(1, '冰', true, 2),
(1, '比较烫', false, 0),
(1, '温', false, 0);

-- 为"冰量"标签添加选项
INSERT INTO product_tag_options (tag_id, value, is_default, recommendation_level) VALUES
(2, '正常', true, 2),
(2, '少冰', false, 0),
(2, '去冰', false, -1);

-- 为"甜度"标签添加选项
INSERT INTO product_tag_options (tag_id, value, is_default, recommendation_level) VALUES
(3, '少甜', true, 2),
(3, '少少甜', false, 1),
(3, '少少少甜', false, 0),
(3, '不另外加糖', false, -1),
(3, '多甜', false, -2);

-- 为"做法"标签添加选项
INSERT INTO product_tag_options (tag_id, value, is_default, recommendation_level) VALUES
(4, '标准', true, 2);

-- 为"小料"标签添加选项
INSERT INTO product_tag_options (tag_id, value, is_default, recommendation_level, additional_price) VALUES
(5, 'QQ', false, 2, 2.00),
(5, '珍珠', false, 2, 2.00),
(5, '椰果', false, 2, 2.00),
(5, '红豆', false, 2, 2.00);

-- 创建索引
CREATE INDEX idx_product_tag_relations_tag_id ON product_tag_relations(tag_id);
CREATE INDEX idx_product_tag_option_relations_option_id ON product_tag_option_relations(option_id);
CREATE INDEX idx_order_item_options_option_id ON order_item_options(option_id);