<template>
  <!-- 帖子卡片 - 瀑布流布局单个卡片 -->
  <div
    class="bg-white rounded-2xl overflow-hidden shadow-sm break-inside-avoid mb-4 cursor-pointer"
    @click="goToDetail"
  >
    <!-- 图片区域 -->
    <div class="overflow-hidden relative">
      <img
        :src="post.imageUrl"
        :alt="post.content"
        class="w-full object-cover"
        :style="{ height: post.imageHeight + 'px' }"
      />
      <!-- 多图标记 -->
      <div
        v-if="post.images && post.images.length > 1"
        class="absolute top-2 right-2 px-2 py-1 bg-black/50 rounded-full flex items-center gap-1"
      >
        <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <span class="text-xs text-white">{{ post.images.length }}</span>
      </div>
    </div>

    <!-- 内容区域 -->
    <div class="p-3">
      <!-- 文字描述 - 单行截断 -->
      <p class="text-sm text-apple-gray-800 line-clamp-2 mb-2">
        {{ post.content }}
      </p>

      <!-- 标签 -->
      <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-1 mb-2">
        <span
          v-for="tag in post.tags.slice(0, 2)"
          :key="tag"
          class="text-xs text-klein-blue bg-klein-blue/10 px-2 py-0.5 rounded-full cursor-pointer hover:bg-klein-blue/20 transition-fast"
          @click.stop="goToTag(tag)"
        >
          #{{ tag }}
        </span>
      </div>

      <!-- 底部：用户信息 + 点赞 -->
      <div class="flex items-center justify-between">
        <!-- 用户头像 + 昵称 -->
        <div
          class="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-fast"
          @click.stop="goToUser"
        >
          <img
            :src="post.userAvatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
            :alt="post.userNickname"
            class="w-6 h-6 rounded-full"
            @error="(e: Event) => (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
          />
          <span class="text-xs text-apple-gray-500">{{ post.userNickname }}</span>
        </div>

        <!-- 点赞按钮 -->
        <button
          class="flex items-center gap-1 group"
          @click.stop="handleLike"
        >
          <svg
            class="w-4 h-4 transition-fast"
            :class="[
              isLiked ? 'text-red-500 like-bounce' : 'text-apple-gray-400 group-hover:text-red-400'
            ]"
            :fill="isLiked ? 'currentColor' : 'none'"
            viewBox="0 0 24 24"
            stroke="currentColor"
            stroke-width="2"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
          <span
            class="text-xs transition-fast"
            :class="isLiked ? 'text-red-500' : 'text-apple-gray-400'"
          >
            {{ likesCount }}
          </span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import type { Post } from '../../types'
import { userStore } from '../../stores/user'
import { likePost, unlikePost } from '../../api/modules/community'

const router = useRouter()

const props = defineProps<{
  post: Post
}>()

const emit = defineEmits<{
  (e: 'require-login'): void
}>()

const isLiked = ref(props.post.likedByUser)
const likesCount = ref(props.post.likesCount)

watch(() => props.post, (newPost) => {
  isLiked.value = newPost.likedByUser
  likesCount.value = newPost.likesCount
})

function goToDetail() {
  router.push(`/community/post/${props.post.id}`)
}

function goToTag(tag: string) {
  router.push(`/community/tag/${encodeURIComponent(tag)}`)
}

function goToUser() {
  router.push({
    path: `/community/user/${props.post.userId}`,
    query: {
      nickname: props.post.userNickname,
      avatar: props.post.userAvatar
    }
  })
}

async function handleLike() {
  if (!userStore.isLoggedIn.value) {
    emit('require-login')
    return
  }

  const wasLiked = isLiked.value
  isLiked.value = !wasLiked
  likesCount.value += wasLiked ? -1 : 1

  try {
    if (wasLiked) {
      await unlikePost(props.post.id)
    } else {
      await likePost(props.post.id)
    }
  } catch (error) {
    console.error('点赞请求失败:', error)
    isLiked.value = wasLiked
    likesCount.value += wasLiked ? 1 : -1
  }
}
</script>

<style scoped>
.like-bounce {
  animation: likeBounce 0.3s ease-in-out;
}

@keyframes likeBounce {
  0% { transform: scale(1); }
  50% { transform: scale(1.3); }
  100% { transform: scale(1); }
}
</style>
