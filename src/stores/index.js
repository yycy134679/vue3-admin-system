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

  function resetState() {
    token.value = ''
  }

  // 在需要使用 menu store 的地方调用
  function getMenuStore() {
    return useMenuStore()
  }

  return { token, setToken, clearToken, resetState, getMenuStore }
})
