# 营收追踪器

本项目是一个基于 Next.js + React 的企业营收数据可视化平台，支持股票搜索、月营收趋势图表、年增长率分析等功能。

## 主要功能
- 支持台/美股代码搜索公司
- 展示公司月度营收趋势图和年增长率
- 时间范围筛选
- 全局错误提示（Toast）
- 自动登录与 Token 管理

## 快速启动
1. 安装依赖
   ```bash
   npm install
   ```
2. 启动开发环境
   ```bash
   npm run dev
   ```
3. 访问
   浏览器打开 [http://localhost:3000](http://localhost:3000)

## 部署说明
1. 构建生产包
   ```bash
   npm run build
   ```
2. 启动生产服务
   ```bash
   npm start
   ```
3. 推荐使用 [Vercel](https://vercel.com/) 或 [Netlify](https://www.netlify.com/) 等平台一键部署。
4. 也可将 `.next` 目录和相关文件部署到自有服务器，需 Node.js 18+ 环境。

## 主要技术栈
- Next.js 15
- React 19
- TypeScript
- Zustand（全局状态管理）
- MUI（UI 组件库）
- Recharts（数据可视化）

## 目录结构
- `src/pages/`      页面入口
- `src/components/` 复用组件
- `src/hooks/`      业务逻辑与数据获取
- `src/api/`        API 封装
- `src/store/`      状态管理
- `src/types/`      类型定义

## 其他说明
- 所有接口异常和业务错误均有全局 Toast 提示
- Token 自动刷新，支持自动登录

---
如需二次开发或有问题，欢迎提 issue 或联系作者。
