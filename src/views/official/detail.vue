<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar />

    <main class="pt-16 pb-8">
      <div class="max-w-5xl mx-auto px-4">

        <!-- 加载中 -->
        <div v-if="isLoading" class="flex flex-col md:flex-row gap-4">
          <div class="md:w-1/2 aspect-square bg-white rounded-2xl animate-pulse"></div>
          <div class="md:w-1/2 bg-white rounded-2xl p-4 space-y-3">
            <div class="h-6 bg-apple-gray-100 rounded animate-pulse w-2/3"></div>
            <div class="h-4 bg-apple-gray-100 rounded animate-pulse w-1/2"></div>
            <div class="h-10 bg-apple-gray-100 rounded animate-pulse mt-4"></div>
          </div>
        </div>

        <template v-else-if="goods">
          <!-- 核心信息区 -->
          <div class="flex flex-col md:flex-row gap-4 mb-4">
            <!-- 左侧：商品封面图 -->
            <div class="md:w-1/2">
              <div class="bg-white rounded-2xl overflow-hidden shadow-sm">
                <img
                  :src="goods.cover"
                  :alt="goods.name"
                  class="w-full aspect-square object-contain"
                />
              </div>
            </div>

            <!-- 右侧：价格与购买 -->
            <div class="md:w-1/2">
              <div class="bg-white rounded-2xl overflow-hidden shadow-sm p-4 h-full flex flex-col">
                <!-- 标签 -->
                <div class="flex items-center gap-2 mb-3">
                  <span class="px-2 py-0.5 bg-klein-blue text-white text-xs rounded-full">官方直售</span>
                  <span class="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">正品保障</span>
                </div>

                <!-- 名称 -->
                <h1 class="text-base font-bold text-apple-gray-800 mb-4">{{ goods.name }}</h1>

                <!-- 价格 -->
                <div class="bg-apple-gray-50 rounded-xl p-3 mb-4">
                  <div class="flex items-baseline gap-2 mb-1">
                    <span class="text-2xl font-bold text-red-500">¥{{ goods.price }}</span>
                    <span v-if="goods.originalPrice && goods.originalPrice > goods.price" class="text-sm text-apple-gray-400 line-through">
                      ¥{{ goods.originalPrice }}
                    </span>
                  </div>
                  <div v-if="discountPercent" class="text-xs text-red-500">
                    {{ discountPercent }}折 · 省¥{{ (goods.originalPrice - goods.price).toFixed(0) }}
                  </div>
                </div>

                <!-- 商品信息 -->
                <div class="space-y-2 text-sm mb-4 flex-1">
                  <div class="flex justify-between">
                    <span class="text-apple-gray-400">分类</span>
                    <span class="text-apple-gray-700">{{ goods.category }}</span>
                  </div>
                  <div class="flex justify-between">
                    <span class="text-apple-gray-400">已售</span>
                    <span class="text-apple-gray-700">{{ goods.sales }}件</span>
                  </div>
                </div>

                <!-- 服务保障 -->
                <div class="flex items-center gap-3 text-xs text-apple-gray-500 mb-4">
                  <div class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>正品保障</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>七天无理由</span>
                  </div>
                  <div class="flex items-center gap-1">
                    <svg class="w-3.5 h-3.5 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>顺丰包邮</span>
                  </div>
                </div>

                <!-- 购买按钮 -->
                <button
                  class="w-full h-10 bg-klein-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-fast"
                  @click="handleBuyNow"
                >
                  立即购买
                </button>
              </div>
            </div>
          </div>

          <!-- 商品详情图 -->
          <div v-if="detailImages.length > 0" class="bg-white rounded-2xl overflow-hidden shadow-sm p-4">
            <h3 class="text-sm font-medium text-apple-gray-800 mb-3">商品详情</h3>
            <div class="space-y-3">
              <img
                v-for="(img, index) in detailImages"
                :key="index"
                :src="img"
                :alt="`${goods.name} 详情图 ${index + 1}`"
                class="w-full rounded-lg"
              />
            </div>
          </div>

        </template>

        <!-- 空状态 -->
        <div v-else class="text-center py-20 bg-white rounded-2xl">
          <svg class="w-16 h-16 mx-auto text-apple-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p class="text-apple-gray-400">商品不存在</p>
        </div>

      </div>
    </main>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar from '../../components/layout/NavBar.vue'
import { getOfficialGoodsDetail } from '../../api/modules/home'
import type { Goods } from '../../types'

const router = useRouter()
const route = useRoute()

const goods = ref<Goods | null>(null)
const isLoading = ref(true)

// 折扣
const discountPercent = computed(() => {
  if (!goods.value?.originalPrice || !goods.value?.price) return null
  if (goods.value.originalPrice <= goods.value.price) return null
  return Math.round((goods.value.price / goods.value.originalPrice) * 100)
})

// 详情图（排除封面）
const detailImages = computed(() => {
  if (!goods.value?.images) return []
  return goods.value.images.filter(img => img !== goods.value?.cover)
})

// 立即购买
function handleBuyNow() {
  router.push(`/order/confirm/${goods.value?.id}?type=official`)
}

// 加载数据
onMounted(async () => {
  const goodsId = Number(route.params.id)

  try {
    goods.value = await getOfficialGoodsDetail(goodsId)
  } catch (error) {
    console.error('加载商品详情失败:', error)
  } finally {
    isLoading.value = false
  }
})
</script>
