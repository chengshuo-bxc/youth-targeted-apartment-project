-- 青年公寓服务系统数据库建表脚本

CREATE DATABASE IF NOT EXISTS youth_apartment DEFAULT CHARSET utf8mb4 COLLATE utf8mb4_general_ci;
USE youth_apartment;

-- 用户表
CREATE TABLE IF NOT EXISTS users (
  user_id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
  password VARCHAR(255) NOT NULL COMMENT '密码',
  role_type ENUM('admin','manager','tenant') NOT NULL DEFAULT 'tenant' COMMENT '角色',
  name VARCHAR(50) NOT NULL COMMENT '姓名',
  phone VARCHAR(20) DEFAULT '' COMMENT '手机号',
  id_card VARCHAR(30) DEFAULT '' COMMENT '身份证',
  gender ENUM('男','女') DEFAULT '男' COMMENT '性别',
  age INT DEFAULT 0 COMMENT '年龄',
  avatar VARCHAR(500) DEFAULT '' COMMENT '头像',
  status ENUM('active','inactive') NOT NULL DEFAULT 'active' COMMENT '状态',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB COMMENT='用户表';

-- 房源表
CREATE TABLE IF NOT EXISTS houses (
  house_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(100) NOT NULL COMMENT '房源名称',
  type VARCHAR(30) DEFAULT '' COMMENT '房型',
  area DECIMAL(10,2) DEFAULT 0 COMMENT '面积(m²)',
  floor VARCHAR(20) DEFAULT '' COMMENT '楼层',
  price DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT '月租(元)',
  deposit DECIMAL(10,2) DEFAULT 0 COMMENT '押金(元)',
  address VARCHAR(200) DEFAULT '' COMMENT '地址',
  description TEXT COMMENT '描述',
  status ENUM('available','reserved','rented') NOT NULL DEFAULT 'available' COMMENT '状态',
  images TEXT COMMENT '图片(JSON数组)',
  tags VARCHAR(500) DEFAULT '' COMMENT '标签(逗号分隔)',
  facilities VARCHAR(500) DEFAULT '' COMMENT '设施(逗号分隔)',
  manager_id INT DEFAULT NULL COMMENT '管理员ID',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB COMMENT='房源表';

-- 订单表
CREATE TABLE IF NOT EXISTS orders (
  order_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL COMMENT '用户ID',
  house_id INT NOT NULL COMMENT '房源ID',
  type ENUM('预订','退租') NOT NULL DEFAULT '预订' COMMENT '类型',
  status ENUM('pending','active','completed','cancelled') NOT NULL DEFAULT 'pending' COMMENT '状态',
  check_in DATE DEFAULT NULL COMMENT '入住日期',
  check_out DATE DEFAULT NULL COMMENT '退租日期',
  remark VARCHAR(500) DEFAULT '' COMMENT '备注',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (house_id) REFERENCES houses(house_id) ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT='订单表';

-- 合同表
CREATE TABLE IF NOT EXISTS contracts (
  contract_id INT AUTO_INCREMENT PRIMARY KEY,
  order_id INT NOT NULL COMMENT '订单ID',
  user_id INT NOT NULL COMMENT '用户ID',
  house_id INT NOT NULL COMMENT '房源ID',
  start_date DATE NOT NULL COMMENT '开始日期',
  end_date DATE NOT NULL COMMENT '结束日期',
  rent_amount DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT '月租金',
  deposit DECIMAL(10,2) DEFAULT 0 COMMENT '押金',
  status ENUM('active','terminated','expired') NOT NULL DEFAULT 'active' COMMENT '状态',
  sign_date DATE DEFAULT NULL COMMENT '签约日期',
  content TEXT COMMENT '合同内容',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (order_id) REFERENCES orders(order_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (house_id) REFERENCES houses(house_id) ON DELETE RESTRICT
) ENGINE=InnoDB COMMENT='合同表';

-- 缴费记录表
CREATE TABLE IF NOT EXISTS payments (
  payment_id INT AUTO_INCREMENT PRIMARY KEY,
  contract_id INT NOT NULL COMMENT '合同ID',
  user_id INT NOT NULL COMMENT '用户ID',
  amount DECIMAL(10,2) NOT NULL DEFAULT 0 COMMENT '金额',
  type VARCHAR(30) NOT NULL COMMENT '类型(租金/押金/水费/电费)',
  period VARCHAR(30) DEFAULT '' COMMENT '缴费周期',
  status ENUM('paid','unpaid') NOT NULL DEFAULT 'unpaid' COMMENT '状态',
  pay_time DATETIME DEFAULT NULL COMMENT '支付时间',
  method VARCHAR(30) DEFAULT '' COMMENT '支付方式',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
  FOREIGN KEY (contract_id) REFERENCES contracts(contract_id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE
) ENGINE=InnoDB COMMENT='缴费记录表';

-- 公告表
CREATE TABLE IF NOT EXISTS announcements (
  announcement_id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200) NOT NULL COMMENT '标题',
  content TEXT COMMENT '内容',
  create_time DATETIME DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) ENGINE=InnoDB COMMENT='公告表';
