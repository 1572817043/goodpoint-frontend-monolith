import type { Goods, SeckillActivity } from '../types'

/**
 * 首页 Mock 数据
 * 开发阶段使用，后续对接后端时删除
 */

// 推荐商品列表
export const mockGoodsList: Goods[] = [
  {
    id: 1,
    name: '初音未来 16周年 亚克力立牌',
    cover: 'https://picsum.photos/400/400?random=1',
    price: 89,
    originalPrice: 129,
    category: '立牌',
    tags: ['初音未来', 'V家', '16周年'],
    stock: 50,
    sales: 328,
    status: 'on_sale',
  },
  {
    id: 2,
    name: '咒术回战 五条悟 挂件',
    cover: 'https://picsum.photos/400/400?random=2',
    price: 45,
    originalPrice: 68,
    category: '挂件',
    tags: ['咒术回战', '五条悟'],
    stock: 100,
    sales: 567,
    status: 'on_sale',
  },
  {
    id: 3,
    name: '原神 雷电将军 徽章',
    cover: 'https://picsum.photos/400/400?random=3',
    price: 25,
    originalPrice: 35,
    category: '徽章',
    tags: ['原神', '雷电将军'],
    stock: 200,
    sales: 1024,
    status: 'on_sale',
  },
  {
    id: 4,
    name: '间谍过家家 阿尼亚 流沙麻将',
    cover: 'https://picsum.photos/400/400?random=4',
    price: 128,
    originalPrice: 168,
    category: '流沙麻将',
    tags: ['间谍过家家', '阿尼亚'],
    stock: 30,
    sales: 89,
    status: 'on_sale',
  },
  {
    id: 5,
    name: '鬼灭之刃 炭治郎 手办',
    cover: 'https://picsum.photos/400/400?random=5',
    price: 299,
    originalPrice: 399,
    category: '手办',
    tags: ['鬼灭之刃', '炭治郎'],
    stock: 20,
    sales: 156,
    status: 'on_sale',
  },
  {
    id: 6,
    name: '明日方舟 阿米娅 亚克力钥匙扣',
    cover: 'https://picsum.photos/400/400?random=6',
    price: 35,
    originalPrice: 49,
    category: '钥匙扣',
    tags: ['明日方舟', '阿米娅'],
    stock: 150,
    sales: 432,
    status: 'on_sale',
  },
]

// 秒杀活动列表
export const mockSeckillList: SeckillActivity[] = [
  {
    id: 1,
    goodsId: 101,
    goods: {
      id: 101,
      name: 'EVA 初号机 限定手办',
      cover: 'https://picsum.photos/400/400?random=7',
      price: 599,
      originalPrice: 899,
      category: '手办',
      tags: ['EVA', '初号机', '限定'],
      stock: 10,
      sales: 0,
      status: 'on_sale',
    },
    seckillPrice: 299,
    startTime: '2026-05-28T20:00:00',
    endTime: '2026-05-28T22:00:00',
    totalStock: 10,
    remainStock: 3,
    status: 'active',
  },
  {
    id: 2,
    goodsId: 102,
    goods: {
      id: 102,
      name: 'Fate Saber 花嫁 限量版',
      cover: 'https://picsum.photos/400/400?random=8',
      price: 1299,
      originalPrice: 1899,
      category: '手办',
      tags: ['Fate', 'Saber', '花嫁'],
      stock: 5,
      sales: 0,
      status: 'on_sale',
    },
    seckillPrice: 699,
    startTime: '2026-05-29T10:00:00',
    endTime: '2026-05-29T12:00:00',
    totalStock: 5,
    remainStock: 5,
    status: 'pending',
  },
]

// 分类列表
export const mockCategories = [
  '全部',
  '手办',
  '立牌',
  '徽章',
  '挂件',
  '钥匙扣',
  '流沙麻将',
  '明信片',
  '文件夹',
]
