import { http } from '../index'
import type { User } from '../../types'

// 关注用户
export function followUser(id: number) {
  return http.post<any, void>(`/user/${id}/follow`)
}

// 取消关注
export function unfollowUser(id: number) {
  return http.delete<any, void>(`/user/${id}/follow`)
}

// 是否已关注
export function isFollowing(id: number) {
  return http.get<any, { isFollowing: boolean }>(`/user/${id}/follow`)
}

// 获取关注列表
export function getFollowing(id: number) {
  return http.get<any, User[]>(`/user/${id}/following`)
}

// 获取粉丝列表
export function getFollowers(id: number) {
  return http.get<any, User[]>(`/user/${id}/followers`)
}

// 获取共同关注
export function getMutualFollows(id: number) {
  return http.get<any, User[]>(`/user/${id}/mutual`)
}
