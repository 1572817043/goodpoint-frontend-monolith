<template>
  <!-- 商品卡片 - 圆角卡片设计，悬停有微小上浮效果 -->
  <div
    class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-default hover:-translate-y-1 cursor-pointer"
    @click="goToDetail"
  >
    <!-- 商品图片 -->
    <div class="aspect-square overflow-hidden">
      <img
        :src="goods.cover"
        :alt="goods.name"
        class="w-full h-full object-cover hover:scale-105 transition-default"
      />
    </div>

    <!-- 商品信息 -->
    <div class="p-4">
      <!-- 商品名称 -->
      <h3 class="text-sm text-apple-gray-800 line-clamp-2 mb-2">
        {{ goods.name }}
      </h3>

      <!-- 价格区域 -->
      <div class="flex items-baseline gap-2">
        <span class="text-lg font-bold text-klein-blue">
          ¥{{ goods.price }}
        </span>
        <span class="text-xs text-apple-gray-400 line-through">
          ¥{{ goods.originalPrice }}
        </span>
      </div>

      <!-- 销量信息 -->
      <div class="mt-2 text-xs text-apple-gray-400">
        已售 {{ goods.sales }} 件
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { Goods } from '../../types'

/**
 * 商品卡片组件
 * 展示商品图片、名称、价格、销量
 */

const router = useRouter()

// 接收商品数据
const props = defineProps<{
  goods: Goods
}>()

// 跳转到详情页
function goToDetail() {
  router.push(`/goods/${props.goods.id}`)
}
</script>
