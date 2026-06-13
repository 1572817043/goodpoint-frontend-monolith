import axios from 'axios'
import type { ApiResponse } from '../types'
import { userStore } from '../stores/user'
import { router } from '../router'

// 创建 axios 实例
const http = axios.create({
  baseURL: '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 请求拦截器 - 自动添加 token
http.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// 响应拦截器 - 统一处理错误
http.interceptors.response.use(
  (response) => {
    const res = response.data as ApiResponse
    // 业务状态码不是 200，视为错误
    if (res.code !== 200) {
      const error: any = new Error(res.msg)
      error.response = { data: res }
      return Promise.reject(error)
    }
    return res.data
  },
  (error) => {
    // HTTP 状态码错误
    if (error.response) {
      switch (error.response.status) {
        case 401:
          userStore.redirectPath.value = router.currentRoute.value.fullPath
          userStore.showLoginModal.value = true
          break
        case 403:
          console.error('没有权限访问')
          break
        case 500:
          console.error('服务器内部错误')
          break
        default:
          console.error('网络错误')
      }
    } else {
      console.error('网络连接失败')
    }
    return Promise.reject(error)
  }
)

export { http }
