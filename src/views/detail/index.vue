<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar />

    <main class="pt-16 pb-8">
      <div class="max-w-4xl mx-auto px-4">

        <!-- 返回按钮 -->
        <button
          class="flex items-center gap-2 text-sm text-apple-gray-500 hover:text-apple-gray-800 mb-6 transition-fast"
          @click="router.back()"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>

        <!-- 商品主体区域 -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div class="md:flex">
            <!-- 左侧：商品图片 -->
            <div class="md:w-1/2">
              <div class="aspect-square overflow-hidden">
                <img
                  :src="goods.cover"
                  :alt="goods.name"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>

            <!-- 右侧：商品信息 -->
            <div class="md:w-1/2 p-6 md:p-8 flex flex-col">
              <!-- 商品名称 -->
              <h1 class="text-xl md:text-2xl font-bold text-apple-gray-800 mb-4">
                {{ goods.name }}
              </h1>

              <!-- 标签 -->
              <div class="flex flex-wrap gap-2 mb-6">
                <span
                  v-for="tag in goods.tags"
                  :key="tag"
                  class="px-3 py-1 bg-apple-gray-100 text-apple-gray-600 text-xs rounded-full"
                >
                  {{ tag }}
                </span>
              </div>

              <!-- 价格区域 -->
              <div class="mb-6">
                <div class="flex items-baseline gap-3">
                  <span class="text-3xl font-bold text-klein-blue">
                    ¥{{ currentPrice }}
                  </span>
                  <span
                    v-if="isSeckill"
                    class="text-lg text-apple-gray-400 line-through"
                  >
                    ¥{{ goods.originalPrice }}
                  </span>
                  <span
                    v-if="isSeckill"
                    class="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full"
                  >
                    秒杀价
                  </span>
                </div>
              </div>

              <!-- 秒杀倒计时（仅秒杀商品显示） -->
              <div v-if="isSeckill" class="mb-6 p-4 bg-red-50 rounded-xl">
                <div class="text-sm text-red-600 mb-2 font-medium">
                  {{ seckillStatusText }}
                </div>
                <div class="flex gap-3">
                  <div
                    v-for="(unit, index) in countdownUnits"
                    :key="index"
                    class="flex flex-col items-center"
                  >
                    <div class="w-14 h-14 bg-red-500 text-white rounded-lg flex items-center justify-center text-xl font-bold">
                      {{ unit.value }}
                    </div>
                    <div class="text-xs text-apple-gray-500 mt-1">{{ unit.label }}</div>
                  </div>
                </div>
              </div>

              <!-- 库存信息 -->
              <div class="mb-6 text-sm text-apple-gray-500">
                <span>库存: {{ goods.stock }} 件</span>
                <span class="mx-3">|</span>
                <span>已售: {{ goods.sales }} 件</span>
              </div>

              <!-- 操作按钮 -->
              <div class="mt-auto flex gap-3">
                <!-- 立即抢购按钮 -->
                <button
                  class="flex-1 h-12 rounded-xl text-white font-medium transition-fast flex items-center justify-center gap-2"
                  :class="buyButtonClass"
                  :disabled="buyButtonDisabled"
                  @click="handleBuy"
                >
                  <!-- Loading 动画 -->
                  <svg
                    v-if="isLoading"
                    class="w-5 h-5 animate-spin"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <span>{{ buyButtonText }}</span>
                </button>

                <!-- 加入购物车按钮 -->
                <button class="w-12 h-12 rounded-xl bg-apple-gray-100 text-apple-gray-600 hover:bg-apple-gray-200 transition-fast flex items-center justify-center">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- 商品详情 -->
        <div class="mt-6 bg-white rounded-2xl shadow-sm p-6 md:p-8">
          <h2 class="text-lg font-bold text-apple-gray-800 mb-4">商品详情</h2>
          <div class="text-sm text-apple-gray-600 leading-relaxed">
            <p>这里是商品的详细描述区域。</p>
            <p class="mt-2">谷子（グッズ）是指动漫、游戏等二次元 IP 的周边商品，包括但不限于徽章、立牌、挂件、手办等。</p>
            <p class="mt-2">本商品为正版授权，品质保证。</p>
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
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../../components/layout/NavBar.vue'
import LoginModal from '../../components/common/LoginModal.vue'
import { userStore } from '../../stores/user'
import type { Goods } from '../../types'

/**
 * 商品详情页
 * 功能：
 * 1. 展示商品详细信息
 * 2. 秒杀倒计时（如果是秒杀商品）
 * 3. 带 Loading 状态和防抖的抢购按钮
 * 4. 登录状态检查
 */

const router = useRouter()

// 登录弹窗状态
const showLoginModal = ref(false)

// 登录成功后执行抢购
function handleLoginSuccess() {
  handleBuy()
}

