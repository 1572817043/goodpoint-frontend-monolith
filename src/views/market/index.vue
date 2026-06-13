<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar />

    <main class="pt-16 pb-8">
      <div
        class="max-w-7xl mx-auto px-4"
        @touchstart="onPullStart"
        @touchmove="onPullMove"
        @touchend="onPullEnd"
      >
        <!-- 下拉刷新提示 -->
        <div
          class="flex items-center justify-center overflow-hidden transition-all duration-300"
          :style="{ height: pullDistance > 0 ? pullDistance + 'px' : '0px' }"
        >
          <div class="flex items-center gap-2 text-sm text-apple-gray-400">
            <svg
              class="w-4 h-4 transition-transform"
              :class="{ 'animate-spin': isRefreshing }"
              :style="{ transform: pullDistance > 60 && !isRefreshing ? 'rotate(180deg)' : '' }"
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
            <span>{{ isRefreshing ? '刷新中...' : pullDistance > 60 ? '松手刷新' : '下拉刷新' }}</span>
          </div>
        </div>

        <!-- 搜索栏 -->
        <section class="mb-6">
          <div class="relative max-w-xl mx-auto">
            <input
              v-model="keyword"
              type="text"
              placeholder="搜索谷子、IP、角色..."
              class="w-full h-12 pl-12 pr-4 bg-white rounded-full border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm"
              @keyup.enter="handleSearch"
            />
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <button
              v-if="searchKeyword"
              class="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-apple-gray-400 hover:text-apple-gray-600"
              @click="clearSearch"
            >
              清除
            </button>
          </div>
          <p v-if="searchKeyword" class="mt-2 text-sm text-apple-gray-500 text-center">
            搜索 "{{ searchKeyword }}" 的结果
          </p>
        </section>

        <!-- 分类导航 -->
        <section class="mb-6">
          <div class="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
            <button
              v-for="(category, index) in categories"
              :key="category"
              class="px-5 py-2 text-sm rounded-full whitespace-nowrap transition-fast"
              :class="activeCategory === index
                ? 'bg-apple-gray-800 text-white'
                : 'bg-white text-apple-gray-600 hover:bg-apple-gray-100'"
              @click="activeCategory = index; loadGoods()"
            >
              {{ category }}
            </button>
          </div>
        </section>

        <!-- 筛选栏 -->
        <section class="mb-6 flex items-center gap-4 flex-wrap">
          <div class="flex items-center gap-2">
            <span class="text-sm text-apple-gray-500">价格：</span>
            <button
              v-for="(range, index) in priceRanges"
              :key="index"
              class="px-3 py-1.5 text-xs rounded-full transition-fast"
              :class="activePrice === index
                ? 'bg-klein-blue text-white'
                : 'bg-white text-apple-gray-600 hover:bg-apple-gray-100'"
              @click="activePrice = index; loadGoods()"
            >
              {{ range.label }}
            </button>
          </div>
          <div class="flex items-center gap-2 ml-auto">
            <button
              class="px-6 py-2.5 bg-klein-blue text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-fast"
              @click="handlePublishClick"
            >
              + 发布闲置
            </button>
          </div>
        </section>

        <!-- 商品网格 -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="goods in goodsList"
            :key="goods.id"
            class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-fast cursor-pointer"
            @click="goToDetail(goods.id)"
          >
            <!-- 图片 -->
            <div class="aspect-square bg-apple-gray-100">
              <img
                :src="goods.images?.[0] || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                :alt="goods.title"
                class="w-full h-full object-cover"
              />
            </div>

            <!-- 信息 -->
            <div class="p-3">
              <h3 class="text-sm font-medium text-apple-gray-800 line-clamp-2 mb-2">
                {{ goods.title }}
              </h3>
              <div class="flex items-baseline gap-2 mb-2">
                <span class="text-lg font-bold text-red-500">¥{{ goods.price }}</span>
                <span v-if="goods.originalPrice" class="text-xs text-apple-gray-400 line-through">
                  ¥{{ goods.originalPrice }}
                </span>
              </div>
              <div class="flex items-center justify-between">
                <span class="text-xs px-2 py-0.5 bg-apple-gray-100 rounded-full text-apple-gray-500">
                  {{ goods.goodsCondition }}
                </span>
                <div class="flex items-center gap-1">
                  <img
                    :src="goods.userAvatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                    class="w-4 h-4 rounded-full"
                    @error="(e: Event) => (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                  />
                  <span class="text-xs text-apple-gray-400">{{ goods.userNickname }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-if="!isLoading && goodsList.length === 0" class="text-center py-16">
          <svg class="w-16 h-16 mx-auto text-apple-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p class="text-apple-gray-400">{{ searchKeyword ? '未找到相关商品' : '暂无商品' }}</p>
        </div>

        <!-- 加载更多状态 -->
        <div v-if="goodsList.length > 0" class="py-8 text-center">
          <div v-if="isLoading" class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5 animate-spin text-apple-gray-400" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span class="text-sm text-apple-gray-400">加载中...</span>
          </div>
          <div v-else-if="noMore" class="flex items-center justify-center gap-3">
            <div class="w-16 h-px bg-apple-gray-200"></div>
            <span class="text-xs text-apple-gray-300">已经到底了</span>
            <div class="w-16 h-px bg-apple-gray-200"></div>
          </div>
          <div v-else ref="sentinelRef" class="h-1"></div>
        </div>

      </div>
    </main>

    <!-- 发布弹窗 -->
    <PublishModal
      v-model:visible="showPublishModal"
      @publish-success="handlePublishSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar from '../../components/layout/NavBar.vue'
import PublishModal from '../../components/common/PublishModal.vue'
import { getMarketGoods } from '../../api/modules/market'
import { userStore } from '../../stores/user'
import type { SecondHandGoods } from '../../api/modules/market'

const router = useRouter()
const route = useRoute()

// 搜索
const keyword = ref('')
const searchKeyword = ref('')

// 分类列表
const categories = ['全部', '手办', '立牌', '徽章', '挂件', '钥匙扣', '流沙麻将', '明信片', '文件夹']
const activeCategory = ref(0)

// 价格区间
const priceRanges = [
  { label: '全部', min: undefined, max: undefined },
  { label: '0-50', min: 0, max: 50 },
  { label: '50-100', min: 50, max: 100 },
  { label: '100-300', min: 100, max: 300 },
  { label: '300+', min: 300, max: undefined },
]
const activePrice = ref(0)

// 商品列表
const goodsList = ref<SecondHandGoods[]>([])
const page = ref(1)
const pageSize = ref(12)
const total = ref(0)
const isLoading = ref(false)
const noMore = ref(false)

// 下拉刷新
const pullDistance = ref(0)
const isRefreshing = ref(false)
let touchStartY = 0
let isPulling = false

// 无限滚动
const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

// 发布弹窗
const showPublishModal = ref(false)

// 全部数据缓存（后端一次返回100条，前端分页）
let allFiltered: SecondHandGoods[] = []

function handlePublishClick() {
  if (!userStore.isLoggedIn.value) {
    userStore.showLoginModal.value = true
    return
  }
  showPublishModal.value = true
}

function handleSearch() {
  const q = keyword.value.trim()
  if (q) {
    searchKeyword.value = q
    loadGoods()
  }
}

function clearSearch() {
  keyword.value = ''
  searchKeyword.value = ''
  loadGoods()
}

// 下拉刷新触摸处理
function onPullStart(e: TouchEvent) {
  if (window.scrollY <= 0) {
    touchStartY = e.touches[0].clientY
    isPulling = true
  }
}

function onPullMove(e: TouchEvent) {
  if (!isPulling || isRefreshing.value) return
  const dy = e.touches[0].clientY - touchStartY
  if (dy > 0 && window.scrollY <= 0) {
    e.preventDefault()
    pullDistance.value = Math.min(dy * 0.5, 100)
  }
}

function onPullEnd() {
  if (!isPulling) return
  isPulling = false

  if (pullDistance.value > 60 && !isRefreshing.value) {
    isRefreshing.value = true
    pullDistance.value = 50
    doRefresh()
  } else {
    pullDistance.value = 0
  }
}

async function doRefresh() {
  try {
    await loadGoods()
  } finally {
    isRefreshing.value = false
    pullDistance.value = 0
  }
}

// 加载商品列表
async function loadGoods() {
  isLoading.value = true
  page.value = 1
  noMore.value = false

  try {
    const category = activeCategory.value === 0 ? undefined : categories[activeCategory.value]
    const priceRange = priceRanges[activePrice.value]
    const result = await getMarketGoods({
      page: 1,
      pageSize: 100,
      category,
      keyword: searchKeyword.value || undefined,
    })
    allFiltered = result.list
    if (priceRange.min !== undefined) {
      allFiltered = allFiltered.filter(g => g.price >= priceRange.min!)
    }
    if (priceRange.max !== undefined) {
      allFiltered = allFiltered.filter(g => g.price < priceRange.max!)
    }
    total.value = allFiltered.length
    goodsList.value = allFiltered.slice(0, pageSize.value)

    if (goodsList.value.length >= total.value) {
      noMore.value = true
    }
  } catch (error) {
    console.error('加载商品失败:', error)
  } finally {
    isLoading.value = false
    nextTick(() => observeSentinel())
  }
}

// 加载更多
function loadMore() {
  if (isLoading.value || noMore.value) return
  isLoading.value = true
  page.value++

  const start = (page.value - 1) * pageSize.value
  const end = start + pageSize.value
  const more = allFiltered.slice(start, end)

  if (more.length > 0) {
    goodsList.value.push(...more)
  }
  if (goodsList.value.length >= total.value) {
    noMore.value = true
  }

  isLoading.value = false
  nextTick(() => observeSentinel())
}

function observeSentinel() {
  if (observer) observer.disconnect()
  if (noMore.value) return

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !isLoading.value && !noMore.value) {
        loadMore()
      }
    },
    { rootMargin: '200px' }
  )

  if (sentinelRef.value) {
    observer.observe(sentinelRef.value)
  }
}

// 跳转详情
function goToDetail(id: number) {
  router.push(`/market/${id}`)
}

// 发布成功回调
function handlePublishSuccess() {
  loadGoods()
}

// 监听路由 query 变化
watch(() => route.query.keyword, (val) => {
  if (val) {
    keyword.value = val as string
    searchKeyword.value = val as string
    loadGoods()
  }
}, { immediate: true })

onMounted(() => {
  if (!route.query.keyword) {
    loadGoods()
  }
})

onUnmounted(() => {
  if (observer) observer.disconnect()
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
