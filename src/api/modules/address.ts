import { http } from '../index'

export interface Address {
  id: number
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  fullAddress: string
  isDefault: number
}

export interface AddressDTO {
  name: string
  phone: string
  province: string
  city: string
  district: string
  detail: string
  isDefault?: number
}

// 获取地址列表
export function getAddresses() {
  return http.get<any, Address[]>('/addresses')
}

// 获取地址详情
export function getAddress(id: number) {
  return http.get<any, Address>(`/addresses/${id}`)
}

// 新增地址
export function addAddress(data: AddressDTO) {
  return http.post<any, void>('/addresses', data)
}

// 修改地址
export function updateAddress(id: number, data: AddressDTO) {
  return http.put<any, void>(`/addresses/${id}`, data)
}

// 删除地址
export function deleteAddress(id: number) {
  return http.delete<any, void>(`/addresses/${id}`)
}

// 设为默认地址
export function setDefaultAddress(id: number) {
  return http.put<any, void>(`/addresses/${id}/default`)
}
