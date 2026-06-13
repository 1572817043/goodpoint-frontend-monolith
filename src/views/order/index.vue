<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar />

    <main class="pt-16 pb-8">
      <div class="max-w-3xl mx-auto px-4">

        <!-- 返回 + 标题 -->
        <div class="flex items-center justify-between mb-6">
          <button
            class="flex items-center gap-2 text-sm text-apple-gray-500 hover:text-apple-gray-800 transition-fast"
            @click="router.back()"
          >
            <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
            </svg>
            返回
          </button>
          <h1 class="text-xl font-bold text-apple-gray-800">{{ isSeller ? '我的卖单' : '我的买单' }}</h1>
          <div class="w-10"></div>
        </div>

        <!-- 状态筛选 -->
        <div class="flex gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="px-4 py-2 text-sm rounded-full whitespace-nowrap transition-fast"
            :class="activeTab === tab.value
              ? 'bg-apple-gray-800 text-white'
              : 'bg-white text-apple-gray-600 hover:bg-apple-gray-100'"
            @click="activeTab = tab.value; loadOrders()"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- 加载中 -->
        <div v-if="isLoading" class="space-y-4">
          <div v-for="i in 3" :key="i" class="bg-white rounded-2xl p-4 animate-pulse">
            <div class="flex gap-4">
              <div class="w-20 h-20 bg-apple-gray-100 rounded-xl"></div>
              <div class="flex-1">
                <div class="h-4 bg-apple-gray-100 rounded w-3/4 mb-2"></div>
                <div class="h-3 bg-apple-gray-100 rounded w-1/2 mb-2"></div>
                <div class="h-4 bg-apple-gray-100 rounded w-1/4"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- 订单列表 -->
        <div v-else-if="orders.length > 0" class="space-y-4">
          <div
            v-for="order in orders"
            :key="order.id"
            class="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            <div class="p-4">
              <!-- 订单头 -->
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs text-apple-gray-400">订单号：{{ order.orderNo }}</span>
                <span
                  class="text-xs px-2 py-1 rounded-full"
                  :class="statusClass(order.status)"
                >
                  {{ statusText(order.status) }}
                </span>
              </div>

              <!-- 商品信息 -->
              <div
                class="flex gap-4 cursor-pointer"
                @click="router.push(`/orders/${order.id}`)"
              >
                <img
                  :src="order.goodsImage || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                  class="w-20 h-20 object-cover rounded-xl"
                  @error="(e: Event) => (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                />
                <div class="flex-1 min-w-0">
                  <h3 class="text-sm font-medium text-apple-gray-800 line-clamp-2">{{ order.goodsTitle }}</h3>
                  <p class="text-lg font-bold text-red-500 mt-1">¥{{ order.goodsPrice }}</p>
                  <p class="text-xs text-apple-gray-400 mt-1">
                    {{ isSeller ? '买家' : '卖家' }}：{{ isSeller ? '用户' : order.sellerNickname }}
                  </p>
                </div>
              </div>

              <!-- 操作按钮 -->
              <div class="flex justify-end gap-3 mt-4">
                <!-- 买家操作 -->
                <template v-if="!isSeller">
                  <button
                    v-if="order.status === 'pending'"
                    class="px-4 py-2 text-sm rounded-full bg-apple-gray-100 text-apple-gray-600 hover:bg-apple-gray-200 transition-fast"
                    @click="handleCancel(order.id)"
                  >
                    取消订单
                  </button>
                  <button
                    v-if="order.status === 'pending'"
                    class="px-4 py-2 text-sm rounded-full bg-klein-blue text-white hover:bg-blue-600 transition-fast"
                    @click="handlePay(order.id)"
                  >
                    去付款
                  </button>
                  <button
                    v-if="order.status === 'shipped'"
                    class="px-4 py-2 text-sm rounded-full bg-klein-blue text-white hover:bg-blue-600 transition-fast"
                    @click="handleConfirm(order.id)"
                  >
                    确认收货
                  </button>
                </template>

                <!-- 卖家操作 -->
                <template v-if="isSeller">
                  <button
                    v-if="order.status === 'paid'"
                    class="px-4 py-2 text-sm rounded-full bg-klein-blue text-white hover:bg-blue-600 transition-fast"
                    @click="router.push(`/orders/${order.id}`)"
                  >
                    发货
                  </button>
                  <button
                    v-if="order.status === 'shipped'"
                    class="px-4 py-2 text-sm rounded-full bg-apple-gray-100 text-apple-gray-600 hover:bg-apple-gray-200 transition-fast"
                    @click="router.push(`/orders/${order.id}`)"
                  >
                    查看物流
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="text-center py-16">
          <svg class="w-16 h-16 mx-auto text-apple-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <p class="text-apple-gray-400">{{ isSeller ? '暂无卖单' : '暂无买单' }}</p>
        </div>

        <!-- 加载更多 -->
        <div v-if="orders.length > 0 && orders.length < total" class="mt-8 text-center">
          <button
            class="px-8 py-2.5 bg-white text-apple-gray-600 rounded-full text-sm hover:bg-apple-gray-100 transition-fast"
            @click="loadMore"
            :disabled="isLoading"
          >
            {{ isLoading ? '加载中...' : '加载更多' }}
          </button>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar from '../../components/layout/NavBar.vue'
