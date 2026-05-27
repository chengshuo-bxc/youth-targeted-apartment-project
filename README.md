# 青年公寓服务系统

> 面向都市青年的公寓租赁与物业管理系统，提供从看房、预订、签约到缴费的全流程在线服务。

## 项目简介

青年公寓服务系统是一套完整的公寓租赁管理平台，采用前后端分离架构。系统包含**前台展示**、**租客端**、**管家端**和**管理后台**四个子系统，覆盖房源管理、在线预订、合同管理、缴费管理、数据统计等核心业务场景。

## 技术栈

| 层级 | 技术 | 说明 |
|------|------|------|
| 前端框架 | Vue 3 (Composition API + `<script setup>`) | 渐进式前端框架 |
| 构建工具 | Vite 8 | 新一代前端开发与构建工具 |
| UI 组件库 | Element Plus 2 | 基于 Vue 3 的企业级组件库 |
| 数据可视化 | ECharts 6 | 强大的图表与数据可视化库 |
| 状态管理 | Pinia 3 | Vue 3 官方推荐状态管理 |
| 路由 | Vue Router 4 | Vue 3 官方路由管理器 |
| 后端框架 | Express 4 | Node.js Web 框架 |
| 数据库 | MySQL 8.0 | 关系型数据库 |
| ORM / 驱动 | mysql2 | MySQL 连接驱动，使用连接池 |
| 身份认证 | JWT + bcryptjs | Token 认证 + 密码加密 |
| 容器化 | Docker + docker-compose | 一键部署 |

## 系统功能

### 前台门户

- 首页横幅轮播与房源搜索
- 精选房源展示、公告通知列表
- 房源列表页（支持关键字筛选、类型/价格筛选）
- 房源详情页（展示图片、标签、设施、价格）
- 数据分析页（公开数据可视化）
- 用户注册与登录
- 公告中心与联系我们

### 租客端（用户中心）

- 个人中心（个人信息查看与修改）
- 我的订单（提交看房/预订订单、查看状态）
- 我的合同（在线查看电子合同）
- 缴费记录（在线缴纳租金与水电费）

### 管家端

- 工作概览仪表盘
- 房源管理（新增、编辑、上下架房源，数据隔离）
- 订单审核（审批/驳回看房及预订订单）
- 管家个人信息管理

### 管理后台

- 全局仪表盘（统计数据总览）
- 房源管理（全局管理，可指派管家）
- 用户管理（查看、禁用用户）
- 订单管理（查看/审核/转交管家）
- 合同管理（查看所有电子合同）
- 缴费管理（查看缴费记录与状态）

### 系统特色

- **三级权限体系**：管理员、管家、租客，各角色功能隔离
- **数据隔离**：管家只能操作自己管辖的房源和订单
- **JWT 认证**：使用 Token 机制保护 API
- **连接池**：数据库使用连接池管理，性能可靠
- **Docker 部署**：支持容器化一键部署

## 目录结构

