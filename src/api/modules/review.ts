import { http } from '../index'
import type { PageQuery, PageResult } from '../../types'

export interface Review {
  id: number
  orderId: number
  fromUserId: number
  fromUserNickname: string
  fromUserAvatar: string
  fromUserRole: string
  toUserId: number
  rating: number
  content: string
  goodsTitle: string
  createTime: string
}

export interface ReviewSummary {
  count: number
  avgRating: number
}

export interface SubmitReviewParams {
  orderId: number
  rating: number
  content: string
}

// 提交评价
export function submitReview(data: SubmitReviewParams) {
  return http.post<any, void>('/reviews', data)
}

// 获取用户收到的评价
export function getUserReviews(userId: number, params: PageQuery) {
  return http.get<any, PageResult<Review>>(`/reviews/user/${userId}`, { params })
}

// 获取用户评价统计
export function getReviewSummary(userId: number) {
  return http.get<any, ReviewSummary>(`/reviews/user/${userId}/summary`)
}

// 检查是否已评价某订单
export function hasReviewed(orderId: number) {
  return http.get<any, boolean>(`/reviews/check/${orderId}`)
}
