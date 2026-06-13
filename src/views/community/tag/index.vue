<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar />

    <main class="pt-16 pb-8">
      <div class="max-w-6xl mx-auto px-4">

        <!-- 页面标题 -->
        <div class="mb-6">
          <button
            class="flex items-center gap-2 text-sm text-apple-gray-500 hover:text-apple-gray-800 mb-3 transition-fast"
            @click="router.push('/community')"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回社区
          </button>
          <h1 class="text-2xl font-bold text-apple-gray-800">
            <span class="text-klein-blue">#</span>{{ tagName }}
          </h1>
          <p class="text-sm text-apple-gray-500 mt-1">共 {{ total }} 篇相关帖子</p>
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
          <div v-if="isLoading" class="flex items-center justify-center gap-2">
            <svg class="w-5 h-5 animate-spin text-apple-gray-400" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
            </svg>
            <span class="text-sm text-apple-gray-400">加载中...</span>
          </div>

          <div v-else-if="noMore && posts.length > 0" class="flex items-center justify-center gap-3">
            <div class="w-16 h-px bg-apple-gray-200"></div>
            <span class="text-xs text-apple-gray-300">已经到底了</span>
            <div class="w-16 h-px bg-apple-gray-200"></div>
          </div>

          <div v-else-if="!isLoading && posts.length === 0" class="py-12">
            <svg class="w-16 h-16 mx-auto text-apple-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            <p class="text-apple-gray-400">暂无相关帖子</p>
          </div>

          <div v-else ref="sentinelRef" class="h-1"></div>
        </div>

      </div>
    </main>

    <!-- 登录弹窗 -->
    <LoginModal
      v-model:visible="showLoginModal"
      @login-success="loadPosts"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar from '../../../components/layout/NavBar.vue'
import PostCard from '../../../components/common/PostCard.vue'
import LoginModal from '../../../components/common/LoginModal.vue'
import { getPosts } from '../../../api/modules/community'
import type { Post } from '../../../types'

const router = useRouter()
const route = useRoute()

const tagName = ref('')
const posts = ref<Post[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const isLoading = ref(false)
const noMore = ref(false)
const showLoginModal = ref(false)
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
      tagName: tagName.value
    })
    if (append) {
      posts.value.push(...result.list)
    } else {
      posts.value = result.list
    }
    total.value = result.total

    if (posts.value.length >= total.value) {
      noMore.value = true
    }
  } catch (error) {
    console.error('加载帖子失败:', error)
  } finally {
    isLoading.value = false
    nextTick(() => observeSentinel())
  }
}

function loadMore() {
  if (isLoading.value || noMore.value) return
  page.value++
  loadPosts(true)
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

function init() {
  tagName.value = decodeURIComponent(route.params.tagName as string || '')
  posts.value = []
  page.value = 1
  noMore.value = false
  total.value = 0
  loadPosts()
}

watch(() => route.params.tagName, () => {
  if (route.params.tagName) {
    init()
  }
})

onMounted(() => {
  init()
})

onUnmounted(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>
