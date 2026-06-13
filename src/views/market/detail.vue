<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar />

    <main class="pt-16 pb-8">
      <div class="max-w-5xl mx-auto px-4">

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
        <div v-if="isLoading" class="flex justify-center py-20">
          <svg class="w-8 h-8 animate-spin text-apple-gray-400" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>

        <!-- 商品不存在 -->
        <div v-else-if="!goods" class="text-center py-20">
          <p class="text-apple-gray-400">商品不存在或已下架</p>
        </div>

        <!-- 商品详情：双栏布局 -->
        <div v-else class="flex flex-col md:flex-row gap-6">

          <!-- 左侧：图片 -->
          <div class="w-full md:w-1/2">
            <div class="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-20">
              <div
                class="relative select-none"
                @touchstart="onTouchStart"
                @touchmove="onTouchMove"
                @touchend="onTouchEnd"
              >
                <div class="overflow-hidden">
                  <div
                    class="flex transition-transform duration-300"
                    :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }"
                  >
                    <div
                      v-for="(img, index) in goods.images"
                      :key="index"
                      class="w-full flex-shrink-0"
                    >
                      <img
                        :src="img"
                        class="w-full aspect-square object-contain bg-white"
                        draggable="false"
                      />
                    </div>
                  </div>
                </div>

                <!-- 左右箭头 -->
                <template v-if="goods.images.length > 1">
                  <button
                    v-if="currentImageIndex > 0"
                    class="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-fast"
                    @click="currentImageIndex--"
                  >
                    <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    v-if="currentImageIndex < goods.images.length - 1"
                    class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-fast"
                    @click="currentImageIndex++"
                  >
                    <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </template>

                <!-- 图片计数 -->
                <div
                  v-if="goods.images.length > 1"
                  class="absolute top-4 right-4 px-2.5 py-1 bg-black/50 rounded-full text-xs text-white"
                >
                  {{ currentImageIndex + 1 }}/{{ goods.images.length }}
                </div>
              </div>

              <!-- 缩略图 -->
              <div v-if="goods.images.length > 1" class="flex gap-2 p-3 overflow-x-auto">
                <button
                  v-for="(img, index) in goods.images"
                  :key="index"
                  class="w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-fast"
                  :class="currentImageIndex === index ? 'border-klein-blue' : 'border-transparent'"
                  @click="currentImageIndex = index"
                >
                  <img :src="img" class="w-full h-full object-cover" />
                </button>
              </div>
            </div>
          </div>

          <!-- 右侧：信息 -->
          <div class="w-full md:w-1/2">
            <!-- 价格 + 标题卡片 -->
            <div class="bg-white rounded-2xl shadow-sm p-5 mb-4">
              <div class="flex items-baseline gap-3 mb-2">
                <span class="text-2xl font-bold text-red-500">¥{{ goods.price }}</span>
                <span v-if="goods.originalPrice" class="text-sm text-apple-gray-400 line-through">
                  ¥{{ goods.originalPrice }}
                </span>
              </div>
              <h1 class="text-lg font-bold text-apple-gray-800 mb-3">{{ goods.title }}</h1>
              <div class="flex flex-wrap gap-1.5">
                <span class="px-2 py-0.5 bg-apple-gray-100 text-apple-gray-500 text-xs rounded-full">
                  {{ goods.category }}
                </span>
                <span class="px-2 py-0.5 bg-apple-gray-100 text-apple-gray-500 text-xs rounded-full">
                  {{ goods.goodsCondition }}
                </span>
              </div>
            </div>

            <!-- 描述 -->
            <div v-if="goods.description" class="bg-white rounded-2xl shadow-sm p-5 mb-4">
              <p class="text-sm text-apple-gray-600 leading-relaxed whitespace-pre-wrap">{{ goods.description }}</p>
            </div>

            <!-- 卖家信息 -->
            <div class="bg-white rounded-2xl shadow-sm p-5 mb-4">
              <div
                class="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-fast"
                @click="goToUser"
              >
                <img
                  :src="goods.userAvatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                  :alt="goods.userNickname"
                  class="w-10 h-10 rounded-full"
                  @error="(e: Event) => (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                />
                <div class="flex-1">
                  <p class="text-sm font-medium text-apple-gray-800">{{ goods.userNickname }}</p>
                  <p class="text-xs text-apple-gray-400">{{ formatDate(goods.createdAt) }}</p>
                </div>
                <svg class="w-4 h-4 text-apple-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>

            <!-- 浏览和想要 -->
            <div class="flex items-center gap-4 text-xs text-apple-gray-400 mb-4">
              <span>{{ goods.viewCount }} 次浏览</span>
              <span>{{ goods.likeCount }} 人想要</span>
            </div>

            <!-- 操作按钮 -->
            <div v-if="isOwner" class="flex gap-3">
              <button
                class="flex-1 h-11 bg-apple-gray-100 text-apple-gray-600 rounded-xl font-medium hover:bg-apple-gray-200 transition-fast"
                @click="handleDelete"
              >
                下架
              </button>
            </div>
            <div v-else class="flex gap-3">
              <button
                class="h-11 px-5 rounded-xl font-medium transition-fast flex items-center gap-1.5"
                :class="goods.favoritedByUser
                  ? 'bg-red-50 text-red-500 hover:bg-red-100'
                  : 'bg-apple-gray-100 text-apple-gray-600 hover:bg-apple-gray-200'"
                @click="handleLike"
              >
                <svg class="w-4 h-4" :fill="goods.favoritedByUser ? 'currentColor' : 'none'" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                {{ goods.favoritedByUser ? '已收藏' : '收藏' }}
              </button>
              <button
                class="flex-1 h-11 bg-apple-gray-800 text-white rounded-xl font-medium hover:bg-apple-gray-900 transition-fast flex items-center justify-center gap-2"
                @click="handleChat"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                与卖家沟通
              </button>
              <!-- 买家视角：根据订单状态显示 -->
              <button
                v-if="goods.myOrderStatus === 'pending'"
                class="h-11 px-5 bg-yellow-500 text-white rounded-xl font-medium hover:bg-yellow-600 transition-fast"
                @click="router.push(`/orders/${goods.myOrderId}`)"
              >
                去付款
              </button>
              <button
                v-else-if="goods.myOrderStatus === 'paid'"
                class="h-11 px-5 bg-apple-gray-200 text-apple-gray-600 rounded-xl font-medium"
                @click="router.push(`/orders/${goods.myOrderId}`)"
              >
                待发货
              </button>
              <button
                v-else-if="goods.myOrderStatus === 'shipped'"
                class="h-11 px-5 bg-purple-500 text-white rounded-xl font-medium hover:bg-purple-600 transition-fast"
                @click="router.push(`/orders/${goods.myOrderId}`)"
              >
                确认收货
              </button>
              <!-- 其他人视角：已卖出 -->
              <button
                v-else-if="goods.status === 'sold'"
                class="h-11 px-5 bg-apple-gray-200 text-apple-gray-500 rounded-xl font-medium cursor-not-allowed flex items-center gap-1.5"
                disabled
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
                已卖出
              </button>
              <button
                v-else
                class="h-11 px-5 bg-klein-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-fast"
                @click="handleBuy"
              >
                直接购买
              </button>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar from '../../components/layout/NavBar.vue'
