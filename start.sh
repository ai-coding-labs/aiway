#!/bin/bash

# AI味儿检测器一键启动脚本
# AI Flavor Detector One-Click Startup Script

echo "🚀 启动AI味儿检测器..."
echo "🚀 Starting AI Flavor Detector..."

# 检查Node.js是否安装
if ! command -v node &> /dev/null; then
    echo "❌ 错误：未找到Node.js，请先安装Node.js"
    echo "❌ Error: Node.js not found, please install Node.js first"
    exit 1
fi

# 检查npm是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ 错误：未找到npm，请先安装npm"
    echo "❌ Error: npm not found, please install npm first"
    exit 1
fi

echo "✅ Node.js版本: $(node --version)"
echo "✅ npm版本: $(npm --version)"

# 检查node_modules是否存在
if [ ! -d "node_modules" ]; then
    echo "📦 正在安装依赖..."
    echo "📦 Installing dependencies..."
    npm install
    if [ $? -ne 0 ]; then
        echo "❌ 依赖安装失败"
        echo "❌ Failed to install dependencies"
        exit 1
    fi
    echo "✅ 依赖安装完成"
    echo "✅ Dependencies installed successfully"
else
    echo "✅ 依赖已存在"
    echo "✅ Dependencies already exist"
fi

# 检查dist目录是否存在
if [ ! -d "dist" ]; then
    echo "🔨 正在构建项目..."
    echo "🔨 Building project..."
    npm run build
    if [ $? -ne 0 ]; then
        echo "❌ 项目构建失败"
        echo "❌ Failed to build project"
        exit 1
    fi
    echo "✅ 项目构建完成"
    echo "✅ Project built successfully"
else
    echo "✅ 项目已构建"
    echo "✅ Project already built"
fi

# 启动应用
echo "🎯 正在启动AI味儿检测器..."
echo "🎯 Starting AI Flavor Detector..."
npm start

# 检查启动状态
if [ $? -eq 0 ]; then
    echo "✅ 应用已正常退出"
    echo "✅ Application exited normally"
else
    echo "❌ 应用启动失败或异常退出"
    echo "❌ Application failed to start or exited abnormally"
    exit 1
fi 