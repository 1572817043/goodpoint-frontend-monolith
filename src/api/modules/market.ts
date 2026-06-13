import { http } from '../index'
import type { PageQuery, PageResult } from '../../types'

/**
 * 市场相关 API（二手交易）
 * 后端对应 Controller: MarketController
 */

// 二手商品类型
export interface SecondHandGoods {
  id: number
  userId: number
  userNickname: string
  userAvatar: string
  title: string
  description: string
  images: string[]
  price: number
  originalPrice: number
  category: string
  goodsCondition: string
  status: string
  viewCount: number
  likeCount: number
  favoritedByUser: boolean
  myOrderId?: number
  myOrderStatus?: string
  createdAt: string
}

// 发布商品参数
export interface PublishGoodsParams {
  title: string
  description: string
  images: string[]
  price: number
  originalPrice?: number
  category: string
  goodsCondition: string
}

// 获取二手商品列表
export function getMarketGoods(params: PageQuery & { category?: string; keyword?: string }) {
  return http.get<any, PageResult<SecondHandGoods>>('/market/goods', { params })
}

// 获取我的发布
export function getMyGoods(params: PageQuery) {
  return http.get<any, PageResult<SecondHandGoods>>('/market/my-goods', { params })
}

// 获取商品详情
export function getGoodsDetail(id: number) {
  return http.get<any, SecondHandGoods>(`/market/goods/${id}`)
}

// 发布商品
export function publishGoods(data: PublishGoodsParams) {
  return http.post<any, void>('/market/goods', data)
}

// 更新商品
export function updateGoods(id: number, data: PublishGoodsParams) {
  return http.put<any, void>(`/market/goods/${id}`, data)
}

// 删除商品
export function deleteGoods(id: number) {
  return http.delete<any, void>(`/market/goods/${id}`)
}

// 收藏商品
export function favoriteGoods(id: number) {
  return http.post<any, void>(`/market/goods/${id}/favorite`)
}

// 取消收藏商品
export function unfavoriteGoods(id: number) {
  return http.delete<any, void>(`/market/goods/${id}/favorite`)
}

// 获取收藏的商品列表
export function getFavoriteGoods(params: PageQuery) {
  return http.get<any, PageResult<SecondHandGoods>>('/market/favorites', { params })
}

// 获取指定用户的商品列表
export function getUserGoods(userId: number, params: PageQuery) {
  return http.get<any, PageResult<SecondHandGoods>>(`/market/user-goods/${userId}`, { params })
}
