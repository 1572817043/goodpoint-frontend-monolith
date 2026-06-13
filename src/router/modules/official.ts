import type { RouteRecordRaw } from 'vue-router'

const officialRoutes: RouteRecordRaw[] = [
  {
    path: '/official/:id',
    name: 'OfficialDetail',
    component: () => import('../../views/official/detail.vue'),
    meta: {
      title: '官方直售',
    },
  },
]

export default officialRoutes
