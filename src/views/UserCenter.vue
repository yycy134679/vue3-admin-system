<template>
  <div style="text-align: center">
    <h2>你好！{{ userInfo.username }} 同学</h2>

    <el-form :model="passForm" status-icon :rules="rules" ref="passFormRef" label-width="100px">
      <el-form-item label="旧密码" prop="currentPass">
        <el-input type="password" v-model="passForm.currentPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="password">
        <el-input type="password" v-model="passForm.password" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="确认密码" prop="checkPass">
        <el-input type="password" v-model="passForm.checkPass" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm">提交</el-button>
        <el-button @click="resetForm">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, ref, onMounted, getCurrentInstance } from 'vue'
import { ElMessageBox } from 'element-plus'

// 获取全局属性
const { proxy } = getCurrentInstance()

// 表单引用
const passFormRef = ref(null)

// 定义响应式数据
const userInfo = reactive({
  id: '',
  username: '',
  avatar: '',
})

const passForm = reactive({
  password: '',
  checkPass: '',
  currentPass: '',
})

// 验证确认密码
const validatePass = (rule, value, callback) => {
  if (value === '') {
    callback(new Error('请再次输入密码'))
  } else if (value !== passForm.password) {
    callback(new Error('两次输入密码不一致!'))
  } else {
    callback()
  }
}

// 表单验证规则
const rules = {
  password: [
    { required: true, message: '请输入新密码', trigger: 'blur' },
    { min: 6, max: 12, message: '长度在 6 到 12 个字符', trigger: 'blur' },
  ],
  checkPass: [{ required: true, validator: validatePass, trigger: 'blur' }],
  currentPass: [{ required: true, message: '请输入当前密码', trigger: 'blur' }],
}

// 获取用户信息
const getUserInfo = () => {
  proxy.$request.get('/sys/userInfo').then((res) => {
    if (res.data && res.data.data) {
      userInfo.id = res.data.data.id
      userInfo.username = res.data.data.username
      userInfo.avatar = res.data.data.avatar
    }
  })
}

// 提交表单
const submitForm = () => {
  passFormRef.value.validate((valid) => {
    if (valid) {
      proxy.$request.post('/sys/user/updatePass', passForm).then((res) => {
        ElMessageBox.alert(res.data.msg, '提示', {
          confirmButtonText: '确定',
          callback: () => {
            passFormRef.value.resetFields()
          },
        })
      })
    } else {
      console.log('error submit!!')
      return false
    }
  })
}

// 重置表单
const resetForm = () => {
  passFormRef.value.resetFields()
}

// 组件挂载时获取用户信息
onMounted(() => {
  getUserInfo()
})
</script>

<style scoped>
.el-form {
  width: 420px;
  margin: 50px auto;
}
</style>
