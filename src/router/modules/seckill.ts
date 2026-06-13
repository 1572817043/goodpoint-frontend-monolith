import type { RouteRecordRaw } from 'vue-router'

const seckillRoutes: RouteRecordRaw[] = [
  {
    path: '/seckill',
    name: 'Seckill',
    component: () => import('../../views/seckill/index.vue'),
    meta: {
      title: '限时秒杀',
    },
  },
  {
    path: '/seckill/:id',
    name: 'SeckillDetail',
    component: () => import('../../views/seckill/detail.vue'),
    meta: {
      title: '秒杀详情',
    },
  },
]

export default seckillRoutes
