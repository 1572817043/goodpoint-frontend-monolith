<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar title="评价" />

    <main class="pt-16 pb-8">
      <div class="max-w-lg mx-auto px-4">

        <!-- 加载中 -->
        <div v-if="loading" class="flex justify-center py-20">
          <svg class="w-8 h-8 animate-spin text-apple-gray-400" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>

        <template v-else-if="order">
          <!-- 商品信息 -->
          <div class="bg-white rounded-2xl shadow-sm p-4 mt-4">
            <div class="flex gap-3">
              <img
                :src="order.goodsImage || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                class="w-16 h-16 rounded-xl object-cover shrink-0"
              />
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-medium text-apple-gray-800 line-clamp-2">{{ order.goodsTitle }}</h3>
                <p class="text-base font-bold text-red-500 mt-1">¥{{ order.goodsPrice }}</p>
              </div>
            </div>
          </div>

          <!-- 评分 -->
          <div class="bg-white rounded-2xl shadow-sm p-5 mt-3">
            <p class="text-sm font-medium text-apple-gray-800 mb-3">评分</p>
            <div class="flex items-center gap-2">
              <button
                v-for="star in 5"
                :key="star"
                @click="rating = star"
                class="transition-fast"
              >
                <svg
                  class="w-8 h-8"
                  :class="star <= rating ? 'text-yellow-400' : 'text-apple-gray-200'"
                  :fill="star <= rating ? 'currentColor' : 'none'"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </button>
              <span class="text-sm text-apple-gray-400 ml-2">{{ ratingText }}</span>
            </div>
          </div>

          <!-- 评价内容 -->
          <div class="bg-white rounded-2xl shadow-sm p-5 mt-3">
            <p class="text-sm font-medium text-apple-gray-800 mb-3">评价内容</p>
            <textarea
              v-model="content"
              placeholder="分享你的交易体验，帮助其他用户参考（可选）"
              rows="4"
              class="w-full bg-apple-gray-50 rounded-xl p-3 text-sm text-apple-gray-800 outline-none focus:ring-2 focus:ring-klein-blue/30 resize-none transition-fast"
            ></textarea>
          </div>

          <!-- 提交按钮 -->
          <div class="mt-6">
            <button
              class="w-full h-12 bg-klein-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-fast"
              :disabled="rating === 0 || submitting"
              :class="rating === 0 ? 'opacity-50 cursor-not-allowed' : ''"
              @click="handleSubmit"
            >
              {{ submitting ? '提交中...' : '提交评价' }}
            </button>
          </div>
        </template>

        <!-- 已评价 -->
        <div v-else-if="alreadyReviewed" class="text-center py-20">
          <svg class="w-16 h-16 mx-auto text-green-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-apple-gray-600">您已评价过此订单</p>
          <button
            class="mt-4 px-6 py-2 bg-apple-gray-100 text-apple-gray-600 rounded-full text-sm"
            @click="router.back()"
          >
            返回
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar from '../../components/layout/NavBar.vue'
import { getOrderDetail } from '../../api/modules/order'
import { submitReview, hasReviewed } from '../../api/modules/review'
import { useToast } from '../../composables/useToast'
import type { Order } from '../../api/modules/order'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const order = ref<Order | null>(null)
const loading = ref(true)
const rating = ref(0)
const content = ref('')
const submitting = ref(false)
const alreadyReviewed = ref(false)

const ratingText = computed(() => {
  const texts = ['', '非常差', '较差', '一般', '满意', '非常满意']
  return texts[rating.value] || ''
})

async function handleSubmit() {
  if (rating.value === 0 || !order.value) return
  submitting.value = true
  try {
    await submitReview({
      orderId: order.value.id,
      rating: rating.value,
      content: content.value.trim(),
    })
    toast.success('评价成功')
    router.push(`/orders/${order.value.id}`)
  } catch {
    toast.error('提交失败')
  } finally {
    submitting.value = false
  }
}

onMounted(async () => {
  const orderId = Number(route.params.orderId)
  if (!orderId) {
    loading.value = false
    return
  }

  try {
    // 检查是否已评价
    const reviewed = await hasReviewed(orderId)
    if (reviewed) {
      alreadyReviewed.value = true
      loading.value = false
      return
    }
    order.value = await getOrderDetail(orderId)
  } catch {
    toast.error('加载失败')
  } finally {
    loading.value = false
  }
})
</script>
