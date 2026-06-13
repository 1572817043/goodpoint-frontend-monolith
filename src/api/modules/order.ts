import { http } from '../index'
import type { PageQuery, PageResult } from '../../types'

export interface Order {
  id: number
  orderNo: string
  userId: number
  goodsId: number
  goodsType: 'official' | 'secondhand' | 'seckill'
  refId?: number
  goodsTitle: string
  goodsImage: string
  goodsPrice: number
  sellerId: number
  sellerNickname: string
  sellerAvatar: string
  receiverName: string
  receiverPhone: string
  receiverAddress: string
  trackingNumber: string
  couponId?: number
  discountAmount?: number
  payAmount?: number
  status: 'pending' | 'paid' | 'shipped' | 'completed' | 'cancelled'
  createTime: string
}

export interface CreateOrderDTO {
  goodsId: number
  goodsType: 'official' | 'secondhand' | 'seckill'
  quantity?: number
  addressId: number
  activityId?: number
  userCouponId?: number
}

// 创建订单
export function createOrder(data: CreateOrderDTO) {
  return http.post<any, Order>('/orders', data)
}

// 获取订单详情
export function getOrderDetail(id: number) {
  return http.get<any, Order>(`/orders/${id}`)
}

// 我的订单（买家）
export function getMyOrders(params: PageQuery & { status?: string }) {
  return http.get<any, PageResult<Order>>('/orders/my', { params })
}

// 我的卖出（卖家）
export function getMySales(params: PageQuery & { status?: string }) {
  return http.get<any, PageResult<Order>>('/orders/sales', { params })
}

// 付款
export function payOrder(id: number) {
  return http.put<any, void>(`/orders/${id}/pay`)
}

// 发货
export function shipOrder(id: number, trackingNumber?: string) {
  return http.put<any, void>(`/orders/${id}/ship`, null, { params: { trackingNumber } })
}

// 修改物流信息
export function updateTracking(id: number, trackingNumber: string) {
  return http.put<any, void>(`/orders/${id}/tracking`, null, { params: { trackingNumber } })
}

// 撤销发货
export function cancelShip(id: number) {
  return http.put<any, void>(`/orders/${id}/cancel-ship`)
}

// 确认收货
export function confirmReceive(id: number) {
  return http.put<any, void>(`/orders/${id}/confirm`)
}

// 取消订单
export function cancelOrder(id: number) {
  return http.put<any, void>(`/orders/${id}/cancel`)
}

// 检查是否已购买过某秒杀活动
export function hasSeckillOrder(activityId: number) {
  return http.get<any, boolean>(`/orders/seckill/check/${activityId}`)
}
