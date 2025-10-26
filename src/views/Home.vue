<template>
  <el-container>
    <el-aside width="200px">
      <SideMenu />
    </el-aside>

    <el-container>
      <!-- 头部 -->
      <el-header>
        <div style="float: left; position: relative; left: 45%">
          <strong>VueManager后台管理系统</strong>
        </div>
        <div class="header-avatar">
          <el-avatar :src="userInfo.avatar" />
          <el-dropdown>
            <span class="el-dropdown-link">
              {{ userInfo.username }}<el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>
                  <router-link to="/userCenter">个人中心</router-link>
                </el-dropdown-item>
                <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <Tabs />
        <div style="margin: 0 15px">
          <router-view></router-view>
        </div>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { reactive, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
import SideMenu from './inc/SideMenu.vue'
import Tabs from './inc/Tabs.vue'
import { useAuthStore } from '@/stores'
import { useMenuStore } from '@/stores/modules/menu'

// 获取全局属性
const { proxy } = getCurrentInstance()
const router = useRouter()
const authStore = useAuthStore()
const menuStore = useMenuStore()

// 定义响应式用户信息对象
const userInfo = reactive({
  id: '',
  username: '',
  avatar: '',
})

// 获取用户信息的方法
const getUserInfo = async () => {
  try {
    const res = await proxy.$request.get('/sys/userInfo')
    if (res.data && res.data.data) {
      userInfo.id = res.data.data.id
      userInfo.username = res.data.data.username
      userInfo.avatar = res.data.data.avatar
    }
  } catch (e) {
    // 异常捕获：如 token 失效等，回到登录页
    try {
      authStore.clearToken()
      menuStore.resetState()
    } catch (err) {}
    router.push('/login')
  }
}

// 退出登录方法
const logout = async () => {
  try {
    await proxy.$request.post('/logout')
  } catch (e) {
    // 忽略服务端异常，执行本地清理
  }

  // 清除 token 与菜单/标签状态
  authStore.clearToken()
  menuStore.resetState()

  // 可选：清理其它本地状态
  try {
    sessionStorage.clear()
  } catch (e) {}

  // 跳转到登录页
  router.push('/login')
}

// 组件挂载时获取用户信息
onMounted(() => {
  getUserInfo()
})
</script>

<style scoped>
.el-container {
  padding: 0;
  margin: 0;
  display: flex;
  min-height: 100vh;
}

.el-header {
  background-color: #17b3a3;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 20px;
  height: 60px;
}

.header-avatar {
  display: flex;
  align-items: center;
  gap: 10px;
}

.el-dropdown-link {
  display: flex;
  align-items: center;
  cursor: pointer;
}

.el-main {
  color: #333;
  text-align: left;
  padding: 0;
}
</style>
