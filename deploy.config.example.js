/**
 * 腾讯云 COS 部署配置文件模板
 * 
 * 使用方法：
 * 1. 复制此文件为 deploy.config.js
 * 2. 填写您的实际配置信息
 * 3. 运行部署脚本：node deploy-cos.js
 * 
 * 安全提示：
 * - 不要将包含真实密钥的 deploy.config.js 提交到版本控制系统
 * - 建议将 deploy.config.js 添加到 .gitignore
 */

module.exports = {
    // 腾讯云密钥信息
    // 获取方式：https://console.cloud.tencent.com/cam/capi
    SecretId: 'YOUR_SECRET_ID',
    SecretKey: 'YOUR_SECRET_KEY',
    
    // COS 存储桶配置
    // 存储桶名称格式：bucket-name-APPID
    // 例如：destiny-1234567890
    Bucket: 'your-bucket-name',
    
    // 存储桶所在区域
    // 可选值：
    //   ap-beijing      - 华北地区（北京）
    //   ap-chengdu      - 西南地区（成都）
    //   ap-chongqing    - 西南地区（重庆）
    //   ap-guangzhou    - 华南地区（广州）
    //   ap-guangzhou-open - 华南地区（广州）- 开放专区
    //   ap-hongkong     - 港澳台及海外地区（中国香港）
    //   ap-mumbai       - 亚太南部（孟买）
    //   ap-seoul        - 亚太东北（首尔）
    //   ap-shanghai     - 华东地区（上海）
    //   ap-singapore    - 亚太东南（新加坡）
    //   ap-tokyo        - 亚太东北（东京）
    //   eu-frankfurt    - 欧洲地区（法兰克福）
    //   na-ashburn      - 北美地区（弗吉尼亚）
    //   na-toronto      - 北美地区（多伦多）
    Region: 'ap-guangzhou',
    
    // 本地文件目录（相对于当前脚本的目录）
    LocalDir: './',
    
    // 需要排除的文件/目录模式
    // 支持完整路径匹配和通配符匹配
    Exclude: [
        // 目录
        'node_modules',
        '.git',
        '.vscode',
        '.idea',
        'dist',
        'build',
        
        // 文档文件
        '*.md',
        'README*',
        'LICENSE',
        
        // 部署脚本本身
        'deploy.config.js',
        'deploy.config.example.js',
        'deploy-cos.js',
        'deploy-cos.sh',
        'deploy-cos.ps1',
        
        // 包管理文件
        'package.json',
        'package-lock.json',
        'yarn.lock',
        'pnpm-lock.yaml',
        
        // 配置文件
        '.gitignore',
        '.editorconfig',
        'vercel.json',
        'netlify.toml'
    ],
    
    // 需要上传的文件扩展名
    IncludeExtensions: [
        '.html', '.htm',
        '.css', '.scss', '.less',
        '.js', '.jsx', '.ts', '.tsx', '.mjs',
        '.json',
        '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.avif',
        '.woff', '.woff2', '.ttf', '.eot',
        '.xml', '.txt',
        '.mp4', '.webm', '.ogg',
        '.mp3', '.wav',
        '.pdf', '.doc', '.docx'
    ],
    
    // 高级配置
    Advanced: {
        // 是否启用 gzip 压缩上传
        enableGzip: false,
        
        // 是否删除远程多余文件（谨慎使用）
        deleteExtra: false,
        
        // 文件缓存控制（秒）
        // 0 = 不设置缓存
        // 31536000 = 1 年
        cacheControl: {
            // HTML 文件不缓存或短时间缓存
            'html': 0,
            // CSS/JS 文件长时间缓存
            'css': 31536000,
            'js': 31536000,
            // 图片资源长时间缓存
            'image': 31536000,
            // 字体文件长时间缓存
            'font': 31536000
        },
        
        // 是否设置 CORS（跨域资源共享）
        enableCors: true,
        corsConfig: {
            AllowedOrigin: ['*'],
            AllowedMethod: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
            AllowedHeader: ['*'],
            ExposeHeader: ['ETag'],
            MaxAgeSeconds: 3600
        }
    }
};