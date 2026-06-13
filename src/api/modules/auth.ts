import { http } from '../index'
import type { User } from '../../types'

/**
 * 认证相关 API
 * 后端对应 Controller: AuthController
 */

// 登录响应数据
export interface LoginResult {
  token: string
  userId: number
  nickname: string
  avatar: string
  hasPassword: boolean
}

// 发送验证码
// POST /api/auth/sms/send
export function sendSmsCode(phone: string) {
  return http.post<any, void>('/auth/sms/send', { phone })
}

// 手机号验证码登录
// POST /api/auth/login
export function login(phone: string, code: string) {
  return http.post<any, LoginResult>('/auth/login', { phone, code, loginType: 'sms' })
}

// 密码登录
// POST /api/auth/login
export function loginByPassword(phone: string, password: string) {
  return http.post<any, LoginResult>('/auth/login', { phone, password, loginType: 'password' })
}

// 二次验证登录（密码登录后需要短信验证时调用）
// POST /api/auth/login/verify
export function loginVerify(phone: string, code: string) {
  return http.post<any, LoginResult>('/auth/login/verify', { phone, code })
}

// 设置密码
// POST /api/auth/set-password
export function setPassword(password: string) {
  return http.post<any, void>('/auth/set-password', { password })
}

// 获取当前用户信息
// GET /api/auth/me
export function getMe() {
  return http.get<any, { id: number; nickname: string; avatar: string; phone: string; createTime: string }>('/auth/me')
}

// 修改个人资料
// PUT /api/auth/profile
export function updateProfile(data: { nickname?: string; avatar?: string }) {
  return http.put<any, void>('/auth/profile', data)
}
