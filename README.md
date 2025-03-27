# Met.red Demo

这是一个用于教育目的的链接追踪系统演示项目。该项目展示了如何创建和追踪特殊的重定向链接，用于记录访问者的IP地址和地理位置信息。

## 功能特点

- 生成自定义追踪链接
- 记录访问者IP地址
- 获取访问者地理位置信息
- 使用密钥查看追踪记录
- 现代化的用户界面

## 技术栈

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma
- MongoDB
- Vercel

## 开始使用

1. 克隆项目：
   ```bash
   git clone https://github.com/yourusername/met-red-demo.git
   cd met-red-demo
   ```

2. 安装依赖：
   ```bash
   npm install
   ```

3. 配置环境变量：
   - 复制 `.env.example` 到 `.env`
   - 更新 MongoDB 连接字符串
   - 设置 `NEXT_PUBLIC_BASE_URL`

4. 初始化数据库：
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. 运行开发服务器：
   ```bash
   npm run dev
   ```

6. 访问 [http://localhost:3000](http://localhost:3000)

## 部署

本项目可以轻松部署到Vercel平台：

1. 在Vercel上创建新项目
2. 导入你的Git仓库
3. 配置环境变量
4. 部署

## 注意事项

- 本项目仅用于教育目的
- 请遵守相关法律法规
- 不要将此工具用于非法用途

## 许可证

MIT 