import { getMyOrders, getMySales, payOrder, confirmReceive, cancelOrder } from '../../api/modules/order'
import { useToast } from '../../composables/useToast'
import type { Order } from '../../api/modules/order'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const tabs = [
  { label: '全部', value: '' },
  { label: '待付款', value: 'pending' },
  { label: '已付款', value: 'paid' },
  { label: '已发货', value: 'shipped' },
  { label: '已完成', value: 'completed' },
]

const activeTab = ref('')
const isSeller = computed(() => route.path === '/sales')
const orders = ref<Order[]>([])
const page = ref(1)
const total = ref(0)
const isLoading = ref(false)

function statusText(status: string) {
  const map: Record<string, string> = {
    pending: '待付款',
    paid: '已付款',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消',
  }
  return map[status] || status
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-600',
    paid: 'bg-blue-50 text-blue-600',
    shipped: 'bg-purple-50 text-purple-600',
    completed: 'bg-green-50 text-green-600',
    cancelled: 'bg-apple-gray-100 text-apple-gray-500',
  }
  return map[status] || 'bg-apple-gray-100 text-apple-gray-500'
}

async function loadOrders() {
  isLoading.value = true
  page.value = 1
  try {
    const params = { page: page.value, pageSize: 10, status: activeTab.value || undefined }
    const result = isSeller.value
      ? await getMySales(params)
      : await getMyOrders(params)
    orders.value = result.list
    total.value = result.total
  } catch (error) {
    console.error('加载订单失败:', error)
  } finally {
    isLoading.value = false
  }
}

async function loadMore() {
  if (isLoading.value) return
  isLoading.value = true
  page.value++
  try {
    const params = { page: page.value, pageSize: 10, status: activeTab.value || undefined }
    const result = isSeller.value
      ? await getMySales(params)
      : await getMyOrders(params)
    orders.value.push(...result.list)
  } catch (error) {
    page.value--
  } finally {
    isLoading.value = false
  }
}

async function handlePay(orderId: number) {
  if (!confirm('确认付款？')) return
  try {
    await payOrder(orderId)
    toast.success('付款成功')
    loadOrders()
  } catch (error) {
    toast.error('操作失败')
  }
}

async function handleConfirm(orderId: number) {
  try {
    await confirmReceive(orderId)
    toast.success('已确认收货')
    loadOrders()
  } catch (error) {
    toast.error('操作失败')
  }
}

async function handleCancel(orderId: number) {
  if (!confirm('确定要取消订单吗？')) return
  try {
    await cancelOrder(orderId)
    toast.success('订单已取消')
    loadOrders()
  } catch (error) {
    toast.error('操作失败')
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
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
