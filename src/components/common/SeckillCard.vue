<template>
  <!-- 秒杀卡片 - 带倒计时和秒杀按钮 -->
  <div
    class="bg-white rounded-2xl overflow-hidden shadow-sm border border-red-100 cursor-pointer hover:shadow-md transition-fast"
    @click="goToDetail"
  >
    <div class="flex">
      <!-- 左侧商品图片 -->
      <div class="w-32 h-32 flex-shrink-0 overflow-hidden">
        <img
          :src="activity.goods.cover"
          :alt="activity.goods.name"
          class="w-full h-full object-cover"
        />
      </div>

      <!-- 右侧信息 -->
      <div class="flex-1 p-4 flex flex-col justify-between">
        <!-- 商品名称 -->
        <h3 class="text-sm text-apple-gray-800 line-clamp-1">
          {{ activity.goods.name }}
        </h3>

        <!-- 价格信息 -->
        <div class="flex items-baseline gap-2 my-2">
          <span class="text-xl font-bold text-red-500">
            ¥{{ activity.seckillPrice }}
          </span>
          <span class="text-xs text-apple-gray-400 line-through">
            ¥{{ activity.goods.originalPrice }}
          </span>
        </div>

        <!-- 底部：库存和按钮 -->
        <div class="flex items-center justify-between">
          <!-- 库存进度条 -->
          <div class="flex-1 mr-4">
            <div class="h-2 bg-red-100 rounded-full overflow-hidden">
              <div
                class="h-full bg-red-500 rounded-full transition-all duration-500"
                :style="{ width: stockPercent + '%' }"
              ></div>
            </div>
            <div class="text-xs text-apple-gray-400 mt-1">
              剩余 {{ activity.remainStock }} 件
            </div>
          </div>

          <!-- 秒杀按钮 -->
          <button
            class="px-4 py-1.5 text-sm rounded-full font-medium transition-fast"
            :class="{
              'bg-apple-gray-200 text-apple-gray-500 cursor-not-allowed': activity.status === 'pending',
              'bg-red-500 text-white hover:bg-red-600 active:bg-red-700': activity.status === 'active',
              'bg-apple-gray-200 text-apple-gray-400 cursor-not-allowed': activity.status === 'ended',
            }"
            :disabled="activity.status !== 'active'"
            @click.stop
          >
            {{ buttonText }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import type { SeckillActivity } from '../../types'

/**
 * 秒杀卡片组件
 * 展示秒杀商品信息、倒计时、库存进度
 */

const router = useRouter()

const props = defineProps<{
  activity: SeckillActivity
}>()

// 跳转到秒杀详情
function goToDetail() {
  router.push(`/seckill/${props.activity.id}`)
}

// 库存百分比
const stockPercent = computed(() => {
  return ((props.activity.totalStock - props.activity.remainStock) / props.activity.totalStock) * 100
})

// 按钮文字
const buttonText = computed(() => {
  switch (props.activity.status) {
    case 'pending':
      return '即将开始'
    case 'active':
      return '立即秒杀'
    case 'ended':
      return '已结束'
    default:
      return ''
  }
})
</script>
