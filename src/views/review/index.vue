<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar title="我的评价" />

    <main class="pt-16 pb-8">
      <div class="max-w-lg mx-auto px-4">

        <!-- 返回 + 标题 -->
        <div class="flex items-center gap-3 mb-4 mt-4">
          <button
            class="flex items-center gap-1 text-sm text-apple-gray-500 hover:text-apple-gray-800 transition-fast"
            @click="router.back()"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </button>
        </div>

        <!-- 评价统计 -->
        <div class="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <div class="flex items-center gap-4">
            <div class="text-center">
              <p class="text-3xl font-bold text-apple-gray-800">{{ summary.avgRating || '-' }}</p>
              <div class="flex items-center gap-0.5 mt-1">
                <svg
                  v-for="star in 5"
                  :key="star"
                  class="w-3.5 h-3.5"
                  :class="star <= Math.round(summary.avgRating) ? 'text-yellow-400' : 'text-apple-gray-200'"
                  :fill="star <= Math.round(summary.avgRating) ? 'currentColor' : 'none'"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <p class="text-xs text-apple-gray-400 mt-1">{{ summary.count }} 条评价</p>
            </div>
            <div class="flex-1 space-y-1.5">
              <div v-for="star in [5,4,3,2,1]" :key="star" class="flex items-center gap-2">
                <span class="text-xs text-apple-gray-500 w-3">{{ star }}</span>
                <svg class="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
                <div class="flex-1 h-1.5 bg-apple-gray-100 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-yellow-400 rounded-full"
                    :style="{ width: getStarPercent(star) + '%' }"
                  ></div>
                </div>
                <span class="text-xs text-apple-gray-400 w-8 text-right">{{ getStarCount(star) }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 评价列表 -->
        <div class="space-y-3">
          <div
            v-for="review in reviews"
            :key="review.id"
            class="bg-white rounded-2xl shadow-sm p-4"
          >
            <div class="flex items-center gap-3 mb-2">
              <img
                :src="review.fromUserAvatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                class="w-8 h-8 rounded-full"
                @error="(e: Event) => (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
              />
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-1.5">
                  <p class="text-sm font-medium text-apple-gray-800">{{ review.fromUserNickname }}</p>
                  <span
                    v-if="review.fromUserRole"
                    class="text-xs px-1.5 py-0.5 rounded"
                    :class="review.fromUserRole === '买家' ? 'bg-blue-50 text-blue-500' : 'bg-orange-50 text-orange-500'"
                  >
                    {{ review.fromUserRole }}
                  </span>
                </div>
                <div class="flex items-center gap-1">
                  <svg
                    v-for="star in 5"
                    :key="star"
                    class="w-3 h-3"
                    :class="star <= review.rating ? 'text-yellow-400' : 'text-apple-gray-200'"
                    :fill="star <= review.rating ? 'currentColor' : 'none'"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                </div>
              </div>
              <span class="text-xs text-apple-gray-400">{{ formatTime(review.createTime) }}</span>
            </div>
            <p v-if="review.content" class="text-sm text-apple-gray-600 mb-1.5">{{ review.content }}</p>
            <p v-if="review.goodsTitle" class="text-xs text-apple-gray-400">商品：{{ review.goodsTitle }}</p>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!loading && reviews.length === 0" class="text-center py-16">
          <svg class="w-16 h-16 mx-auto text-apple-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
          </svg>
          <p class="text-apple-gray-400">暂无评价</p>
        </div>

        <!-- 加载更多 -->
        <div v-if="reviews.length > 0 && reviews.length < total" class="mt-6 text-center">
          <button
            class="px-8 py-2.5 bg-white text-apple-gray-600 rounded-full text-sm hover:bg-apple-gray-100 transition-fast"
            @click="loadMore"
            :disabled="loading"
          >
            {{ loading ? '加载中...' : '加载更多' }}
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar from '../../components/layout/NavBar.vue'
import { getUserReviews, getReviewSummary } from '../../api/modules/review'
import { userStore } from '../../stores/user'
import type { Review, ReviewSummary } from '../../api/modules/review'

const router = useRouter()
const route = useRoute()

const reviews = ref<Review[]>([])
const page = ref(1)
const total = ref(0)
const loading = ref(false)
const summary = ref<ReviewSummary>({ count: 0, avgRating: 0 })
const starCounts = ref<Record<number, number>>({1: 0, 2: 0, 3: 0, 4: 0, 5: 0})

const userId = Number(route.params.userId) || Number(userStore.state.userId)

function getStarCount(star: number) {
  return starCounts.value[star] || 0
}

function getStarPercent(star: number) {
  if (summary.value.count === 0) return 0
  return Math.round((getStarCount(star) / summary.value.count) * 100)
}

function formatTime(time: string) {
  if (!time) return ''
  const d = new Date(time)
  const now = new Date()
  const diff = now.getTime() - d.getTime()
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前'
  if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前'
  return `${d.getMonth() + 1}-${d.getDate()}`
}

async function loadSummary() {
  try {
    summary.value = await getReviewSummary(userId)
  } catch {
    // 静默
  }
}

async function loadReviews(append = false) {
  if (loading.value) return
  loading.value = true
  try {
    const result = await getUserReviews(userId, { page: page.value, pageSize: 10 })
    if (append) {
      reviews.value.push(...result.list)
    } else {
      reviews.value = result.list
    }
    total.value = result.total

    // 统计各星级数量
    if (!append) {
      const counts: Record<number, number> = {1: 0, 2: 0, 3: 0, 4: 0, 5: 0}
      reviews.value.forEach(r => {
        if (r.rating >= 1 && r.rating <= 5) counts[r.rating]++
      })
      starCounts.value = counts
    }
  } catch {
    // 静默
  } finally {
    loading.value = false
  }
}

function loadMore() {
  if (loading.value) return
  page.value++
  loadReviews(true)
}

onMounted(() => {
  loadSummary()
  loadReviews()
})
</script>
