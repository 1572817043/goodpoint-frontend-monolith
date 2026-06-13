import type { RouteRecordRaw } from 'vue-router'

/**
 * 商品详情路由
 */
const detailRoutes: RouteRecordRaw[] = [
  {
    path: '/goods/:id',
    name: 'GoodsDetail',
    component: () => import('../../views/goods/index.vue'),
    meta: {
      title: '商品详情',
    },
  },
]

export default detailRoutes
