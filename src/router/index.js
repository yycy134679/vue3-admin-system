// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
// 使用项目里已配置拦截器的 axios 实例
import axios from '@/axios.js'
// Pinia stores（Vue3 写法）
import { useAuthStore } from '@/stores'
import { useMenuStore } from '@/stores/modules/menu'

// 导入组件
import Home from '@/views/Home.vue'
import Index from '@/views/index.vue'
import Menu from '@/views/sys/Menu.vue'
import Role from '@/views/sys/Role.vue'
import User from '@/views/sys/User.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
      // 登录后或访问根路径时，始终重定向到首页，避免出现“Home”标签
      redirect: '/index',
      children: [
        {
          path: '/index',
          name: 'Index',
          component: Index,
        },
        // {
        //   path: 'sys/users',
        //   name: 'SysUser',
        //   component: User,
        // },
        // {
        //   path: 'sys/menus',
        //   name: 'SysMenu',
        //   component: Menu,
        // },
        // {
        //   path: 'sys/roles',
        //   name: 'SysRole',
        //   component: Role,
        // },
        {
          path: '/userCenter',
          name: 'UserCenter',
          component: () => import('@/views/UserCenter.vue'),
        },
      ],
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
    },
  ],
})

// 基于 Vite 的按需加载：自动将后端的 component（如 'sys/User'）映射到实际视图组件
// 说明：这里使用相对路径 '../views/**/*.vue'，因为本文件位于 src/router
const viewModules = import.meta.glob('../views/**/*.vue')

// 将单个菜单项转换为路由对象（Vue3 写法，使用懒加载组件）
function menuToRoute(menu) {
  if (!menu || !menu.component || !menu.path) return null
  const fileKey = `../views/${menu.component}.vue`
  const loader = viewModules[fileKey]
  if (!loader) return null

  return {
    // 注意：作为 Home 的子路由添加时，child 路由 path 不能以 '/' 开头
    // 后端通常返回绝对路径（如 '/sys/roles'），这里转换为相对路径 'sys/roles'
    // 这样挂到父路由 '/' 下后，完整路径依然是 '/sys/roles'
    path: menu.path.startsWith('/') ? menu.path.slice(1) : menu.path,
    name: menu.name || menu.path,
    meta: {
      icon: menu.icon,
      title: menu.title,
    },
    component: loader,
  }
}

// 将后端 nav 转成子路由（挂到 Home 下）
function generateChildRoutesFromNav(nav = []) {
  const routes = []
  const travel = (items = []) => {
    items.forEach((item) => {
      const route = menuToRoute(item)
      if (route) routes.push(route)
      if (item.children && item.children.length) travel(item.children)
    })
  }
  travel(nav)
  return routes
}

// 安全添加子路由（避免重复）
function addHomeChildrenRoutes(childRoutes = []) {
  childRoutes.forEach((r) => {
    if (r.name && router.hasRoute(r.name)) return
    // Home 是父路由的 name
    router.addRoute('Home', r)
  })
}

// 路由守卫：
// 1) 校验登录
// 2) 首次进入时拉取导航与权限，写入 Pinia，并按需动态挂载子路由
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()
  const menuStore = useMenuStore()

  // 允许直接进入登录页
  if (to.path === '/login') return next()

  const token = authStore.token || localStorage.getItem('token') || ''
  if (!token) {
    // 没有登录，确保清空菜单/标签等残留状态
    try {
      menuStore.resetState()
    } catch (e) {}
    return next({ path: '/login', replace: true })
  }

  // 仅在首次（或刷新后）加载导航
  if (!menuStore.hasRoute) {
    try {
      const res = await axios.get('/sys/menu/nav')
      const { nav, authoritys } = res.data.data || { nav: [], authoritys: [] }

      menuStore.setMenuList(nav)
      menuStore.setPermList(authoritys)

      // 生成并挂载动态子路由
      const children = generateChildRoutesFromNav(nav)
      addHomeChildrenRoutes(children)

      // 标记已处理，避免重复请求
      menuStore.changeRouteState(true)

      // 确保新路由生效
      return next({ ...to, replace: true })
    } catch (err) {
      console.error('获取导航失败:', err)
      // 失败时，清空残留状态并返回登录
      try {
        menuStore.resetState()
      } catch (e) {}
      return next({ path: '/login', replace: true })
    }
  }

  next()
})

export default router
