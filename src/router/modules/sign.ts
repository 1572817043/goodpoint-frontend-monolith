import type { RouteRecordRaw } from 'vue-router'

const signRoutes: RouteRecordRaw[] = [
  {
    path: '/sign',
    name: 'Sign',
    component: () => import('../../views/sign/index.vue'),
    meta: {
      title: '每日签到',
    },
  },
]

export default signRoutes
