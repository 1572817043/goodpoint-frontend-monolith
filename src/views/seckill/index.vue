<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar />

    <main class="pt-16 pb-8">
      <div class="max-w-5xl mx-auto px-4">

        <!-- 顶部轮播 -->
        <div
          class="relative rounded-2xl overflow-hidden shadow-sm mb-8 select-none"
          @touchstart="onBannerTouchStart"
          @touchmove="onBannerTouchMove"
          @touchend="onBannerTouchEnd"
          @mouseenter="pauseAutoPlay"
          @mouseleave="resumeAutoPlay"
        >
          <!-- 加载骨架 -->
          <div v-if="isLoading" class="h-56 md:h-80 bg-apple-gray-100 animate-pulse"></div>

          <template v-else-if="bannerList.length > 0">
            <div
              class="flex transition-transform duration-500 ease-out"
              :style="{ transform: `translateX(-${bannerIndex * 100}%)` }"
            >
              <div
                v-for="item in bannerList"
                :key="item.id"
                class="w-full flex-shrink-0 cursor-pointer"
                @click="handleBannerClick(item)"
              >
                <div class="relative h-56 md:h-80">
                  <img
                    :src="item.image"
                    :alt="item.title"
                    class="w-full h-full object-cover"
                  />
                  <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div class="absolute bottom-0 left-0 right-0 p-5">
                    <div class="flex items-end justify-between">
                      <div>
                        <h3 class="text-white text-lg font-bold mb-1">{{ item.title }}</h3>
                        <div v-if="item.price" class="flex items-baseline gap-2">
                          <span class="text-2xl font-bold text-white">¥{{ item.price }}</span>
                          <span v-if="item.originalPrice" class="text-sm text-white/60 line-through">¥{{ item.originalPrice }}</span>
                        </div>
                        <p v-if="item.subtitle" class="text-sm text-white/80 mt-1">{{ item.subtitle }}</p>
                      </div>
                      <div v-if="item.status" class="text-right">
                        <p class="text-xs text-white/70 mb-1">{{ getSeckillLabel(item.status) }}</p>
                        <div v-if="getCountdown(item).total > 0" class="flex items-center gap-1">
                          <span v-if="getCountdown(item).days > 0" class="px-1.5 py-1 bg-white/20 backdrop-blur-sm rounded text-sm text-white font-mono">{{ getCountdown(item).days }}天</span>
                          <span class="px-1.5 py-1 bg-white/20 backdrop-blur-sm rounded text-sm text-white font-mono">{{ pad(getCountdown(item).hours) }}</span>
                          <span class="text-white/60 text-sm">:</span>
                          <span class="px-1.5 py-1 bg-white/20 backdrop-blur-sm rounded text-sm text-white font-mono">{{ pad(getCountdown(item).minutes) }}</span>
                          <span class="text-white/60 text-sm">:</span>
                          <span class="px-1.5 py-1 bg-white/20 backdrop-blur-sm rounded text-sm text-white font-mono">{{ pad(getCountdown(item).seconds) }}</span>
                        </div>
                      </div>
                    </div>
                    <div v-if="item.remainStock !== undefined" class="mt-3">
                      <div class="h-1.5 bg-white/20 rounded-full overflow-hidden">
                        <div
                          class="h-full bg-red-400 rounded-full transition-all duration-500"
                          :style="{ width: getStockPercent(item) + '%' }"
                        ></div>
                      </div>
                      <span class="text-xs text-white/60 mt-1">剩余 {{ item.remainStock }} 件</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 箭头 -->
            <button
              class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-fast"
              @click="prevBanner"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <button
              class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-black/30 backdrop-blur-sm text-white flex items-center justify-center hover:bg-black/50 transition-fast"
              @click="nextBanner"
            >
              <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>

            <!-- 指示器 -->
            <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              <button
                v-for="(_, index) in bannerList"
                :key="index"
                class="h-1 rounded-full transition-all duration-300"
                :class="bannerIndex === index ? 'w-6 bg-white' : 'w-1.5 bg-white/40'"
                @click="bannerIndex = index"
              ></button>
            </div>
          </template>
        </div>

        <!-- 正在秒杀 -->
        <section class="mb-10">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-bold text-apple-gray-800">正在秒杀</h2>
              <span class="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full font-medium">HOT</span>
            </div>
            <div class="flex items-center gap-1 text-sm text-apple-gray-500">
              <svg class="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>全场限时抢购</span>
            </div>
          </div>

          <!-- 加载骨架 -->
          <div v-if="isLoading" class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div v-for="i in 6" :key="i" class="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div class="aspect-square bg-apple-gray-100 animate-pulse"></div>
              <div class="p-3 space-y-2">
                <div class="h-4 bg-apple-gray-100 rounded animate-pulse"></div>
                <div class="h-5 bg-apple-gray-100 rounded animate-pulse w-2/3"></div>
              </div>
            </div>
          </div>

          <!-- 秒杀卡片网格 -->
          <div v-else-if="activeSeckill.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div
              v-for="item in activeSeckill"
              :key="item.id"
              class="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-fast"
              @click="router.push(`/seckill/${item.id}`)"
            >
              <div class="relative aspect-square overflow-hidden">
                <img
                  :src="item.goods?.cover"
                  :alt="item.goods?.name"
                  class="w-full h-full object-cover"
                />
                <!-- 库存不足标签 -->
                <div
                  v-if="item.remainStock < item.totalStock * 0.2"
                  class="absolute top-2 left-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full"
                >
                  即将售罄
                </div>
              </div>
              <div class="p-3">
                <h3 class="text-sm text-apple-gray-800 line-clamp-1 mb-2">{{ item.goods?.name }}</h3>
                <div class="flex items-baseline gap-1.5 mb-2">
                  <span class="text-lg font-bold text-red-500">¥{{ item.seckillPrice }}</span>
                  <span class="text-xs text-apple-gray-400 line-through">¥{{ item.goods?.originalPrice }}</span>
                </div>
                <div class="h-1.5 bg-red-100 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-red-500 rounded-full transition-all duration-500"
                    :style="{ width: getStockPercent(item) + '%' }"
                  ></div>
                </div>
                <div class="flex items-center justify-between mt-1.5">
                  <span class="text-xs text-apple-gray-400">剩余 {{ item.remainStock }} 件</span>
                  <div class="flex items-center gap-1">
                    <svg class="w-3 h-3 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-xs text-apple-gray-500 font-mono">{{ getCountdownText(item) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="text-center py-12 bg-white rounded-2xl">
            <svg class="w-12 h-12 mx-auto text-apple-gray-200 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p class="text-apple-gray-400">暂无进行中的秒杀</p>
          </div>
        </section>

        <!-- 已结束 / 即将开始 -->
        <section v-if="otherSeckill.length > 0" class="mb-10">
          <div class="flex items-center gap-2 mb-4">
            <h2 class="text-lg font-bold text-apple-gray-800">更多秒杀</h2>
            <span class="px-2 py-0.5 bg-apple-gray-200 text-apple-gray-500 text-xs rounded-full">往期 & 预告</span>
          </div>

          <div class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div
              v-for="item in otherSeckill"
              :key="item.id"
              class="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-fast opacity-70"
              @click="router.push(`/seckill/${item.id}`)"
            >
              <div class="relative aspect-square overflow-hidden">
                <img
                  :src="item.goods?.cover"
                  :alt="item.goods?.name"
                  class="w-full h-full object-cover"
                />
                <div class="absolute inset-0 bg-black/10"></div>
                <span
                  class="absolute top-2 left-2 px-2 py-0.5 text-white text-xs rounded-full"
                  :class="item.status === 'pending' ? 'bg-orange-500' : 'bg-apple-gray-500'"
                >
                  {{ item.status === 'pending' ? '即将开始' : item.remainStock <= 0 ? '已抢完' : '已结束' }}
                </span>
              </div>
              <div class="p-3">
                <h3 class="text-sm text-apple-gray-800 line-clamp-1 mb-2">{{ item.goods?.name }}</h3>
                <div class="flex items-baseline gap-1.5 mb-2">
                  <span class="text-lg font-bold text-red-500">¥{{ item.seckillPrice }}</span>
                  <span class="text-xs text-apple-gray-400 line-through">¥{{ item.goods?.originalPrice }}</span>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-apple-gray-400">
                    {{ item.status === 'pending' ? formatTime(item.startTime) : '已结束' }}
                  </span>
                  <span v-if="item.status === 'pending'" class="text-xs font-mono text-orange-500">{{ getCountdownText(item) }}</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 官方严选 -->
        <section id="official">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-bold text-apple-gray-800">官方严选</h2>
              <span class="px-2 py-0.5 bg-klein-blue text-white text-xs rounded-full">正品保障</span>
            </div>
          </div>

          <!-- 加载骨架 -->
          <div v-if="isLoadingOfficial" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div v-for="i in 4" :key="i" class="bg-white rounded-2xl overflow-hidden shadow-sm">
              <div class="aspect-square bg-apple-gray-100 animate-pulse"></div>
              <div class="p-3 space-y-2">
                <div class="h-4 bg-apple-gray-100 rounded animate-pulse"></div>
                <div class="h-5 bg-apple-gray-100 rounded animate-pulse w-1/2"></div>
              </div>
            </div>
          </div>

          <!-- 商品网格 -->
          <div v-else-if="officialGoods.length > 0" class="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div
              v-for="item in officialGoods"
              :key="item.id"
              class="bg-white rounded-2xl overflow-hidden shadow-sm cursor-pointer hover:shadow-md transition-fast"
              @click="router.push(`/official/${item.id}`)"
            >
              <div class="aspect-square overflow-hidden">
                <img
                  :src="item.cover"
                  :alt="item.name"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="p-3">
                <h3 class="text-sm text-apple-gray-800 line-clamp-1 mb-1.5">{{ item.name }}</h3>
                <span class="text-lg font-bold text-red-500">¥{{ item.price }}</span>
              </div>
            </div>
          </div>

          <!-- 空状态 -->
          <div v-else class="text-center py-12 bg-white rounded-2xl">
            <p class="text-apple-gray-400">暂无商品</p>
          </div>
        </section>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar from '../../components/layout/NavBar.vue'
import { getSeckillActivities, getOfficialGoods } from '../../api/modules/home'
import type { SeckillActivity, Goods } from '../../types'

const router = useRouter()
const route = useRoute()

const seckillList = ref<SeckillActivity[]>([])
const officialGoods = ref<Goods[]>([])
const isLoading = ref(true)
const isLoadingOfficial = ref(true)
const bannerIndex = ref(0)

let autoPlayTimer: ReturnType<typeof setInterval> | null = null
let countdownTimer: ReturnType<typeof setInterval> | null = null

// --- 轮播数据：将秒杀项转为 banner 格式 ---
interface BannerItem {
  id: number
  image: string
  title: string
  price?: number
  originalPrice?: number
  subtitle?: string
  status?: 'pending' | 'active' | 'ended'
  startTime?: string
  endTime?: string
  remainStock?: number
  totalStock?: number
  link?: string
  activityId?: number
}

const bannerList = computed<BannerItem[]>(() => {
  return seckillList.value.filter(item => !(item.status === 'active' && item.remainStock <= 0)).map(item => ({
    id: item.id,
    image: item.goods?.cover || '',
    title: item.goods?.name || '',
    price: item.seckillPrice,
    originalPrice: item.goods?.originalPrice,
    status: item.status,
    startTime: item.startTime,
    endTime: item.endTime,
    remainStock: item.remainStock,
    totalStock: item.totalStock,
    activityId: item.id,
  }))
})

const activeSeckill = computed(() => {
  return seckillList.value.filter(item => item.status === 'active' && item.remainStock > 0)
})

const otherSeckill = computed(() => {
  return seckillList.value.filter(item => !(item.status === 'active' && item.remainStock > 0))
})

function handleBannerClick(item: BannerItem) {
  if (item.activityId) {
    router.push(`/seckill/${item.activityId}`)
  }
}

// --- 倒计时 ---
function pad(n: number) {
  return String(n).padStart(2, '0')
}

function getCountdown(item: BannerItem) {
  const now = Date.now()
  let target: number
  if (item.status === 'pending') {
    target = new Date(item.startTime!).getTime()
  } else if (item.status === 'active') {
    target = new Date(item.endTime!).getTime()
  } else {
    return { total: 0, days: 0, hours: 0, minutes: 0, seconds: 0 }
  }
  const diff = Math.max(0, target - now)
  const totalSeconds = Math.floor(diff / 1000)
  return {
    total: diff,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  }
}

function getCountdownText(item: SeckillActivity) {
  const now = Date.now()
  let target: number
  if (item.status === 'pending') {
    target = new Date(item.startTime).getTime()
  } else if (item.status === 'active') {
    target = new Date(item.endTime).getTime()
  } else {
    return '已结束'
  }
  const diff = Math.max(0, target - now)
  const totalSeconds = Math.floor(diff / 1000)
  const d = Math.floor(totalSeconds / 86400)
  const h = Math.floor((totalSeconds % 86400) / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  if (d > 0) return `${d}天 ${pad(h)}:${pad(m)}:${pad(s)}`
  if (h > 0) return `${pad(h)}:${pad(m)}:${pad(s)}`
  return `${pad(m)}:${pad(s)}`
}

function formatTime(time: string) {
  const d = new Date(time)
  return `${d.getMonth() + 1}/${d.getDate()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function getSeckillLabel(status: string) {
  if (status === 'pending') return '即将开始'
  if (status === 'ended') return '已结束'
  return '秒杀中'
}

function getStockPercent(item: { totalStock?: number; remainStock?: number }) {
  if (!item.totalStock) return 0
  return ((item.totalStock - (item.remainStock || 0)) / item.totalStock) * 100
}

// --- 轮播控制 ---
function prevBanner() {
  if (bannerList.value.length === 0) return
  bannerIndex.value = (bannerIndex.value - 1 + bannerList.value.length) % bannerList.value.length
}

function nextBanner() {
  if (bannerList.value.length === 0) return
  bannerIndex.value = (bannerIndex.value + 1) % bannerList.value.length
}

function startAutoPlay() {
  stopAutoPlay()
  if (bannerList.value.length > 1) {
    autoPlayTimer = setInterval(nextBanner, 4000)
  }
}

function stopAutoPlay() {
  if (autoPlayTimer) {
    clearInterval(autoPlayTimer)
    autoPlayTimer = null
  }
}

function pauseAutoPlay() { stopAutoPlay() }
function resumeAutoPlay() { startAutoPlay() }

let bannerTouchStartX = 0
let bannerTouchStartY = 0

function onBannerTouchStart(e: TouchEvent) {
  bannerTouchStartX = e.touches[0].clientX
  bannerTouchStartY = e.touches[0].clientY
  pauseAutoPlay()
}

function onBannerTouchMove(e: TouchEvent) {
  const dx = e.touches[0].clientX - bannerTouchStartX
  const dy = e.touches[0].clientY - bannerTouchStartY
  if (Math.abs(dx) > Math.abs(dy)) e.preventDefault()
}

function onBannerTouchEnd(e: TouchEvent) {
  const dx = e.changedTouches[0].clientX - bannerTouchStartX
  const dy = e.changedTouches[0].clientY - bannerTouchStartY
  if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 40) {
    if (dx < 0) nextBanner()
    else prevBanner()
  }
  resumeAutoPlay()
}

// --- 加载数据 ---
onMounted(async () => {
  // 倒计时刷新
  countdownTimer = setInterval(() => {
    seckillList.value = [...seckillList.value]
  }, 1000)

  // 加载秒杀活动
  try {
    seckillList.value = await getSeckillActivities()
    startAutoPlay()
  } catch (error) {
    console.error('加载秒杀活动失败:', error)
  } finally {
    isLoading.value = false
  }

  // 加载官方商品
  try {
    officialGoods.value = await getOfficialGoods()
  } catch (error) {
    console.error('加载官方商品失败:', error)
  } finally {
    isLoadingOfficial.value = false
  }

  // 锚点滚动
  if (route.hash) {
    await nextTick()
    const el = document.querySelector(route.hash)
    if (el) {
      const navHeight = 80
      const top = el.getBoundingClientRect().top + window.scrollY - navHeight
      window.scrollTo({ top, behavior: 'smooth' })
    }
  }
})

onUnmounted(() => {
  stopAutoPlay()
  if (countdownTimer) clearInterval(countdownTimer)
})
</script>
