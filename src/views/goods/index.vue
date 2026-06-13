<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar />

    <main class="pt-16 pb-8">
      <div class="max-w-6xl mx-auto px-4">
        <div class="bg-white rounded-2xl overflow-hidden shadow-sm">
          <div class="flex flex-col md:flex-row">
            <!-- 左侧图片轮播 -->
            <div class="md:w-1/2 p-4">
              <!-- 大图 -->
              <div class="relative aspect-square bg-apple-gray-100 rounded-xl overflow-hidden mb-4">
                <img
                  :src="currentImage"
                  :alt="goods?.name"
                  class="w-full h-full object-contain"
                />
                <!-- 左右箭头 -->
                <button
                  v-if="goods?.images && goods.images.length > 1"
                  class="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center hover:bg-black/50 transition"
                  @click="prevImage"
                >
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  v-if="goods?.images && goods.images.length > 1"
                  class="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/30 rounded-full flex items-center justify-center hover:bg-black/50 transition"
                  @click="nextImage"
                >
                  <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <!-- 图片计数 -->
                <div
                  v-if="goods?.images && goods.images.length > 1"
                  class="absolute bottom-2 right-2 px-3 py-1 bg-black/50 rounded-full text-white text-sm"
                >
                  {{ currentIndex + 1 }}/{{ goods.images.length }}
                </div>
              </div>

              <!-- 缩略图列表 -->
              <div
                v-if="goods?.images && goods.images.length > 1"
                class="flex gap-2 overflow-x-auto pb-2"
              >
                <button
                  v-for="(img, index) in goods.images"
                  :key="index"
                  class="flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition"
                  :class="currentIndex === index ? 'border-klein-blue' : 'border-transparent hover:border-apple-gray-300'"
                  @click="currentIndex = index"
                >
                  <img
                    :src="img"
                    class="w-full h-full object-cover"
                  />
                </button>
              </div>
            </div>

            <!-- 右侧商品信息 -->
            <div class="md:w-1/2 p-6">
              <h1 class="text-xl font-bold text-apple-gray-800 mb-4">{{ goods?.name }}</h1>

              <div class="flex items-baseline gap-3 mb-6">
                <span class="text-3xl font-bold text-red-500">¥{{ goods?.price }}</span>
                <span v-if="goods?.originalPrice" class="text-lg text-apple-gray-400 line-through">
                  ¥{{ goods.originalPrice }}
                </span>
              </div>

              <div class="flex gap-2 mb-6">
                <span
                  v-for="tag in goods?.tags"
                  :key="tag"
                  class="px-3 py-1 bg-apple-gray-100 rounded-full text-sm text-apple-gray-600"
                >
                  {{ tag }}
                </span>
              </div>

              <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div class="flex items-center gap-2 text-apple-gray-500">
                  <span>分类：{{ goods?.category }}</span>
                </div>
                <div class="flex items-center gap-2 text-apple-gray-500">
                  <span>库存：{{ goods?.stock }}</span>
                </div>
                <div class="flex items-center gap-2 text-apple-gray-500">
                  <span>已售：{{ goods?.sales }}</span>
                </div>
                <div class="flex items-center gap-2 text-apple-gray-500">
                  <span>状态：{{ goods?.status === 'on_sale' ? '在售' : '售罄' }}</span>
                </div>
              </div>

              <!-- 秒杀信息 -->
              <div v-if="seckillActivity" class="bg-red-50 rounded-xl p-4 mb-6">
                <div class="flex items-center gap-2 mb-2">
                  <span class="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">秒杀</span>
                  <span class="text-sm text-red-600 font-medium">限时特惠</span>
                </div>
                <div class="flex items-baseline gap-2 mb-2">
                  <span class="text-2xl font-bold text-red-500">¥{{ seckillActivity.seckillPrice }}</span>
                  <span class="text-sm text-apple-gray-400 line-through">¥{{ goods?.price }}</span>
                </div>
                <div class="text-sm text-apple-gray-500">
                  剩余库存：{{ seckillActivity.remainStock }}/{{ seckillActivity.totalStock }}
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex gap-3">
                <button
                  class="flex-1 h-12 bg-klein-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-fast"
                  @click="handleBuy"
                >
                  {{ seckillActivity ? '立即秒杀' : '立即购买' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import NavBar from '../../components/layout/NavBar.vue'
import { getRecommendGoods, getSeckillActivities } from '../../api/modules/home'
import type { Goods, SeckillActivity } from '../../types'

const route = useRoute()

// 商品数据
const goods = ref<Goods | null>(null)
const seckillActivity = ref<SeckillActivity | null>(null)

// 图片轮播
const currentIndex = ref(0)
const currentImage = computed(() => {
  if (goods.value?.images && goods.value.images.length > 0) {
    return goods.value.images[currentIndex.value]
  }
  return goods.value?.cover || ''
})

// 上一张
function prevImage() {
  if (!goods.value?.images) return
  currentIndex.value = (currentIndex.value - 1 + goods.value.images.length) % goods.value.images.length
}

// 下一张
function nextImage() {
  if (!goods.value?.images) return
  currentIndex.value = (currentIndex.value + 1) % goods.value.images.length
}

// 购买/秒杀
function handleBuy() {
  alert('购买功能开发中...')
}

// 加载数据
onMounted(async () => {
  const goodsId = Number(route.params.id)

  try {
    // 并行获取商品和秒杀数据
    const [goodsList, seckillList] = await Promise.all([
      getRecommendGoods(),
      getSeckillActivities()
    ])

    // 查找对应商品
    goods.value = goodsList.find(g => g.id === goodsId) || null

    // 查找对应的秒杀活动
    seckillActivity.value = seckillList.find(a => a.goodsId === goodsId) || null
  } catch (error) {
    console.error('加载商品详情失败:', error)
  }
})
</script>
