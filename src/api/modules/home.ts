import { http } from '../index'
import type { Goods, SeckillActivity } from '../../types'

/**
 * 首页相关 API
 * 后端对应 Controller: HomeController, SeckillController
 */

// 获取推荐商品列表
export function getRecommendGoods() {
  return http.get<any, Goods[]>('/home/recommend')
}

// 获取秒杀活动列表
export function getSeckillActivities() {
  return http.get<any, SeckillActivity[]>('/home/seckill')
}

// 获取官方直售商品
export function getOfficialGoods() {
  return http.get<any, Goods[]>('/home/official-goods')
}

// 获取官方直售商品详情
export function getOfficialGoodsDetail(id: number) {
  return http.get<any, Goods>(`/home/official-goods/${id}`)
}

// 获取秒杀活动详情
export function getSeckillDetail(id: number) {
  return http.get<any, SeckillActivity>(`/home/seckill/${id}`)
}

// 获取商品分类列表
export function getCategories() {
  return http.get<any, string[]>('/home/categories')
}

// 创建秒杀订单
export function createSeckillOrder(data: { activityId: number; goodsId: number }) {
  return http.post<any, any>('/seckill/order', data)
}

// 查询秒杀订单状态（异步下单后轮询）
export function getSeckillOrderStatus(activityId: number) {
  return http.get<any, any>(`/seckill/order/status/${activityId}`)
}