import { getGoodsDetail, deleteGoods, favoriteGoods, unfavoriteGoods } from '../../api/modules/market'
import { userStore } from '../../stores/user'
import { useToast } from '../../composables/useToast'
import type { SecondHandGoods } from '../../api/modules/market'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const goods = ref<SecondHandGoods | null>(null)
const isLoading = ref(true)
const currentImageIndex = ref(0)

function prevImage() {
  if (!goods.value?.images?.length) return
  currentImageIndex.value = (currentImageIndex.value - 1 + goods.value.images.length) % goods.value.images.length
}

function nextImage() {
  if (!goods.value?.images?.length) return
  currentImageIndex.value = (currentImageIndex.value + 1) % goods.value.images.length
}

let touchStartX = 0
let touchStartY = 0

function onTouchStart(e: TouchEvent) {
  touchStartX = e.touches[0].clientX
  touchStartY = e.touches[0].clientY
}

function onTouchMove(e: TouchEvent) {
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

const isOwner = computed(() => {
  return goods.value?.userId === userStore.state.userId
})

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const date = new Date(dateStr)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function goToUser() {
  if (!goods.value) return
  router.push({
    path: `/community/user/${goods.value.userId}`,
    query: {
      nickname: goods.value.userNickname,
      avatar: goods.value.userAvatar,
    }
  })
}

async function handleLike() {
  if (!userStore.isLoggedIn.value) {
    userStore.showLoginModal.value = true
    return
  }
  if (!goods.value) return

  const wasFavorited = goods.value.favoritedByUser
  // 乐观更新
  goods.value.favoritedByUser = !wasFavorited

  try {
    if (wasFavorited) {
      await unfavoriteGoods(goods.value.id)
      toast.success('已取消收藏')
    } else {
      await favoriteGoods(goods.value.id)
      toast.success('已收藏')
    }
  } catch (error) {
    // 回滚
    goods.value.favoritedByUser = wasFavorited
    toast.error('操作失败')
  }
}

function handleChat() {
  if (!userStore.isLoggedIn.value) {
    userStore.showLoginModal.value = true
    return
  }
  if (!goods.value) return

  router.push({
    path: `/chat/${goods.value.userId}`,
    query: {
      goodsId: goods.value.id,
      nickname: goods.value.userNickname,
      avatar: goods.value.userAvatar,
    }
  })
}

async function handleBuy() {
  if (!userStore.isLoggedIn.value) {
    userStore.showLoginModal.value = true
    return
  }
  if (!goods.value) return
  router.push(`/order/confirm/${goods.value.id}?type=secondhand`)
}

async function handleDelete() {
  if (!goods.value) return
  if (!confirm('确定要下架这件商品吗？')) return

  try {
    await deleteGoods(goods.value.id)
    toast.success('已下架')
    router.push('/market')
  } catch (error) {
    toast.error('操作失败')
  }
}

async function loadGoods() {
  const id = Number(route.params.id)
  if (!id) {
    isLoading.value = false
    return
  }

  isLoading.value = true
  currentImageIndex.value = 0
  try {
    goods.value = await getGoodsDetail(id)
  } catch (error) {
    console.error('加载商品详情失败:', error)
  } finally {
    isLoading.value = false
  }
}

watch(() => route.params.id, () => {
  loadGoods()
})

onMounted(() => {
  loadGoods()
})
</script>
