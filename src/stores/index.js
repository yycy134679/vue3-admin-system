import { ref } from 'vue'
import { defineStore } from 'pinia'
import { useMenuStore } from '@/stores/modules/menu'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || '')

  function setToken(newToken) {
    token.value = newToken
    localStorage.setItem('token', newToken)
  }

  function clearToken() {
    token.value = ''
    localStorage.removeItem('token')
  }

  // 在需要使用 menu store 的地方调用
  function getMenuStore() {
    return useMenuStore()
  }

  // 重置认证相关状态，并联动重置菜单等关联 Store
  function resetState() {
    // 清除本地 token
    try {
      clearToken()
    } catch (e) {}

    // 重置菜单/权限/标签等（如果 menuStore 存在）
    try {
      const menuStore = getMenuStore()
      menuStore?.resetState?.()
    } catch (e) {}

    // 兜底：清掉路由加载标识
    try {
      sessionStorage.removeItem('hasRoute')
    } catch (e) {}
  }

  return { token, setToken, clearToken, resetState, getMenuStore }
})
