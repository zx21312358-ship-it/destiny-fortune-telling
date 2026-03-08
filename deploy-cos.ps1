# 腾讯云 COS 静态网站部署脚本 (PowerShell 版本)
# 使用方法：.\deploy-cos.ps1

# ==================== 配置区域 ====================
# 请修改以下配置为您的实际值

# 腾讯云密钥信息
$SECRET_ID = "YOUR_SECRET_ID"
$SECRET_KEY = "YOUR_SECRET_KEY"

# COS 存储桶配置
$COS_BUCKET = "your-bucket-name"
$COS_REGION = "ap-guangzhou"  # 例如：ap-guangzhou, ap-shanghai, ap-beijing

# 本地文件目录
$LOCAL_DIR = "."

# ==================== 不要修改以下代码 ====================

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  腾讯云 COS 静态网站部署脚本 (PowerShell)" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# 检查配置
if ($SECRET_ID -eq "YOUR_SECRET_ID") {
    Write-Host "错误：请配置 SECRET_ID" -ForegroundColor Red
    exit 1
}

if ($SECRET_KEY -eq "YOUR_SECRET_KEY") {
    Write-Host "错误：请配置 SECRET_KEY" -ForegroundColor Red
    exit 1
}

# 检查 coscmd 是否安装
try {
    $coscmd = Get-Command coscmd -ErrorAction Stop
} catch {
    Write-Host "错误：未找到 coscmd，请先安装：" -ForegroundColor Red
    Write-Host "  pip install coscmd" -ForegroundColor Yellow
    exit 1
}

# 检查本地目录
if (-not (Test-Path $LOCAL_DIR)) {
    Write-Host "错误：本地目录不存在：$LOCAL_DIR" -ForegroundColor Red
    exit 1
}

Write-Host "配置信息：" -ForegroundColor Green
Write-Host "  存储桶：$COS_BUCKET"
Write-Host "  区域：$COS_REGION"
Write-Host "  本地目录：$LOCAL_DIR"
Write-Host ""

# 配置 coscmd
Write-Host "正在配置 coscmd..." -ForegroundColor Yellow
coscmd config -a $SECRET_ID -s $SECRET_KEY -b $COS_BUCKET -r $COS_REGION

# 上传文件
Write-Host ""
Write-Host "正在上传文件..." -ForegroundColor Yellow
coscmd upload -rs --delete $LOCAL_DIR /

# 设置网站权限（可选）
Write-Host ""
Write-Host "正在列出文件..." -ForegroundColor Yellow
coscmd list -a

Write-Host ""
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "  部署完成！" -ForegroundColor Green
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "请前往腾讯云 COS 控制台配置静态网站：" -ForegroundColor Yellow
Write-Host "1. 进入存储桶详情页"
Write-Host "2. 点击'基础配置' -> '静态网站'"
Write-Host "3. 启用静态网站托管"
Write-Host "4. 设置索引文档为 index.html"
Write-Host "5. 设置错误文档为 index.html（单页应用）或 404.html"
Write-Host ""