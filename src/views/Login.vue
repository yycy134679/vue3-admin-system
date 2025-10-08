<template>
  <el-row type="flex" class="row-bg" justify="center">
    <!-- 左部内容 -->
    <el-col
      :xl="{ span: 10, offset: 1 }"
      :lg="{ span: 10, offset: 1 }"
      style="float: left; position: relative; left: 10%"
    >
      <h2>欢迎使用VueManager管理系统</h2>
      <el-image
        src="/src/assets/logo.png"
        style="width: 480px; height: 350px"
        alt="Logo"
      ></el-image>
      <h3>管理至简，运维无忧</h3>
    </el-col>

    <!-- 中部内容 -->
    <el-col :xl="{ span: 1, offset: 1 }" :lg="{ span: 1, offset: 1 }">
      <el-divider direction="vertical" />
    </el-col>

    <!-- 右边表单 -->
    <el-col
      :xl="{ span: 10, offset: 1 }"
      :lg="{ span: 10, offset: 1 }"
      style="float: right; position: relative; right: 5%"
    >
      <el-form
        ref="loginFromRef"
        :model="loginForm"
        :rules="rules"
        label-width="100px"
        class="demo-loginForm"
      >
        <el-form-item label="用户名" prop="username">
          <el-input
            v-model="loginForm.username"
            style="width: 390px; float: left"
            placeholder="请输入用户名"
          />
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input
            v-model="loginForm.password"
            type="password"
            placeholder="请输入密码"
            show-password
            style="width: 390px; float: left"
          />
        </el-form-item>
        <el-form-item label="验证码" prop="code">
          <el-input v-model="loginForm.code" style="width: 170px; float: left" />
          <el-image :src="codeImg" class="codeImg"></el-image>
        </el-form-item>
        <el-form-item style="float: left; position: relative; left: 10%; margin-top: 30px">
          <el-button type="primary" @click="submitForm(loginFromRef)">登录</el-button>
          <el-button @click="resetForm(loginFromRef)">重置</el-button>
        </el-form-item>
      </el-form>
    </el-col>
  </el-row>
</template>

<script setup>
import { reactive, ref, onMounted } from 'vue'
import request from '@/axios.js'

const loginFromRef = ref()
const loginForm = reactive({
  username: '',
  password: '',
  code: '',
  token: '',
})

const codeImg = ref('') // 验证码图片

const rules = reactive({
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
  code: [
    { required: true, message: '请输入验证码', trigger: 'blur' },
    { min: 5, max: 5, message: '验证码长度应为 5 个字符', trigger: 'blur' },
  ],
  codeImg: '',
})

const submitForm = async (formEl) => {
  if (!formEl) return
  await formEl.validate((valid, fields) => {
    if (valid) {
      console.log('登录成功!', loginForm)
    } else {
      console.log('验证失败!', fields)
    }
  })
}

const resetForm = (formEl) => {
  if (!formEl) return
  formEl.resetFields()
}
// 获取验证码
const getCaptcha = () => {
  request
    .get('/captcha')
    .then((res) => {
      if (res.data && res.data.data) {
        loginForm.token = res.data.data.token || ''
        console.log('mock（模拟服务器生成的随机码）：', loginForm.token)
        codeImg.value = res.data.data.captchaImg
      }
    })
    .catch((error) => {
      console.log('获取验证码失败：', error)
    })
}

onMounted(() => {
  getCaptcha()
})
</script>

<style scoped>
.el-row {
  align-items: center;
  min-height: 100vh;
  height: 100%;
  display: flex;
  text-align: center;
}

.el-divider {
  height: 450px;
}

.codeImg {
  float: left;
  margin-left: 10px;
  border-radius: 5px;
}
</style>