```
youth-apartment/
├── index.html                    # HTML 入口
├── package.json                  # 前端依赖
├── vite.config.js                # Vite 配置（含代理转发）
├── Dockerfile                    # Docker 构建文件
├── docker-compose.yml            # Docker Compose 编排
├── server/                       # 后端服务
│   ├── app.js                    # Express 入口
│   ├── .env                      # 环境变量配置
│   ├── package.json              # 后端依赖
│   ├── config/
│   │   ├── db.js                 # 数据库连接池
│   │   └── jwt.js                # JWT 配置
│   ├── middleware/
│   │   └── auth.js               # 认证与鉴权中间件
│   ├── routes/                   # API 路由
│   │   ├── auth.js               # 登录/注册
│   │   ├── users.js              # 用户管理
│   │   ├── rooms.js              # 房源管理
│   │   ├── orders.js             # 订单管理
│   │   ├── contracts.js          # 合同管理
│   │   ├── payments.js           # 缴费管理
│   │   ├── announcements.js      # 公告管理
│   │   └── stats.js              # 数据统计
│   ├── sql/
│   │   ├── schema.sql            # 数据库表结构
│   │   └── full_data.sql         # 完整数据（含测试数据）
│   ├── init-db.js                # 数据库初始化脚本
│   └── init-manager.js           # 初始管理人员创建脚本
├── src/                          # 前端源码
│   ├── main.js                   # Vue 入口
│   ├── App.vue                   # 根组件
│   ├── router/index.js           # 路由配置（含鉴权守卫）
│   ├── stores/user.js            # Pinia 状态管理（用户）
│   ├── api/index.js              # 所有 API 封装
│   ├── utils/request.js          # Axios 封装（含拦截器）
│   ├── styles/global.css         # 全局样式
│   ├── layouts/                  # 布局组件
│   │   ├── FrontLayout.vue       # 前台布局
│   │   ├── UserLayout.vue        # 用户中心布局
│   │   ├── ManagerLayout.vue     # 管家端布局
│   │   └── AdminLayout.vue       # 管理后台布局
│   └── views/                    # 页面组件
│       ├── front/                # 前台页面
│       │   ├── Home.vue          # 首页
│       │   ├── Login.vue         # 登录
│       │   ├── Register.vue      # 注册
│       │   ├── RoomList.vue      # 房源列表
│       │   ├── RoomDetail.vue    # 房源详情
│       │   ├── DataAnalysis.vue  # 数据分析
│       │   ├── Announcements.vue # 公告中心
│       │   └── Contact.vue       # 联系我们
│       ├── user/                 # 租客端页面
│       │   ├── Profile.vue       # 个人中心
│       │   ├── Orders.vue        # 我的订单
│       │   ├── Contracts.vue     # 我的合同
│       │   └── Payments.vue      # 缴费记录
│       ├── manager/              # 管家端页面
│       │   ├── Dashboard.vue     # 工作概览
│       │   ├── Profile.vue       # 个人信息
│       │   ├── RoomManage.vue    # 房源管理
│       │   └── OrderManage.vue   # 订单审核
│       └── admin/                # 管理后台页面
│           ├── Dashboard.vue     # 管理首页
│           ├── RoomManage.vue    # 房源管理
│           ├── UserManage.vue    # 用户管理
│           ├── OrderManage.vue   # 订单管理
│           ├── ContractManage.vue# 合同管理
│           └── PaymentManage.vue # 缴费管理
├── youth_apartment.sql           # 完整数据库备份
├── check_data.sql                # 数据检查脚本
└── DEPLOYMENT.md                 # 部署指南
```

## 快速开始

### 前置要求

- Node.js >= 18
- MySQL >= 8.0
- npm

### 1. 克隆项目

```bash
git clone https://github.com/chengshuo-bxc/youth-targeted-apartment-project.git
cd youth-targeted-apartment-project
```

### 2. 初始化数据库

```bash
# 登录 MySQL 创建数据库
mysql -u root -p -e "CREATE DATABASE youth_apartment CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"

# 导入表结构
mysql -u root -p youth_apartment < server/sql/schema.sql

# 导入测试数据（可选）
mysql -u root -p youth_apartment < server/sql/full_data.sql
```

或使用初始化脚本：

```bash
cd server
# 修改 .env 中的数据库密码后执行
npm run init-db
```

### 3. 启动后端

```bash
cd server
npm install
npm start
```

服务运行在 `http://localhost:3000`。

### 4. 启动前端

```bash
# 在项目根目录
npm install
npm run dev
```

前端开发服务器运行在 `http://localhost:5173`，已配置代理转发 `/api` 到后端。

### 5. 访问系统

打开浏览器访问 `http://localhost:5173`。

### 默认测试账号

| 角色 | 账号 | 密码 |
|------|------|------|
| 管理员 | admin | 123456 |
| 租客 | zhangsan | 123456 |

## Docker 部署

### 构建镜像

```bash
docker build -t youth-apartment .
```

### 启动服务

```bash
# 修改 docker-compose.yml 中的数据库密码
docker-compose up -d
```

### 访问

浏览器打开 `http://localhost` 即可访问。

## 环境变量

在 `server/.env` 中配置：

```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=root
DB_NAME=youth_apartment
JWT_SECRET=youth_apartment_secret_key_2026
JWT_EXPIRES_IN=24h
```

## License

MIT
