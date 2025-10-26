<template>
  <RouterView />
</template>

<script setup>
// 监听路由变化，在刷新或直达某页时把当前路由补充到标签页中，保证 Tabs/侧边高亮与内容一致
import { RouterView, useRoute } from 'vue-router'
import { watch } from 'vue'
import { useMenuStore } from '@/stores/modules/menu'

const route = useRoute()
const menuStore = useMenuStore()

watch(
  () => route.fullPath,
  () => {
    // 登录页不加入标签
    if (route.path === '/login') return

    const name = route.name ? String(route.name) : undefined
    // 忽略布局路由 Home，避免出现“Home”标签
    if (!name || name === 'Home') return

    // 标题优先取路由 meta.title；没有则回退到路由名
    const title =
      (route.meta && route.meta.title ? String(route.meta.title) : undefined) ||
      (name === 'Index' ? '首页' : name)

    menuStore.addTab({ name, title })
  },
  { immediate: true },
)
</script>

<style scoped></style>
