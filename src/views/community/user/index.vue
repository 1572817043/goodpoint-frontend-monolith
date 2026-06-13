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

        <!-- 用户信息卡片 -->
        <div class="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <div class="flex items-center gap-4">
            <img
              :src="userAvatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
              :alt="userNickname"
              class="w-16 h-16 rounded-full"
              @error="(e: Event) => (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
            />
            <div class="flex-1">
              <h1 class="text-xl font-bold text-apple-gray-800">{{ userNickname }}</h1>
            </div>
            <div v-if="!isSelf" class="flex items-center gap-2">
              <button
                class="px-5 py-2 rounded-full text-sm font-medium transition-fast"
                :class="isFollowed
                  ? 'bg-apple-gray-100 text-apple-gray-500 hover:bg-apple-gray-200'
                  : 'bg-klein-blue text-white hover:bg-blue-600'"
                @click="toggleFollow"
              >
                {{ isFollowed ? '已关注' : '关注' }}
              </button>
              <button
                class="px-5 py-2 bg-apple-gray-100 text-apple-gray-700 rounded-full text-sm font-medium hover:bg-apple-gray-200 transition-fast"
                @click="goToChat"
              >
                发消息
              </button>
            </div>
          </div>

          <!-- 统计栏 -->
          <div class="flex items-center justify-around mt-4 pt-4 border-t border-apple-gray-100">
            <div class="text-center">
              <p class="text-lg font-bold text-apple-gray-800">{{ postCount }}</p>
              <p class="text-xs text-apple-gray-400">帖子</p>
            </div>
            <div class="text-center">
              <p class="text-lg font-bold text-apple-gray-800">{{ goodsCount }}</p>
              <p class="text-xs text-apple-gray-400">商品</p>
            </div>
            <div class="text-center">
              <div class="flex items-center justify-center gap-1">
                <p class="text-lg font-bold text-apple-gray-800">{{ avgRating || '-' }}</p>
                <svg v-if="avgRating > 0" class="w-3.5 h-3.5 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <p class="text-xs text-apple-gray-400">{{ reviewCount }}条评价</p>
            </div>
            <div class="text-center cursor-pointer" @click="showFollowingModal = true">
              <p class="text-lg font-bold text-apple-gray-800">{{ followingCount }}</p>
              <p class="text-xs text-apple-gray-400">关注</p>
            </div>
            <div class="text-center cursor-pointer" @click="showFollowersModal = true">
              <p class="text-lg font-bold text-apple-gray-800">{{ followersCount }}</p>
              <p class="text-xs text-apple-gray-400">粉丝</p>
            </div>
          </div>
        </div>

        <!-- 标签切换 -->
        <div class="bg-white rounded-2xl shadow-sm mb-4 flex">
          <button
            class="flex-1 py-3 text-sm font-medium text-center transition-fast rounded-l-2xl"
            :class="activeTab === 'posts'
              ? 'text-klein-blue border-b-2 border-klein-blue'
              : 'text-apple-gray-500 hover:text-apple-gray-700'"
            @click="switchTab('posts')"
          >
            帖子
          </button>
          <button
            class="flex-1 py-3 text-sm font-medium text-center transition-fast"
            :class="activeTab === 'goods'
              ? 'text-klein-blue border-b-2 border-klein-blue'
              : 'text-apple-gray-500 hover:text-apple-gray-700'"
            @click="switchTab('goods')"
          >
            商品
          </button>
          <button
            class="flex-1 py-3 text-sm font-medium text-center transition-fast rounded-r-2xl"
            :class="activeTab === 'reviews'
              ? 'text-klein-blue border-b-2 border-klein-blue'
              : 'text-apple-gray-500 hover:text-apple-gray-700'"
            @click="switchTab('reviews')"
          >
            评价
          </button>
        </div>

        <!-- 帖子列表 -->
        <div v-if="activeTab === 'posts'">
          <div class="columns-2 md:columns-3 gap-4">
            <PostCard
              v-for="post in posts"
              :key="post.id"
              :post="post"
              @require-login="showLoginModal = true"
            />
          </div>

          <div class="py-8 text-center">
            <div v-if="isLoadingPosts" class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5 animate-spin text-apple-gray-400" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span class="text-sm text-apple-gray-400">加载中...</span>
            </div>
            <div v-else-if="postsNoMore && posts.length > 0" class="flex items-center justify-center gap-3">
              <div class="w-16 h-px bg-apple-gray-200"></div>
              <span class="text-xs text-apple-gray-300">已经到底了</span>
              <div class="w-16 h-px bg-apple-gray-200"></div>
            </div>
            <div v-else-if="!isLoadingPosts && posts.length === 0" class="py-12">
              <svg class="w-16 h-16 mx-auto text-apple-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              <p class="text-apple-gray-400">暂无帖子</p>
            </div>
            <div v-else ref="postSentinelRef" class="h-1"></div>
          </div>
        </div>

        <!-- 商品列表 -->
        <div v-if="activeTab === 'goods'">
          <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div
              v-for="goods in goodsList"
              :key="goods.id"
              class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-fast cursor-pointer"
              @click="router.push(`/market/${goods.id}`)"
            >
              <div class="aspect-square bg-apple-gray-100">
                <img
                  :src="goods.images?.[0] || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                  :alt="goods.title"
                  class="w-full h-full object-cover"
                />
              </div>
              <div class="p-3">
                <h3 class="text-sm font-medium text-apple-gray-800 line-clamp-2 mb-2">
                  {{ goods.title }}
                </h3>
                <span class="text-lg font-bold text-red-500">¥{{ goods.price }}</span>
              </div>
            </div>
          </div>

          <div class="py-8 text-center">
            <div v-if="isLoadingGoods" class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5 animate-spin text-apple-gray-400" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span class="text-sm text-apple-gray-400">加载中...</span>
            </div>
            <div v-else-if="goodsNoMore && goodsList.length > 0" class="flex items-center justify-center gap-3">
              <div class="w-16 h-px bg-apple-gray-200"></div>
              <span class="text-xs text-apple-gray-300">已经到底了</span>
              <div class="w-16 h-px bg-apple-gray-200"></div>
            </div>
            <div v-else-if="!isLoadingGoods && goodsList.length === 0" class="py-12">
              <svg class="w-16 h-16 mx-auto text-apple-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              <p class="text-apple-gray-400">暂无商品</p>
            </div>
            <div v-else ref="goodsSentinelRef" class="h-1"></div>
          </div>
        </div>

        <!-- 评价列表 -->
        <div v-if="activeTab === 'reviews'">
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
              <p v-if="review.content" class="text-sm text-apple-gray-600 mb-1">{{ review.content }}</p>
              <p v-if="review.goodsTitle" class="text-xs text-apple-gray-400">商品：{{ review.goodsTitle }}</p>
            </div>
          </div>

          <div class="py-8 text-center">
            <div v-if="isLoadingReviews" class="flex items-center justify-center gap-2">
              <svg class="w-5 h-5 animate-spin text-apple-gray-400" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span class="text-sm text-apple-gray-400">加载中...</span>
            </div>
            <div v-else-if="reviews.length === 0" class="py-12">
              <svg class="w-16 h-16 mx-auto text-apple-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <p class="text-apple-gray-400">暂无评价</p>
            </div>
            <div v-else-if="reviewsNoMore && reviews.length > 0" class="flex items-center justify-center gap-3">
              <div class="w-16 h-px bg-apple-gray-200"></div>
              <span class="text-xs text-apple-gray-300">已经到底了</span>
              <div class="w-16 h-px bg-apple-gray-200"></div>
            </div>
          </div>
        </div>

      </div>
    </main>

    <!-- 登录弹窗 -->
    <LoginModal
      v-model:visible="showLoginModal"
      @login-success="handleLoginSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar from '../../../components/layout/NavBar.vue'
