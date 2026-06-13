<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar />

    <main class="pt-16 pb-8">
      <div class="max-w-md mx-auto px-4">

        <!-- 返回按钮 + 标题 -->
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
          <h1 class="text-xl font-bold text-apple-gray-800">每日签到</h1>
        </div>

        <!-- 签到统计卡片 -->
        <div class="bg-gradient-to-br from-klein-blue to-blue-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
          <div class="flex items-center justify-between mb-4">
            <div>
              <p class="text-sm opacity-80">本月签到</p>
              <p class="text-3xl font-bold mt-1">{{ signCount }} <span class="text-base font-normal opacity-80">天</span></p>
            </div>
            <div class="text-right">
              <p class="text-sm opacity-80">连续签到</p>
              <p class="text-3xl font-bold mt-1">{{ continuousDays }} <span class="text-base font-normal opacity-80">天</span></p>
            </div>
          </div>

          <!-- 签到按钮 -->
          <button
            class="w-full h-12 rounded-xl text-base font-medium transition-fast"
            :class="todaySigned
              ? 'bg-white/20 text-white/60 cursor-not-allowed'
              : 'bg-white text-klein-blue hover:bg-white/90 active:bg-white/80'"
            :disabled="todaySigned"
            @click="handleSign"
          >
            {{ todaySigned ? '今日已签到' : '立即签到' }}
          </button>
        </div>

        <!-- 签到奖励 -->
        <div class="bg-white rounded-2xl shadow-sm p-5 mb-6">
          <h3 class="text-sm font-medium text-apple-gray-800 mb-4">签到奖励</h3>
          <div class="space-y-3">
            <div
              v-for="reward in signRewards"
              :key="reward.days"
              class="flex items-center gap-3"
            >
              <div
                class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                :class="continuousDays.value >= reward.days
                  ? 'bg-klein-blue text-white'
                  : 'bg-apple-gray-100 text-apple-gray-400'"
              >
                {{ reward.days }}
              </div>
              <div class="flex-1 min-w-0">
                <p class="text-sm text-apple-gray-700">连续{{ reward.days }}天</p>
                <p class="text-xs text-apple-gray-400">{{ reward.desc }}</p>
              </div>
              <span
                class="text-xs px-2 py-0.5 rounded-full shrink-0"
                :class="continuousDays.value >= reward.days
                  ? 'bg-green-50 text-green-600'
                  : 'bg-apple-gray-50 text-apple-gray-400'"
              >
                {{ continuousDays.value >= reward.days ? '已解锁' : '未达成' }}
              </span>
            </div>
          </div>
        </div>

        <!-- 日历 -->
        <div class="bg-white rounded-2xl shadow-sm p-5">
          <!-- 月份导航 -->
          <div class="flex items-center justify-between mb-4">
            <button
              class="w-8 h-8 rounded-full hover:bg-apple-gray-100 flex items-center justify-center transition-fast"
              @click="changeMonth(-1)"
            >
              <svg class="w-4 h-4 text-apple-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <h3 class="text-sm font-medium text-apple-gray-700">{{ currentYear }}年{{ currentMonth }}月</h3>
            <button
              class="w-8 h-8 rounded-full hover:bg-apple-gray-100 flex items-center justify-center transition-fast"
              @click="changeMonth(1)"
            >
              <svg class="w-4 h-4 text-apple-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>

          <!-- 星期标题 -->
          <div class="grid grid-cols-7 gap-1 mb-2">
            <div v-for="day in weekDays" :key="day" class="text-center text-xs text-apple-gray-400 py-1">
              {{ day }}
            </div>
          </div>

          <!-- 日期格子 -->
          <div class="grid grid-cols-7 gap-1">
            <!-- 前置空白 -->
            <div v-for="i in firstDayOfWeek" :key="'empty-' + i"></div>

            <!-- 日期 -->
            <div
              v-for="day in daysInMonth"
              :key="day"
              class="aspect-square flex items-center justify-center rounded-full text-sm relative"
              :class="getDayClass(day)"
            >
              {{ day }}
              <!-- 签到标记 -->
              <div
                v-if="signedDays.has(day)"
                class="absolute -top-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full flex items-center justify-center"
              >
                <svg class="w-2 h-2 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../../components/layout/NavBar.vue'
import { signIn, getSignCount, checkSign } from '../../api/modules/sign'
import { useToast } from '../../composables/useToast'

const router = useRouter()
const toast = useToast()

const weekDays = ['日', '一', '二', '三', '四', '五', '六']
const today = new Date()

const currentYear = ref(today.getFullYear())
const currentMonth = ref(today.getMonth() + 1)
const signCount = ref(0)
const continuousDays = ref(0)
const signedDays = ref(new Set<number>())
const todaySigned = ref(false)

const signRewards = [
  { days: 3, desc: '满30减5优惠券' },
  { days: 7, desc: '满50减10优惠券' },
  { days: 14, desc: '满100减20优惠券' },
  { days: 30, desc: '满200打9折优惠券' },
]

const daysInMonth = computed(() => {
  return new Date(currentYear.value, currentMonth.value, 0).getDate()
})

const firstDayOfWeek = computed(() => {
  return new Date(currentYear.value, currentYear.value ? currentMonth.value - 1 : 0, 1).getDay()
})

const isCurrentMonth = computed(() => {
  return currentYear.value === today.getFullYear() && currentMonth.value === today.getMonth() + 1
})

function getDayClass(day: number) {
  const isToday = isCurrentMonth.value && day === today.getDate()
  const isSigned = signedDays.value.has(day)
  const isFuture = isCurrentMonth.value && day > today.getDate()

  if (isToday && isSigned) {
    return 'bg-green-50 text-green-600 font-bold'
  }
  if (isToday) {
    return 'bg-klein-blue text-white font-bold'
  }
  if (isFuture) {
    return 'text-apple-gray-300'
  }
  if (isSigned) {
    return 'text-green-600'
  }
  return 'text-apple-gray-600'
}

async function handleSign() {
  try {
    await signIn()
    todaySigned.value = true
    signCount.value++
    continuousDays.value++
    signedDays.value.add(today.getDate())
    toast.success('签到成功')
  } catch (error) {
    toast.error('签到失败')
  }
}

function changeMonth(delta: number) {
  let newMonth = currentMonth.value + delta
  let newYear = currentYear.value

  if (newMonth < 1) {
    newMonth = 12
    newYear--
  } else if (newMonth > 12) {
    newMonth = 1
    newYear++
  }

  // 不能超过当前月
  if (newYear > today.getFullYear() || (newYear === today.getFullYear() && newMonth > today.getMonth() + 1)) {
    return
  }

  currentYear.value = newYear
  currentMonth.value = newMonth
  loadMonthSignData()
}

async function loadMonthSignData() {
  signedDays.value.clear()

  // 只有当前月才从接口获取，其他月暂时不查
  if (!isCurrentMonth.value) return

  try {
    const result = await getSignCount()
    signCount.value = result.count
    continuousDays.value = result.continuous

    // 检查今天是否已签到
    todaySigned.value = await checkSign(today.getDate())

    // 查询本月每天的签到状态
    const maxDay = today.getDate()
    for (let d = 1; d <= maxDay; d++) {
      const signed = await checkSign(d)
      if (signed) {
        signedDays.value.add(d)
      }
    }
  } catch (error) {
    console.error('加载签到数据失败:', error)
  }
}

onMounted(() => {
  loadMonthSignData()
})
</script>
