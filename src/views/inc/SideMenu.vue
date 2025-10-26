<template>
  <el-menu
    :default-active="editableTabsValue"
    class="el-menu-vertical-demo"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b"
  >
    <router-link to="/index">
      <el-menu-item index="Index">
        <el-icon><HomeFilled /></el-icon>
        <span class="font-style">首页</span>
      </el-menu-item>
    </router-link>

    <el-sub-menu :index="menu.name" v-for="menu in viewMenuList" :key="menu.name">
      <template #title>
        <el-icon>
          <component :is="menu.icon" />
        </el-icon>
        <span class="font-style">{{ menu.title }}</span>
      </template>

      <router-link :to="item.path" v-for="item in menu.children" :key="item.name">
        <el-menu-item :index="item.name" @click="selectMenu(item)">
          <el-icon>
            <component :is="item.icon" />
          </el-icon>
          <span class="font-style">{{ item.title }}</span>
        </el-menu-item>
      </router-link>
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { HomeFilled } from '@element-plus/icons-vue'
import { useMenuStore } from '@/stores/modules/menu'

// 从 Pinia 获取后端返回的菜单
const menuStore = useMenuStore()
const { menuList } = storeToRefs(menuStore)
// 当前激活的标签（用于同步侧边菜单高亮）
const editableTabsValue = computed(() => menuStore.editableTabsValue)

// 将后端图标字符串（Element UI 风格）映射为 Element Plus 图标组件名
const iconMap = {
  'el-icon-s-operation': 'Operation',
  'el-icon-s-custom': 'User',
  'el-icon-location': 'Location',
  'el-icon-s-order': 'Document',
  'el-icon-menu': 'Menu',
}

// 视图层使用的菜单：补充图标映射，递归处理 children
const viewMenuList = computed(() => {
  const mapItem = (item) => ({
    ...item,
    icon: iconMap[item.icon] || 'Menu',
    children: (item.children || []).map(mapItem),
  })
  return (menuList.value || []).map(mapItem)
})

// 点击菜单项时添加到标签页
const selectMenu = (item) => {
  menuStore.addTab(item)
}
</script>

<style scoped>
.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: left;
  line-height: 200px;
}

.el-menu-vertical-demo {
  height: 100%;
}

a {
  text-decoration: none;
}
</style>
