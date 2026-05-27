-- =============================================
-- 青年公寓服务系统 数据库建表SQL
-- 数据库名: youth_apartment
-- 表数量: 7张 (users/houses/orders/contracts/payments/announcements/system_logs)
-- =============================================

DROP DATABASE IF EXISTS youth_apartment;
CREATE DATABASE youth_apartment DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE youth_apartment;

-- =============================================
-- 1. 用户表 (users)
-- 存储用户登录凭证、角色类型、账号状态等认证相关信息
-- =============================================
CREATE TABLE `users` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '用户ID',
  `username` VARCHAR(50) NOT NULL COMMENT '用户名',
  `password` VARCHAR(255) NOT NULL COMMENT '密码(加密)',
  `name` VARCHAR(50) DEFAULT NULL COMMENT '真实姓名',
  `phone` VARCHAR(20) DEFAULT NULL COMMENT '手机号',
  `email` VARCHAR(100) DEFAULT NULL COMMENT '邮箱',
  `id_card` VARCHAR(18) DEFAULT NULL COMMENT '身份证号(加密)',
  `age` INT(3) DEFAULT NULL COMMENT '年龄',
  `role_type` ENUM('admin', 'manager', 'tenant') NOT NULL DEFAULT 'tenant' COMMENT '角色类型:管理员/管家/租客',
  `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '账号状态:0禁用/1正常',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  UNIQUE KEY `uk_username` (`username`),
  KEY `idx_phone` (`phone`),
  KEY `idx_role_type` (`role_type`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='用户表';

-- =============================================
-- 2. 房源表 (houses)
-- 存储房源详细信息，包括房间编号、类型、面积、租金、状态等
-- =============================================
CREATE TABLE `houses` (
  `house_id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '房源ID',
  `house_no` VARCHAR(50) NOT NULL COMMENT '房源编号',
  `title` VARCHAR(100) NOT NULL COMMENT '房源标题',
  `type` VARCHAR(20) NOT NULL COMMENT '户型:一室一厅/两室一厅/三室一厅等',
  `area` DECIMAL(8,2) NOT NULL COMMENT '面积(平方米)',
  `floor` INT(5) DEFAULT NULL COMMENT '所在楼层',
  `total_floors` INT(5) DEFAULT NULL COMMENT '总楼层',
  `price` DECIMAL(10,2) NOT NULL COMMENT '月租金(元)',
  `deposit` DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT '押金(元)',
  `facilities` TEXT DEFAULT NULL COMMENT '配套设施(JSON数组)',
  `images` TEXT DEFAULT NULL COMMENT '房源图片(多图URL逗号分隔)',
  `description` TEXT DEFAULT NULL COMMENT '房源描述',
  `area_zone` VARCHAR(50) DEFAULT NULL COMMENT '所属区域',
  `address` VARCHAR(255) DEFAULT NULL COMMENT '详细地址',
  `manager_id` BIGINT(20) DEFAULT NULL COMMENT '负责管家ID',
  `status` ENUM('available', 'reserved', 'rented', 'maintenance') NOT NULL DEFAULT 'available' COMMENT '状态:待租/已预订/已租/维护中',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`house_id`),
  UNIQUE KEY `uk_house_no` (`house_no`),
  KEY `idx_status` (`status`),
  KEY `idx_manager_id` (`manager_id`),
  KEY `idx_price` (`price`),
  CONSTRAINT `fk_houses_manager` FOREIGN KEY (`manager_id`) REFERENCES `users` (`id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='房源表';

-- =============================================
-- 3. 订单表 (orders)
-- 存储用户预订订单信息，关联用户和房源
-- =============================================
CREATE TABLE `orders` (
  `order_id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '订单ID',
  `order_no` VARCHAR(50) NOT NULL COMMENT '订单编号',
  `user_id` BIGINT(20) NOT NULL COMMENT '用户ID(租客)',
  `house_id` BIGINT(20) NOT NULL COMMENT '房源ID',
  `type` ENUM('booking', 'renewal', 'termination') NOT NULL DEFAULT 'booking' COMMENT '订单类型:预订/续租/退租',
  `check_in_date` DATE DEFAULT NULL COMMENT '预计入住日期',
  `check_out_date` DATE DEFAULT NULL COMMENT '预计退房日期',
  `lease_months` INT(5) DEFAULT NULL COMMENT '租赁月数',
  `total_amount` DECIMAL(12,2) DEFAULT NULL COMMENT '订单总金额',
  `remark` TEXT DEFAULT NULL COMMENT '备注/留言',
  `status` ENUM('pending', 'confirmed', 'rejected', 'completed', 'cancelled') NOT NULL DEFAULT 'pending' COMMENT '订单状态:待确认/已确认/已拒绝/已完成/已取消',
  `version` INT(5) NOT NULL DEFAULT 1 COMMENT '乐观锁版本号',
  `handled_by` BIGINT(20) DEFAULT NULL COMMENT '处理管家ID',
  `handled_at` DATETIME DEFAULT NULL COMMENT '处理时间',
  `reject_reason` VARCHAR(255) DEFAULT NULL COMMENT '拒绝原因',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`order_id`),
  UNIQUE KEY `uk_order_no` (`order_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_house_id` (`house_id`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`),
  CONSTRAINT `fk_orders_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_orders_house` FOREIGN KEY (`house_id`) REFERENCES `houses` (`house_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='订单表';

-- =============================================
-- 4. 合同表 (contracts)
-- 存储租赁合同信息，关联订单和用户
-- =============================================
CREATE TABLE `contracts` (
  `contract_id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '合同ID',
  `contract_no` VARCHAR(50) NOT NULL COMMENT '合同编号',
  `order_id` BIGINT(20) NOT NULL COMMENT '关联订单ID',
  `user_id` BIGINT(20) NOT NULL COMMENT '签约用户ID',
  `house_id` BIGINT(20) NOT NULL COMMENT '房源ID',
  `content` TEXT DEFAULT NULL COMMENT '合同内容',
  `start_date` DATE NOT NULL COMMENT '合同开始日期',
  `end_date` DATE NOT NULL COMMENT '合同结束日期',
  `monthly_rent` DECIMAL(10,2) NOT NULL COMMENT '月租金',
  `deposit` DECIMAL(10,2) NOT NULL COMMENT '押金金额',
  `sign_status` ENUM('unsigned', 'signed', 'expired', 'terminated') NOT NULL DEFAULT 'unsigned' COMMENT '签署状态:未签署/已签署/已过期/已终止',
  `sign_time` DATETIME DEFAULT NULL COMMENT '签署时间',
  `file_url` VARCHAR(255) DEFAULT NULL COMMENT '合同文件URL',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`contract_id`),
  UNIQUE KEY `uk_contract_no` (`contract_no`),
  UNIQUE KEY `uk_order_id` (`order_id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_house_id` (`house_id`),
  KEY `idx_sign_status` (`sign_status`),
  CONSTRAINT `fk_contracts_order` FOREIGN KEY (`order_id`) REFERENCES `orders` (`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_contracts_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_contracts_house` FOREIGN KEY (`house_id`) REFERENCES `houses` (`house_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='合同表';

-- =============================================
-- 5. 缴费记录表 (payments)
-- 记录租金和费用缴纳信息，关联合同和用户
-- =============================================
CREATE TABLE `payments` (
  `payment_id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '缴费ID',
  `payment_no` VARCHAR(50) NOT NULL COMMENT '缴费流水号',
  `user_id` BIGINT(20) NOT NULL COMMENT '缴费用户ID',
  `contract_id` BIGINT(20) DEFAULT NULL COMMENT '关联合同ID',
  `type` ENUM('rent', 'deposit', 'utility', 'compensation', 'other') NOT NULL COMMENT '缴费类型:租金/押金/水电费/违约金/其他',
  `amount` DECIMAL(12,2) NOT NULL COMMENT '缴费金额',
  `payment_method` VARCHAR(20) DEFAULT NULL COMMENT '支付方式:alipay/wechat/bank/card/cash',
  `payment_status` ENUM('pending', 'paid', 'refunded', 'failed') NOT NULL DEFAULT 'pending' COMMENT '支付状态',
  `payment_time` DATETIME DEFAULT NULL COMMENT '支付时间',
  `billing_month` VARCHAR(7) DEFAULT NULL COMMENT '账期:YYYY-MM',
  `remark` VARCHAR(255) DEFAULT NULL COMMENT '备注',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`payment_id`),
  UNIQUE KEY `uk_payment_no` (`payment_no`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_contract_id` (`contract_id`),
  KEY `idx_payment_status` (`payment_status`),
  KEY `idx_billing_month` (`billing_month`),
  CONSTRAINT `fk_payments_user` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `fk_payments_contract` FOREIGN KEY (`contract_id`) REFERENCES `contracts` (`contract_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='缴费记录表';

-- =============================================
-- 6. 公告表 (announcements)
-- 存储平台发布的公告信息及活动通知内容
-- =============================================
CREATE TABLE `announcements` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '公告ID',
  `title` VARCHAR(200) NOT NULL COMMENT '公告标题',
  `content` TEXT NOT NULL COMMENT '公告内容',
  `type` VARCHAR(20) DEFAULT 'notice' COMMENT '公告类型:notice/activity/system',
  `priority` TINYINT(1) NOT NULL DEFAULT 0 COMMENT '优先级:0普通/1重要/2置顶',
  `publisher_id` BIGINT(20) NOT NULL COMMENT '发布人ID',
  `publish_time` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '发布时间',
  `end_time` DATETIME DEFAULT NULL COMMENT '下线时间',
  `status` TINYINT(1) NOT NULL DEFAULT 1 COMMENT '状态:0下架/1上架',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  `updated_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '更新时间',
  PRIMARY KEY (`id`),
  KEY `idx_publisher_id` (`publisher_id`),
  KEY `idx_publish_time` (`publish_time`),
  KEY `idx_status` (`status`),
  CONSTRAINT `fk_announcements_publisher` FOREIGN KEY (`publisher_id`) REFERENCES `users` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='公告表';

-- =============================================
-- 7. 系统日志表 (system_logs)
-- 记录系统操作日志，包括管理员操作记录
-- =============================================
CREATE TABLE `system_logs` (
  `id` BIGINT(20) NOT NULL AUTO_INCREMENT COMMENT '日志ID',
  `user_id` BIGINT(20) DEFAULT NULL COMMENT '操作用户ID',
  `username` VARCHAR(50) DEFAULT NULL COMMENT '操作用户名',
  `action` VARCHAR(50) NOT NULL COMMENT '操作类型:login/logout/create/update/delete/assign/export等',
  `target_type` VARCHAR(30) DEFAULT NULL COMMENT '操作对象类型:user/house/order/contract/payment等',
  `target_id` BIGINT(20) DEFAULT NULL COMMENT '操作对象ID',
  `content` TEXT DEFAULT NULL COMMENT '操作详情描述',
  `ip_address` VARCHAR(45) DEFAULT NULL COMMENT '操作IP地址',
  `user_agent` VARCHAR(255) DEFAULT NULL COMMENT '浏览器/客户端信息',
  `request_method` VARCHAR(10) DEFAULT NULL COMMENT 'HTTP请求方法',
  `request_url` VARCHAR(255) DEFAULT NULL COMMENT '请求接口路径',
  `request_params` TEXT DEFAULT NULL COMMENT '请求参数(JSON)',
  `response_code` INT(5) DEFAULT 200 COMMENT '响应状态码',
  `error_msg` TEXT DEFAULT NULL COMMENT '错误信息(如有)',
  `duration_ms` INT(10) DEFAULT NULL COMMENT '请求耗时(毫秒)',
  `created_at` DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP COMMENT '操作时间',
  PRIMARY KEY (`id`),
  KEY `idx_user_id` (`user_id`),
  KEY `idx_action` (`action`),
  KEY `idx_target_type` (`target_type`),
  KEY `idx_target_id` (`target_id`),
  KEY `idx_created_at` (`created_at`),
  KEY `idx_ip_address` (`ip_address`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COMMENT='系统日志表';


-- =============================================
-- 初始数据
-- =============================================

-- 管理员
INSERT INTO `users` (`username`, `password`, `name`, `role_type`, `status`) VALUES
('admin', '$2a$10$...', '系统管理员', 'admin', 1);

-- 管家
INSERT INTO `users` (`username`, `password`, `name`, `phone`, `role_type`, `status`) VALUES
('guanjia_a', '$2a$10$...', '张管家', '13800001111', 'manager', 1),
('guanjia_b', '$2a$10$...', '李管家', '13800002222', 'manager', 1),
('guanjia_c', '$2a$10$...', '王管家', '13800003333', 'manager', 1);

-- 租客
INSERT INTO `users` (`username`, `password`, `name`, `phone`, `id_card`, `age`, `role_type`, `status`) VALUES
('zhangsan', '$2a$10$...', '张三', '13900001111', '110101199505051234', 30, 'tenant', 1),
('lisi', '$2a$10$...', '李四', '13900002222', '110101199806061234', 27, 'tenant', 1);

-- 房源
INSERT INTO `houses` (`house_no`, `title`, `type`, `area`, `floor`, `total_floors`, `price`, `deposit`, `facilities`, `area_zone`, `address`, `manager_id`, `status`) VALUES
('A-101', '温馨一居室', '一室一厅', 45.00, 1, 6, 2500.00, 5000.00, '["空调","热水器","床","衣柜","宽带"]', 'A区', '青年公寓A栋101室', 2, 'available'),
('B-201', '舒适两居室', '两室一厅', 75.00, 2, 6, 3800.00, 7600.00, '["空调","热水器","床","衣柜","宽带","冰箱"]', 'B区', '青年公寓B栋201室', 3, 'available'),
('C-301', '精装三居室', '三室一厅', 95.00, 3, 6, 4500.00, 9000.00, '["空调","热水器","床","衣柜","宽带","冰箱","洗衣机"]', 'C区', '青年公寓C栋301室', 4, 'available');

-- 公告
INSERT INTO `announcements` (`title`, `content`, `type`, `priority`, `publisher_id`, `status`) VALUES
('欢迎使用青年公寓系统', '欢迎各位租客使用本系统，祝您生活愉快！', 'notice', 1, 1, 1),
('本月房租缴纳通知', '请各位租客于本月28日前完成房租缴纳', 'system', 2, 1, 1);
