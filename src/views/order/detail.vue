<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar title="订单详情" />

    <main class="pt-16 pb-24">
      <div class="max-w-lg mx-auto px-4">

        <!-- 加载中 -->
        <div v-if="loading" class="space-y-4 mt-4">
          <div class="bg-white rounded-2xl p-6 animate-pulse">
            <div class="h-6 bg-apple-gray-100 rounded w-1/3 mb-4"></div>
            <div class="h-4 bg-apple-gray-100 rounded w-2/3"></div>
          </div>
        </div>

        <template v-else-if="order">
          <!-- 订单状态 -->
          <div class="bg-white rounded-2xl shadow-sm p-5 mt-4">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full flex items-center justify-center"
                :class="statusIconClass(order.status)"
              >
                <svg v-if="order.status === 'pending'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else-if="order.status === 'paid'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else-if="order.status === 'shipped'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
                <svg v-else-if="order.status === 'completed'" class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <div>
                <p class="text-base font-medium text-apple-gray-800">{{ statusText(order.status) }}</p>
                <p class="text-xs text-apple-gray-400 mt-0.5">{{ statusDesc(order.status) }}</p>
              </div>
            </div>

            <!-- 订单进度条 -->
            <div v-if="order.status !== 'cancelled'" class="flex items-center mt-4 px-2">
              <div
                v-for="(step, index) in orderSteps"
                :key="step.label"
                class="flex items-center"
                :class="index < orderSteps.length - 1 ? 'flex-1' : ''"
              >
                <div class="flex flex-col items-center">
                  <div
                    class="w-6 h-6 rounded-full flex items-center justify-center text-xs"
                    :class="step.done ? 'bg-klein-blue text-white' : 'bg-apple-gray-100 text-apple-gray-400'"
                  >
                    <svg v-if="step.done" class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                    </svg>
                    <span v-else>{{ index + 1 }}</span>
                  </div>
                  <span class="text-xs mt-1" :class="step.done ? 'text-apple-gray-700' : 'text-apple-gray-400'">
                    {{ step.label }}
                  </span>
                </div>
                <div
                  v-if="index < orderSteps.length - 1"
                  class="flex-1 h-0.5 mx-2 mb-5"
                  :class="orderSteps[index + 1].done ? 'bg-klein-blue' : 'bg-apple-gray-200'"
                ></div>
              </div>
            </div>
          </div>

          <!-- 收货地址 -->
          <div class="bg-white rounded-2xl shadow-sm p-4 mt-3">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-apple-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-medium text-apple-gray-800">{{ order.receiverName }}</span>
                  <span class="text-sm text-apple-gray-500">{{ order.receiverPhone }}</span>
                </div>
                <p class="text-sm text-apple-gray-500">{{ order.receiverAddress }}</p>
              </div>
            </div>
          </div>

          <!-- 物流信息 -->
          <div v-if="order.trackingNumber" class="bg-white rounded-2xl shadow-sm p-4 mt-3">
            <div class="flex items-start gap-3">
              <svg class="w-5 h-5 text-apple-gray-400 shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
              </svg>
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-medium text-apple-gray-800">物流信息</span>
                  <span
                    class="text-xs px-2 py-0.5 rounded-full"
                    :class="order.status === 'completed' ? 'bg-green-50 text-green-600' : 'bg-purple-50 text-purple-600'"
                  >
                    {{ order.status === 'completed' ? '已签收' : '运输中' }}
                  </span>
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <span class="text-sm text-apple-gray-600">快递单号：</span>
                  <span class="text-sm text-apple-gray-800 font-mono">{{ order.trackingNumber }}</span>
                  <button class="text-xs text-klein-blue shrink-0" @click="copyTrackingNo">复制</button>
                </div>
              </div>
            </div>
          </div>

          <!-- 商品信息 -->
          <div
            class="bg-white rounded-2xl shadow-sm p-4 mt-3 cursor-pointer hover:bg-apple-gray-50 transition-fast"
            @click="goToGoods"
          >
            <div class="flex gap-3">
              <img
                :src="order.goodsImage || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                class="w-20 h-20 rounded-xl object-cover shrink-0"
              />
              <div class="flex-1 min-w-0">
                <h3 class="text-sm font-medium text-apple-gray-800 line-clamp-2">{{ order.goodsTitle }}</h3>
                <p class="text-lg font-bold text-red-500 mt-2">¥{{ order.goodsPrice }}</p>
              </div>
              <svg class="w-4 h-4 text-apple-gray-300 shrink-0 self-center" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          <!-- 订单信息 -->
          <div class="bg-white rounded-2xl shadow-sm p-4 mt-3">
            <h3 class="text-sm font-medium text-apple-gray-800 mb-3">订单信息</h3>
            <div class="space-y-2.5">
              <div class="flex justify-between">
                <span class="text-sm text-apple-gray-500">订单编号</span>
                <div class="flex items-center gap-2">
                  <span class="text-sm text-apple-gray-700">{{ order.orderNo }}</span>
                  <button class="text-xs text-klein-blue" @click="copyOrderNo">复制</button>
                </div>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-apple-gray-500">下单时间</span>
                <span class="text-sm text-apple-gray-700">{{ formatTime(order.createTime) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-apple-gray-500">卖家</span>
                <span class="text-sm text-apple-gray-700">{{ order.sellerNickname }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-sm text-apple-gray-500">商品金额</span>
                <span class="text-sm font-medium text-red-500">¥{{ order.goodsPrice }}</span>
              </div>
              <div v-if="order.discountAmount" class="flex justify-between">
                <span class="text-sm text-apple-gray-500">优惠券抵扣</span>
                <span class="text-sm text-red-500">-¥{{ order.discountAmount }}</span>
              </div>
              <div v-if="order.payAmount" class="flex justify-between">
                <span class="text-sm text-apple-gray-500">实付金额</span>
                <span class="text-sm font-medium text-red-500">¥{{ order.payAmount }}</span>
              </div>
            </div>
          </div>
        </template>

        <!-- 发货弹窗 -->
        <Teleport to="body">
          <div
            v-if="showShipModal"
            class="fixed inset-0 z-[999] bg-black/50 flex items-end justify-center"
            @click.self="showShipModal = false"
          >
            <div class="bg-white rounded-t-2xl w-full max-w-lg p-5 pb-8">
              <div class="flex items-center justify-between mb-4">
                <h3 class="text-base font-medium text-apple-gray-800">{{ isEditShip ? '修改物流' : '确认发货' }}</h3>
                <button @click="showShipModal = false" class="text-apple-gray-400">
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <!-- 收货地址 -->
              <div class="bg-apple-gray-50 rounded-xl p-3 mb-4">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-medium text-apple-gray-800">{{ order?.receiverName }}</span>
                  <span class="text-sm text-apple-gray-500">{{ order?.receiverPhone }}</span>
                </div>
                <p class="text-sm text-apple-gray-500">{{ order?.receiverAddress }}</p>
              </div>

              <!-- 快递单号输入 -->
              <div class="mb-4">
                <label class="block text-sm text-apple-gray-600 mb-1.5">快递单号</label>
                <input
                  v-model="trackingInput"
                  type="text"
                  placeholder="请输入快递单号"
                  class="w-full h-11 px-4 bg-apple-gray-50 rounded-xl text-sm text-apple-gray-800 outline-none focus:ring-2 focus:ring-klein-blue/30 transition-fast"
                />
              </div>

              <button
                class="w-full h-11 bg-klein-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-fast"
                :disabled="!trackingInput.trim()"
                :class="!trackingInput.trim() ? 'opacity-50 cursor-not-allowed' : ''"
                @click="confirmShip"
              >
                {{ isEditShip ? '保存修改' : '确认发货' }}
              </button>
            </div>
          </div>
        </Teleport>

        <!-- 底部操作栏 -->
        <div v-if="order" class="fixed bottom-0 left-0 right-0 bg-white border-t border-apple-gray-100 z-40">
          <div class="max-w-lg mx-auto px-4 py-3 flex items-center justify-end gap-3">
            <!-- 买家操作 -->
            <template v-if="order.userId === currentUserId">
              <!-- 联系卖家（二手商品） -->
              <button
                v-if="order.sellerId != 0 && order.status !== 'cancelled' && order.status !== 'completed'"
                class="px-5 py-2 text-sm rounded-full bg-apple-gray-100 text-apple-gray-600"
                @click="contactSeller"
              >
                联系卖家
              </button>
              <button
                v-if="order.status === 'pending'"
                class="px-5 py-2 text-sm rounded-full bg-apple-gray-100 text-apple-gray-600"
                @click="handleCancel"
              >
                取消订单
              </button>
              <button
                v-if="order.status === 'pending'"
                class="px-5 py-2 text-sm rounded-full bg-klein-blue text-white"
                @click="handlePay"
              >
                去付款
              </button>
              <button
                v-if="order.status === 'shipped'"
                class="px-5 py-2 text-sm rounded-full bg-klein-blue text-white"
                @click="handleConfirm"
              >
                确认收货
              </button>
              <!-- 去评价 -->
              <button
                v-if="order.status === 'completed' && !reviewed"
                class="px-5 py-2 text-sm rounded-full bg-yellow-500 text-white"
                @click="router.push(`/review/submit/${order.id}`)"
              >
                去评价
              </button>
              <!-- 再次购买 -->
              <button
                v-if="order.status === 'completed' || order.status === 'cancelled'"
                class="px-5 py-2 text-sm rounded-full bg-klein-blue text-white"
                @click="goToGoods"
              >
                再次购买
              </button>
            </template>

            <!-- 卖家操作 -->
            <template v-if="order.sellerId === currentUserId">
              <button
                v-if="order.status === 'paid'"
                class="px-5 py-2 text-sm rounded-full bg-klein-blue text-white"
                @click="handleShip"
              >
                发货
              </button>
              <button
                v-if="order.status === 'shipped'"
                class="px-5 py-2 text-sm rounded-full bg-apple-gray-100 text-apple-gray-600"
                @click="handleCancelShip"
              >
                撤销发货
              </button>
              <button
                v-if="order.status === 'shipped'"
                class="px-5 py-2 text-sm rounded-full bg-klein-blue text-white"
                @click="handleEditTracking"
              >
                修改物流
              </button>
              <button
                v-if="order.status === 'completed' && !reviewed"
                class="px-5 py-2 text-sm rounded-full bg-yellow-500 text-white"
                @click="router.push(`/review/submit/${order.id}`)"
              >
                去评价
              </button>
            </template>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../../components/layout/NavBar.vue'
import { getOrderDetail, payOrder, shipOrder, updateTracking, cancelShip, confirmReceive, cancelOrder } from '../../api/modules/order'
import { hasReviewed } from '../../api/modules/review'
import { userStore } from '../../stores/user'
import { useToast } from '../../composables/useToast'
import type { Order } from '../../api/modules/order'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const order = ref<Order | null>(null)
const loading = ref(true)
const currentUserId = Number(userStore.state.userId)
const showShipModal = ref(false)
const isEditShip = ref(false)
const trackingInput = ref('')
const reviewed = ref(false)

const statusOrder = ['pending', 'paid', 'shipped', 'completed']

const orderSteps = computed(() => {
  if (!order.value) return []
  const currentIdx = statusOrder.indexOf(order.value.status)
  return [
    { label: '下单', done: currentIdx >= 0 },
    { label: '付款', done: currentIdx >= 1 },
    { label: '发货', done: currentIdx >= 2 },
    { label: '收货', done: currentIdx >= 3 },
  ]
})

function statusText(status: string) {
  const map: Record<string, string> = {
    pending: '待付款',
    paid: '已付款，待发货',
    shipped: '已发货',
    completed: '已完成',
    cancelled: '已取消',
  }
  return map[status] || status
}

function statusDesc(status: string) {
  const map: Record<string, string> = {
    pending: '请尽快完成付款',
    paid: '等待卖家发货',
    shipped: '请确认收货或等待自动确认',
    completed: '交易已完成',
    cancelled: '订单已取消',
  }
  return map[status] || ''
}

function statusIconClass(status: string) {
  const map: Record<string, string> = {
    pending: 'bg-yellow-50 text-yellow-500',
    paid: 'bg-blue-50 text-blue-500',
    shipped: 'bg-purple-50 text-purple-500',
    completed: 'bg-green-50 text-green-500',
    cancelled: 'bg-apple-gray-100 text-apple-gray-400',
  }
  return map[status] || 'bg-apple-gray-100 text-apple-gray-400'
}

function formatTime(time: string) {
  if (!time) return ''
  const d = new Date(time)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
}

function copyOrderNo() {
  if (!order.value) return
  navigator.clipboard.writeText(order.value.orderNo).then(() => {
    toast.success('已复制')
  })
}

function goToGoods() {
  if (!order.value) return
  if (order.value.goodsType === 'seckill') {
    router.push(`/seckill/${order.value.refId}`)
  } else if (order.value.goodsType === 'official') {
    router.push(`/official/${order.value.goodsId}`)
  } else {
    router.push(`/market/${order.value.goodsId}`)
  }
}

function contactSeller() {
  if (!order.value) return
  router.push({
    path: `/chat/${order.value.sellerId}`,
    query: {
      nickname: order.value.sellerNickname,
      avatar: order.value.sellerAvatar || '',
      goodsId: String(order.value.goodsId),
    },
  })
}

async function loadOrder() {
  const orderId = Number(route.params.id)
  try {
    order.value = await getOrderDetail(orderId)
    if (order.value?.status === 'completed') {
      reviewed.value = await hasReviewed(orderId)
    }
  } catch {
    toast.error('加载订单失败')
  } finally {
    loading.value = false
  }
}

async function handlePay() {
  if (!order.value || !confirm('确认付款？')) return
  try {
    await payOrder(order.value.id)
    toast.success('付款成功')
    loadOrder()
  } catch {
    toast.error('操作失败')
  }
}

function handleShip() {
  if (!order.value) return
  isEditShip.value = false
  trackingInput.value = ''
  showShipModal.value = true
}

function handleEditTracking() {
  if (!order.value) return
  isEditShip.value = true
  trackingInput.value = order.value.trackingNumber || ''
  showShipModal.value = true
}

async function confirmShip() {
  if (!order.value || !trackingInput.value.trim()) return
  try {
    if (isEditShip.value) {
      await updateTracking(order.value.id, trackingInput.value.trim())
      toast.success('物流信息已更新')
    } else {
      await shipOrder(order.value.id, trackingInput.value.trim())
      toast.success('已发货')
    }
    showShipModal.value = false
    loadOrder()
  } catch {
    toast.error('操作失败')
  }
}

async function handleCancelShip() {
  if (!order.value || !confirm('确定要撤销发货吗？')) return
  try {
    await cancelShip(order.value.id)
    toast.success('已撤销发货')
    loadOrder()
  } catch {
    toast.error('操作失败')
  }
}

function copyTrackingNo() {
  if (!order.value?.trackingNumber) return
  navigator.clipboard.writeText(order.value.trackingNumber).then(() => {
    toast.success('已复制')
  })
}

async function handleConfirm() {
  if (!order.value) return
  try {
    await confirmReceive(order.value.id)
    toast.success('已确认收货')
    loadOrder()
  } catch {
    toast.error('操作失败')
  }
}

async function handleCancel() {
  if (!order.value || !confirm('确定要取消订单吗？')) return
  try {
    await cancelOrder(order.value.id)
    toast.success('订单已取消')
    loadOrder()
  } catch {
    toast.error('操作失败')
  }
}

onMounted(loadOrder)
</script>
