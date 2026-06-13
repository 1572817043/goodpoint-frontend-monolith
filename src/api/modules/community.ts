import { http } from '../index'
import type { Post, PageQuery, PageResult } from '../../types'

/**
 * 社区相关 API
 * 后端对应 Controller: CommunityController
 */

// 发布帖子参数
export interface CreatePostParams {
  imageUrl: string
  imageHeight: number
  images?: string[]
  content: string
  location?: string
  tags?: string[]
}

// 获取帖子列表（分页）
export function getPosts(params: PageQuery & { tagName?: string; keyword?: string }) {
  return http.get<any, PageResult<Post>>('/community/posts', { params })
}

// 获取帖子详情
export function getPostDetail(id: number) {
  return http.get<any, Post>(`/community/posts/${id}`)
}

// 获取用户帖子列表
export function getUserPosts(userId: number, params: PageQuery) {
  return http.get<any, PageResult<Post>>(`/community/users/${userId}/posts`, { params })
}

// 发布帖子
export function createPost(data: CreatePostParams) {
  return http.post<any, Post>('/community/posts', data)
}

// 点赞帖子
export function likePost(id: number) {
  return http.post<any, void>(`/community/posts/${id}/like`)
}

// 取消点赞
export function unlikePost(id: number) {
  return http.delete<any, void>(`/community/posts/${id}/like`)
}

// 删除帖子
export function deletePost(id: number) {
  return http.delete<any, void>(`/community/posts/${id}`)
}

// 收藏帖子
export function favoritePost(id: number) {
  return http.post<any, void>(`/community/posts/${id}/favorite`)
}

// 取消收藏
export function unfavoritePost(id: number) {
  return http.delete<any, void>(`/community/posts/${id}/favorite`)
}

// 获取收藏帖子列表
export function getFavoritePosts(params: PageQuery) {
  return http.get<any, PageResult<Post>>('/community/favorites', { params })
}

// 获取热门帖子排行
export function getTopPosts(count: number = 10) {
  return http.get<any, Post[]>('/community/posts/ranking', { params: { count } })
}
