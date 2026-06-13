/**
 * 通用响应类型 - 对应后端统一返回格式
 * 后端 Controller 返回格式: { code: 200, msg: "success", data: {...} }
 */
export interface ApiResponse<T = any> {
  code: number
  msg: string
  data: T
}

/**
 * 分页请求参数
 */
export interface PageQuery {
  page: number
  pageSize: number
}

/**
 * 分页响应数据
 */
export interface PageResult<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

/**
 * 谷子（商品）类型
 */
export interface Goods {
  id: number
  name: string
  cover: string
  images: string[]
  price: number
  originalPrice: number
  category: string
  tags: string[]
  stock: number
  sales: number
  status: 'on_sale' | 'sold_out' | 'coming_soon'
}

/**
 * 秒杀活动类型
 */
export interface SeckillActivity {
  id: number
  goodsId: number
  goods: Goods
  seckillPrice: number
  startTime: string
  endTime: string
  totalStock: number
  remainStock: number
  status: 'pending' | 'active' | 'ended'
}

/**
 * 用户类型
 */
export interface User {
  id: number
  username: string
  nickname: string
  avatar: string
  phone: string
}

/**
 * 帖子类型（扁平结构，方便 Java + Redis 对接）
 *
 * 设计说明：
 * - userId 直接存储，不嵌套 User 对象
 * - userNickname / userAvatar 冗余存储，避免查询时 JOIN
 * - likesCount 使用计数器，适合 Redis INCR 操作
 * - likedByUser 前端状态字段，后端可通过 Redis SISMEMBER 判断
 * - imageHeight 存储图片高度，用于瀑布流布局计算
 */
export interface Post {
  id: number
  userId: number
  userNickname: string
  userAvatar: string
  imageUrl: string
  imageHeight: number
  images: string[]
  content: string
  location?: string
  tags: string[]
  likesCount: number
  likedByUser: boolean
  favoritedByUser: boolean
  createdAt: string
}
