<template>
  <el-container>
    <el-aside width="200px">
      <el-menu
        class="el-menu-vertical-demo"
        background-color="#545c64"
        text-color="#fff"
        active-text-color="#ffd04b"
      >
        <router-link to="/index">
          <el-menu-item index="Index">
            <el-icon><HomeFilled /></el-icon>
            <span>首页</span>
          </el-menu-item>
        </router-link>
        <el-sub-menu index="1">
          <template #title>
            <el-icon><Operation /></el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item index="1-1">
            <el-icon><User /></el-icon>
            <span>用户管理</span>
          </el-menu-item>
          <el-menu-item index="1-2">
            <el-icon><Rank /></el-icon>
            <span>角色管理</span>
          </el-menu-item>
          <el-menu-item index="1-3">
            <el-icon><Menu /></el-icon>
            <span>菜单管理</span>
          </el-menu-item>
        </el-sub-menu>
        <el-sub-menu index="2">
          <template #title>
            <el-icon><Tools /></el-icon>
            <span>系统工具</span>
          </template>
          <el-menu-item index="2-2">
            <el-icon><Document /></el-icon>
            <span>数字字典</span>
          </el-menu-item>
        </el-sub-menu>
      </el-menu>
    </el-aside>
    <el-container>
      <!-- 头部 -->
      <el-header>
        <div style="float: left; position: relative; left: 45%">
          <strong>VueManager后台管理系统</strong>
        </div>
        <div class="header-avatar">
          <el-avatar :src="userAvatar" />
          <el-dropdown>
            <span class="el-dropdown-link">
              Admin<el-icon class="el-icon--right"><ArrowDown /></el-icon>
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item>个人中心</el-dropdown-item>
                <el-dropdown-item>退出</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
      </el-header>
      <el-main>Main</el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import {
  HomeFilled,
  Operation,
  User,
  Rank,
  Menu,
  Tools,
  Document,
  ArrowDown,
} from '@element-plus/icons-vue'
import userAvatar from '@/assets/user.jpg'
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

.el-aside {
  background-color: #d3dce6;
  color: #333;
  text-align: left;
  line-height: 200px;
}

.el-main {
  color: #333;
  text-align: center;
  line-height: 160px;
  padding: 0;
}

.el-menu-vertical-demo {
  height: 100%;
}

a {
  text-decoration: none;
}
</style>
