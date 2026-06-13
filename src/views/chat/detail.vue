<template>
  <div class="h-screen bg-apple-gray-50 flex flex-col overflow-hidden">
    <!-- 顶部导航 -->
    <div class="bg-white/80 backdrop-blur-lg border-b border-apple-gray-100 px-4 py-3 flex items-center gap-3 sticky top-0 z-50">
      <button
        class="text-apple-gray-500 hover:text-apple-gray-800 transition-fast"
        @click="router.back()"
      >
        <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <img
        :src="otherAvatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
        class="w-8 h-8 rounded-full cursor-pointer"
        @error="(e: Event) => (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
        @click="goToUser()"
      />
      <div class="flex-1 min-w-0 cursor-pointer" @click="goToUser()">
        <p class="text-sm font-medium text-apple-gray-800 truncate">{{ otherNickname }}</p>
      </div>
    </div>

    <!-- 商品卡片（置顶） -->
    <div
      v-if="goodsInfo"
      class="bg-white border-b border-apple-gray-100 px-4 py-3 hover:bg-apple-gray-50 transition-fast"
    >
      <div class="flex items-center gap-3 max-w-2xl mx-auto">
        <img
          v-if="goodsInfo.images?.[0]"
          :src="goodsInfo.images[0]"
          class="w-12 h-12 rounded-lg object-cover cursor-pointer"
          @click="router.push(`/market/${goodsInfo.id}`)"
        />
        <div class="flex-1 min-w-0 cursor-pointer" @click="router.push(`/market/${goodsInfo.id}`)">
          <p class="text-sm text-apple-gray-800 truncate">{{ goodsInfo.title }}</p>
          <p class="text-sm font-bold text-red-500">¥{{ goodsInfo.price }}</p>
        </div>
        <!-- 买家视角：根据订单状态 -->
        <button
          v-if="goodsInfo.myOrderStatus === 'pending'"
          class="shrink-0 h-8 px-4 bg-yellow-500 text-white text-xs rounded-full font-medium hover:bg-yellow-600 transition-fast"
          @click.stop="router.push(`/orders/${goodsInfo.myOrderId}`)"
        >
          去付款
        </button>
        <button
          v-else-if="goodsInfo.myOrderStatus === 'paid'"
          class="shrink-0 h-8 px-4 bg-apple-gray-200 text-apple-gray-600 text-xs rounded-full font-medium"
          @click.stop="router.push(`/orders/${goodsInfo.myOrderId}`)"
        >
          待发货
        </button>
        <button
          v-else-if="goodsInfo.myOrderStatus === 'shipped'"
          class="shrink-0 h-8 px-4 bg-purple-500 text-white text-xs rounded-full font-medium hover:bg-purple-600 transition-fast"
          @click.stop="router.push(`/orders/${goodsInfo.myOrderId}`)"
        >
          确认收货
        </button>
        <!-- 其他用户：可购买 -->
        <button
          v-else-if="goodsInfo.userId !== currentUserId && goodsInfo.status !== 'sold'"
          class="shrink-0 h-8 px-4 bg-klein-blue text-white text-xs rounded-full font-medium hover:bg-blue-600 transition-fast"
          @click.stop="handleBuy"
        >
          立即购买
        </button>
        <span
          v-else-if="goodsInfo.status === 'sold'"
          class="shrink-0 h-8 px-3 flex items-center bg-apple-gray-100 text-apple-gray-400 text-xs rounded-full"
        >
          已卖出
        </span>
      </div>
    </div>

    <!-- 消息列表 -->
    <div
      ref="messagesContainer"
      class="flex-1 overflow-y-auto px-4 py-4"
      @scroll="onScroll"
    >
      <div class="max-w-2xl mx-auto space-y-4">
        <div
          v-for="msg in messages"
          :key="msg.id"
          class="flex gap-3"
          :class="msg.fromUserId === currentUserId ? 'flex-row-reverse' : ''"
        >
          <!-- 头像 -->
          <img
            :src="msg.fromAvatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
            class="w-8 h-8 rounded-full flex-shrink-0"
            :class="msg.fromUserId !== currentUserId ? 'cursor-pointer' : ''"
            @error="(e: Event) => (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
            @click="msg.fromUserId !== currentUserId && goToUser()"
          />

          <!-- 消息气泡 -->
          <div
            class="max-w-[70%] rounded-2xl"
            :class="msg.type === 1
              ? (msg.fromUserId === currentUserId ? 'rounded-tr-md' : 'rounded-tl-md')
              : 'px-4 py-2.5 text-sm ' + (msg.fromUserId === currentUserId ? 'bg-klein-blue text-white rounded-tr-md' : 'bg-white text-apple-gray-800 rounded-tl-md shadow-sm')"
          >
            <img
              v-if="msg.type === 1"
              :src="msg.content"
              class="max-w-full rounded-2xl cursor-pointer"
              :class="msg.fromUserId === currentUserId ? 'rounded-tr-md' : 'rounded-tl-md'"
              @click="previewImage = msg.content"
            />
            <p v-else class="whitespace-pre-wrap break-words">{{ msg.content }}</p>
          </div>
        </div>

        <!-- 加载中 -->
        <div v-if="isLoading" class="text-center py-4">
          <svg class="w-6 h-6 animate-spin text-apple-gray-400 mx-auto" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>
      </div>
    </div>

    <!-- 输入框 -->
    <div class="bg-white/80 backdrop-blur-lg border-t border-apple-gray-100 px-4 py-3 sticky bottom-0">
      <div class="max-w-2xl mx-auto flex gap-3 items-center">
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleImageSelect"
        />
        <button
          class="w-10 h-10 flex items-center justify-center text-apple-gray-500 hover:text-apple-gray-800 transition-fast disabled:opacity-50"
          :disabled="isUploading"
          @click="fileInput?.click()"
        >
          <svg v-if="!isUploading" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <svg v-else class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </button>
        <input
          v-model="inputText"
          type="text"
          placeholder="输入消息..."
          class="flex-1 h-10 px-4 bg-apple-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-klein-blue/30"
          @keyup.enter="handleSend"
        />
        <button
          class="h-10 px-5 bg-klein-blue text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-fast disabled:opacity-50"
          :disabled="!inputText.trim() || isSending"
          @click="handleSend"
        >
          发送
        </button>
      </div>
    </div>

    <!-- 图片预览 -->
    <Teleport to="body">
      <div
        v-if="previewImage"
        class="fixed inset-0 z-[999] bg-black/90 flex items-center justify-center"
        @click="previewImage = ''"
      >
        <img
          :src="previewImage"
          class="max-w-[90vw] max-h-[90vh] object-contain"
          @click.stop
        />
        <button
          class="absolute top-4 right-4 w-10 h-10 flex items-center justify-center text-white/80 hover:text-white"
          @click="previewImage = ''"
        >
          <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { getMessages, sendMessage, markAsRead } from '../../api/modules/message'
