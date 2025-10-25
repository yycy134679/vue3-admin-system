// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 导入
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
      children: [
        {
          path: '/index',
          name: 'Index',
          component: Index,
        },
        {
          path: 'sys/users',
          name: 'SysUser',
          component: User,
        },
        {
          path: 'sys/menus',
          name: 'SysMenu',
          component: Menu,
        },
        {
          path: 'sys/roles',
          name: 'SysRole',
          component: Role,
        },
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

export default router
