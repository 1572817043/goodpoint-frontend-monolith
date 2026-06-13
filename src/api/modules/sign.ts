import { http } from '../index'

// 签到
export function signIn() {
  return http.post<any, void>('/sign')
}

// 获取签到统计
export function getSignCount() {
  return http.get<any, { count: number; continuous: number }>('/sign/count')
}

// 查询某天是否签到
export function checkSign(day: number) {
  return http.get<any, boolean>('/sign/check', { params: { day } })
}
