<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar />

    <main class="pt-16 pb-8">
      <div class="max-w-6xl mx-auto px-4">

        <!-- 页面标题 -->
        <div class="mb-6 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-bold text-apple-gray-800">谷子社区</h1>
            <p class="text-sm text-apple-gray-500 mt-1">发现同好，分享收藏</p>
          </div>
          <router-link
            to="/community/ranking"
            class="flex items-center gap-1 px-4 py-2 bg-white rounded-full text-sm text-apple-gray-600 hover:text-klein-blue hover:bg-klein-blue/5 transition-fast"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            热门排行
          </router-link>
        </div>

        <!-- 搜索栏 -->
        <div class="mb-6">
          <div class="relative">
            <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-apple-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              v-model="searchKeyword"
              type="text"
              placeholder="搜索帖子内容..."
              class="w-full pl-10 pr-4 py-2.5 bg-white rounded-xl border border-apple-gray-200 text-sm focus:outline-none focus:border-klein-blue transition-fast"
              @keyup.enter="handleSearch"
            />
            <button
              v-if="searchKeyword"
              class="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-apple-gray-400 hover:text-apple-gray-600"
              @click="clearSearch"
            >
              清除
            </button>
          </div>
        </div>

        <!-- 瀑布流布局 -->
        <div class="columns-2 md:columns-3 gap-4">
          <PostCard
            v-for="post in posts"
            :key="post.id"
            :post="post"
            @require-login="showLoginModal = true"
          />
        </div>

        <!-- 加载状态 -->
        <div class="py-8 text-center">
          <!-- 加载中 -->
          <div v-if="isLoading" class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5 animate-spin text-apple-gray-400" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span class="text-sm text-apple-gray-400">加载中...</span>
          </div>

          <!-- 空状态 -->
          <div v-else-if="!isLoading && posts.length === 0" class="py-12">
            <svg class="w-16 h-16 mx-auto text-apple-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
            </svg>
            <p class="text-apple-gray-400 mb-2">暂无帖子</p>
            <p class="text-sm text-apple-gray-300">点击右下角按钮发布第一篇帖子</p>
          </div>

          <!-- 没有更多 -->
          <div v-else-if="noMore" class="flex items-center justify-center gap-3">
            <div class="w-16 h-px bg-apple-gray-200"></div>
            <span class="text-xs text-apple-gray-300">已经到底了</span>
            <div class="w-16 h-px bg-apple-gray-200"></div>
          </div>

          <!-- 触发加载的哨兵元素 -->
          <div v-else ref="sentinelRef" class="h-1"></div>
        </div>

      </div>
    </main>

    <!-- 发布按钮（右下角悬浮） -->
    <button
      class="fixed right-6 bottom-6 w-14 h-14 bg-klein-blue text-white rounded-full shadow-lg flex items-center justify-center hover:scale-105 transition-fast z-50"
      @click="handlePublishClick"
    >
      <svg class="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
      </svg>
    </button>

    <!-- 发布弹窗 -->
    <CommunityPublishModal
      v-model:visible="showPublishModal"
      @published="handlePublished"
    />

    <!-- 登录弹窗 -->
    <LoginModal
      v-model:visible="showLoginModal"
      @login-success="handleLoginSuccess"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import NavBar from '../../components/layout/NavBar.vue'
import PostCard from '../../components/common/PostCard.vue'
import LoginModal from '../../components/common/LoginModal.vue'
import CommunityPublishModal from '../../components/common/CommunityPublishModal.vue'
import { getPosts } from '../../api/modules/community'
import { userStore } from '../../stores/user'
import type { Post } from '../../types'

const posts = ref<Post[]>([])

const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const isLoading = ref(false)
const noMore = ref(false)
const searchKeyword = ref('')

const showLoginModal = ref(false)
const showPublishModal = ref(false)

const sentinelRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

async function loadPosts(append = false) {
  if (isLoading.value) return
  if (append && noMore.value) return

  isLoading.value = true
  try {
    const result = await getPosts({
      page: page.value,
      pageSize: pageSize.value,
      keyword: searchKeyword.value || undefined
    })
    if (append) {
      posts.value.push(...result.list)
    } else {
      posts.value = result.list
    }
    total.value = result.total

    // 判断是否还有更多
    if (posts.value.length >= total.value) {
      noMore.value = true
    }
  } catch (error) {
    console.error('加载帖子失败:', error)
  } finally {
    isLoading.value = false
    // 加载完成后重新观察哨兵
    nextTick(() => observeSentinel())
  }
}

function loadMore() {
  if (isLoading.value || noMore.value) return
  page.value++
  loadPosts(true)
}

function handleSearch() {
  page.value = 1
  noMore.value = false
  loadPosts()
}

function clearSearch() {
  searchKeyword.value = ''
  handleSearch()
}

function observeSentinel() {
  // 先断开之前的观察
  if (observer) {
    observer.disconnect()
  }

  // 没有更多数据时不观察
  if (noMore.value) return

  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting && !isLoading.value && !noMore.value) {
        loadMore()
      }
    },
    { rootMargin: '200px' } // 提前200px触发
  )

  if (sentinelRef.value) {
    observer.observe(sentinelRef.value)
  }
}

function handlePublishClick() {
  if (!userStore.isLoggedIn.value) {
    showLoginModal.value = true
    return
  }
  showPublishModal.value = true
}

function handlePublished(post: Post) {
  posts.value.unshift(post)
  total.value++
}

function handleLoginSuccess() {
  page.value = 1
  noMore.value = false
  loadPosts()
}

onMounted(() => {
  loadPosts()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>
