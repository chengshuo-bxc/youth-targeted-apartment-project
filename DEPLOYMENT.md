# 青年公寓服务系统

基于 Node.js + Vue3 + MySQL 的青年公寓管理系统。

## 快速部署到腾讯轻量应用服务器

### 方式一：Docker 部署（推荐）

1. 本地打包项目
   ```bash
   # 安装依赖
   npm install
   
   # 构建 Docker 镜像
   docker build -t youth-apartment .
   
   # 导出镜像为 tar 文件
   docker save youth-apartment -o youth-apartment.tar
   ```

2. 上传文件到服务器
   - 使用 SCP/SFTP 工具上传以下文件：
     - `youth-apartment.tar`（Docker 镜像）
     - `docker-compose.yml`（见下方）

3. 服务器操作
   ```bash
   # 导入镜像
   docker load -i youth-apartment.tar
   
   # 安装 Docker Compose（如未安装）
   curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
   chmod +x /usr/local/bin/docker-compose
   
   # 创建 docker-compose.yml
   #（见下方内容）
   
   # 修改 .env 文件中的数据库地址
   # 如果你使用云数据库，填写云数据库的内网地址
   # 如果使用本地数据库，填写 localhost
   
   # 启动服务
   docker-compose up -d
   
   # 查看日志
   docker-compose logs -f
   ```

### 方式二：手动部署

1. 上传项目文件
   ```bash
   # 使用 SCP 上传整个项目目录
   scp -r youth-apartment root@your-server-ip:/root/
   ```

2. 服务器安装环境
   ```bash
   # 安装 Node.js 18
   curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
   apt-get install -y nodejs
   
   # 安装 MySQL
   apt-get install -y mysql-server
   
   # 启动 MySQL 并创建数据库
   systemctl start mysql
   mysql -u root -e "CREATE DATABASE youth_apartment CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;"
   
   # 导入数据结构
   mysql youth_apartment < /root/youth-apartment/server/sql/schema.sql
   
   # 运行数据初始化脚本
   cd /root/youth-apartment/server
   node init-db.js
   ```

3. 启动服务
   ```bash
   cd /root/youth-apartment
   npm install --production
   npm run build
   # 使用 PM2 保持进程运行
   npm install -g pm2
   pm2 start server/app.js --name youth-apartment
   pm2 save
   pm2 startup
   ```

4. 配置 Nginx 反向代理
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;
       
       location / {
           root /root/youth-apartment/dist;
           try_files $uri $uri/ /index.html;
       }
       
       location /api {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

5. 配置防火墙
   ```bash
   # 开放 80 端口
   ufw allow 80/tcp
   ufw allow 443/tcp
   ufw allow 22/tcp
   ufw enable
   ```

### 环境变量配置

修改 `server/.env` 文件：

```env
PORT=3000

# MySQL 数据库配置（根据实际情况修改）
DB_HOST=localhost           # 本地 MySQL 用 localhost，云数据库用内网地址
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password    # 你的 MySQL 密码
DB_NAME=youth_apartment

# JWT 密钥
JWT_SECRET=change_this_to_a_random_string
JWT_EXPIRES_IN=24h
```

### docker-compose.yml

```yaml
version: '3.8'

services:
  mysql:
    image: mysql:8.0
    container_name: youth-mysql
    environment:
      MYSQL_ROOT_PASSWORD: your_root_password
      MYSQL_DATABASE: youth_apartment
      MYSQL_CHARACTER_SET_SERVER: utf8mb4
      MYSQL_COLLATION_SERVER: utf8mb4_general_ci
    ports:
      - "3306:3306"
    volumes:
      - mysql-data:/var/lib/mysql
    restart: always

  app:
    image: youth-apartment:latest
    container_name: youth-apartment
    environment:
      DB_HOST: mysql
      DB_PORT: 3306
      DB_USER: root
      DB_PASSWORD: your_root_password
      DB_NAME: youth_apartment
    ports:
      - "3000:3000"
      - "80:80"    # Nginx 端口（需在 Dockerfile 中配置）
    depends_on:
      - mysql
    restart: always

volumes:
  mysql-data:
```

### 访问地址

部署完成后，通过以下地址访问：

- HTTP: `http://your-server-ip`
- HTTPS: 需配置 SSL 证书（推荐使用 Let's Encrypt 免费证书）

### 默认账号

- 管理员：`admin` / `123456`
- 租客：`zhangsan` / `123456`

### 故障排查

1. 查看日志
   ```bash
   # Docker 部署
   docker-compose logs -f
   
   # 手动部署
   pm2 logs youth-apartment
   ```

2. 检查服务状态
   ```bash
   # Docker
   docker-compose ps
   
   # 手动
   pm2 status
   ```

3. 测试数据库连接
   ```bash
   mysql -h localhost -u root -p youth_apartment
   ```
