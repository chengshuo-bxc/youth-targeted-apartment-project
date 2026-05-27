# 多阶段构建
FROM node:18-alpine AS builder

WORKDIR /app

# 复制项目文件
COPY . .

# 安装前端依赖
RUN npm ci

# 构建前端
RUN npm run build

# 生产镜像 - 使用 Nginx + Node.js
FROM node:18-alpine AS backend

# 安装 Nginx
RUN apk add --no-cache nginx

WORKDIR /app

# 安装后端依赖
COPY package*.json server/ ./
RUN npm ci --production

# 复制后端代码
COPY server/ ./server/

# 复制前端产物
COPY --from=builder /app/dist ./dist

# 复制环境变量
COPY .env .env

# 配置 Nginx
RUN echo 'server { \
    listen 80; \
    server_name _; \
    location / { \
        root /app/dist; \
        try_files $uri $uri/ /index.html; \
    } \
    location /api { \
        proxy_pass http://localhost:3000; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
        proxy_cache_bypass $http_upgrade; \
    } \
}' > /etc/nginx/conf.d/default.conf

# 暴露端口
EXPOSE 80

# 启动脚本
RUN echo '#!/bin/sh \
nginx -g "daemon off;" & \
node server/app.js' > /start.sh && chmod +x /start.sh

CMD ["/start.sh"]
