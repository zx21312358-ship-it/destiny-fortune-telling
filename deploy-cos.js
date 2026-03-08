/**
 * 腾讯云 COS 静态网站部署脚本 (Node.js 版本)
 * 使用 COS SDK 进行文件上传
 * 
 * 使用方法：
 * 1. 安装依赖：npm install cos-nodejs-sdk-v5
 * 2. 配置下面的密钥和存储桶信息
 * 3. 运行：node deploy-cos.js
 */

const COS = require('cos-nodejs-sdk-v5');
const fs = require('fs');
const path = require('path');

// ==================== 配置区域 ====================
// 请修改以下配置为您的实际值

const config = {
    // 腾讯云密钥信息
    // 请复制 deploy.config.example.js 为 deploy.config.js 并填写真实密钥
    SecretId: process.env.TENCENT_SECRET_ID || 'YOUR_SECRET_ID',
    SecretKey: process.env.TENCENT_SECRET_KEY || 'YOUR_SECRET_KEY',
    
    Bucket: 'destiny-1403288566',  // 存储桶名称，格式：bucket-name-APPID
    Region: 'ap-guangzhou',      // 例如：ap-guangzhou, ap-shanghai, ap-beijing
    
    // 自定义域名（可选）- 如果有绑定域名，填写后会自动生成访问 URL
    CustomDomain: '',
    
    // 本地文件目录
    LocalDir: './',
    
    // 需要排除的文件/目录
    Exclude: [
        'node_modules',
        '.git',
        '.vscode',
        '.claude',
        '.omc',
        '.wrangler',
        '*.md',
        'deploy-cos.js',
        'deploy-cos.sh',
        'deploy-cos.ps1',
        'package.json',
        'package-lock.json',
        'deploy.config.example.js'
    ]
};

// ==================== 不要修改以下代码 ====================

// 检查配置
if (config.SecretId === 'YOUR_SECRET_ID') {
    console.error('错误：请配置 SecretId');
    process.exit(1);
}

if (config.SecretKey === 'YOUR_SECRET_KEY') {
    console.error('错误：请配置 SecretKey');
    process.exit(1);
}

// 创建 COS 实例
const cos = new COS({
    SecretId: config.SecretId,
    SecretKey: config.SecretKey
});

// 需要匹配的文件扩展名
const includeExtensions = ['.html', '.css', '.js', '.json', '.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.webp', '.woff', '.woff2', '.ttf', '.eot'];

// 检查是否应该排除某个文件
function shouldExclude(filePath) {
    for (const pattern of config.Exclude) {
        if (filePath.includes(pattern)) {
            return true;
        }
        if (pattern.startsWith('*')) {
            const ext = pattern;
            if (filePath.endsWith(ext.substring(1))) {
                return true;
            }
        }
    }
    return false;
}

// 检查文件扩展名是否匹配
function hasValidExtension(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    return includeExtensions.includes(ext);
}

// 递归获取文件列表
function getFiles(dir, baseDir = '') {
    const files = [];
    const items = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const item of items) {
        const fullPath = path.join(dir, item.name);
        const relativePath = path.join(baseDir, item.name);
        
        if (shouldExclude(relativePath)) {
            continue;
        }
        
        if (item.isDirectory()) {
            files.push(...getFiles(fullPath, relativePath));
        } else if (item.isFile() && hasValidExtension(relativePath)) {
            files.push({
                localPath: fullPath,
                cosPath: relativePath.replace(/\\/g, '/')
            });
        }
    }
    
    return files;
}

// 获取文件的 Content-Type
function getContentType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const types = {
        '.html': 'text/html; charset=utf-8',
        '.css': 'text/css; charset=utf-8',
        '.js': 'application/javascript; charset=utf-8',
        '.json': 'application/json; charset=utf-8',
        '.png': 'image/png',
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.ico': 'image/x-icon',
        '.webp': 'image/webp',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.eot': 'application/vnd.ms-fontobject'
    };
    return types[ext] || 'application/octet-stream';
}

