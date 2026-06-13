import { http } from '../index'

export interface Coupon {
  id: number
  templateId: number
  name: string
  type: 'fixed' | 'percent'
  discountValue: number
  minSpend: number
  status: 'unused' | 'used' | 'expired'
  startTime: string
  endTime: string
  obtainTime: string
  useTime?: string
}

export function getMyCoupons(status?: string) {
  return http.get<any, Coupon[]>('/coupons/my', { params: { status } })
}

export function getAvailableCoupons(amount?: number) {
  return http.get<any, Coupon[]>('/coupons/available', { params: { amount } })
}

export function claimCoupon(templateId: number) {
  return http.post<any, void>(`/coupons/claim/${templateId}`)
}
