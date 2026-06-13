import type { RouteRecordRaw } from 'vue-router'

const chatRoutes: RouteRecordRaw[] = [
  {
    path: '/messages',
    name: 'Messages',
    component: () => import('../../views/chat/index.vue'),
    meta: {
      title: '消息',
    },
  },
  {
    path: '/chat/:userId',
    name: 'ChatDetail',
    component: () => import('../../views/chat/detail.vue'),
    meta: {
      title: '聊天',
    },
  },
]

export default chatRoutes
