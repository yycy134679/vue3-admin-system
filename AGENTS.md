## 项目概述

Vue 3 + Element Plus 的后台管理系统，采用前后端分离架构，使用 Mock.js 模拟后端接口。

## 技术栈

- Vue 3 (Composition API `<script setup>`)
- Element Plus 2.x
- Vite 7.x
- Vue Router 4.x (动态路由)
- Pinia 3.x (状态管理)
- Axios 1.x (HTTP 客户端)
- MockJS 1.x (接口模拟)

## 开发命令

```bash
npm run dev        # 启动开发服务器
npm run build      # 构建生产版本
npm run lint       # ESLint 检查和自动修复
npm run format     # Prettier 格式化代码
```

**环境要求**: Node.js ^20.19.0 || >=22.12.0

## 核心架构

### 1. 路由架构 (`src/router/index.js`)

**关键特性: 动态路由加载**

- **静态路由**:
  - `Home` (父路由): 主布局容器
  - `/login`: 登录页（懒加载）
  - `/index`: 首页（Home 的子路由）
  - `/userCenter`: 用户中心（Home 的子路由）

- **动态路由**:
  - 路由守卫 `beforeEach` 在首次进入时调用 `/sys/menu/nav` 获取导航菜单
  - `generateChildRoutesFromNav()` 将后端菜单转换为 Vue Router 路由配置
  - `menuToRoute()` 使用 `import.meta.glob('../views/**/*.vue')` 实现组件懒加载
  - 通过 `router.addRoute('Home', route)` 动态挂载子路由到 Home 父路由下

**后端菜单格式示例**:

```javascript
{
  name: 'SysUser',
  title: '用户管理',
  icon: 'el-icon-s-custom',
  path: '/sys/users',
  component: 'sys/User',  // 映射到 src/views/sys/User.vue
  children: []
}
```

**路由守卫逻辑**:

1. 检查 token (来自 localStorage)，未登录跳转到 `/login`
2. 检查 `menuStore.hasRoute` 标志，判断是否已加载动态路由
3. 首次进入时调用 `/sys/menu/nav`，获取导航和权限数据
4. 生成动态路由并挂载到 Home 父路由下
5. 使用 `next({ ...to, replace: true })` 确保新路由生效

### 2. 状态管理 (Pinia)

**stores/index.js** - `useAuthStore`:

- `token`: 从 localStorage 持久化读取
- `setToken()`, `clearToken()`, `resetState()`

**stores/modules/menu.js** - `useMenuStore`:

- `menuList`: 后端返回的导航菜单（用于侧边栏渲染）
- `permList`: 权限列表
- `hasRoute`: 标记是否已加载动态路由（存储在 sessionStorage）

### 3. HTTP 请求系统 (`src/axios.js`)

**请求拦截器**:

- 自动从 localStorage 读取 token 并添加到 `Authorization` 请求头

**响应拦截器**:

- 统一处理 `{ code, msg, data }` 格式的响应
- `code !== 200` 时使用 `ElMessage.error()` 显示错误消息
- `401` 状态自动跳转到 `/login`

**使用方式**:

```javascript
// Composition API 中
import { getCurrentInstance } from 'vue'
const { proxy } = getCurrentInstance()
proxy.$request.get('/api/endpoint')

// 或直接导入
import request from '@/axios.js'
```

### 4. 布局结构

**层级**: `App.vue` → `Home.vue` → `<router-view>` (动态内容)

**Home.vue** (`src/views/Home.vue`):

- 使用 Element Plus 的 `<el-container>` 布局
- 包含三个部分:
  - `<el-aside>`: 侧边栏 (包含 `SideMenu` 组件)
  - `<el-header>`: 顶部栏 (系统标题 + 用户信息下拉菜单)
  - `<el-main>`: 主内容区 (`<router-view>` 渲染子路由)
- `onMounted` 时调用 `/sys/userInfo` 获取用户信息
- `logout()` 方法清除 localStorage/sessionStorage 并跳转到登录页

**SideMenu.vue** (`src/views/inc/SideMenu.vue`):

- 从 `useMenuStore()` 读取 `menuList`
- 使用 `iconMap` 将后端的 Element UI 风格图标字符串映射为 Element Plus 图标组件
- 使用 `<router-link>` 包裹 `<el-menu-item>` 实现导航

### 5. Mock 数据系统 (`src/mock.js`)

**生产环境注意**: 删除 `main.js` 中的 `import './mock.js'`

**关键接口**:

- `GET /captcha`: 返回验证码图片 (Base64) 和随机 token
- `POST /login`: 验证码固定为 `c1n9a`
- `GET /sys/userInfo`: 返回用户信息 (id, username, avatar)
- `POST /logout`: 退出登录
- `GET /sys/menu/nav`: 返回导航菜单和权限列表 (`{ nav, authoritys }`)

**响应格式**:

```javascript
{
  code: 200,      // 200 表示成功
  msg: '操作成功',
  data: { ... }   // 实际数据
}
```

## 开发规范

### 路径别名

- `@` 指向 `src` 目录 (在 `vite.config.js` 中配置)

### 组件开发

- 使用 `<script setup>` 语法
- 组件文件名使用 PascalCase (如 `SideMenu.vue`)
- scoped CSS

### 图标使用

- Element Plus 图标已在 `main.js` 中全局注册
- 直接在模板中使用: `<el-icon><User /></el-icon>`
- 需要先在 `<script setup>` 中导入: `import { User } from '@element-plus/icons-vue'`

### 动态菜单开发

- 后端菜单的 `component` 字段必须对应 `src/views/` 下的实际文件路径
- 例如: `component: 'sys/User'` 对应 `src/views/sys/User.vue`
- 图标字段使用 Element UI 风格 (如 `el-icon-s-custom`)，SideMenu 组件会自动映射为 Element Plus 图标

## 项目当前状态

### 已完成

- ✅ 登录系统 (验证码 + token)
- ✅ Axios 拦截器 (请求/响应)
- ✅ 动态路由加载 (基于后端菜单)
- ✅ 用户信息获取和显示
- ✅ 退出登录功能
- ✅ 侧边栏导航 (基于 Pinia 菜单数据)

### 待开发

- 系统管理页面内容 (User.vue、Role.vue、Menu.vue 当前为空)
- 首页 (index.vue) 内容填充
- 权限控制 (基于 `permList`)
