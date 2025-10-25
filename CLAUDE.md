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
├── assets/          # 静态资源（如 user.jpg）
├── components/      # 公共组件（如 HelloWorld.vue）
├── stores/         # Pinia 状态管理（auth.js, counter.js）
├── router/         # 路由配置（index.js）
├── views/          # 主要页面组件
│   ├── sys/        # 系统管理功能组件（User.vue, Role.vue, Menu.vue）
│   ├── Login.vue   # 登录页
│   ├── Home.vue    # 主布局容器（包含头部、侧边栏、主内容区）
│   ├── index.vue   # 首页内容
│   ├── SideMenu.vue # 左侧导航菜单
│   └── inc.vue     # 其他组件
├── App.vue         # 根组件
├── main.js         # 入口文件（全局配置、插件注册）
├── axios.js        # Axios 实例配置和拦截器
└── mock.js         # Mock 数据接口定义
```

### 关键架构说明

1. **布局层级**: `App.vue` → `Home.vue`（主布局） → `router-view`（动态内容）
2. **导航结构**: `Home.vue` 包含 `SideMenu.vue`（左侧菜单）+ 顶部栏 + 主内容区
3. **系统模块**: `views/sys/` 目录存放系统管理功能组件（用户、角色、菜单管理）
4. **路由配置**: Home 为父路由，index 和系统管理页面为子路由

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

- 采用嵌套路由结构：Home 为父路由，包含多个子路由
- 子路由：`/index`（首页）、`/sys/users`、`/sys/roles`、`/sys/menus`
- 独立路由：`/login`（登录页，使用懒加载）
- 所有系统管理页面在 Home 布局内通过 `<router-view>` 动态渲染

### 5. 主界面系统 (`src/views/Home.vue` + `SideMenu.vue`)

- **Home.vue**: 使用 Element Plus 的 Container 布局，包含侧边栏、头部和主内容区
- **SideMenu.vue**: 左侧导航菜单，包含首页、系统管理（用户/角色/菜单管理）、系统工具（数字字典）
- 使用 `<router-link>` 实现页面导航，避免全页面刷新

## 开发规范

### 1. 组件开发

- 使用 Composition API (`<script setup>`)
- 组件文件名使用 PascalCase
- 优先使用 Element Plus 组件

### 2. 样式规范

- 使用 scoped CSS
- 遵循 Element Plus 设计规范

### 3. 数据请求

- 在组件中通过 `this.$request` 或 `getCurrentInstance().appContext.config.globalProperties.$request` 访问 Axios 实例
- 在 Composition API 中使用：
  ```javascript
  import { getCurrentInstance } from 'vue'
  const { proxy } = getCurrentInstance()
  proxy.$request.get('/api/endpoint')
  ```
- 或直接导入：`import request from '@/axios.js'`
- Mock 数据位于 `src/mock.js`，开发时自动拦截请求
- 接口路径约定：系统管理相关接口以 `/sys` 开头

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

1. **全局配置位置**: `main.js` 中完成了以下全局配置：
   - Element Plus 图标全局注册（可直接在模板中使用）
   - `$request` 全局属性挂载（用于 HTTP 请求）
   - Pinia、Router、Element Plus 插件注册

2. **HTTP 请求流程**:
   - 请求拦截器自动从 localStorage 读取 token 并添加到 Authorization 头
   - 响应拦截器统一处理错误（code !== 200 时显示错误消息）
   - 401 状态码自动跳转到登录页

3. **Mock 数据开发**:
   - Mock.js 在 `main.js` 中导入后即生效
   - 实际请求会被 Mock.js 拦截，返回模拟数据
   - 生产环境需要删除 `import './mock.js'` 并连接真实后端

4. **组件导入注意**:
   - 系统管理组件位于 `@/views/sys/` 目录
   - 使用路径别名 `@` 指向 `src` 目录

5. **路由导航**:
   - 在 SideMenu 中添加新菜单项时，需要同步更新 `router/index.js` 中的路由配置
   - 子路由路径不需要以 `/` 开头（相对于父路由）

## 登录流程

1. 浏览器打开登录页面
2. 动态加载登录验证码，由于是前后端分离项目，所以不再使用session进行交互，后端将禁用session，在设计上，后端在生成验证码同时生成一个随机码，随机码作为key，验证码为value保存到redis中，再将随机码和验证码图片的Base64字符串码发送到前端.
3. 前端提交用户名、密码、验证码还有随机码
4. 后台验证验证码是否匹配以及密码是否正确

## 项目当前状态

### 已完成功能
- ✅ 基础项目结构和环境配置
- ✅ 登录页面（含验证码功能）
- ✅ Axios 请求/响应拦截器
- ✅ Mock 数据系统（登录、用户、角色、菜单接口）
- ✅ 主布局框架（Home.vue 包含头部、侧边栏、主内容区）
- ✅ 左侧导航菜单（SideMenu.vue）
- ✅ 嵌套路由配置

### 待开发功能
- 系统管理页面内容实现（User.vue、Role.vue、Menu.vue 当前为空）
- 首页（index.vue）内容填充
- 用户信息获取和显示（头部下拉菜单）
- 退出登录功能
- 路由守卫（登录验证）
- 动态菜单加载（基于权限）

### Git 状态
当前分支: `main`

已修改但未提交的文件:
- `src/router/index.js` - 路由配置更新
- `src/views/Home.vue` - 主布局完善
- `src/views/index.vue` - 首页组件

新增文件:
- `src/views/sys/Menu.vue` - 菜单管理页面
- `src/views/sys/Role.vue` - 角色管理页面
- `src/views/sys/User.vue` - 用户管理页面
- `src/views/SideMenu.vue` - 侧边栏导航
- `src/views/inc.vue` - 组件文件
