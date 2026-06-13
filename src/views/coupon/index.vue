<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar title="我的优惠券" />

    <main class="pt-16 pb-8">
      <div class="max-w-lg mx-auto px-4">

        <!-- Tab 切换 -->
        <div class="flex bg-white rounded-2xl p-1 mb-4 shadow-sm">
          <button
            v-for="tab in tabs"
            :key="tab.value"
            class="flex-1 py-2 text-sm rounded-xl transition-fast"
            :class="activeTab === tab.value
              ? 'bg-klein-blue text-white'
              : 'text-apple-gray-500'"
            @click="activeTab = tab.value"
          >
            {{ tab.label }}
          </button>
        </div>

        <!-- 加载中 -->
        <div v-if="loading" class="space-y-3">
          <div v-for="i in 3" :key="i" class="h-28 bg-white rounded-2xl animate-pulse"></div>
        </div>

        <!-- 空状态 -->
        <div v-else-if="couponList.length === 0" class="text-center py-16">
          <svg class="w-16 h-16 mx-auto text-apple-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
          </svg>
          <p class="text-sm text-apple-gray-400">暂无优惠券</p>
        </div>

        <!-- 优惠券列表 -->
        <div v-else class="space-y-3">
          <div
            v-for="coupon in couponList"
            :key="coupon.id"
            class="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            <div class="flex">
              <!-- 左侧金额 -->
              <div
                class="w-28 flex flex-col items-center justify-center shrink-0"
                :class="coupon.status === 'unused' ? 'bg-klein-blue' : 'bg-apple-gray-200'"
              >
                <template v-if="coupon.type === 'fixed'">
                  <span class="text-xs text-white/80">¥</span>
                  <span class="text-3xl font-bold text-white">{{ coupon.discountValue }}</span>
                </template>
                <template v-else>
                  <span class="text-3xl font-bold text-white">{{ coupon.discountValue * 10 }}</span>
                  <span class="text-xs text-white/80">折</span>
                </template>
              </div>

              <!-- 右侧信息 -->
              <div class="flex-1 p-4 flex flex-col justify-between">
                <div>
                  <h3 class="text-sm font-medium text-apple-gray-800">{{ coupon.name }}</h3>
                  <p class="text-xs text-apple-gray-400 mt-1">
                    满{{ coupon.minSpend }}元可用
                  </p>
                </div>
                <div class="flex items-center justify-between">
                  <span class="text-xs text-apple-gray-400">
                    {{ formatTime(coupon.startTime) }} - {{ formatTime(coupon.endTime) }}
                  </span>
                  <span
                    v-if="coupon.status === 'used'"
                    class="text-xs text-apple-gray-400"
                  >
                    已使用
                  </span>
                  <span
                    v-else-if="coupon.status === 'expired'"
                    class="text-xs text-apple-gray-400"
                  >
                    已过期
                  </span>
                  <button
                    v-else
                    class="text-xs text-klein-blue"
                    @click="router.push('/official')"
                  >
                    去使用
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../../components/layout/NavBar.vue'
import { getMyCoupons } from '../../api/modules/coupon'
import type { Coupon } from '../../api/modules/coupon'
import { useToast } from '../../composables/useToast'

const router = useRouter()
const toast = useToast()

const tabs = [
  { label: '未使用', value: 'unused' },
  { label: '已使用', value: 'used' },
  { label: '已过期', value: 'expired' },
]

const activeTab = ref('unused')
const couponList = ref<Coupon[]>([])
const loading = ref(true)

function formatTime(time: string) {
  if (!time) return ''
  const d = new Date(time)
  return `${d.getMonth() + 1}/${d.getDate()}`
}

async function loadCoupons() {
  loading.value = true
  try {
    couponList.value = await getMyCoupons(activeTab.value)
  } catch {
    toast.error('加载失败')
  } finally {
    loading.value = false
  }
}

watch(activeTab, loadCoupons)
onMounted(loadCoupons)
</script>
