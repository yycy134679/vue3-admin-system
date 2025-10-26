<template>
  <el-tabs
    v-model="editableTabsValue"
    type="card"
    class="demo-tabs"
    closable
    @tab-remove="removeTab"
    @tab-click="clickTab"
  >
    <el-tab-pane
      v-for="item in editableTabs"
      :key="item.name"
      :label="item.title"
      :name="item.name"
      :closable="item.name !== 'Index'"
    >
    </el-tab-pane>
  </el-tabs>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useMenuStore } from '@/stores/modules/menu'

import type { TabPaneName, TabsPaneContext } from 'element-plus'

const menuStore = useMenuStore()
const router = useRouter()
const route = useRoute()

let tabIndex = 2
const editableTabsValue = computed({
  get() {
    return menuStore.editableTabsValue
  },
  set(val) {
    menuStore.editableTabsValue = val
  },
})
const editableTabs = computed({
  get() {
    return menuStore.editableTabs
  },
  set(val) {
    menuStore.editableTabs = val
  },
})

// 点击标签时，同步路由以切换页面内容
const clickTab = (pane: TabsPaneContext) => {
  // pane.paneName 为激活的 pane 名称（与 :name 绑定一致）
  const targetName = (pane as any).paneName as string
  if (targetName && route.name !== targetName) {
    router.push({ name: targetName })
  }
}

const removeTab = (targetName: TabPaneName) => {
  // 保护：禁止关闭首页标签
  if (targetName === 'Index') return
  const tabs = menuStore.editableTabs
  let activeName = menuStore.editableTabsValue
  if (activeName === targetName) {
    tabs.forEach((tab, index) => {
      if (tab.name === targetName) {
        const nextTab = tabs[index + 1] || tabs[index - 1]
        if (nextTab) {
          activeName = nextTab.name
        }
      }
    })
  }

  menuStore.editableTabsValue = activeName
  menuStore.editableTabs = tabs.filter((tab) => tab.name !== targetName)

  // 删除后，跳转到新的激活页
  if (activeName) {
    router.push({ name: activeName as string })
  }
}
</script>

<style>
.demo-tabs > .el-tabs__content {
  padding: 32px;
  color: #6b778c;
  font-size: 32px;
  font-weight: 600;
}
</style>
