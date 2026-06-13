import type { RouteRecordRaw } from 'vue-router'

/**
 * 社区路由（分享收藏）
 */
const communityRoutes: RouteRecordRaw[] = [
  {
    path: '/community',
    name: 'Community',
    component: () => import('../../views/community/index.vue'),
    meta: {
      title: '谷子社区',
    },
  },
  {
    path: '/community/post/:id',
    name: 'CommunityPost',
    component: () => import('../../views/community/post/index.vue'),
    meta: {
      title: '帖子详情',
    },
  },
  {
    path: '/community/tag/:tagName',
    name: 'CommunityTag',
    component: () => import('../../views/community/tag/index.vue'),
    meta: {
      title: '标签筛选',
    },
  },
  {
    path: '/community/user/:userId',
    name: 'CommunityUser',
    component: () => import('../../views/community/user/index.vue'),
    meta: {
      title: '用户主页',
    },
  },
  {
    path: '/community/ranking',
    name: 'CommunityRanking',
    component: () => import('../../views/community/ranking/index.vue'),
    meta: {
      title: '热门排行',
    },
  },
]

export default communityRoutes
