import { computed } from 'vue'
import { useMenuStore } from '@/stores/modules/menu'

export function useAuth() {
  const menuStore = useMenuStore()
  // 权限判断方法
  function hasAuth(perm: string): boolean {
    return menuStore.permList.includes(perm)
  }
  return { hasAuth }
}
