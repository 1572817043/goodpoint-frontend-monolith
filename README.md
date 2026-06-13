# 谷子雷达前端（单体版）

基于 Vue 3 + TypeScript + Tailwind CSS 的二次元谷子爱好者综合平台前端。

## 技术栈

| 组件 | 版本 | 说明 |
|------|------|------|
| Vue | 3 | 前端框架 |
| TypeScript | 5 | 类型系统 |
| Vite | 5 | 构建工具 |
| Vue Router | 4 | 路由管理 |
| Pinia | 2 | 状态管理 |
| Tailwind CSS | 3 | 原子化 CSS |
| Axios | 1 | HTTP 请求 |

## 环境要求

- Node.js 18+
- npm 9+

## 快速启动

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器
npm run dev
```

开发服务器默认运行在 `http://localhost:3000`

## 构建生产版本

```bash
npm run build
```

构建产物输出到 `dist/` 目录。

---

## 项目结构

```
src/
├── api/                 API 请求模块
│   └── modules/         按功能拆分（auth, market, community, order, coupon 等）
├── components/          通用组件
│   └── layout/          布局组件（Header, TabBar）
├── composables/         组合式函数（useToast）
├── router/              路由配置
│   └── modules/         按功能拆分的路由模块
├── stores/              Pinia 状态管理
│   ├── user.ts          用户状态（登录、Token）
│   └── message.ts       消息状态（未读数）
├── types/               TypeScript 类型定义
├── utils/               工具函数（request 封装、Token 管理）
├── views/               页面组件
│   ├── home/            首页
│   ├── login/           登录
│   ├── market/          二手市场（列表、详情）
│   ├── official/        官方严选（详情）
│   ├── community/       社区（首页、帖子详情、排行、标签、用户主页）
│   ├── seckill/         秒杀（列表、详情）
│   ├── order/           订单（列表、详情、确认下单）
│   ├── profile/         个人中心（订单、收藏、发布管理）
│   ├── address/         收货地址管理
│   ├── coupon/          我的优惠券
│   ├── sign/            每日签到
│   └── chat/            私信（列表、详情）
├── App.vue              根组件
└── main.ts              入口文件
```

## 页面路由

| 路径 | 页面 | 说明 |
|------|------|------|
| `/` | home/index.vue | 首页（热门帖子、热门二手、秒杀、官方严选） |
| `/login` | login/index.vue | 登录（手机号+验证码/密码） |
| `/market` | market/index.vue | 二手市场列表 |
| `/market/:id` | market/detail.vue | 二手商品详情 |
| `/official/:id` | official/detail.vue | 官方商品详情 |
| `/community` | community/index.vue | 社区首页 |
| `/community/post/:id` | community/post/index.vue | 帖子详情 |
| `/community/ranking` | community/ranking/index.vue | 帖子排行榜 |
| `/community/tag/:name` | community/tag/index.vue | 标签页 |
| `/community/user/:id` | community/user/index.vue | 用户主页 |
| `/seckill` | seckill/index.vue | 秒杀活动列表 |
| `/seckill/:id` | seckill/detail.vue | 秒杀活动详情 |
| `/order` | order/index.vue | 我的订单 |
| `/order/:id` | order/detail.vue | 订单详情 |
| `/order/confirm/:id` | order/confirm.vue | 确认下单（选地址、优惠券） |
| `/profile` | profile/index.vue | 个人中心 |
| `/profile/orders` | profile/orders.vue | 订单管理 |
| `/profile/favorites` | profile/favorites.vue | 帖子收藏 |
| `/profile/goods-favorites` | profile/goods-favorites.vue | 商品收藏 |
| `/profile/my-goods` | profile/my-goods.vue | 我的发布 |
| `/address` | address/index.vue | 收货地址管理 |
| `/sign` | sign/index.vue | 每日签到 |
| `/coupons` | coupon/index.vue | 我的优惠券 |
| `/chat` | chat/index.vue | 私信列表 |
| `/chat/:id` | chat/detail/index.vue | 私信详情 |

## 功能模块

| 模块 | 说明 |
|------|------|
| 认证 | 手机号 + 短信验证码 / 密码登录，JWT Token 存 localStorage |
| 首页 | 轮播 Banner、热门帖子横向滚动、秒杀倒计时、官方严选、热门二手 |
| 二手市场 | 商品列表（分类筛选）、商品详情、发布商品、购买 |
| 社区 | 帖子列表、发帖、点赞/收藏、评论、标签筛选、排行榜 |
| 秒杀 | 活动列表、倒计时、秒杀下单 |
| 订单 | 订单列表（按状态筛选）、订单详情、确认收货、取消订单 |
| 优惠券 | 我的优惠券列表（未使用/已使用/已过期）、下单选择优惠券 |
| 签到 | 签到日历、连续签到天数、签到奖励展示 |
| 私信 | 会话列表、实时聊天（WebSocket） |
| 个人中心 | 个人信息、订单管理、收藏管理、发布管理 |

## 后端接口

前端请求统一通过 `src/utils/request.ts` 封装的 Axios 实例发送：

- 基础 URL：`/api`
- 认证：`Authorization: Bearer <token>`（自动从 localStorage 读取）
- 错误处理：401 自动跳转登录页

完整接口文档见后端项目 `src/main/resources/api.md`
