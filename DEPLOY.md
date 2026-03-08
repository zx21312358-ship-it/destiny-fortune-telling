# 腾讯云 COS 静态网站部署指南

## 快速开始

### 方法一：使用 Node.js 脚本（推荐）

1. **安装依赖**
   ```bash
   npm install
   ```

2. **配置密钥**
   
   编辑 `deploy-cos.js` 文件，填写您的腾讯云密钥：
   ```javascript
   const config = {
       SecretId: 'YOUR_SECRET_ID',
       SecretKey: 'YOUR_SECRET_KEY',
       Bucket: 'your-bucket-name',
       Region: 'ap-guangzhou'
   };
   ```

3. **运行部署**
   ```bash
   npm run deploy
   ```

### 方法二：使用 Shell 脚本（Linux/Mac）

1. **安装 coscmd**
   ```bash
   pip install coscmd
   ```

2. **配置密钥**
   
   编辑 `deploy-cos.sh` 文件，填写您的腾讯云密钥。

3. **运行部署**
   ```bash
   chmod +x deploy-cos.sh
   ./deploy-cos.sh
   ```

### 方法三：使用 PowerShell 脚本（Windows）

1. **安装 coscmd**
   ```bash
   pip install coscmd
   ```

2. **配置密钥**
   
   编辑 `deploy-cos.ps1` 文件，填写您的腾讯云密钥。

3. **运行部署**
   ```powershell
   .\deploy-cos.ps1
   ```

## 获取腾讯云密钥

1. 登录 [腾讯云控制台](https://console.cloud.tencent.com/)
2. 访问 [访问管理 - API 密钥管理](https://console.cloud.tencent.com/cam/capi)
3. 点击「新建密钥」创建新的 SecretId 和 SecretKey
4. 复制并保存到部署脚本中

## 创建 COS 存储桶

1. 登录 [COS 控制台](https://console.cloud.tencent.com/cos5)
2. 点击「新建存储桶」
3. 填写存储桶名称（格式：`bucket-name-APPID`）
4. 选择所在地域（如：华南地区 - 广州）
5. 访问权限选择「公有读私有写」
6. 点击「确认」创建

## 配置静态网站托管

1. 进入存储桶详情页
2. 点击「基础配置」标签
3. 找到「静态网站」配置项
4. 点击「编辑」启用静态网站托管
5. 设置：
   - 索引文档：`index.html`
   - 错误文档：`index.html`（单页应用）或 `404.html`
6. 点击「确认」保存

## 配置自定义域名（可选）

1. 在 COS 控制台进入存储桶详情
2. 点击「域名管理」标签
3. 点击「添加域名」
4. 填写您的域名
5. 按照提示配置 CNAME 记录
6. 配置 HTTPS 证书（可选）

## 安全提示

- **不要**将包含真实密钥的文件提交到 Git
- 建议将 `deploy.config.js` 添加到 `.gitignore`
- 定期轮换密钥
- 使用子账号密钥，限制最小权限

## 常见问题

### 上传失败：权限不足
检查存储桶权限是否设置为「公有读私有写」

### 上传失败：签名错误
检查 SecretId 和 SecretKey 是否正确

### 网站访问 403
检查是否已启用静态网站托管，并正确配置索引文档

### 刷新页面 404
将错误文档设置为 `index.html`，实现前端路由支持

## 文件说明

| 文件 | 说明 |
|------|------|
| `deploy-cos.js` | Node.js 部署脚本 |
| `deploy-cos.sh` | Linux/Mac Shell 部署脚本 |
| `deploy-cos.ps1` | Windows PowerShell 部署脚本 |
| `deploy.config.example.js` | 配置文件模板 |
| `package.json` | Node.js 项目配置 |

## 其他部署方式

### 使用 Vercel
```bash
npm install -g vercel
vercel
```

### 使用 Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod