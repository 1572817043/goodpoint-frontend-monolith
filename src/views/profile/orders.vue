<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar />

    <main class="pt-16 pb-8">
      <div class="max-w-lg mx-auto px-4">

        <!-- 标题 -->
        <div class="flex items-center gap-3 mb-4">
          <button
            class="flex items-center gap-1 text-sm text-apple-gray-500 hover:text-apple-gray-800 transition-fast"
            @click="router.back()"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </button>
          <h1 class="text-xl font-bold text-apple-gray-800">我的订单</h1>
        </div>

        <!-- 状态标签 -->
        <div class="flex gap-1 mb-4 overflow-x-auto scrollbar-hide">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="px-4 py-2 text-sm rounded-full whitespace-nowrap transition-fast"
            :class="activeTab === tab.value
              ? 'bg-apple-gray-800 text-white'
              : 'bg-white text-apple-gray-600 hover:bg-apple-gray-100'"
            @click="switchTab(tab.value)"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- 加载中 -->
        <div v-if="isLoading && orders.length === 0" class="text-center py-20">
          <svg class="w-8 h-8 animate-spin text-apple-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <p class="text-sm text-apple-gray-400">加载中...</p>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!isLoading && orders.length === 0" class="text-center py-20">
          <svg class="w-16 h-16 mx-auto text-apple-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-apple-gray-400 mb-2">暂无订单</p>
          <router-link
            to="/market"
            class="inline-block mt-4 px-6 py-2 bg-klein-blue text-white rounded-full text-sm hover:bg-blue-600 transition-fast"
          >
            逛市场
          </router-link>
        </div>

        <!-- 订单列表 -->
        <div v-else class="space-y-3">
          <div
            v-for="order in orders"
            :key="order.id"
            class="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            <!-- 订单头 -->
            <div class="flex items-center justify-between px-4 py-3 border-b border-apple-gray-50">
              <span class="text-xs text-apple-gray-400">{{ order.orderNo }}</span>
              <span class="text-xs font-medium" :class="statusColor(order.status)">
                {{ statusText(order.status) }}
              </span>
            </div>

            <!-- 商品信息 -->
            <div
              class="flex gap-3 p-4 cursor-pointer hover:bg-apple-gray-50 transition-fast"
              @click="router.push(`/orders/${order.id}`)"
            >
              <img
                :src="order.goodsImage || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                :alt="order.goodsTitle"
                class="w-16 h-16 rounded-xl object-cover shrink-0"
                @error="(e) => e.target.src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
              />
              <div class="flex-1 min-w-0">
                <h3 class="text-sm text-apple-gray-800 line-clamp-1">{{ order.goodsTitle }}</h3>
                <p class="text-xs text-apple-gray-400 mt-1">卖家：{{ order.sellerNickname }}</p>
                <p class="text-sm font-bold text-red-500 mt-1">¥{{ order.goodsPrice }}</p>
              </div>
            </div>

            <!-- 操作按钮 -->
            <div class="flex items-center justify-end gap-2 px-4 py-3 border-t border-apple-gray-50">
              <span class="text-xs text-apple-gray-300 mr-auto">{{ formatDate(order.createTime) }}</span>

              <button
                v-if="order.status === 'pending'"
                class="px-4 py-1.5 text-xs rounded-full bg-apple-gray-100 text-apple-gray-500 hover:bg-apple-gray-200 transition-fast"
                @click="handleCancel(order)"
              >
                取消
              </button>
              <button
                v-if="order.status === 'pending'"
                class="px-4 py-1.5 text-xs rounded-full bg-klein-blue text-white hover:bg-blue-600 transition-fast"
                @click="handlePay(order)"
              >
                付款
              </button>

              <button
                v-if="order.status === 'paid' && isSeller(order)"
                class="px-4 py-1.5 text-xs rounded-full bg-klein-blue text-white hover:bg-blue-600 transition-fast"
                @click="handleShip(order)"
              >
                发货
              </button>

              <button
                v-if="order.status === 'shipped' && !isSeller(order)"
                class="px-4 py-1.5 text-xs rounded-full bg-klein-blue text-white hover:bg-blue-600 transition-fast"
                @click="handleConfirm(order)"
              >
                确认收货
              </button>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div v-if="orders.length > 0 && orders.length < total" class="mt-6 text-center">
          <button
            class="px-8 py-2.5 bg-white text-apple-gray-600 rounded-full text-sm hover:bg-apple-gray-100 transition-fast"
            :disabled="isLoading"
            @click="loadMore"
          >
            {{ isLoading ? '加载中...' : '加载更多' }}
          </button>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../../components/layout/NavBar.vue'
import { getMyOrders, payOrder, shipOrder, confirmReceive, cancelOrder } from '../../api/modules/order'
import { userStore } from '../../stores/user'
import { useToast } from '../../composables/useToast'
import type { Order } from '../../api/modules/order'

const router = useRouter()
const toast = useToast()

const tabs = [
  { label: '全部', value: '' },
  { label: '待付款', value: 'pending' },
  { label: '待发货', value: 'paid' },
  { label: '待收货', value: 'shipped' },
  { label: '已完成', value: 'completed' },
]

const activeTab = ref('')
const orders = ref<Order[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const isLoading = ref(false)

function isSeller(order: Order) {
  return order.sellerId === userStore.state.userId
}

function statusText(status: string) {
  const map: Record<string, string> = {
    pending: '待付款',
    paid: '待发货',
    shipped: '待收货',
    completed: '已完成',
    cancelled: '已取消',
  }
  return map[status] || status
}

function statusColor(status: string) {
  const map: Record<string, string> = {
    pending: 'text-orange-500',
    paid: 'text-blue-500',
    shipped: 'text-purple-500',
    completed: 'text-green-500',
    cancelled: 'text-apple-gray-400',
  }
  return map[status] || 'text-apple-gray-400'
}

function formatDate(dateStr: string) {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

async function loadOrders(append = false) {
  if (isLoading.value) return
  isLoading.value = true
  try {
    const params: any = { page: page.value, pageSize: pageSize.value }
    if (activeTab.value) params.status = activeTab.value
    const result = await getMyOrders(params)
    if (append) {
      orders.value.push(...result.list)
    } else {
      orders.value = result.list
    }
    total.value = result.total
  } catch (error) {
    console.error('加载订单失败:', error)
  } finally {
    isLoading.value = false
  }
}

function switchTab(value: string) {
  activeTab.value = value
  page.value = 1
  loadOrders()
}

function loadMore() {
  if (isLoading.value || orders.value.length >= total.value) return
  page.value++
  loadOrders(true)
}

async function handlePay(order: Order) {
  if (!confirm('确认付款？')) return
  try {
    await payOrder(order.id)
    order.status = 'paid'
    toast.success('付款成功')
  } catch {
    toast.error('付款失败')
  }
}

async function handleShip(order: Order) {
  if (!confirm('确认发货？')) return
  try {
    await shipOrder(order.id)
    order.status = 'shipped'
    toast.success('已发货')
  } catch {
    toast.error('发货失败')
  }
}

async function handleConfirm(order: Order) {
  if (!confirm('确认收货？')) return
  try {
    await confirmReceive(order.id)
    order.status = 'completed'
    toast.success('已确认收货')
  } catch {
    toast.error('操作失败')
  }
}

async function handleCancel(order: Order) {
  if (!confirm('确定取消订单？')) return
  try {
    await cancelOrder(order.id)
    order.status = 'cancelled'
    toast.success('订单已取消')
  } catch {
    toast.error('取消失败')
  }
}

onMounted(() => {
  loadOrders()
})
</script>

<style scoped>
.scrollbar-hide::-webkit-scrollbar {
  display: none;
}
.scrollbar-hide {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
