import axios from 'axios'
import router from './router'
import { ElMessage } from 'element-plus'

// 创建一个自定义的axios实例，用于统一配置请求参数
const request = axios.create({
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json;charset=utf-8',
  },
})

request.interceptors.request.use((config) => {
  config.headers['Authorization'] = localStorage.getItem('token')
  return config
})

request.interceptors.response.use(
  (response) => {
    let res = response.data
    if (res.code === 200) {
      return response
    } else {
      ElMessage.error(!res.msg ? '系统异常' : res.msg)
      return Promise.reject(response.data.msg)
    }
  },
  (error) => {
    if (error.response.data) {
      error.message = error.response.data.msg
    }
    if (error.response.status === 401) {
      // 未授权状态

      router.push('/login')
    }
    ElMessage.error(error.message, { duration: 3000 })
    return Promise.reject(error)
  },
)
export default request