import PostCard from '../../../components/common/PostCard.vue'
import LoginModal from '../../../components/common/LoginModal.vue'
import { getUserPosts } from '../../../api/modules/community'
import { getUserGoods } from '../../../api/modules/market'
import { getUserReviews, getReviewSummary } from '../../../api/modules/review'
import { followUser, unfollowUser, isFollowing, getFollowing, getFollowers } from '../../../api/modules/follow'
import { userStore } from '../../../stores/user'
import { useToast } from '../../../composables/useToast'
import type { Post } from '../../../types'
import type { SecondHandGoods } from '../../../api/modules/market'
import type { Review } from '../../../api/modules/review'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const userId = ref(0)
const userNickname = ref('')
const userAvatar = ref('')

// 统计数据
const postCount = ref(0)
const goodsCount = ref(0)
const followingCount = ref(0)
const followersCount = ref(0)
const reviewCount = ref(0)
const avgRating = ref(0)

// 标签切换
const activeTab = ref<'posts' | 'goods' | 'reviews'>('posts')

// 评价数据
const reviews = ref<Review[]>([])
const reviewPage = ref(1)
const isLoadingReviews = ref(false)
const reviewsNoMore = ref(false)

// 帖子数据
const posts = ref<Post[]>([])
const postPage = ref(1)
const isLoadingPosts = ref(false)
const postsNoMore = ref(false)
const postSentinelRef = ref<HTMLElement | null>(null)
let postObserver: IntersectionObserver | null = null

