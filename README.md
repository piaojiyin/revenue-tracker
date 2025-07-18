## [评测原题](https://starktech.notion.site/Stark-Tech-1-2593796171d44c0b89af35dad29612fd)

# 营收追踪器

本项目是一个基于 Next.js + React 的企业营收数据可视化平台，支持股票搜索、月营收趋势图表、年增长率分析等功能。

[预览地址](https://www.laidoulaile.fun/)

## 投入时间

20250712-20150713这周末期间断断续续完成，累计投入约大半天。涉及评估、设计、编码、本地测试、优化、部署、线上测试、文档编写等环节

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

1. 目前使用`Vercel`平台自动部署本仓库的`master`分支，`Cloudflare`加速访问。[预览地址](https://www.laidoulaile.fun/)
2. 也可在自有服务器使用`docker`、`pm2`等工具部署。
3. 本地部署
   - 构建生产包
   ```bash
   npm run build
   ```
   - 启动生产服务
   ```bash
   npm start
   ```

## 主要技术栈

- Next.js 15
- React 19
- TypeScript
- Zustand（全局状态管理）
- MUI（UI 组件库）
- Recharts（数据可视化）

## 目录结构

- `src/pages/` 页面入口
- `src/components/` 复用组件
- `src/hooks/` 业务逻辑与数据获取
- `src/api/` API 封装
- `src/store/` 状态管理
- `src/types/` 类型定义

## 其他说明

- 待完善功能：自动化测试

---

如需二次开发或有问题，欢迎提 issue 或联系作者。
