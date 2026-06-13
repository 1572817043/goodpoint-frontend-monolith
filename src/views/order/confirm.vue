<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar title="确认订单" />

    <main class="pt-16 pb-24">
      <div class="max-w-lg mx-auto px-4">

        <!-- 收货地址 -->
        <div class="bg-white rounded-2xl shadow-sm p-4 mt-4" @click="showAddressPicker = true">
          <div v-if="selectedAddress" class="flex items-start justify-between">
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2 mb-1">
                <span class="text-sm font-medium text-apple-gray-800">{{ selectedAddress.name }}</span>
                <span class="text-sm text-apple-gray-500">{{ selectedAddress.phone }}</span>
              </div>
              <p class="text-sm text-apple-gray-500 leading-relaxed">
                {{ selectedAddress.fullAddress }}
              </p>
            </div>
            <svg class="w-4 h-4 text-apple-gray-300 shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
            </svg>
          </div>
          <div v-else class="flex items-center justify-center py-4">
            <svg class="w-5 h-5 text-apple-gray-300 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span class="text-sm text-apple-gray-400">请添加收货地址</span>
          </div>
        </div>

        <!-- 商品信息 -->
        <div v-if="goodsInfo" class="bg-white rounded-2xl shadow-sm p-4 mt-3">
          <div class="flex gap-3">
            <img
              :src="goodsInfo.image"
              :alt="goodsInfo.title"
              class="w-20 h-20 rounded-xl object-cover shrink-0"
            />
            <div class="flex-1 min-w-0">
              <h3 class="text-sm font-medium text-apple-gray-800 line-clamp-2">{{ goodsInfo.title }}</h3>
              <div class="flex items-center justify-between mt-2">
                <span class="text-base font-bold text-red-500">
                  ¥{{ goodsInfo.price?.toFixed(2) }}
                </span>
                <span v-if="goodsType === 'official'" class="text-sm text-apple-gray-400">x{{ quantity }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 商品加载中 -->
        <div v-else-if="loading" class="bg-white rounded-2xl shadow-sm p-8 mt-3 text-center">
          <div class="w-6 h-6 border-2 border-klein-blue border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>

        <!-- 优惠券（仅官方商品） -->
        <div
          v-if="goodsType === 'official'"
          class="bg-white rounded-2xl shadow-sm p-4 mt-3 cursor-pointer"
          @click="showCouponPicker = true"
        >
          <div class="flex items-center justify-between">
            <span class="text-sm text-apple-gray-700">优惠券</span>
            <div class="flex items-center gap-2">
              <span v-if="selectedCoupon" class="text-sm text-klein-blue">
                -¥{{ couponDiscount.toFixed(2) }}
              </span>
              <span v-else-if="availableCoupons.length > 0" class="text-sm text-klein-blue">
                {{ availableCoupons.length }}张可用
              </span>
              <span v-else class="text-sm text-apple-gray-400">暂无可用</span>
              <svg class="w-4 h-4 text-apple-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>

        <!-- 价格明细 -->
        <div class="bg-white rounded-2xl shadow-sm p-4 mt-3">
          <div class="space-y-2">
            <div class="flex justify-between">
              <span class="text-sm text-apple-gray-500">商品金额</span>
              <span class="text-sm text-apple-gray-700">¥{{ totalPrice.toFixed(2) }}</span>
            </div>
            <div v-if="couponDiscount > 0" class="flex justify-between">
              <span class="text-sm text-apple-gray-500">优惠券抵扣</span>
              <span class="text-sm text-red-500">-¥{{ couponDiscount.toFixed(2) }}</span>
            </div>
            <div class="border-t border-apple-gray-100 pt-2 flex justify-between">
              <span class="text-sm font-medium text-apple-gray-700">实付金额</span>
              <span class="text-lg font-bold text-red-500">¥{{ payAmount.toFixed(2) }}</span>
            </div>
          </div>
        </div>

        <!-- 底部提交栏 -->
        <div class="fixed bottom-0 left-0 right-0 bg-white border-t border-apple-gray-100 z-40">
          <div class="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
            <div>
              <span class="text-sm text-apple-gray-500">实付：</span>
              <span class="text-lg font-bold text-red-500">
                ¥{{ payAmount.toFixed(2) }}
              </span>
            </div>
            <button
              class="px-8 py-2.5 bg-klein-blue text-white rounded-xl text-sm font-medium disabled:opacity-50 active:scale-[0.98] transition-transform"
              :disabled="!selectedAddress || submitting"
              @click="handleSubmit"
            >
              {{ submitting ? '提交中...' : '提交订单' }}
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- 地址选择弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showAddressPicker" class="fixed inset-0 z-50">
          <div class="absolute inset-0 bg-black/40" @click="showAddressPicker = false"></div>
          <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-w-lg mx-auto max-h-[70vh] flex flex-col">
            <div class="flex items-center justify-between px-5 py-4 border-b border-apple-gray-100 shrink-0">
              <span class="text-base font-medium text-apple-gray-800">选择收货地址</span>
              <button @click="showAddressPicker = false">
                <svg class="w-5 h-5 text-apple-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto">
              <div v-if="addresses.length === 0" class="py-12 text-center">
                <p class="text-sm text-apple-gray-400 mb-3">暂无收货地址</p>
                <button
                  class="text-sm text-klein-blue"
                  @click="goToAddAddress"
                >
                  去添加地址
                </button>
              </div>
              <div
                v-for="addr in addresses"
                :key="addr.id"
                class="flex items-start px-5 py-3.5 border-b border-apple-gray-50 cursor-pointer hover:bg-apple-gray-50"
                @click="selectAddress(addr)"
              >
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="text-sm font-medium text-apple-gray-800">{{ addr.name }}</span>
                    <span class="text-sm text-apple-gray-500">{{ addr.phone }}</span>
                    <span
                      v-if="addr.isDefault === 1"
                      class="text-xs px-1.5 py-0.5 rounded bg-klein-blue/10 text-klein-blue"
                    >默认</span>
                  </div>
                  <p class="text-sm text-apple-gray-500">{{ addr.fullAddress }}</p>
                </div>
                <svg
                  v-if="selectedAddress?.id === addr.id"
                  class="w-5 h-5 text-klein-blue shrink-0 mt-0.5"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>

            <div class="p-4 shrink-0">
              <button
                class="w-full py-2.5 bg-apple-gray-100 text-apple-gray-600 rounded-xl text-sm"
                @click="goToAddAddress"
              >
                新增收货地址
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 优惠券选择弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showCouponPicker" class="fixed inset-0 z-50">
          <div class="absolute inset-0 bg-black/40" @click="showCouponPicker = false"></div>
          <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-w-lg mx-auto max-h-[70vh] flex flex-col">
            <div class="flex items-center justify-between px-5 py-4 border-b border-apple-gray-100 shrink-0">
              <span class="text-base font-medium text-apple-gray-800">选择优惠券</span>
              <button @click="showCouponPicker = false">
                <svg class="w-5 h-5 text-apple-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div class="flex-1 overflow-y-auto">
              <!-- 不使用优惠券 -->
              <div
                class="flex items-center px-5 py-3.5 border-b border-apple-gray-50 cursor-pointer hover:bg-apple-gray-50"
                @click="selectCoupon(null)"
              >
                <div class="flex-1">
                  <span class="text-sm text-apple-gray-700">不使用优惠券</span>
                </div>
                <svg
                  v-if="!selectedCoupon"
                  class="w-5 h-5 text-klein-blue shrink-0"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div
                v-for="coupon in availableCoupons"
                :key="coupon.id"
                class="flex items-center px-5 py-3.5 border-b border-apple-gray-50 cursor-pointer hover:bg-apple-gray-50"
                @click="selectCoupon(coupon)"
              >
                <div class="flex items-center gap-3 flex-1 min-w-0">
                  <div class="w-14 h-14 rounded-xl bg-klein-blue flex flex-col items-center justify-center shrink-0">
                    <template v-if="coupon.type === 'fixed'">
                      <span class="text-xs text-white/80">¥</span>
                      <span class="text-lg font-bold text-white">{{ coupon.discountValue }}</span>
                    </template>
                    <template v-else>
                      <span class="text-lg font-bold text-white">{{ coupon.discountValue * 10 }}</span>
                      <span class="text-xs text-white/80">折</span>
                    </template>
                  </div>
                  <div class="flex-1 min-w-0">
                    <p class="text-sm font-medium text-apple-gray-800">{{ coupon.name }}</p>
                    <p class="text-xs text-apple-gray-400 mt-0.5">满{{ coupon.minSpend }}可用</p>
                  </div>
                </div>
                <svg
                  v-if="selectedCoupon?.id === coupon.id"
                  class="w-5 h-5 text-klein-blue shrink-0"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div v-if="availableCoupons.length === 0" class="py-12 text-center">
                <p class="text-sm text-apple-gray-400">暂无可用优惠券</p>
              </div>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NavBar from '../../components/layout/NavBar.vue'
import { getOfficialGoodsDetail, getSeckillDetail } from '../../api/modules/home'
import { getGoodsDetail } from '../../api/modules/market'
import { getAddresses } from '../../api/modules/address'
import { createOrder } from '../../api/modules/order'
import { getAvailableCoupons } from '../../api/modules/coupon'
import type { Address } from '../../api/modules/address'
import type { Coupon } from '../../api/modules/coupon'
import { useToast } from '../../composables/useToast'

const route = useRoute()
const router = useRouter()
const toast = useToast()

const goodsId = Number(route.params.goodsId)
const goodsType = computed(() => (route.query.type as string) || 'official')
const quantity = computed(() => Number(route.query.quantity) || 1)
const activityId = computed(() => Number(route.query.activityId) || 0)

// 统一的商品展示信息
const goodsInfo = ref<{ title: string; image: string; price: number } | null>(null)
const addresses = ref<Address[]>([])
const selectedAddress = ref<Address | null>(null)
const showAddressPicker = ref(false)
const loading = ref(true)
const submitting = ref(false)

// 优惠券
const availableCoupons = ref<Coupon[]>([])
const selectedCoupon = ref<Coupon | null>(null)
const showCouponPicker = ref(false)

const totalPrice = computed(() => {
  if (!goodsInfo.value) return 0
  if (goodsType.value === 'official') {
    return goodsInfo.value.price * quantity.value
  }
  return goodsInfo.value.price
})

const couponDiscount = computed(() => {
  if (!selectedCoupon.value) return 0
  const coupon = selectedCoupon.value
  if (coupon.type === 'fixed') {
    return Math.min(coupon.discountValue, totalPrice.value)
  } else {
    return totalPrice.value * (1 - coupon.discountValue)
  }
})

const payAmount = computed(() => {
  return Math.max(0, totalPrice.value - couponDiscount.value)
})

async function loadData() {
  loading.value = true
  try {
    const addrList = await getAddresses()
    addresses.value = addrList
    const defaultAddr = addrList.find(a => a.isDefault === 1)
    if (defaultAddr) {
      selectedAddress.value = defaultAddr
    } else if (addrList.length > 0) {
      selectedAddress.value = addrList[0]
    }

    if (goodsType.value === 'official') {
      const goods = await getOfficialGoodsDetail(goodsId)
      goodsInfo.value = {
        title: goods.name,
        image: goods.cover,
        price: goods.price,
      }
      // 加载可用优惠券
      const amount = goodsInfo.value.price * quantity.value
      availableCoupons.value = await getAvailableCoupons(amount)
    } else if (goodsType.value === 'seckill' && activityId.value) {
      const activity = await getSeckillDetail(activityId.value)
      goodsInfo.value = {
        title: activity.goods?.name || '',
        image: activity.goods?.cover || '',
        price: activity.seckillPrice,
      }
    } else {
      const goods = await getGoodsDetail(goodsId)
      goodsInfo.value = {
        title: goods.title,
        image: goods.images?.[0] || '',
        price: goods.price,
      }
    }
  } catch {
    toast.error('加载失败')
  } finally {
    loading.value = false
  }
}

function selectAddress(addr: Address) {
  selectedAddress.value = addr
  showAddressPicker.value = false
}

function goToAddAddress() {
  showAddressPicker.value = false
  router.push('/address')
}

function selectCoupon(coupon: Coupon | null) {
  selectedCoupon.value = coupon
  showCouponPicker.value = false
}

async function handleSubmit() {
  if (!selectedAddress.value) {
    toast.error('请选择收货地址')
    return
  }
  submitting.value = true
  try {
    await createOrder({
      goodsId,
      goodsType: goodsType.value as 'official' | 'secondhand' | 'seckill',
      quantity: goodsType.value === 'official' ? quantity.value : undefined,
      addressId: selectedAddress.value.id,
      activityId: goodsType.value === 'seckill' ? activityId.value : undefined,
      userCouponId: selectedCoupon.value?.id,
    })
    toast.success('下单成功')
    router.replace('/orders')
  } catch {
    toast.error('下单失败')
  } finally {
    submitting.value = false
  }
}

onMounted(loadData)
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