// 商品数据
const goodsList = ref<SecondHandGoods[]>([])
const goodsPage = ref(1)
const isLoadingGoods = ref(false)
const goodsNoMore = ref(false)
const goodsSentinelRef = ref<HTMLElement | null>(null)
let goodsObserver: IntersectionObserver | null = null

const pageSize = 12

const isFollowed = ref(false)
const isSelf = computed(() => userId.value === userStore.state.userId)
const showLoginModal = ref(false)
const showFollowingModal = ref(false)
const showFollowersModal = ref(false)

function switchTab(tab: 'posts' | 'goods' | 'reviews') {
  activeTab.value = tab
  if (tab === 'goods' && goodsList.value.length === 0) {
    loadGoods()
  }
  if (tab === 'reviews' && reviews.value.length === 0) {
    loadReviews()
  }
}

// 加载帖子
async function loadPosts(append = false) {
  if (isLoadingPosts.value) return
  if (append && postsNoMore.value) return

  isLoadingPosts.value = true
  try {
    const result = await getUserPosts(userId.value, {
      page: postPage.value,
      pageSize,
    })
    if (append) {
      posts.value.push(...result.list)
    } else {
      posts.value = result.list
    }
    postCount.value = result.total

    if (result.list.length > 0) {
      userNickname.value = result.list[0].userNickname
      userAvatar.value = result.list[0].userAvatar
    }

    if (posts.value.length >= postCount.value) {
      postsNoMore.value = true
    }
  } catch (error) {
    console.error('加载帖子失败:', error)
  } finally {
    isLoadingPosts.value = false
    nextTick(() => observePostSentinel())
  }
}

function loadMorePosts() {
  if (isLoadingPosts.value || postsNoMore.value) return
  postPage.value++
  loadPosts(true)
}

function observePostSentinel() {
  if (postObserver) postObserver.disconnect()
  if (postsNoMore.value) return

  postObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !isLoadingPosts.value && !postsNoMore.value) {
        loadMorePosts()
      }
    },
    { rootMargin: '200px' }
  )

  if (postSentinelRef.value) {
    postObserver.observe(postSentinelRef.value)
  }
}

// 加载商品
async function loadGoods(append = false) {
  if (isLoadingGoods.value) return
  if (append && goodsNoMore.value) return

  isLoadingGoods.value = true
  try {
    const result = await getUserGoods(userId.value, {
      page: goodsPage.value,
      pageSize,
    })
    if (append) {
      goodsList.value.push(...result.list)
    } else {
      goodsList.value = result.list
    }
    goodsCount.value = result.total

    if (goodsList.value.length >= goodsCount.value) {
      goodsNoMore.value = true
    }
  } catch (error) {
    console.error('加载商品失败:', error)
  } finally {
    isLoadingGoods.value = false
    nextTick(() => observeGoodsSentinel())
  }
}

