import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuList: [],
    permList: [],
    hasRoute: false,

    editableTabsValue: 'Index',
    editableTabs: [
      {
        title: '首页',
        name: 'Index',
      },
    ],
  }),

  actions: {
    setMenuList(menus) {
      this.menuList = menus
    },

    setPermList(perms) {
      this.permList = perms
    },

    changeRouteState(hasRoute) {
      this.hasRoute = hasRoute
      sessionStorage.setItem('hasRoute', hasRoute)
    },

    addTab(item) {
      // 检查标签页是否已存在
      const exists = this.editableTabs.find((tab) => tab.name === item.name)
      if (!exists) {
        this.editableTabs.push({
          title: item.title,
          name: item.name,
        })
      }
      // 设置当前激活的标签页
      this.editableTabsValue = item.name
    },

    // 重置菜单与标签状态（用于退出登录或需要清空时）
    resetState() {
      this.menuList = []
      this.permList = []
      this.hasRoute = false
      try {
        sessionStorage.removeItem('hasRoute')
      } catch (e) {}

      // 恢复默认标签：仅保留首页
      this.editableTabsValue = 'Index'
      this.editableTabs = [
        {
          title: '首页',
          name: 'Index',
        },
      ]
    },
  },

  getters: {
    getMenuList: (state) => state.menuList,
    getPermList: (state) => state.permList,
    getHasRoute: (state) => state.hasRoute,
  },
})
