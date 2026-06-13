<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar />

    <main class="pt-16 pb-8">
      <div class="max-w-5xl mx-auto px-4">

        <!-- 返回按钮 + 标题 -->
        <div class="flex items-center gap-3 mb-6">
          <button
            class="flex items-center gap-1 text-sm text-apple-gray-500 hover:text-apple-gray-800 transition-fast"
            @click="router.back()"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </button>
          <h1 class="text-xl font-bold text-apple-gray-800">商品收藏</h1>
        </div>

        <!-- 商品列表 -->
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="goods in goodsList"
            :key="goods.id"
            class="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-fast"
            @click="router.push(`/market/${goods.id}`)"
          >
            <div class="aspect-square bg-apple-gray-100 relative">
              <img
                :src="goods.images?.[0]"
                :alt="goods.title"
                class="w-full h-full object-cover"
                :class="goods.status === 'sold' ? 'opacity-60' : ''"
              />
              <div
                v-if="goods.status === 'sold'"
                class="absolute inset-0 flex items-center justify-center"
              >
                <span class="bg-black/60 text-white text-sm px-3 py-1 rounded-full">已卖出</span>
              </div>
            </div>
            <div class="p-3">
              <p class="text-sm text-apple-gray-800 line-clamp-2 mb-2">{{ goods.title }}</p>
              <div class="flex items-center justify-between">
                <span class="text-base font-bold text-red-500">¥{{ goods.price }}</span>
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

        <!-- 加载状态 -->
        <div class="py-8 text-center">
          <div v-if="isLoading" class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5 animate-spin text-apple-gray-400" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span class="text-sm text-apple-gray-400">加载中...</span>
          </div>

          <div v-else-if="!isLoading && goodsList.length === 0" class="py-12">
            <svg class="w-16 h-16 mx-auto text-apple-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            <p class="text-apple-gray-400 mb-2">暂无收藏商品</p>
            <p class="text-sm text-apple-gray-300">浏览市场时点击收藏按钮即可添加</p>
          </div>

          <div v-else-if="noMore && goodsList.length > 0" class="flex items-center justify-center gap-3">
            <div class="w-16 h-px bg-apple-gray-200"></div>
            <span class="text-xs text-apple-gray-300">已经到底了</span>
            <div class="w-16 h-px bg-apple-gray-200"></div>
          </div>

          <div v-else ref="sentinelRef" class="h-1"></div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../../components/layout/NavBar.vue'
import { getFavoriteGoods } from '../../api/modules/market'
import { userStore } from '../../stores/user'
import type { SecondHandGoods } from '../../api/modules/market'

const router = useRouter()

const goodsList = ref<SecondHandGoods[]>([])
const page = ref(1)
const pageSize = ref(12)
const total = ref(0)
const isLoading = ref(false)
const noMore = ref(false)
const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

async function loadGoods(append = false) {
  if (isLoading.value) return
  if (append && noMore.value) return

  isLoading.value = true
  try {
    const result = await getFavoriteGoods({
      page: page.value,
      pageSize: pageSize.value,
    })
    if (append) {
      goodsList.value.push(...result.list)
    } else {
      goodsList.value = result.list
    }
    total.value = result.total

    if (goodsList.value.length >= total.value) {
      noMore.value = true
    }
  } catch (error) {
    console.error('加载收藏商品失败:', error)
  } finally {
    isLoading.value = false
    nextTick(() => observeSentinel())
  }
}

function loadMore() {
  if (isLoading.value || noMore.value) return
  page.value++
  loadGoods(true)
}

function observeSentinel() {
  if (observer) {
    observer.disconnect()
  }

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

onMounted(() => {
  if (!userStore.isLoggedIn.value) {
    router.push('/market')
    return
  }
  loadGoods()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>