function loadMoreGoods() {
  if (isLoadingGoods.value || goodsNoMore.value) return
  goodsPage.value++
  loadGoods(true)
}

function observeGoodsSentinel() {
  if (goodsObserver) goodsObserver.disconnect()
  if (goodsNoMore.value) return

  goodsObserver = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !isLoadingGoods.value && !goodsNoMore.value) {
        loadMoreGoods()
      }
    },
    { rootMargin: '200px' }
  )

  if (goodsSentinelRef.value) {
    goodsObserver.observe(goodsSentinelRef.value)
  }
}

// 加载评价
async function loadReviews(append = false) {
  if (isLoadingReviews.value) return
  if (append && reviewsNoMore.value) return

  isLoadingReviews.value = true
  try {
    const result = await getUserReviews(userId.value, { page: reviewPage.value, pageSize: 10 })
    if (append) {
      reviews.value.push(...result.list)
    } else {
      reviews.value = result.list
    }
    if (reviews.value.length >= result.total) {
      reviewsNoMore.value = true
    }
  } catch {
    // 静默
  } finally {
    isLoadingReviews.value = false
  }
}

async function loadReviewSummary() {
  try {
    const summary = await getReviewSummary(userId.value)
    reviewCount.value = summary.count
    avgRating.value = summary.avgRating
  } catch {
    // 静默
  }
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

// 关注相关
async function toggleFollow() {
  if (!userStore.isLoggedIn.value) {
    showLoginModal.value = true
    return
  }
  try {
    if (isFollowed.value) {
      await unfollowUser(userId.value)
      isFollowed.value = false
      followersCount.value = Math.max(0, followersCount.value - 1)
      toast.success('已取消关注')
    } else {
      await followUser(userId.value)
      isFollowed.value = true
      followersCount.value++
      toast.success('关注成功')
    }
  } catch (error) {
    toast.error('操作失败')
  }
}

function goToChat() {
  if (!userStore.isLoggedIn.value) {
    showLoginModal.value = true
    return
  }
  router.push({
    path: `/chat/${userId.value}`,
    query: { nickname: userNickname.value, avatar: userAvatar.value }
  })
}

async function checkFollowStatus() {
  if (!userStore.isLoggedIn.value || isSelf.value) return
  try {
    const res = await isFollowing(userId.value)
    isFollowed.value = res.isFollowing
  } catch (error) {
    // 静默失败
  }
}

async function loadFollowCounts() {
  try {
    const [following, followers] = await Promise.all([
      getFollowing(userId.value),
      getFollowers(userId.value),
    ])
    followingCount.value = following.length
    followersCount.value = followers.length
  } catch (error) {
    // 静默失败
  }
}

function handleLoginSuccess() {
  postPage.value = 1
  postsNoMore.value = false
  loadPosts()
  checkFollowStatus()
}

function init() {
  userId.value = Number(route.params.userId) || 0
  userNickname.value = route.query.nickname as string || '用户'
  userAvatar.value = route.query.avatar as string || ''

  // 重置状态
  posts.value = []
  goodsList.value = []
  reviews.value = []
  postPage.value = 1
  goodsPage.value = 1
  reviewPage.value = 1
  postsNoMore.value = false
  goodsNoMore.value = false
  reviewsNoMore.value = false
  postCount.value = 0
  goodsCount.value = 0
  followingCount.value = 0
  followersCount.value = 0
  reviewCount.value = 0
  avgRating.value = 0
  isFollowed.value = false
  activeTab.value = 'posts'

  loadPosts()
  loadFollowCounts()
  loadReviewSummary()
  checkFollowStatus()
}

watch(() => route.params.userId, () => {
  init()
})

onMounted(() => {
  init()
})

onUnmounted(() => {
  if (postObserver) postObserver.disconnect()
  if (goodsObserver) goodsObserver.disconnect()
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
