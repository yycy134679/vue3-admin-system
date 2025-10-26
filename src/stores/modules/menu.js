import { defineStore } from 'pinia'

export const useMenuStore = defineStore('menu', {
  state: () => ({
    menuList: [],
    permList: [],
    hasRoute: false,
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
  },

  getters: {
    getMenuList: (state) => state.menuList,
    getPermList: (state) => state.permList,
    getHasRoute: (state) => state.hasRoute,
  },
})
