#!/bin/bash

# 腾讯云 COS 静态网站部署脚本
# 使用方法：./deploy-cos.sh

set -e

# ==================== 配置区域 ====================
# 请修改以下配置为您的实际值

# 腾讯云密钥信息
SECRET_ID="YOUR_SECRET_ID"
SECRET_KEY="YOUR_SECRET_KEY"

# COS 存储桶配置
COS_BUCKET="your-bucket-name"
COS_REGION="ap-guangzhou"  # 例如：ap-guangzhou, ap-shanghai, ap-beijing

# 本地文件目录
LOCAL_DIR="./"

# 需要上传的文件类型
INCLUDE_FILES="*.html *.css *.js *.json *.png *.jpg *.jpeg *.gif *.svg *.ico *.webp *.woff *.woff2 *.ttf *.eot"

# ==================== 不要修改以下代码 ====================

echo "=========================================="
echo "  腾讯云 COS 静态网站部署脚本"
echo "=========================================="
echo ""

# 检查配置
if [ "$SECRET_ID" = "YOUR_SECRET_ID" ]; then
    echo "错误：请配置 SECRET_ID"
    exit 1
fi

if [ "$SECRET_KEY" = "YOUR_SECRET_KEY" ]; then
    echo "错误：请配置 SECRET_KEY"
    exit 1
fi

# 检查 coscmd 是否安装
if ! command -v coscmd &> /dev/null; then
    echo "错误：未找到 coscmd，请先安装："
    echo "  pip install coscmd"
    exit 1
fi

# 检查本地目录
if [ ! -d "$LOCAL_DIR" ]; then
    echo "错误：本地目录不存在：$LOCAL_DIR"
    exit 1
fi

echo "配置信息："
echo "  存储桶：$COS_BUCKET"
echo "  区域：$COS_REGION"
echo "  本地目录：$LOCAL_DIR"
echo ""

# 配置 coscmd
echo "正在配置 coscmd..."
coscmd config -a "$SECRET_ID" -s "$SECRET_KEY" -b "$COS_BUCKET" -r "$COS_REGION"

# 上传文件
echo ""
echo "正在上传文件..."
coscmd upload -rs --delete "$LOCAL_DIR" /

# 设置网站权限（可选）
echo ""
echo "正在设置文件权限..."
coscmd list -a

echo ""
echo "=========================================="
echo "  部署完成！"
echo "=========================================="
echo ""
echo "请前往腾讯云 COS 控制台配置静态网站："
echo "1. 进入存储桶详情页"
echo "2. 点击'基础配置' -> '静态网站'"
echo "3. 启用静态网站托管"
echo "4. 设置索引文档为 index.html"
echo "5. 设置错误文档为 index.html（单页应用）或 404.html"
echo ""