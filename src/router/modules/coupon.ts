import type { RouteRecordRaw } from 'vue-router'

const couponRoutes: RouteRecordRaw[] = [
  {
    path: '/coupons',
    name: 'Coupons',
    component: () => import('../../views/coupon/index.vue'),
    meta: {
      title: '我的优惠券',
    },
  },
]

export default couponRoutes
