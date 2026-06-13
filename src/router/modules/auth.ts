import type { RouteRecordRaw } from 'vue-router'

/**
 * 认证相关路由
 */
const authRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'Login',
    component: () => import('../../views/login/index.vue'),
    meta: {
      title: '登录',
    },
  },
]

export default authRoutes
