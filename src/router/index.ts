import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

// 导入各模块路由
import homeRoutes from './modules/home'
import marketRoutes from './modules/market'
import communityRoutes from './modules/community'
import seckillRoutes from './modules/seckill'
import detailRoutes from './modules/detail'
import authRoutes from './modules/auth'
import profileRoutes from './modules/profile'
import signRoutes from './modules/sign'
import orderRoutes from './modules/order'
import chatRoutes from './modules/chat'
import officialRoutes from './modules/official'
import addressRoutes from './modules/address'
import reviewRoutes from './modules/review'
import couponRoutes from './modules/coupon'

// 合并所有路由
const routes: RouteRecordRaw[] = [
  ...homeRoutes,
  ...marketRoutes,
  ...communityRoutes,
  ...seckillRoutes,
  ...detailRoutes,
  ...authRoutes,
  ...profileRoutes,
  ...signRoutes,
  ...orderRoutes,
  ...chatRoutes,
  ...officialRoutes,
  ...addressRoutes,
  ...reviewRoutes,
  ...couponRoutes,
]

// 创建路由实例
export const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (savedPosition) {
      return savedPosition
    }

    return { top: 0 }
  },
})
