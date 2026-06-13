<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar />

    <main class="pt-16 pb-8">
      <div class="max-w-5xl mx-auto px-4">

        <!-- 轮播 Banner -->
        <section class="mb-6">
          <div
            class="relative rounded-2xl overflow-hidden"
            @mouseenter="pauseCarousel"
            @mouseleave="resumeCarousel"
          >
            <div
              class="flex"
              :style="{ transform: `translateX(-${currentBanner * 100}%)`, transition: 'transform 500ms ease-in-out' }"
            >
              <div
                v-for="(banner, index) in banners"
                :key="index"
                class="w-full flex-shrink-0"
                :class="banner.link ? 'cursor-pointer' : ''"
                @click="banner.link && router.push(banner.link)"
              >
                <img
                  :src="banner.image"
                  :alt="banner.title"
                  class="w-full h-52 md:h-64 object-cover"
                />
              </div>
            </div>

            <!-- 指示器 -->
            <div class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              <button
                v-for="(_, index) in banners"
                :key="index"
                class="w-2 h-2 rounded-full transition-fast"
                :class="index === currentBanner ? 'bg-white' : 'bg-white/40'"
                @click="currentBanner = index"
              ></button>
            </div>
          </div>
        </section>

        <!-- 快捷入口 -->
        <section class="mb-6">
          <div class="grid grid-cols-4 gap-3">
            <router-link
              v-for="entry in entries"
              :key="entry.path"
              :to="entry.path"
              class="bg-white rounded-2xl p-4 flex flex-col items-center gap-2 hover:shadow-md transition-fast"
            >
              <div
                class="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
                :class="entry.bg"
              >
                {{ entry.icon }}
              </div>
              <span class="text-xs text-apple-gray-600">{{ entry.name }}</span>
            </router-link>
          </div>
        </section>

        <!-- 限时秒杀 -->
        <section v-if="seckillList.filter(i => i.remainStock > 0).length > 0" class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-bold text-apple-gray-800">限时秒杀</h2>
              <span class="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">HOT</span>
            </div>
            <router-link
              to="/seckill"
              class="text-sm text-apple-gray-400 hover:text-apple-gray-600 transition-fast"
            >
              查看全部
            </router-link>
          </div>

          <div class="space-y-3">
            <div
              v-for="item in seckillList.filter(i => i.remainStock > 0)"
              :key="item.id"
              class="bg-white rounded-2xl p-3 flex gap-3 cursor-pointer hover:shadow-md transition-fast"
              @click="router.push(`/seckill/${item.id}`)"
            >
              <div class="w-20 h-20 rounded-xl overflow-hidden bg-apple-gray-100 flex-shrink-0">
                <img
                  :src="item.goods?.cover || item.goods?.images?.[0] || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                  :alt="item.goods?.name"
                  class="w-full h-full object-cover"
                  @error="(e) => e.target.src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-sm text-apple-gray-800 line-clamp-1">{{ item.goods?.name }}</h3>
                <div class="flex items-baseline gap-1.5 mt-1">
                  <span class="text-base font-bold text-red-500">¥{{ item.seckillPrice }}</span>
                  <span class="text-xs text-apple-gray-300 line-through">¥{{ item.goods?.price }}</span>
                </div>
                <div class="mt-1.5 h-1.5 bg-apple-gray-100 rounded-full overflow-hidden">
                  <div
                    class="h-full bg-red-500 rounded-full"
                    :style="{ width: `${((item.totalStock - item.remainStock) / item.totalStock * 100)}%` }"
                  ></div>
                </div>
                <div class="flex items-center justify-between mt-1">
                  <span class="text-xs text-apple-gray-400">剩余 {{ item.remainStock }} 件</span>
                  <div v-if="item._countdown" class="flex items-center gap-1">
                    <span class="text-xs text-apple-gray-500">{{ item.status === 'pending' ? '距开始' : '距结束' }}</span>
                    <span v-if="item._countdown.days > 0" class="text-xs font-mono text-red-500">{{ item._countdown.days }}天</span>
                    <span class="text-xs font-mono text-red-500">{{ pad(item._countdown.hours) }}</span>
                    <span class="text-xs text-apple-gray-300">:</span>
                    <span class="text-xs font-mono text-red-500">{{ pad(item._countdown.minutes) }}</span>
                    <span class="text-xs text-apple-gray-300">:</span>
                    <span class="text-xs font-mono text-red-500">{{ pad(item._countdown.seconds) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- 官方严选 -->
        <section class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <div class="flex items-center gap-2">
              <h2 class="text-lg font-bold text-apple-gray-800">官方严选</h2>
              <span class="px-2 py-0.5 bg-klein-blue text-white text-xs rounded-full">正品保障</span>
            </div>
            <router-link
              to="/seckill#official"
              class="text-sm text-apple-gray-400 hover:text-apple-gray-600 transition-fast"
            >
              查看全部
            </router-link>
          </div>

          <div v-if="isLoadingOfficial" class="flex gap-4 overflow-hidden">
            <div v-for="i in 4" :key="i" class="flex-shrink-0 w-36">
              <div class="w-36 h-36 bg-apple-gray-100 rounded-2xl animate-pulse"></div>
              <div class="mt-2 h-3 bg-apple-gray-100 rounded animate-pulse w-3/4"></div>
              <div class="mt-1 h-4 bg-apple-gray-100 rounded animate-pulse w-12"></div>
            </div>
          </div>

          <div v-else class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <div
              v-for="goods in officialGoods"
              :key="goods.id"
              class="flex-shrink-0 w-36 cursor-pointer group"
              @click="router.push(`/official/${goods.id}`)"
            >
              <div class="w-36 h-36 rounded-2xl overflow-hidden">
                <img
                  :src="goods.cover || goods.images?.[0] || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                  :alt="goods.name"
                  class="w-full h-full object-cover group-hover:scale-105 transition-fast"
                  @error="(e) => e.target.src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                />
              </div>
              <h3 class="mt-2 text-xs text-apple-gray-700 line-clamp-2">{{ goods.name }}</h3>
              <div class="flex items-baseline gap-1 mt-1">
                <span class="text-sm font-bold text-red-500">¥{{ goods.price }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 热门帖子 -->
        <section class="mb-6">
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-apple-gray-800">热门帖子</h2>
            <router-link
              to="/community"
              class="text-sm text-apple-gray-400 hover:text-apple-gray-600 transition-fast"
            >
              查看全部
            </router-link>
          </div>

          <div v-if="isLoadingPosts" class="flex gap-4 overflow-hidden">
            <div v-for="i in 4" :key="i" class="flex-shrink-0 w-40">
              <div class="w-40 h-48 bg-apple-gray-100 rounded-2xl animate-pulse"></div>
              <div class="mt-2 h-3 bg-apple-gray-100 rounded animate-pulse w-3/4"></div>
              <div class="mt-1.5 flex items-center gap-1">
                <div class="w-4 h-4 bg-apple-gray-100 rounded-full animate-pulse"></div>
                <div class="h-3 bg-apple-gray-100 rounded animate-pulse w-12"></div>
              </div>
            </div>
          </div>

          <div v-else class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <div
              v-for="post in hotPosts"
              :key="post.id"
              class="flex-shrink-0 w-40 cursor-pointer group"
              @click="router.push(`/community/post/${post.id}`)"
            >
              <div class="w-40 h-48 rounded-2xl overflow-hidden">
                <img
                  :src="post.images?.[0] || post.imageUrl"
                  :alt="post.content"
                  class="w-full h-full object-cover group-hover:scale-105 transition-fast"
                  @error="(e) => e.target.src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                />
              </div>
              <p class="mt-2 text-xs text-apple-gray-600 line-clamp-2">{{ post.content }}</p>
              <div class="flex items-center gap-1 mt-1.5">
                <img
                  :src="post.userAvatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                  class="w-4 h-4 rounded-full"
                  @error="(e) => e.target.src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                />
                <span class="text-xs text-apple-gray-400">{{ post.userNickname }}</span>
                <span class="text-xs text-apple-gray-300 ml-auto">{{ post.likesCount }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- 热门二手 -->
        <section>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-lg font-bold text-apple-gray-800">热门二手</h2>
            <router-link
              to="/market"
              class="text-sm text-apple-gray-400 hover:text-apple-gray-600 transition-fast"
            >
              查看全部
            </router-link>
          </div>

          <div v-if="isLoadingGoods" class="flex gap-4 overflow-hidden">
            <div v-for="i in 4" :key="i" class="flex-shrink-0 w-36">
              <div class="w-36 h-36 bg-apple-gray-100 rounded-2xl animate-pulse"></div>
              <div class="mt-2 h-3 bg-apple-gray-100 rounded animate-pulse w-3/4"></div>
              <div class="mt-1 h-4 bg-apple-gray-100 rounded animate-pulse w-12"></div>
            </div>
          </div>

          <div v-else class="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
            <div
              v-for="goods in latestGoods"
              :key="goods.id"
              class="flex-shrink-0 w-36 cursor-pointer group"
              @click="router.push(`/market/${goods.id}`)"
            >
              <div class="w-36 h-36 rounded-2xl overflow-hidden">
                <img
                  :src="goods.images?.[0] || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                  :alt="goods.title"
                  class="w-full h-full object-cover group-hover:scale-105 transition-fast"
                  @error="(e) => e.target.src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                />
              </div>
              <h3 class="mt-2 text-xs text-apple-gray-700 line-clamp-2">{{ goods.title }}</h3>
              <div class="flex items-baseline gap-1 mt-1">
                <span class="text-sm font-bold text-red-500">¥{{ goods.price }}</span>
                <span v-if="goods.originalPrice" class="text-xs text-apple-gray-300 line-through">¥{{ goods.originalPrice }}</span>
              </div>
            </div>
          </div>
        </section>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../../components/layout/NavBar.vue'
import { getTopPosts } from '../../api/modules/community'
import { getMarketGoods } from '../../api/modules/market'
import { getSeckillActivities, getOfficialGoods } from '../../api/modules/home'
import type { Post } from '../../types'
import type { SecondHandGoods } from '../../api/modules/market'
import type { Goods } from '../../types'

const router = useRouter()

// Banner 数据
import banner1 from '../../assets/banners/通用品牌海报.png'
import banner2 from '../../assets/banners/秒杀活动海报.png'
import banner3 from '../../assets/banners/社区分享海报.png'
import banner4 from '../../assets/banners/二手市场海报.png'

const banners = [
  { title: '谷子雷达', image: banner1 },
  { title: '社区分享', image: banner3, link: '/community' },
  { title: '二手市场', image: banner4, link: '/market' },
  { title: '限时秒杀', image: banner2, link: '/seckill' },
]
const currentBanner = ref(0)
let bannerTimer: ReturnType<typeof setInterval> | null = null

// 快捷入口
const entries = [
  { name: '二手市场', path: '/market', icon: '🛒', bg: 'bg-blue-50' },
  { name: '谷子社区', path: '/community', icon: '💬', bg: 'bg-green-50' },
  { name: '限时秒杀', path: '/seckill', icon: '⚡', bg: 'bg-red-50' },
  { name: '每日签到', path: '/sign', icon: '✅', bg: 'bg-orange-50' },
]

// 秒杀数据
const seckillList = ref<any[]>([])
let seckillTimer: ReturnType<typeof setInterval> | null = null

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function updateSeckillCountdown() {
  const now = Date.now()
  seckillList.value.forEach(item => {
    let target: number
    if (item.status === 'pending') {
      target = new Date(item.startTime).getTime()
    } else if (item.status === 'active') {
      target = new Date(item.endTime).getTime()
    } else {
      item._countdown = { days: 0, hours: 0, minutes: 0, seconds: 0 }
      return
    }
    const diff = Math.max(0, target - now)
    const total = Math.floor(diff / 1000)
    item._countdown = {
      days: Math.floor(total / 86400),
      hours: Math.floor((total % 86400) / 3600),
      minutes: Math.floor((total % 3600) / 60),
      seconds: total % 60,
    }
  })
}

// 帖子和商品
const hotPosts = ref<Post[]>([])
const latestGoods = ref<SecondHandGoods[]>([])
const officialGoods = ref<Goods[]>([])
const isLoadingPosts = ref(true)
const isLoadingGoods = ref(true)
const isLoadingOfficial = ref(true)

function startCarousel() {
  bannerTimer = setInterval(() => {
    currentBanner.value = (currentBanner.value + 1) % banners.length
  }, 4000)
}

function pauseCarousel() {
  if (bannerTimer) {
    clearInterval(bannerTimer)
    bannerTimer = null
  }
}

function resumeCarousel() {
  pauseCarousel()
  startCarousel()
}

onMounted(async () => {
  startCarousel()

  const [postsRes, goodsRes, seckillRes, officialRes] = await Promise.allSettled([
    getTopPosts(8),
    getMarketGoods({ page: 1, pageSize: 10 }),
    getSeckillActivities(),
    getOfficialGoods(),
  ])

  if (postsRes.status === 'fulfilled') {
    hotPosts.value = postsRes.value
  }
  isLoadingPosts.value = false

  if (goodsRes.status === 'fulfilled') {
    latestGoods.value = goodsRes.value.list.sort(() => Math.random() - 0.5)
  }
  isLoadingGoods.value = false

  if (seckillRes.status === 'fulfilled') {
    seckillList.value = seckillRes.value.slice(0, 5)
    updateSeckillCountdown()
    seckillTimer = setInterval(updateSeckillCountdown, 1000)
  }

  if (officialRes.status === 'fulfilled') {
    officialGoods.value = officialRes.value.slice(0, 8)
  }
  isLoadingOfficial.value = false
})

onUnmounted(() => {
  pauseCarousel()
  if (seckillTimer) {
    clearInterval(seckillTimer)
    seckillTimer = null
  }
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