// 上传单个文件
function uploadFile(file) {
    return new Promise((resolve, reject) => {
        const contentType = getContentType(file.localPath);
        cos.putObject({
            Bucket: config.Bucket,
            Region: config.Region,
            Key: file.cosPath,
            Body: fs.createReadStream(file.localPath),
            ContentType: contentType,
            CacheControl: 'no-cache, no-store, must-revalidate',
            Expires: '0'
        }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// 检查存储桶是否存在
async function checkBucketExists() {
    return new Promise((resolve, reject) => {
        cos.getBucket({
            Bucket: config.Bucket,
            Region: config.Region
        }, (err, data) => {
            if (err && err.statusCode === 404) {
                resolve(false);
            } else if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}

// 创建存储桶
async function createBucket() {
    return new Promise((resolve, reject) => {
        cos.putBucket({
            Bucket: config.Bucket,
            Region: config.Region
        }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// 设置存储桶 CORS
async function setBucketCors() {
    return new Promise((resolve, reject) => {
        cos.putBucketCors({
            Bucket: config.Bucket,
            Region: config.Region,
            CORSConfiguration: {
                CORSRules: [{
                    AllowedOrigin: ['*'],
                    AllowedMethod: ['GET', 'PUT', 'POST', 'DELETE', 'HEAD'],
                    AllowedHeader: ['*'],
                    ExposeHeader: ['ETag'],
                    MaxAgeSeconds: 3600
                }]
            }
        }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// 设置静态网站托管
async function setBucketWebsite() {
    return new Promise((resolve, reject) => {
        cos.putBucketWebsite({
            Bucket: config.Bucket,
            Region: config.Region,
            WebsiteConfiguration: {
                IndexDocument: 'index.html',
                ErrorDocument: 'index.html'
            }
        }, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
}

// 主函数
async function deploy() {
    console.log('==========================================');
    console.log('  腾讯云 COS 静态网站部署脚本 (Node.js)');
    console.log('==========================================');
    console.log('');
    
    console.log('配置信息：');
    console.log(`  存储桶：${config.Bucket}`);
    console.log(`  区域：${config.Region}`);
    console.log(`  本地目录：${config.LocalDir}`);
    console.log('');
    
    // 检查存储桶是否存在
    console.log('正在检查存储桶...');
    let bucketExists = false;
    try {
        bucketExists = await checkBucketExists();
    } catch (err) {
        console.error(`检查存储桶失败：${err.message}`);
        console.log('');
        console.log('==========================================');
        console.log('  错误：无法连接到存储桶');
        console.log('==========================================');
        console.log('');
        console.log('请确保：');
        console.log('1. 存储桶名称格式正确：bucket-name-APPID');
        console.log('2. 存储桶已存在或你有创建权限');
        console.log('3. SecretId 和 SecretKey 配置正确');
        console.log('');
        console.log('你可以前往腾讯云 COS 控制台创建存储桶：');
        console.log('https://console.cloud.tencent.com/cos5/bucket');
        console.log('');
        return;
    }
    
    if (!bucketExists) {
        console.log(`存储桶 ${config.Bucket} 不存在`);
        console.log('');
        console.log('==========================================');
        console.log('  需要手动创建存储桶');
        console.log('==========================================');
        console.log('');
        console.log('当前密钥没有创建存储桶的权限，请手动创建：');
        console.log('');
        console.log('1. 访问腾讯云 COS 控制台：');
        console.log('   https://console.cloud.tencent.com/cos5/bucket');
        console.log('');
        console.log('2. 点击"新建存储桶"，填写以下信息：');
        console.log(`   - 存储桶名称：${config.Bucket}`);
        console.log(`   - 所属地域：${config.Region === 'ap-guangzhou' ? '华南地区 (广州)' : config.Region}`);
        console.log('   - 访问权限：公有读私有写');
        console.log('');
        console.log('3. 创建完成后，再次运行此脚本上传文件');
        console.log('');
        return;
    } else {
        console.log('✓ 存储桶已存在');
    }
    
    console.log('');
    
    // 获取文件列表
    console.log('正在扫描文件...');
    const files = getFiles(config.LocalDir);
    console.log(`找到 ${files.length} 个文件需要上传`);
    console.log('');
    
    if (files.length === 0) {
        console.log('没有文件需要上传');
        return;
    }
    
    // 上传文件
    console.log('正在上传文件...');
    let successCount = 0;
    let failCount = 0;
    
    for (const file of files) {
        try {
            await uploadFile(file);
            console.log(`✓ ${file.cosPath}`);
            successCount++;
        } catch (err) {
            console.error(`✗ ${file.cosPath}: ${err.message}`);
            failCount++;
        }
    }
    
    console.log('');
    console.log('==========================================');
    console.log('  部署完成！');
    console.log('==========================================');
    console.log(`  成功：${successCount} 个文件`);
    console.log(`  失败：${failCount} 个文件`);
    console.log('');
    
    if (successCount > 0) {
        console.log('访问地址：');
        console.log(`https://${config.Bucket}.cos.${config.Region}.myqcloud.com/`);
        console.log('');
        console.log('如果已配置自定义域名，也可以通过域名访问。');
    }
    
    console.log('');
    console.log('注意：如果访问出现 403 错误，请检查：');
    console.log('1. 存储桶权限是否设置为"公有读私有写"');
    console.log('2. 是否已启用静态网站托管');
    console.log('');
}

// 运行部署
deploy().catch(err => {
    console.error('部署失败:', err);
    process.exit(1);
});