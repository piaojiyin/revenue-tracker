# 使用官方Node 18 Alpine镜像
FROM node:18-alpine

# 设置工作目录
WORKDIR /app

# 复制依赖文件
COPY package*.json ./

# 安装生产依赖
RUN npm install --production

# 复制全部项目文件
COPY . .

# 构建Next.js应用
RUN npm run build

# 启动Next.js生产服务
CMD ["npm", "start"] 