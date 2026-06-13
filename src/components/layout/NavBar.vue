<template>
  <!-- 顶部导航栏 - 固定在页面顶部 -->
  <header class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-apple-gray-200">
    <div class="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
      <!-- 左侧 Logo -->
      <router-link to="/" class="flex items-center gap-2">
        <img src="/static/logo.png" alt="谷子雷达" class="w-8 h-8 rounded-lg" />
        <span class="text-lg font-semibold text-apple-gray-800">谷子雷达</span>
      </router-link>

      <!-- 中间导航链接 -->
      <nav class="hidden md:flex items-center gap-8">
        <router-link
          v-for="item in navItems"
          :key="item.path"
          :to="item.path"
          class="text-sm text-apple-gray-500 hover:text-apple-gray-800 transition-fast"
          :class="{ 'text-apple-gray-800 font-medium': $route.path === item.path }"
        >
          {{ item.name }}
        </router-link>
      </nav>

      <!-- 右侧操作区 -->
      <div class="flex items-center gap-4">
        <!-- 消息入口 -->
        <button
          v-if="userStore.isLoggedIn.value"
          class="relative text-apple-gray-500 hover:text-apple-gray-800 transition-fast"
          @click="router.push('/messages')"
        >
          <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          <span
            v-if="unreadCount > 0"
            class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center"
          >
            {{ unreadCount > 9 ? '9+' : unreadCount }}
          </span>
        </button>

        <!-- 已登录：显示用户头像和下拉菜单 -->
        <div
          v-if="userStore.isLoggedIn.value"
          class="relative group"
        >
          <div class="flex items-center gap-2 cursor-pointer" @click="router.push('/profile')">
            <img
              :src="userStore.state.avatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
              class="w-8 h-8 rounded-full"
            />
            <span class="text-sm text-apple-gray-700 hidden md:inline">
              {{ userStore.state.nickname }}
            </span>
          </div>

          <!-- 下拉菜单 -->
          <div class="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-apple-gray-200 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <!-- 用户信息 -->
            <div class="px-4 py-3 border-b border-apple-gray-100">
              <div class="flex items-center gap-3">
                <img
                  :src="userStore.state.avatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                  class="w-10 h-10 rounded-full"
                />
                <div class="min-w-0">
                  <p class="text-sm font-medium text-apple-gray-800 truncate">{{ userStore.state.nickname }}</p>
                  <p class="text-xs text-apple-gray-400">个人中心 ></p>
                </div>
              </div>
            </div>

            <!-- 快捷操作 -->
            <div class="py-2">
              <button
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-klein-blue hover:bg-apple-gray-50 transition-fast"
                @click.stop="handlePublishClick"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
                发布闲置
              </button>
            </div>

            <div class="border-t border-apple-gray-100"></div>

            <!-- 菜单项 -->
            <div class="py-2">
              <router-link
                to="/messages"
                class="flex items-center justify-between px-4 py-2.5 text-sm text-apple-gray-600 hover:bg-apple-gray-50 hover:text-apple-gray-800 transition-fast"
              >
                <div class="flex items-center gap-3">
                  <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  消息
                </div>
                <span
                  v-if="unreadCount > 0"
                  class="px-2 py-0.5 bg-red-500 text-white text-[10px] rounded-full"
                >
                  {{ unreadCount > 99 ? '99+' : unreadCount }}
                </span>
              </router-link>
              <router-link
                to="/community"
                class="flex items-center gap-3 px-4 py-2.5 text-sm text-apple-gray-600 hover:bg-apple-gray-50 hover:text-apple-gray-800 transition-fast"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
                我的帖子
              </router-link>
              <router-link
                to="/favorites"
                class="flex items-center gap-3 px-4 py-2.5 text-sm text-apple-gray-600 hover:bg-apple-gray-50 hover:text-apple-gray-800 transition-fast"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
                我的收藏
              </router-link>
              <router-link
                to="/orders"
                class="flex items-center gap-3 px-4 py-2.5 text-sm text-apple-gray-600 hover:bg-apple-gray-50 hover:text-apple-gray-800 transition-fast"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                我的订单
              </router-link>
            </div>

            <div class="border-t border-apple-gray-100"></div>

            <!-- 退出 -->
            <div class="py-2">
              <button
                class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-fast"
                @click="handleLogout"
              >
                <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                退出登录
              </button>
            </div>
          </div>
        </div>

        <!-- 未登录：登录按钮 -->
        <button
          v-else
          class="px-4 py-1.5 bg-apple-gray-800 text-white text-sm rounded-full hover:bg-apple-gray-700 transition-fast"
          @click="showLoginModal = true"
        >
          登录
        </button>
      </div>
    </div>
  </header>

  <!-- 登录弹窗 -->
  <LoginModal
    v-model:visible="showLoginModal"
    @login-success="handleLoginSuccess"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { userStore } from '../../stores/user'
import LoginModal from '../common/LoginModal.vue'
import { useToast } from '../../composables/useToast'
import { unreadCount, startPollingUnread, stopPollingUnread } from '../../stores/message'

const router = useRouter()

const toast = useToast()

/**
 * 顶部导航栏组件
 * 包含 Logo、导航链接、搜索、登录/用户信息
 */

// 导航菜单配置
const navItems = [
  { name: '首页', path: '/' },
  { name: '市场', path: '/market' },
  { name: '社区', path: '/community' },
  { name: '秒杀', path: '/seckill' },
]

// 登录弹窗状态
const showLoginModal = ref(false)

onMounted(() => {
  if (userStore.isLoggedIn.value) {
    startPollingUnread()
  }
})

onUnmounted(() => {
  stopPollingUnread()
})

// 登录成功回调
function handleLoginSuccess() {
  startPollingUnread()
}

// 发布闲置
function handlePublishClick() {
  router.push('/market')
}

// 退出登录
function handleLogout() {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    toast.success('已退出登录')
  }
}
</script>
