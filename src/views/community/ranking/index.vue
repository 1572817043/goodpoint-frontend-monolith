<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar />

    <main class="pt-16 pb-8">
      <div class="max-w-2xl mx-auto px-4">

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

        <!-- 页面标题 -->
        <div class="mb-6">
          <h1 class="text-2xl font-bold text-apple-gray-800">热门排行</h1>
          <p class="text-sm text-apple-gray-500 mt-1">点赞最多的帖子</p>
        </div>

        <!-- 加载中 -->
        <div v-if="isLoading" class="space-y-4">
          <div v-for="i in 5" :key="i" class="bg-white rounded-2xl p-4 animate-pulse">
            <div class="flex gap-4">
              <div class="w-8 h-8 bg-apple-gray-100 rounded-full"></div>
              <div class="flex-1">
                <div class="h-4 bg-apple-gray-100 rounded w-1/4 mb-2"></div>
                <div class="h-3 bg-apple-gray-100 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-apple-gray-100 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 排行列表 -->
        <div v-else-if="posts.length > 0" class="space-y-4">
          <div
            v-for="(post, index) in posts"
            :key="post.id"
            class="bg-white rounded-2xl shadow-sm overflow-hidden cursor-pointer hover:shadow-md transition-fast"
            @click="router.push(`/community/post/${post.id}`)"
          >
            <div class="p-4">
              <div class="flex items-start gap-3">
                <!-- 排名 -->
                <div
                  class="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
                  :class="index < 3 ? 'bg-red-500 text-white' : 'bg-apple-gray-100 text-apple-gray-500'"
                >
                  {{ index + 1 }}
                </div>

                <!-- 内容 -->
                <div class="flex-1 min-w-0">
                  <!-- 用户信息 -->
                  <div class="flex items-center gap-2 mb-2">
                    <img
                      :src="post.userAvatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                      class="w-6 h-6 rounded-full"
                      @error="(e: Event) => (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                    />
                    <span class="text-sm font-medium text-apple-gray-700">{{ post.userNickname }}</span>
                  </div>

                  <!-- 帖子内容 -->
                  <p class="text-sm text-apple-gray-800 line-clamp-2 mb-2">{{ post.content }}</p>

                  <!-- 图片预览 -->
                  <div v-if="post.images?.length > 0" class="mb-2">
                    <img
                      :src="post.images[0]"
                      class="w-20 h-20 object-cover rounded-lg"
                    />
                  </div>

                  <!-- 互动数据 -->
                  <div class="flex items-center gap-4 text-xs text-apple-gray-400">
                    <span class="flex items-center gap-1">
                      <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      {{ post.likesCount }}
                    </span>
                    <span>{{ formatTime(post.createdAt) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-16">
          <svg class="w-16 h-16 mx-auto text-apple-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
          </svg>
          <p class="text-apple-gray-400">暂无排行数据</p>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../../../components/layout/NavBar.vue'
import { getTopPosts } from '../../../api/modules/community'
import type { Post } from '../../../types'

const router = useRouter()

const posts = ref<Post[]>([])
const isLoading = ref(true)

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

onMounted(async () => {
  try {
    posts.value = await getTopPosts(20)
  } catch (error) {
    console.error('加载排行失败:', error)
  } finally {
    isLoading.value = false
  }
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
