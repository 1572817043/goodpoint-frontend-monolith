import type { RouteRecordRaw } from 'vue-router'

const orderRoutes: RouteRecordRaw[] = [
  {
    path: '/orders',
    name: 'MyOrders',
    component: () => import('../../views/order/index.vue'),
    meta: {
      title: '我的买单',
    },
  },
  {
    path: '/sales',
    name: 'MySales',
    component: () => import('../../views/order/index.vue'),
    meta: {
      title: '我的卖单',
    },
  },
  {
    path: '/orders/:id',
    name: 'OrderDetail',
    component: () => import('../../views/order/detail.vue'),
    meta: {
      title: '订单详情',
    },
  },
  {
    path: '/order/confirm/:goodsId',
    name: 'OrderConfirm',
    component: () => import('../../views/order/confirm.vue'),
    meta: {
      title: '确认订单',
    },
  },
]

export default orderRoutes