// ==================== 商品数据（Mock） ====================
const goods = ref<Goods>({
  id: 101,
  name: 'EVA 初号机 限定手办 - 2026 特别版',
  cover: 'https://picsum.photos/600/600?random=10',
  price: 299,
  originalPrice: 899,
  category: '手办',
  tags: ['EVA', '初号机', '限定', '手办'],
  stock: 10,
  sales: 156,
  status: 'on_sale',
})

// 是否为秒杀商品
const isSeckill = ref(true)

// 秒杀配置
const seckillConfig = ref({
  seckillPrice: 299,
  startTime: new Date(Date.now() + 3600000).toISOString(), // 1小时后开始
  endTime: new Date(Date.now() + 7200000).toISOString(),   // 2小时后结束
  remainStock: 3,
})

// ==================== 价格计算 ====================
const currentPrice = computed(() => {
  return isSeckill.value ? seckillConfig.value.seckillPrice : goods.value.price
})

// ==================== 秒杀倒计时逻辑 ====================
// 倒计时剩余秒数
const remainSeconds = ref(0)
// 秒杀状态：pending(未开始) / active(进行中) / ended(已结束)
const seckillStatus = ref<'pending' | 'active' | 'ended'>('pending')
// 定时器 ID
let countdownTimer: number | null = null

// 计算倒计时显示的 时/分/秒
const countdownUnits = computed(() => {
  const total = remainSeconds.value
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60

  return [
    { value: String(hours).padStart(2, '0'), label: '时' },
    { value: String(minutes).padStart(2, '0'), label: '分' },
    { value: String(seconds).padStart(2, '0'), label: '秒' },
  ]
})

// 秒杀状态文案
const seckillStatusText = computed(() => {
  switch (seckillStatus.value) {
    case 'pending':
      return '距离秒杀开始还有'
    case 'active':
      return '秒杀进行中，抓紧抢购！'
    case 'ended':
      return '秒杀已结束'
    default:
      return ''
  }
})

// 更新倒计时
function updateCountdown() {
  const now = Date.now()
  const start = new Date(seckillConfig.value.startTime).getTime()
  const end = new Date(seckillConfig.value.endTime).getTime()

  if (now < start) {
    // 未开始
    seckillStatus.value = 'pending'
    remainSeconds.value = Math.floor((start - now) / 1000)
  } else if (now < end) {
    // 进行中
    seckillStatus.value = 'active'
    remainSeconds.value = Math.floor((end - now) / 1000)
  } else {
    // 已结束
    seckillStatus.value = 'ended'
    remainSeconds.value = 0
    stopCountdown()
  }
}

// 启动倒计时
function startCountdown() {
  updateCountdown()
  countdownTimer = window.setInterval(updateCountdown, 1000)
}

// 停止倒计时
function stopCountdown() {
  if (countdownTimer) {
    clearInterval(countdownTimer)
    countdownTimer = null
  }
}

// ==================== 抢购按钮逻辑（防抖 + Loading） ====================
const isLoading = ref(false)
// 防抖标记：防止重复点击
let isDebouncing = false

// 按钮文字
const buyButtonText = computed(() => {
  if (isLoading.value) return '处理中...'
  if (isSeckill.value) {
    switch (seckillStatus.value) {
      case 'pending':
        return '即将开始'
      case 'active':
        return '立即抢购'
      case 'ended':
        return '活动已结束'
    }
  }
  return '立即购买'
})

// 按钮是否禁用
const buyButtonDisabled = computed(() => {
  if (isLoading.value) return true
  if (isSeckill.value && seckillStatus.value !== 'active') return true
  return false
})

// 按钮样式
const buyButtonClass = computed(() => {
  if (buyButtonDisabled.value) {
    return 'bg-apple-gray-300 cursor-not-allowed'
  }
  if (isSeckill.value) {
    return 'bg-red-500 hover:bg-red-600'
  }
  return 'bg-klein-blue hover:bg-klein-blue/90'
})

// 处理抢购点击（带防抖）
async function handleBuy() {
  // 防抖检查：如果正在处理中或防抖中，直接返回
  if (isLoading.value || isDebouncing) return

  // 登录检查：未登录则弹出登录弹窗
  if (!userStore.isLoggedIn.value) {
    showLoginModal.value = true
    return
  }

  // 设置防抖标记
  isDebouncing = true
  isLoading.value = true

  try {
    // 模拟网络请求（1.5秒延迟）
    await new Promise(resolve => setTimeout(resolve, 1500))

    // 模拟抢购结果
    const success = Math.random() > 0.3 // 70% 成功率
    if (success) {
      alert('抢购成功！请在 15 分钟内完成支付')
    } else {
      alert('手慢了，已被抢光~')
    }
  } catch (error) {
    alert('网络错误，请重试')
  } finally {
    isLoading.value = false
    // 防抖冷却：1秒内不能再次点击
    setTimeout(() => {
      isDebouncing = false
    }, 1000)
  }
}

// ==================== 生命周期 ====================
onMounted(() => {
  if (isSeckill.value) {
    startCountdown()
  }
})

onUnmounted(() => {
  stopCountdown()
})
</script>