import { getGoodsDetail as getGoods } from '../../api/modules/market'
import { uploadImage } from '../../api/modules/upload'
import { userStore } from '../../stores/user'
import { unreadCount } from '../../stores/message'
import { connectWebSocket, onWsMessage } from '../../utils/websocket'
import { useToast } from '../../composables/useToast'
import type { Message } from '../../api/modules/message'
import type { SecondHandGoods } from '../../api/modules/market'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const currentUserId = userStore.state.userId
const otherUserId = ref(0)
const otherNickname = ref('')
const otherAvatar = ref('')
const goodsId = ref(0)
const goodsInfo = ref<SecondHandGoods | null>(null)

const messages = ref<Message[]>([])
const inputText = ref('')
const isLoading = ref(true)
const isSending = ref(false)
const isUploading = ref(false)
const previewImage = ref('')
const messagesContainer = ref<HTMLElement | null>(null)
const fileInput = ref<HTMLInputElement | null>(null)
let removeWsHandler: (() => void) | null = null
let chatActive = false

async function loadMessages() {
  isLoading.value = true
  try {
    messages.value = await getMessages(otherUserId.value, goodsId.value)
    doMarkAsRead()
  } catch (error) {
    console.error('加载消息失败:', error)
  } finally {
    isLoading.value = false
    chatActive = true
    nextTick(scrollToBottom)
  }
}

