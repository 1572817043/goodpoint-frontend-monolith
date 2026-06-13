<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar />

    <main class="pt-16 pb-8">
      <div class="max-w-3xl mx-auto px-4">

        <!-- 返回按钮 -->
        <button
          class="flex items-center gap-2 text-sm text-apple-gray-500 hover:text-apple-gray-800 mb-4 transition-fast"
          @click="router.back()"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>

        <!-- 加载中 -->
        <div v-if="isLoading" class="space-y-4">
          <div class="aspect-square bg-apple-gray-100 rounded-2xl animate-pulse"></div>
          <div class="h-8 bg-apple-gray-100 rounded animate-pulse w-1/2"></div>
          <div class="h-6 bg-apple-gray-100 rounded animate-pulse w-1/3"></div>
        </div>

        <!-- 内容 -->
        <div v-else-if="activity">
          <!-- 商品图片 -->
          <div class="bg-white rounded-2xl overflow-hidden shadow-sm mb-4">
            <div
              class="aspect-square relative select-none"
              @touchstart="onTouchStart"
              @touchmove="onTouchMove"
              @touchend="onTouchEnd"
            >
              <img
                :src="currentImage"
                :alt="activity.goods?.name"
                class="w-full h-full object-contain"
                draggable="false"
              />
              <!-- 左右箭头（桌面端） -->
              <button
                v-if="activity.goods?.images?.length > 1"
                class="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-fast"
                @click="prevImage"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                v-if="activity.goods?.images?.length > 1"
                class="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 text-white flex items-center justify-center hover:bg-black/50 transition-fast"
                @click="nextImage"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
              <!-- 指示器 -->
              <div
                v-if="activity.goods?.images?.length > 1"
                class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5"
              >
                <button
                  v-for="(img, index) in activity.goods.images"
                  :key="index"
                  class="w-2 h-2 rounded-full transition-fast"
                  :class="currentIndex === index ? 'bg-white' : 'bg-white/50'"
                  @click="currentIndex = index"
                ></button>
              </div>
            </div>
          </div>

          <!-- 秒杀信息卡片 -->
          <div class="bg-white rounded-2xl shadow-sm p-5 mb-4">
            <!-- 价格 -->
            <div class="flex items-baseline gap-3 mb-3">
              <div class="flex items-center gap-1.5">
                <span class="px-2 py-0.5 bg-red-500 text-white text-xs rounded font-medium">秒杀价</span>
                <span class="text-2xl font-bold text-red-500">¥{{ activity.seckillPrice }}</span>
              </div>
              <span class="text-sm text-apple-gray-400 line-through">¥{{ activity.goods?.originalPrice }}</span>
            </div>

            <!-- 商品名称 -->
            <h1 class="text-lg font-bold text-apple-gray-800 mb-2">{{ activity.goods?.name }}</h1>

            <!-- 分类标签 -->
            <div class="flex flex-wrap gap-1.5 mb-4">
              <span
                v-for="tag in activity.goods?.tags"
                :key="tag"
                class="px-2 py-0.5 bg-apple-gray-100 text-apple-gray-500 text-xs rounded-full"
              >
                {{ tag }}
              </span>
            </div>

            <!-- 倒计时 -->
            <div class="flex items-center gap-2 mb-4">
              <svg class="w-4 h-4 text-red-500 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <template v-if="activity.status === 'ended' || (countdown.days === 0 && countdown.hours === 0 && countdown.minutes === 0 && countdown.seconds === 0)">
                <span class="text-sm text-apple-gray-400">活动已结束</span>
              </template>
              <template v-else>
                <span class="text-sm text-apple-gray-600">{{ activity.status === 'pending' ? '距开始' : '距结束' }}</span>
                <div class="flex items-center gap-1">
                  <span v-if="countdown.days > 0" class="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded font-mono">{{ countdown.days }}天</span>
                  <span class="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded font-mono">{{ pad(countdown.hours) }}</span>
                  <span class="text-xs text-apple-gray-400">:</span>
                  <span class="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded font-mono">{{ pad(countdown.minutes) }}</span>
                  <span class="text-xs text-apple-gray-400">:</span>
                  <span class="px-1.5 py-0.5 bg-red-500 text-white text-xs rounded font-mono">{{ pad(countdown.seconds) }}</span>
                </div>
              </template>
            </div>

            <!-- 库存进度 -->
            <div class="mb-4">
              <div class="flex items-center justify-between text-xs text-apple-gray-400 mb-1.5">
                <span>已抢 {{ activity.totalStock - activity.remainStock }} 件</span>
                <span>剩余 {{ activity.remainStock }} 件</span>
              </div>
              <div class="h-2.5 bg-red-100 rounded-full overflow-hidden">
                <div
                  class="h-full bg-gradient-to-r from-red-400 to-red-500 rounded-full transition-all duration-500"
                  :style="{ width: stockPercent + '%' }"
                ></div>
              </div>
            </div>

            <!-- 操作按钮 -->
            <button
              class="w-full h-12 rounded-xl text-base font-medium transition-fast"
              :class="{
                'bg-apple-gray-200 text-apple-gray-500 cursor-not-allowed': activity.status === 'pending' || isEnded || isSoldOut || hasPurchased,
                'bg-red-500 text-white hover:bg-red-600 active:bg-red-700': activity.status === 'active' && !isEnded && !isSoldOut && !hasPurchased,
              }"
              :disabled="activity.status !== 'active' || isEnded || isSoldOut || hasPurchased || isSubmitting"
              @click="handleBuy"
            >
              {{ isSubmitting ? '提交中...' : buttonText }}
            </button>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../../components/layout/NavBar.vue'
