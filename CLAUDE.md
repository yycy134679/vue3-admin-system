# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

这是一个基于 Vue 3 + Element Plus 的后台管理系统项目，使用 Vite 构建，支持用户登录、系统管理等功能。

## 技术栈

- **前端框架**: Vue 3 (Composition API)
- **UI 组件库**: Element Plus 2.x
- **构建工具**: Vite 7.x
- **路由**: Vue Router 4.x
- **状态管理**: Pinia 3.x
- **HTTP 客户端**: Axios 1.x
- **Mock 数据**: MockJS 1.x
- **图标**: @element-plus/icons-vue
- **代码规范**: ESLint + Prettier

## 开发命令

### 常用命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览构建结果
npm run preview

# 代码检查和修复
npm run lint

# 代码格式化
npm run format
```

### 环境要求

- Node.js: ^20.19.0 || >=22.12.0

## 项目结构

```
src/
├── assets/          # 静态资源
├── components/      # 公共组件
├── mock/           # Mock 数据
├── router/         # 路由配置
├── stores/         # Pinia 状态管理
├── views/          # 页面组件
├── App.vue         # 根组件
├── main.js         # 入口文件
├── axios.js        # Axios 配置和拦截器
└── mock.js         # Mock 数据接口
```

## 核心功能模块

### 1. 登录系统 (`src/views/Login.vue`)

- 用户名、密码、验证码登录
- 表单验证
- Mock 数据接口支持

### 2. HTTP 请求系统 (`src/axios.js`)

- 统一的 Axios 实例配置
- 请求拦截器自动添加 Authorization token
- 响应拦截器处理错误状态码和消息提示
- 401 状态自动跳转登录页面

### 3. Mock 数据系统 (`src/mock.js`)

- 完整的后台 API 模拟
- 支持登录、用户管理、角色管理、菜单管理等接口
- 统一的响应格式：`{ code, msg, data }`
- 验证码固定为 `c1n9a`
- 支持分页数据的模拟

### 4. 路由系统 (`src/router/index.js`)

- 基本的页面路由配置
- 支持懒加载
- 当前配置了 Home、Login 和 index 页面

### 5. 主界面系统 (`src/views/index.vue`)

- 左侧导航栏，包含系统管理、系统工具等功能模块
- 顶部头部区域，显示系统标题和用户信息
- 主要内容区域（Main）
- 使用 Element Plus 图标组件

## 开发规范

### 1. 组件开发

- 使用 Composition API (`<script setup>`)
- 组件文件名使用 PascalCase
- 优先使用 Element Plus 组件

### 2. 样式规范

- 使用 scoped CSS
- 遵循 Element Plus 设计规范

### 3. 数据请求

- 使用全局挂载的 `$request` 实例进行 HTTP 请求
- Mock 数据位于 `/src/mock.js`
- 接口路径以 `/sys` 开头的为系统管理相关接口

### 4. 路径别名

- `@` 指向 `src` 目录

## Mock 接口说明

### 主要接口

- `GET /captcha` - 获取验证码
- `POST /login` - 用户登录
- `GET /sys/userInfo` - 获取用户信息
- `POST /logout` - 用户登出
- `GET /sys/menu/nav` - 获取导航菜单
- `GET /sys/menu/list` - 获取菜单列表
- `GET /sys/role/list` - 获取角色列表
- `GET /sys/user/list` - 获取用户列表

### Mock 数据特点

- 验证码固定为 `c1n9a`
- 返回格式统一：`{ code, msg, data }`
- 支持分页数据的模拟

## 配置文件

### Vite 配置 (`vite.config.js`)

- 配置了 `@` 路径别名
- 集成了 Vue DevTools

### ESLint 配置

- 使用 Vue 3 推荐配置
- 集成 Prettier

## 开发注意事项

1. **组件注册**: Element Plus 图标已在 `main.js` 中全局注册
2. **HTTP 请求**: 使用全局挂载的 `$request` 而不是直接导入 axios
3. **Mock 数据**: 开发阶段使用 Mock 数据，实际部署时需要替换为真实接口
4. **路由懒加载**: 非首页组件建议使用懒加载
5. **响应式设计**: 使用 Element Plus 的栅格系统进行响应式布局
6. **错误处理**: 响应拦截器会自动处理错误消息提示和 401 重定向

## 登录流程

1. 浏览器打开登录页面
2. 动态加载登录验证码，由于是前后端分离项目，所以不再使用session进行交互，后端将禁用session，在设计上，后端在生成验证码同时生成一个随机码，随机码作为key，验证码为value保存到redis中，再将随机码和验证码图片的Base64字符串码发送到前端.
3. 前端提交用户名、密码、验证码还有随机码
4. 后台验证验证码是否匹配以及密码是否正确

## 项目状态

### 当前进度
- ✅ 基础项目结构搭建
- ✅ Vue 3 + Element Plus 环境配置
- ✅ Axios 请求拦截器和响应拦截器
- ✅ Mock 数据系统
- ✅ 登录页面和功能
- ✅ 主页面布局和导航结构

### 最近更新
- 第四周：第三、四小节完成，进度至 index 页面整体布局，左侧导航栏
- 第四周：第二小节完成：axios 请求前后置拦截处理
- 第四周：第一小节完成：登录页面发起请求
