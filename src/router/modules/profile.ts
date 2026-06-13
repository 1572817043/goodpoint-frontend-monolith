import type { RouteRecordRaw } from 'vue-router'

const profileRoutes: RouteRecordRaw[] = [
  {
    path: '/profile',
    name: 'Profile',
    component: () => import('../../views/profile/index.vue'),
    meta: {
      title: '个人中心',
    },
  },
  {
    path: '/favorites',
    name: 'Favorites',
    component: () => import('../../views/profile/favorites.vue'),
    meta: {
      title: '我的收藏',
    },
  },
  {
    path: '/goods-favorites',
    name: 'GoodsFavorites',
    component: () => import('../../views/profile/goods-favorites.vue'),
    meta: {
      title: '商品收藏',
    },
  },
  {
    path: '/my-goods',
    name: 'MyGoods',
    component: () => import('../../views/profile/my-goods.vue'),
    meta: {
      title: '我的发布',
    },
  },
]

export default profileRoutes
