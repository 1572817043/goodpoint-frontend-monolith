import { http } from '../index'

// 会话类型
export interface Conversation {
  userId: number
  nickname: string
  avatar: string
  goodsId: number
  goodsTitle: string
  goodsImage: string
  lastMessage: string
  lastMessageType: number
  lastTime: string
  unreadCount: number
}

// 消息类型
export interface Message {
  id: number
  fromUserId: number
  toUserId: number
  goodsId: number
  content: string
  type: number // 0=文本 1=图片
  isRead: number
  createTime: string
  fromNickname: string
  fromAvatar: string
}

// 发送消息
export function sendMessage(data: { toUserId: number; goodsId?: number; content: string; type?: number }) {
  return http.post<any, void>('/message/send', { goodsId: 0, ...data })
}

// 获取会话列表
export function getConversations() {
  return http.get<any, Conversation[]>('/message/conversations')
}

// 获取聊天记录
export function getMessages(otherUserId: number, goodsId: number = 0) {
  return http.get<any, Message[]>('/message/chat', {
    params: { otherUserId, goodsId }
  })
}

// 标记已读并返回总未读数
export function markAsRead(otherUserId: number, goodsId: number = 0) {
  return http.post<any, { count: number }>('/message/read', null, {
    params: { otherUserId, goodsId }
  })
}

// 获取未读消息数
export function getUnreadCount() {
  return http.get<any, { count: number }>('/message/unread')
}