import { getSeckillDetail, createSeckillOrder, getSeckillOrderStatus } from '../../api/modules/home'
import { hasSeckillOrder } from '../../api/modules/order'
import { userStore } from '../../stores/user'
import { useToast } from '../../composables/useToast'
import type { SeckillActivity } from '../../types'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const activity = ref<SeckillActivity | null>(null)
const isLoading = ref(true)
const isSubmitting = ref(false)
const hasPurchased = ref(false)
const currentIndex = ref(0)
const countdown = ref({ days: 0, hours: 0, minutes: 0, seconds: 0 })
let timer: ReturnType<typeof setInterval> | null = null

const currentImage = computed(() => {
  const images = activity.value?.goods?.images
  if (images && images.length > 0) {
    return images[currentIndex.value] || images[0]
  }
  return activity.value?.goods?.cover || ''
})

// 图片切换
function prevImage() {
  const images = activity.value?.goods?.images
  if (!images?.length) return
  currentIndex.value = (currentIndex.value - 1 + images.length) % images.length
}

function nextImage() {
  const images = activity.value?.goods?.images
  if (!images?.length) return
  currentIndex.value = (currentIndex.value + 1) % images.length
}

// 触摸滑动
let touchStartX = 0
let touchStartY = 0

function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

function onTouchMove(e: TouchEvent) {
  // 阻止默认的纵向滚动（当横向滑动时）
  const dx = e.touches[0].clientX - touchStartX
  const dy = e.touches[0].clientY - touchStartY
  if (Math.abs(dx) > Math.abs(dy)) {
    e.preventDefault()
  }
}

function onTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - touchStartX
  const dy = e.changedTouches[0].clientY - touchStartY
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
    if (dx < 0) nextImage()
    else prevImage()
  }
}

const stockPercent = computed(() => {
  if (!activity.value) return 0
  return ((activity.value.totalStock - activity.value.remainStock) / activity.value.totalStock) * 100
})

const isEnded = computed(() => {
  if (!activity.value) return true
  if (activity.value.status === 'ended') return true
  return countdown.value.days === 0 && countdown.value.hours === 0 && countdown.value.minutes === 0 && countdown.value.seconds === 0
})

const isSoldOut = computed(() => {
  return activity.value && activity.value.remainStock <= 0
})

const buttonText = computed(() => {
  if (!activity.value) return ''
  if (hasPurchased.value) return '已抢购'
  if (isEnded.value) return '已结束'
  if (isSoldOut.value) return '已抢完'
  switch (activity.value.status) {
    case 'pending': return '即将开始'
    case 'active': return '立即秒杀'
    case 'ended': return '已结束'
    default: return ''
  }
})

const countdownText = computed(() => {
  if (!activity.value) return ''
  switch (activity.value.status) {
    case 'pending': return '距离开始还有'
    case 'active': return '距离结束还有'
    case 'ended': return '活动已结束'
    default: return ''
  }
})

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function updateCountdown() {
  if (!activity.value) return

  const now = Date.now()
  let target: number

  if (activity.value.status === 'pending') {
    target = new Date(activity.value.startTime).getTime()
  } else if (activity.value.status === 'active') {
    target = new Date(activity.value.endTime).getTime()
  } else {
    countdown.value = { days: 0, hours: 0, minutes: 0, seconds: 0 }
    return
  }

  const diff = Math.max(0, target - now)
  const totalSeconds = Math.floor(diff / 1000)

  countdown.value = {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

async function loadDetail() {
  const id = Number(route.params.id)
  if (!id) return

  isLoading.value = true
  hasPurchased.value = false
  try {
    activity.value = await getSeckillDetail(id)
    updateCountdown()
    startTimer()

    // 检查是否已购买过
    if (userStore.isLoggedIn.value) {
      hasPurchased.value = await hasSeckillOrder(id)
    }
  } catch (error) {
    toast.error('加载失败')
  } finally {
    isLoading.value = false
  }
}

function startTimer() {
  stopTimer()
  timer = setInterval(updateCountdown, 1000)
}

function stopTimer() {
  if (timer) {
    clearInterval(timer)
    timer = null
  }
}

function handleBuy() {
  if (!activity.value) return
  if (!userStore.isLoggedIn.value) {
    userStore.showLoginModal.value = true
    return
  }
  router.push(`/order/confirm/${activity.value.goodsId}?type=seckill&activityId=${activity.value.id}`)
}

watch(() => route.params.id, () => {
  loadDetail()
})

onMounted(() => {
  loadDetail()
})

onUnmounted(() => {
  stopTimer()
})
</script>
