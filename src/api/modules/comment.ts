import { http } from '../index'
import type { PageQuery, PageResult } from '../../types'

export interface Comment {
  id: number
  postId: number
  userId: number
  userNickname: string
  userAvatar: string
  parentId: number | null
  replyUserNickname: string | null
  content: string
  createTime: string
  children: Comment[]
}

export interface CreateCommentParams {
  postId: number
  parentId?: number
  replyUserId?: number
  content: string
}

// 发表评论
export function addComment(data: CreateCommentParams) {
  return http.post<any, void>('/community/comments', data)
}

// 获取帖子评论
export function getComments(postId: number, params: PageQuery) {
  return http.get<any, PageResult<Comment>>(`/community/posts/${postId}/comments`, { params })
}

// 删除评论
export function deleteComment(id: number) {
  return http.delete<any, void>(`/community/comments/${id}`)
}
