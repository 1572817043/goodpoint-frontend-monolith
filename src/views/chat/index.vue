<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar />

    <main class="pt-16 pb-8">
      <div class="max-w-2xl mx-auto px-4">

        <!-- 标题 -->
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
          <h1 class="text-xl font-bold text-apple-gray-800">消息</h1>
        </div>

        <!-- 加载中 -->
        <div v-if="isLoading" class="flex justify-center py-20">
          <svg class="w-8 h-8 animate-spin text-apple-gray-400" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>

        <!-- 会话列表 -->
        <div v-else-if="conversations.length > 0" class="space-y-2">
          <div
            v-for="conv in conversations"
            :key="conv.userId + '_' + conv.goodsId"
            class="bg-white rounded-2xl shadow-sm p-4 cursor-pointer hover:shadow-md transition-fast"
            @click="goToChat(conv)"
          >
            <div class="flex items-center gap-3">
              <!-- 头像 -->
              <div class="relative">
                <img
                  :src="conv.avatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                  class="w-12 h-12 rounded-full"
                  @error="(e: Event) => (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                />
                <span
                  v-if="conv.unreadCount > 0"
                  class="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center"
                >
                  {{ conv.unreadCount > 9 ? '9+' : conv.unreadCount }}
                </span>
              </div>

              <!-- 内容 -->
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between mb-1">
                  <span class="text-sm font-medium text-apple-gray-800">{{ conv.nickname }}</span>
                  <span class="text-xs text-apple-gray-400">{{ formatTime(conv.lastTime) }}</span>
                </div>
                <p class="text-xs text-apple-gray-500 truncate">{{ conv.lastMessageType === 1 ? '[图片]' : conv.lastMessage }}</p>
                <div v-if="conv.goodsId" class="flex items-center gap-2 mt-1.5">
                  <img
                    v-if="conv.goodsImage"
                    :src="conv.goodsImage"
                    class="w-8 h-8 rounded object-cover"
                  />
                  <span class="text-xs text-apple-gray-400 truncate">{{ conv.goodsTitle }}</span>
                </div>
                <div v-else class="mt-1.5">
                  <span class="text-xs text-apple-gray-300">私信</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-20">
          <svg class="w-16 h-16 mx-auto text-apple-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <p class="text-apple-gray-400 mb-2">暂无消息</p>
          <p class="text-sm text-apple-gray-300">对商品点击"与卖家沟通"开始聊天</p>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar from '../../components/layout/NavBar.vue'
import { getConversations } from '../../api/modules/message'
import { userStore } from '../../stores/user'
import { refreshUnreadCount } from '../../stores/message'
import { connectWebSocket, onWsMessage } from '../../utils/websocket'
import type { Conversation } from '../../api/modules/message'

const router = useRouter()
const route = useRoute()

const conversations = ref<Conversation[]>([])
const isLoading = ref(true)
let removeWsHandler: (() => void) | null = null

function formatTime(time: string): string {
  if (!time) return ''
  const date = new Date(time)
  const now = new Date()
  const diff = now.getTime() - date.getTime()

  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  if (diff < 604800000) return `${Math.floor(diff / 86400000)}天前`

  return `${date.getMonth() + 1}/${date.getDate()}`
}

function goToChat(conv: Conversation) {
  router.push({
    path: `/chat/${conv.userId}`,
    query: {
      goodsId: conv.goodsId,
      nickname: conv.nickname,
      avatar: conv.avatar,
    }
  })
}

async function loadConversations() {
  isLoading.value = true
  try {
    conversations.value = await getConversations()
  } catch (error) {
    console.error('加载会话失败:', error)
  } finally {
    isLoading.value = false
  }
}

function setupWebSocket() {
  connectWebSocket()
  removeWsHandler = onWsMessage((data) => {
    if (data.type === 'new_message') {
      // 收到新消息，刷新会话列表
      loadConversations()
    }
  })
}

// 从聊天详情返回时刷新
watch(() => route.path, (path) => {
  if (path === '/messages') {
    loadConversations()
    refreshUnreadCount()
  }
})

onMounted(() => {
  if (!userStore.isLoggedIn.value) {
    router.push('/')
    return
  }
  loadConversations().then(() => setupWebSocket())
})

onUnmounted(() => {
  if (removeWsHandler) {
    removeWsHandler()
    removeWsHandler = null
  }
})
</script>
