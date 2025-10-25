<template>
  <el-container>
    <SideMenu />
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
                  <router-link to="/UserCenter">个人中心</router-link>
                </el-dropdown-item>
                <el-dropdown-item @click.native="logout">退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { reactive, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { ArrowDown } from '@element-plus/icons-vue'
import SideMenu from './SideMenu.vue'
import { useAuthStore } from '@/stores'

// 获取全局属性
const { proxy } = getCurrentInstance()
const router = useRouter()
const authStore = useAuthStore()

// 定义响应式用户信息对象
const userInfo = reactive({
  id: '',
  username: '',
  avatar: '',
})

// 获取用户信息的方法
const getUserInfo = () => {
  proxy.$request.get('/sys/userInfo').then((res) => {
    if (res.data && res.data.data) {
      userInfo.id = res.data.data.id
      userInfo.username = res.data.data.username
      userInfo.avatar = res.data.data.avatar
    }
  })
}

// 退出登录方法
const logout = () => {
  proxy.$request.post('/logout').then((res) => {
    // 清除 localStorage 和 sessionStorage
    localStorage.clear()
    sessionStorage.clear()

    // 重置 Pinia store 状态
    authStore.resetState()

    // 跳转到登录页
    router.push('/login')
  })
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
  text-align: center;
  line-height: 160px;
  padding: 0;
}
</style>
