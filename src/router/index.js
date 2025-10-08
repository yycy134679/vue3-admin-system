// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'

// 导入
import Home from '@/views/Home.vue'
import index from '@/views/index.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: Home,
    },
    {
      path: '/index',
      name: 'Index',
      component: index,
    },
    {
      path: '/login',
      name: 'Login',
      component: () => import('@/views/Login.vue'),
    },
  ],
})

export default router
