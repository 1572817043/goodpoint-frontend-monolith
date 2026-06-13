import type { RouteRecordRaw } from 'vue-router'

const reviewRoutes: RouteRecordRaw[] = [
  {
    path: '/my-reviews',
    name: 'MyReviews',
    component: () => import('../../views/review/index.vue'),
    meta: {
      title: '我的评价',
    },
  },
  {
    path: '/review/submit/:orderId',
    name: 'ReviewSubmit',
    component: () => import('../../views/review/submit.vue'),
    meta: {
      title: '评价',
    },
  },
  {
    path: '/user-reviews/:userId',
    name: 'UserReviews',
    component: () => import('../../views/review/index.vue'),
    meta: {
      title: '用户评价',
    },
  },
]

export default reviewRoutes