async function loadGoodsInfo() {
  try {
    goodsInfo.value = await getGoods(goodsId.value)
  } catch (error) {
    // 静默失败
  }
}

function handleBuy() {
  if (!userStore.isLoggedIn.value) {
    userStore.showLoginModal.value = true
    return
  }
  if (!goodsInfo.value) return
  router.push(`/order/confirm/${goodsInfo.value.id}?type=secondhand`)
}

async function handleSend() {
  const content = inputText.value.trim()
  if (!content || isSending.value) return

  isSending.value = true
  try {
    await sendMessage({
      toUserId: otherUserId.value,
      goodsId: goodsId.value,
      content,
      type: 0,
    })

    messages.value.push({
      id: Date.now(),
      fromUserId: currentUserId!,
      toUserId: otherUserId.value,
      goodsId: goodsId.value,
      content,
      type: 0,
      isRead: 0,
      createTime: new Date().toISOString(),
      fromNickname: userStore.state.nickname || '我',
      fromAvatar: userStore.state.avatar || '',
    })

    inputText.value = ''
    nextTick(scrollToBottom)
  } catch (error) {
    toast.error('发送失败')
  } finally {
    isSending.value = false
  }
}

async function handleImageSelect(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    toast.error('图片不能超过5MB')
    return
  }

  isUploading.value = true
  try {
    const url = await uploadImage(file, 'chat')
    await sendMessage({
      toUserId: otherUserId.value,
      goodsId: goodsId.value,
      content: url,
      type: 1,
    })

    messages.value.push({
      id: Date.now(),
      fromUserId: currentUserId!,
      toUserId: otherUserId.value,
      goodsId: goodsId.value,
      content: url,
      type: 1,
      isRead: 0,
      createTime: new Date().toISOString(),
      fromNickname: userStore.state.nickname || '我',
      fromAvatar: userStore.state.avatar || '',
    })

    nextTick(scrollToBottom)
  } catch (error) {
    toast.error('图片发送失败')
  } finally {
    isUploading.value = false
    input.value = ''
  }
}

function goToUser() {
  router.push({
    path: `/community/user/${otherUserId.value}`,
    query: { nickname: otherNickname.value, avatar: otherAvatar.value }
  })
}

function scrollToBottom() {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
  }
}

function onScroll() {
  // 可以在这里处理滚动加载更多历史消息
}

function setupWebSocket() {
  connectWebSocket()
  removeWsHandler = onWsMessage((data) => {
    if (data.type === 'new_message' && data.fromUserId === otherUserId.value && data.goodsId === goodsId.value) {
      messages.value.push({
        id: data.id,
        fromUserId: data.fromUserId,
        toUserId: data.toUserId,
        goodsId: data.goodsId,
        content: data.content,
        type: data.msgType || 0,
        isRead: 0,
        createTime: data.createTime,
        fromNickname: data.fromNickname,
        fromAvatar: data.fromAvatar,
      })
      nextTick(scrollToBottom)
      doMarkAsRead()
    }
    // 在当前对话页面时，忽略 stale 的未读数推送，重新标记已读
    if (data.type === 'unread_update' && chatActive) {
      doMarkAsRead()
    }
  })
}

function doMarkAsRead() {
  markAsRead(otherUserId.value, goodsId.value).then(res => {
    unreadCount.value = res.count
  })
}

function cleanupWebSocket() {
  chatActive = false
  if (removeWsHandler) {
    removeWsHandler()
    removeWsHandler = null
  }
}

function init() {
  otherUserId.value = Number(route.params.userId) || 0
  otherNickname.value = route.query.nickname as string || '用户'
  otherAvatar.value = route.query.avatar as string || ''
  goodsId.value = Number(route.query.goodsId) || 0

  if (!otherUserId.value) {
    toast.error('参数错误')
    router.back()
    return
  }

  loadMessages().then(() => setupWebSocket())
  if (goodsId.value) {
    loadGoodsInfo()
  }
}

onMounted(() => {
  if (!userStore.isLoggedIn.value) {
    router.push('/')
    return
  }
  init()
})

onUnmounted(() => {
  cleanupWebSocket()
})
</script>
