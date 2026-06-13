import type { RouteRecordRaw } from 'vue-router'

/**
 * 市场路由（二手交易）
 */
const marketRoutes: RouteRecordRaw[] = [
  {
    path: '/market',
    name: 'Market',
    component: () => import('../../views/market/index.vue'),
    meta: {
      title: '二手市场',
    },
  },
  {
    path: '/market/:id',
    name: 'MarketDetail',
    component: () => import('../../views/market/detail.vue'),
    meta: {
      title: '商品详情',
    },
  },
]

export default marketRoutes
