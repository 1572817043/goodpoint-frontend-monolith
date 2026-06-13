import type { RouteRecordRaw } from 'vue-router'

const addressRoutes: RouteRecordRaw[] = [
  {
    path: '/address',
    name: 'Address',
    component: () => import('../../views/address/index.vue'),
    meta: {
      title: '收货地址',
    },
  },
]

export default addressRoutes
