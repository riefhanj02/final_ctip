# SmartPlant Admin Expo

## 项目概述 (Project Overview)

SmartPlant Admin Expo 是一个基于 React Native 和 Expo 构建的植物发现管理平台。该应用程序为管理员提供了一个完整的后台管理系统，用于可视化和管理植物目击记录、IoT 传感器数据、用户管理等。

SmartPlant Admin Expo is a plant discovery management platform built with React Native and Expo. The application provides administrators with a complete back-office management system for visualizing and managing plant sightings, IoT sensor data, user management, and more.

## 项目架构 (Project Architecture)

### 技术栈 (Tech Stack)
- **框架**: React Native 0.81.5 + Expo SDK 54
- **导航**: Expo Router 6.0 + React Navigation
- **地图**: Leaflet 1.9.4 + React Leaflet 5.0
- **后端**: AWS Lambda (API Gateway) + PHP Backend
- **语言**: TypeScript + JavaScript

### 主要功能模块 (Main Features)
1. **用户管理 (Users Management)**: 管理员可以查看、创建、更新和删除用户账户
2. **IoT 数据管理 (IoT Data Management)**: 监控和管理 IoT 传感器读数、警报等
3. **地图可视化 (Map Visualization)**: 
   - 植物目击记录的可视化展示
   - 热力图 (Heatmap) 显示植物分布密度
   - 标记点 (Markers) 显示具体植物位置
   - CRUD 操作：添加、查看、删除植物目击记录
4. **植物管理 (Plant Management)**: 管理不确定的植物图像和分类

### 目录结构 (Directory Structure)
```
smartplant-admin-expo/
├── app/                    # Expo Router 页面路由
│   ├── map.tsx            # 地图页面（包含热力图功能）
│   ├── users.tsx          # 用户管理页面
│   ├── iot.tsx            # IoT 数据页面
│   └── ...
├── src/
│   ├── api.js             # API 请求函数（统一后端接口）
│   ├── mapData.ts         # 地图相关数据
│   └── ...
├── components/
│   └── AdminShell.tsx     # 管理后台布局组件
└── backend/               # PHP 后端接口
```

## API 端点 (API Endpoints)

### 统一后端端点 (Unified Backend Endpoints)
后端 API 基础 URL: `https://sj2osq50u1.execute-api.us-east-1.amazonaws.com/demo`

#### 植物相关 (Plants/Map)
- `GET /plants?admin=1` - 获取植物列表（管理员视图）
- `POST /plants` - 创建新的植物目击记录
- `POST /plants/presign` - 获取 S3 预签名 URL（用于图片上传）
- `GET /plants/heatmap?admin=1` - 获取热力图数据
- `PUT /plants/{id}/mask` - 屏蔽/取消屏蔽植物位置

#### 用户管理 (Users)
- `GET /users.php?mode=stats` - 获取用户统计
- `GET /users.php?mode=list` - 获取用户列表
- `POST /users.php` - 创建用户
- `PUT /users.php?id={id}` - 更新用户
- `DELETE /users.php?id={id}` - 删除用户

#### IoT 数据 (IoT)
- `GET /iot.php?mode=stats` - 获取 IoT 统计
- `GET /iot.php?mode=readings` - 获取传感器读数
- `GET /iot.php?mode=alerts` - 获取警报列表

## 地图功能 (Map Features)

### 热力图 (Heatmap)
- **显示/隐藏切换按钮**: 管理员可以通过"Show Heatmap" / "Hide Heatmap"按钮控制热力图的显示
- **数据来源**: 从 AWS Lambda 端点 `/plants/heatmap` 获取热力图数据
- **可视化**: 使用 `react-leaflet-heatmap-layer-v3` 和 `leaflet.heat` 库渲染热力图
- **配置参数**:
  - 半径 (radius): 25px
  - 模糊度 (blur): 15px
  - 最大强度 (max): 1.0

### 标记点 (Markers)
- 每个植物目击记录在地图上显示为一个标记点
- 点击标记点可以查看详细信息（描述、物种、稀有度、图片等）
- 支持搜索和筛选功能

### CRUD 功能
- **创建**: 点击地图选择位置，填写信息后添加新目击记录
- **读取**: 查看所有标记点和详细信息
- **更新**: 通过管理员视图切换查看完整/公开数据
- **删除**: 从列表中删除植物目击记录

## 安装和运行 (Installation & Running)

### 前置要求 (Prerequisites)
- Node.js 18+ 
- npm 或 yarn
- Expo CLI

### 安装依赖 (Install Dependencies)
```bash
npm install
```

### 运行项目 (Run Project)
```bash
# 启动开发服务器
npm start

# 在 Web 浏览器中运行
npm run web

# 在 Android 设备/模拟器上运行
npm run android

# 在 iOS 设备/模拟器上运行
npm run ios
```

### 安装新依赖 (Install New Dependencies)
```bash
# 例如：安装热力图相关库（已安装）
npm install leaflet.heat react-leaflet-heatmap-layer-v3
```

## 开发说明 (Development Notes)

### 代码规范 (Code Standards)
- 所有代码必须添加清晰的中文注释说明功能和用途
- 代码必须整齐规范，便于理解和维护
- 遵循 React Native 和 Expo 最佳实践

### 重要文件说明 (Important Files)
- `src/api.js`: 包含所有 API 请求函数，统一管理后端接口调用
- `app/map.tsx`: 地图页面组件，包含热力图和标记点功能
- `components/AdminShell.tsx`: 管理后台布局组件，提供侧边栏导航

## 版本历史 (Version History)

### v1.0.0
- 初始版本
- 实现用户管理、IoT 数据管理、地图可视化等基础功能
- 添加热力图功能（2024年更新）

## 许可证 (License)
Private - All Rights Reserved


