import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// 引入 Element Plus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'

// 引入 Element Plus 的图标
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

// 引入 axios 和 mock
import request from './axios.js'
import './mock.js'

const app = createApp(App)

// 全局挂载 axios 实例（Vue3 方式）
app.config.globalProperties.$request = request

// 全局注册 Element Plus 图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.use(router)
app.use(ElementPlus) // 使用 Element Plus

app.mount('#app')
