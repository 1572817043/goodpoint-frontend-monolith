# 谷子雷达 前后端联调接口文档

> 基础路径: `/api`
>
> 统一返回格式: `{ "code": 200, "msg": "success", "data": {...} }`
>
> 认证方式: 请求头 `Authorization: Bearer {token}`

---

## 目录

- [通用类型定义](#通用类型定义)
- [一、首页模块 (HomeController)](#一首页模块-homecontroller)
- [二、市场模块 (MarketController)](#二市场模块-marketcontroller)
- [三、秒杀模块 (SeckillController)](#三秒杀模块-seckillcontroller)
- [四、用户认证模块 (AuthController)](#四用户认证模块-authcontroller)

---

## 通用类型定义

### ApiResponse（统一响应包装）

```typescript
interface ApiResponse<T> {
  code: number    // 状态码，200 表示成功
  msg: string     // 提示信息
  data: T         // 业务数据
}
```

### PageQuery（分页请求参数）

```typescript
interface PageQuery {
  page: number       // 页码，从 1 开始
  pageSize: number   // 每页数量
}
```

### PageResult（分页响应数据）

```typescript
interface PageResult<T> {
  list: T[]          // 数据列表
  total: number      // 总数
  page: number       // 当前页
  pageSize: number   // 每页数量
}
```

---

## 一、首页模块 (HomeController)

### 1.1 获取推荐商品列表

获取首页展示的推荐谷子商品。

- **请求路径**: `GET /api/home/recommend`
- **请求参数**: 无
- **请求头**: 无需登录

**响应 data**:

```json
[
  {
    "id": 1,
    "name": "初音未来 16周年 亚克力立牌",
    "cover": "https://xxx.com/cover.jpg",
    "price": 89,
    "originalPrice": 129,
    "category": "立牌",
    "tags": ["初音未来", "V家", "16周年"],
    "stock": 50,
    "sales": 328,
    "status": "on_sale"
  }
]
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | number | 商品 ID |
| name | string | 商品名称 |
| cover | string | 封面图 URL |
| price | number | 现价（单位：元） |
| originalPrice | number | 原价 |
| category | string | 分类 |
| tags | string[] | 标签数组 |
| stock | number | 库存数量 |
| sales | number | 已售数量 |
| status | string | 状态：on_sale / sold_out / coming_soon |

---

### 1.2 获取秒杀活动列表

获取首页展示的秒杀活动。

- **请求路径**: `GET /api/home/seckill`
- **请求参数**: 无
- **请求头**: 无需登录

**响应 data**:

```json
[
  {
    "id": 1,
    "goodsId": 101,
    "goods": {
      "id": 101,
      "name": "EVA 初号机 限定手办",
      "cover": "https://xxx.com/cover.jpg",
      "price": 599,
      "originalPrice": 899,
      "category": "手办",
      "tags": ["EVA", "初号机", "限定"],
      "stock": 10,
      "sales": 0,
      "status": "on_sale"
    },
    "seckillPrice": 299,
    "startTime": "2026-05-28T20:00:00",
    "endTime": "2026-05-28T22:00:00",
    "totalStock": 10,
    "remainStock": 3,
    "status": "active"
  }
]
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | number | 秒杀活动 ID |
| goodsId | number | 关联商品 ID |
| goods | Goods | 商品信息（嵌套） |
| seckillPrice | number | 秒杀价 |
| startTime | string | 开始时间（ISO 8601） |
| endTime | string | 结束时间（ISO 8601） |
| totalStock | number | 秒杀总库存 |
| remainStock | number | 剩余库存 |
| status | string | 状态：pending / active / ended |

---

### 1.3 获取商品分类列表

获取所有商品分类。

- **请求路径**: `GET /api/home/categories`
- **请求参数**: 无
- **请求头**: 无需登录

**响应 data**:

```json
["全部", "手办", "立牌", "徽章", "挂件", "钥匙扣", "流沙麻将", "明信片", "文件夹"]
```

---

## 二、市场模块 (MarketController)

### 2.1 获取帖子列表（分页）

获取市场瀑布流帖子列表。

- **请求路径**: `GET /api/market/posts`
- **请求参数**: Query String
- **请求头**: 无需登录（likedByUser 需登录后返回真实值）

**请求参数**:

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| page | number | 是 | 页码 |
| pageSize | number | 是 | 每页数量 |

**响应 data**:

```json
{
  "list": [
    {
      "id": 1,
      "userId": 1001,
      "userNickname": "二次元收藏家",
      "userAvatar": "https://xxx.com/avatar.jpg",
      "imageUrl": "https://xxx.com/post.jpg",
      "imageHeight": 500,
      "content": "刚入手的初音未来立牌，太好看了！",
      "likesCount": 128,
      "likedByUser": false,
      "createdAt": "2026-05-28T10:00:00"
    }
  ],
  "total": 100,
  "page": 1,
  "pageSize": 10
}
```

**字段说明**:

| 字段 | 类型 | 说明 |
|------|------|------|
| id | number | 帖子 ID |
| userId | number | 发布者 ID |
| userNickname | string | 发布者昵称（冗余存储） |
| userAvatar | string | 发布者头像（冗余存储） |
| imageUrl | string | 图片 URL |
| imageHeight | number | 图片高度（px），用于瀑布流布局 |
| content | string | 文字描述 |
| likesCount | number | 点赞数 |
| likedByUser | boolean | 当前用户是否已点赞 |
| createdAt | string | 创建时间（ISO 8601） |

**Redis 存储建议**:
- 帖子列表: `ZSET post:list {postId} -> createdAt`
- 点赞数: `STRING post:likes:{postId}` (INCR/DECR)
- 用户点赞: `SET post:liked:{postId}` (SADD/SISMEMBER)

---

### 2.2 点赞帖子

对帖子进行点赞。

- **请求路径**: `POST /api/market/posts/{id}/like`
- **请求参数**: 路径参数
- **请求头**: 需要登录

**路径参数**:

| 参数 | 类型 | 说明 |
|------|------|------|
| id | number | 帖子 ID |

**响应 data**: `null`

**Redis 操作**:
```
SADD post:liked:{postId} {userId}
INCR post:likes:{postId}
```

---

### 2.3 取消点赞

取消对帖子的点赞。

- **请求路径**: `DELETE /api/market/posts/{id}/like`
- **请求参数**: 路径参数
- **请求头**: 需要登录

**路径参数**:

| 参数 | 类型 | 说明 |
|------|------|------|
| id | number | 帖子 ID |

**响应 data**: `null`

**Redis 操作**:
```
SREM post:liked:{postId} {userId}
DECR post:likes:{postId}
```

---

## 三、秒杀模块 (SeckillController)

### 3.1 秒杀商品下单

执行秒杀抢购操作。

- **请求路径**: `POST /api/seckill/order`
- **请求参数**: JSON Body
- **请求头**: 需要登录

**请求体 (DTO)**:

```json
{
  "activityId": 1,
  "goodsId": 101
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| activityId | number | 是 | 秒杀活动 ID |
| goodsId | number | 是 | 商品 ID |

**响应 data**:

```json
{
  "orderId": "SK20260528001",
  "seckillPrice": 299,
  "expireTime": "2026-05-28T20:15:00"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| orderId | string | 订单号 |
| seckillPrice | number | 成交价格 |
| expireTime | string | 支付截止时间 |

**错误码**:

| code | msg | 说明 |
|------|-----|------|
| 4001 | 秒杀活动未开始 | 时间未到 |
| 4002 | 秒杀活动已结束 | 时间已过 |
| 4003 | 库存不足 | 已抢完 |
| 4004 | 重复下单 | 已抢购成功 |

---

## 四、用户认证模块 (AuthController)

### 4.1 发送验证码

发送手机短信验证码。

- **请求路径**: `POST /api/auth/sms/send`
- **请求参数**: JSON Body
- **请求头**: 无需登录

**请求体 (DTO)**:

```json
{
  "phone": "13800138000"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 是 | 手机号（11位） |

**响应 data**: `null`

**限制**: 同一手机号 60 秒内只能发送一次

---

### 4.2 手机号验证码登录

使用手机号 + 验证码登录。

- **请求路径**: `POST /api/auth/login`
- **请求参数**: JSON Body
- **请求头**: 无需登录

**请求体 (DTO)**:

```json
{
  "phone": "13800138000",
  "code": "123456"
}
```

| 参数 | 类型 | 必填 | 说明 |
|------|------|------|------|
| phone | string | 是 | 手机号 |
| code | string | 是 | 验证码（6位） |

**响应 data**:

```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1001,
  "nickname": "用户0000",
  "avatar": "https://xxx.com/avatar.jpg"
}
```

| 字段 | 类型 | 说明 |
|------|------|------|
| token | string | JWT Token |
| userId | number | 用户 ID |
| nickname | string | 用户昵称 |
| avatar | string | 用户头像 URL |

**错误码**:

| code | msg | 说明 |
|------|-----|------|
| 5001 | 验证码错误 | 验证码不匹配 |
| 5002 | 验证码已过期 | 需重新获取 |

---

## 附录：Java Controller 参考命名

```
HomeController
├── GET  /api/home/recommend      → getRecommendGoods()
├── GET  /api/home/seckill        → getSeckillActivities()
└── GET  /api/home/categories     → getCategories()

MarketController
├── GET    /api/market/posts          → getPosts(PageQuery)
├── POST   /api/market/posts/{id}/like → likePost(id)
└── DELETE /api/market/posts/{id}/like → unlikePost(id)

SeckillController
└── POST /api/seckill/order       → createSeckillOrder(SeckillOrderDTO)

AuthController
├── POST /api/auth/sms/send       → sendSmsCode(SmsDTO)
└── POST /api/auth/login          → login(LoginDTO)
```
