<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar />

    <main class="pt-16 pb-8">
      <div class="max-w-2xl mx-auto px-4">

        <!-- 返回按钮 -->
        <button
          class="flex items-center gap-2 text-sm text-apple-gray-500 hover:text-apple-gray-800 mb-4 transition-fast"
          @click="router.back()"
        >
          <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          返回
        </button>

        <!-- 加载中 -->
        <div v-if="isLoading" class="flex justify-center py-20">
          <svg class="w-8 h-8 animate-spin text-apple-gray-400" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
        </div>

        <!-- 帖子内容 -->
        <div v-else-if="post" class="bg-white rounded-2xl shadow-sm overflow-hidden">
          <!-- 图片轮播 -->
          <div class="relative">
            <div class="overflow-hidden">
              <div
                class="flex transition-transform duration-300"
                :style="{ transform: `translateX(-${currentImageIndex * 100}%)` }"
              >
                <div
                  v-for="(img, index) in displayImages"
                  :key="index"
                  class="w-full flex-shrink-0"
                >
                  <img
                    :src="img"
                    class="w-full object-contain bg-black"
                    style="max-height: 500px;"
                  />
                </div>
              </div>
            </div>

            <!-- 轮播指示器 -->
            <div
              v-if="displayImages.length > 1"
              class="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2"
            >
              <button
                v-for="(_, index) in displayImages"
                :key="index"
                class="w-2 h-2 rounded-full transition-fast"
                :class="index === currentImageIndex ? 'bg-white' : 'bg-white/50'"
                @click="currentImageIndex = index"
              ></button>
            </div>

            <!-- 左右箭头 -->
            <template v-if="displayImages.length > 1">
              <button
                v-if="currentImageIndex > 0"
                class="absolute left-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-fast"
                @click="currentImageIndex--"
              >
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                v-if="currentImageIndex < displayImages.length - 1"
                class="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/30 flex items-center justify-center hover:bg-black/50 transition-fast"
                @click="currentImageIndex++"
              >
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </template>

            <!-- 图片计数 -->
            <div
              v-if="displayImages.length > 1"
              class="absolute top-4 right-4 px-2 py-1 bg-black/50 rounded-full text-xs text-white"
            >
              {{ currentImageIndex + 1 }}/{{ displayImages.length }}
            </div>
          </div>

          <!-- 内容区域 -->
          <div class="p-5">
            <!-- 用户信息 -->
            <div class="flex items-center gap-3 mb-4">
              <div
                class="flex items-center gap-3 flex-1 cursor-pointer hover:opacity-80 transition-fast"
                @click="router.push({
                  path: `/community/user/${post.userId}`,
                  query: { nickname: post.userNickname, avatar: post.userAvatar }
                })"
              >
                <img
                  :src="post.userAvatar"
                  :alt="post.userNickname"
                  class="w-10 h-10 rounded-full"
                />
                <div>
                  <p class="text-sm font-medium text-apple-gray-800">{{ post.userNickname }}</p>
                  <p class="text-xs text-apple-gray-400">{{ formatTime(post.createdAt) }}</p>
                </div>
              </div>
              <!-- 关注按钮 -->
              <button
                v-if="!isOwner"
                class="px-4 py-1.5 rounded-full text-xs font-medium transition-fast"
                :class="isFollowed
                  ? 'bg-apple-gray-100 text-apple-gray-500 hover:bg-apple-gray-200'
                  : 'bg-klein-blue text-white hover:bg-blue-600'"
                @click="toggleFollow"
              >
                {{ isFollowed ? '已关注' : '关注' }}
              </button>
            </div>

            <!-- 正文 -->
            <p class="text-apple-gray-800 leading-relaxed mb-4 whitespace-pre-wrap">{{ post.content }}</p>

            <!-- 标签 -->
            <div v-if="post.tags && post.tags.length > 0" class="flex flex-wrap gap-2 mb-4">
              <span
                v-for="tag in post.tags"
                :key="tag"
                class="text-sm text-klein-blue bg-klein-blue/10 px-3 py-1 rounded-full cursor-pointer hover:bg-klein-blue/20 transition-fast"
                @click="router.push(`/community/tag/${encodeURIComponent(tag)}`)"
              >
                #{{ tag }}
              </span>
            </div>

            <!-- 地点 -->
            <div v-if="post.location" class="flex items-center gap-2 mb-4 text-apple-gray-500">
              <svg class="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span class="text-sm">{{ post.location }}</span>
            </div>

            <!-- 分割线 -->
            <div class="border-t border-apple-gray-100 my-4"></div>

            <!-- 互动栏 -->
            <div class="flex items-center justify-between">
              <div class="flex items-center gap-2">
                <button
                  class="flex items-center gap-2 px-4 py-2 rounded-full transition-fast"
                  :class="isLiked ? 'bg-red-50 text-red-500' : 'bg-apple-gray-50 text-apple-gray-500 hover:bg-apple-gray-100'"
                  @click="handleLike"
                >
                  <svg
                    class="w-5 h-5"
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
                  <span class="text-sm">{{ likesCount }}</span>
                </button>

                <button
                  class="flex items-center gap-2 px-4 py-2 rounded-full transition-fast"
                  :class="isFavorited ? 'bg-yellow-50 text-yellow-500' : 'bg-apple-gray-50 text-apple-gray-500 hover:bg-apple-gray-100'"
                  @click="handleFavorite"
                >
                  <svg
                    class="w-5 h-5"
                    :fill="isFavorited ? 'currentColor' : 'none'"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  <span class="text-sm">{{ isFavorited ? '已收藏' : '收藏' }}</span>
                </button>

                <button
                  v-if="isOwner"
                  class="flex items-center gap-2 px-4 py-2 rounded-full bg-red-50 text-red-500 hover:bg-red-100 transition-fast"
                  @click="handleDelete"
                >
                  <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span class="text-sm">删除</span>
                </button>
              </div>
            </div>
          </div>

          <!-- 评论区 -->
          <div class="mt-4 bg-white rounded-2xl shadow-sm p-5">
            <h3 class="text-base font-bold text-apple-gray-800 mb-4">评论 ({{ commentTotal }})</h3>

            <!-- 评论输入框 -->
            <div class="flex gap-3 mb-6">
              <input
                v-model="commentContent"
                type="text"
                :placeholder="replyTo ? `回复 @${replyTo.nickname}...` : '说点什么...'"
                class="flex-1 h-10 px-4 bg-apple-gray-50 rounded-full border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm"
                @keyup.enter="submitComment"
              />
              <button
                class="px-4 h-10 bg-klein-blue text-white rounded-full text-sm font-medium hover:bg-blue-600 transition-fast disabled:opacity-50"
                :disabled="!commentContent.trim()"
                @click="submitComment"
              >
                发送
              </button>
            </div>

            <!-- 取消回复 -->
            <div v-if="replyTo" class="mb-3 flex items-center gap-2">
              <span class="text-xs text-apple-gray-400">回复 @{{ replyTo.nickname }}</span>
              <button class="text-xs text-apple-gray-400 hover:text-apple-gray-600" @click="replyTo = null">取消</button>
            </div>

            <!-- 评论列表 -->
            <div v-if="comments.length > 0" class="space-y-4">
              <div v-for="comment in comments" :key="comment.id">
                <!-- 主评论 -->
                <div class="flex gap-3">
                  <img
                    :src="comment.userAvatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                    class="w-8 h-8 rounded-full flex-shrink-0"
                    @error="(e: Event) => (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                  />
                  <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-2">
                      <span class="text-sm font-medium text-apple-gray-700">{{ comment.userNickname }}</span>
                      <span class="text-xs text-apple-gray-300">{{ formatTime(comment.createTime) }}</span>
                    </div>
                    <p class="text-sm text-apple-gray-600 mt-1">{{ comment.content }}</p>
                    <div class="flex items-center gap-3 mt-1">
                      <button
                        class="text-xs text-apple-gray-400 hover:text-klein-blue transition-fast"
                        @click="setReply(comment.id, comment.userId, comment.userNickname)"
                      >
                        回复
                      </button>
                      <button
                        v-if="comment.userId === userStore.state.userId"
                        class="text-xs text-apple-gray-400 hover:text-red-500 transition-fast"
                        @click="handleDeleteComment(comment.id)"
                      >
                        删除
                      </button>
                    </div>

                    <!-- 子评论 -->
                    <div v-if="comment.children?.length > 0" class="mt-3 space-y-3 pl-3 border-l-2 border-apple-gray-100">
                      <div v-for="child in comment.children" :key="child.id" class="flex gap-3">
                        <img
                          :src="child.userAvatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                          class="w-6 h-6 rounded-full flex-shrink-0"
                          @error="(e: Event) => (e.target as HTMLImageElement).src = 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                        />
                        <div class="flex-1 min-w-0">
                          <div class="flex items-center gap-2">
                            <span class="text-xs font-medium text-apple-gray-700">{{ child.userNickname }}</span>
                            <template v-if="child.replyUserNickname">
                              <span class="text-xs text-apple-gray-300">回复</span>
                              <span class="text-xs text-apple-gray-500">@{{ child.replyUserNickname }}</span>
                            </template>
                            <span class="text-xs text-apple-gray-300">{{ formatTime(child.createTime) }}</span>
                          </div>
                          <p class="text-xs text-apple-gray-600 mt-1">{{ child.content }}</p>
                          <div class="flex items-center gap-3 mt-1">
                            <button
                              class="text-xs text-apple-gray-400 hover:text-klein-blue transition-fast"
                              @click="setReply(comment.id, child.userId, child.userNickname)"
                            >
                              回复
                            </button>
                            <button
                              v-if="child.userId === userStore.state.userId"
                              class="text-xs text-apple-gray-400 hover:text-red-500 transition-fast"
                              @click="handleDeleteComment(child.id)"
                            >
                              删除
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- 空状态 -->
            <div v-else class="text-center py-8">
              <p class="text-sm text-apple-gray-300">暂无评论，快来抢沙发吧</p>
            </div>
          </div>
        </div>

        <!-- 加载失败 -->
        <div v-else class="text-center py-20">
          <p class="text-apple-gray-400">帖子不存在或已被删除</p>
        </div>
      </div>
    </main>

    <!-- 登录弹窗 -->
    <LoginModal
      v-model:visible="showLoginModal"
      @login-success="loadPost"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import NavBar from '../../../components/layout/NavBar.vue'
import LoginModal from '../../../components/common/LoginModal.vue'
import { getPostDetail, likePost, unlikePost, deletePost, favoritePost, unfavoritePost } from '../../../api/modules/community'
import { followUser, unfollowUser, isFollowing } from '../../../api/modules/follow'
import { addComment, getComments, deleteComment } from '../../../api/modules/comment'
import type { Comment as CommentType } from '../../../api/modules/comment'
import { userStore } from '../../../stores/user'
import { useToast } from '../../../composables/useToast'
import type { Post } from '../../../types'

const router = useRouter()
const route = useRoute()
const toast = useToast()

const post = ref<Post | null>(null)
const isLoading = ref(true)
const currentImageIndex = ref(0)
const isLiked = ref(false)
const likesCount = ref(0)
const isFavorited = ref(false)
const isFollowed = ref(false)
const showLoginModal = ref(false)

// 评论相关
const comments = ref<CommentType[]>([])
const commentTotal = ref(0)
const commentContent = ref('')
const replyTo = ref<{ commentId: number; userId: number; nickname: string } | null>(null)

const displayImages = computed(() => {
  if (!post.value) return []
  if (post.value.images && post.value.images.length > 0) {
    return post.value.images
  }
  return [post.value.imageUrl]
})

const isOwner = computed(() => {
  if (!post.value || !userStore.isLoggedIn.value) return false
  return post.value.userId === userStore.state.userId
})

function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return '刚刚'
  if (minutes < 60) return `${minutes}分钟前`
  if (hours < 24) return `${hours}小时前`
  if (days < 30) return `${days}天前`
  return `${date.getMonth() + 1}月${date.getDate()}日`
}

async function loadPost() {
  const id = Number(route.params.id)
  if (isNaN(id)) {
    isLoading.value = false
    return
  }

  isLoading.value = true
  try {
    const data = await getPostDetail(id)
    post.value = data
    isLiked.value = data.likedByUser
    likesCount.value = data.likesCount
    isFavorited.value = data.favoritedByUser
    checkFollowStatus()
  } catch (error) {
    console.error('加载帖子失败:', error)
    post.value = null
  } finally {
    isLoading.value = false
  }
}

async function handleLike() {
  if (!userStore.isLoggedIn.value) {
    showLoginModal.value = true
    return
  }

  const wasLiked = isLiked.value
  isLiked.value = !wasLiked
  likesCount.value += wasLiked ? -1 : 1

  try {
    if (wasLiked) {
      await unlikePost(post.value!.id)
    } else {
      await likePost(post.value!.id)
    }
  } catch (error) {
    console.error('点赞失败:', error)
    isLiked.value = wasLiked
    likesCount.value += wasLiked ? 1 : -1
  }
}

async function handleDelete() {
  if (!confirm('确定要删除这篇帖子吗？')) return

  try {
    await deletePost(post.value!.id)
    router.push('/community')
  } catch (error) {
    console.error('删除失败:', error)
  }
}

async function handleFavorite() {
  if (!userStore.isLoggedIn.value) {
    showLoginModal.value = true
    return
  }

  const wasFavorited = isFavorited.value
  isFavorited.value = !wasFavorited

  try {
    if (wasFavorited) {
      await unfavoritePost(post.value!.id)
    } else {
      await favoritePost(post.value!.id)
    }
  } catch (error) {
    console.error('收藏失败:', error)
    isFavorited.value = wasFavorited
  }
}

async function toggleFollow() {
  if (!userStore.isLoggedIn.value) {
    showLoginModal.value = true
    return
  }
  try {
    if (isFollowed.value) {
      await unfollowUser(post.value!.userId)
      isFollowed.value = false
      toast.success('已取消关注')
    } else {
      await followUser(post.value!.userId)
      isFollowed.value = true
      toast.success('关注成功')
    }
  } catch (error) {
    toast.error('操作失败')
  }
}

async function checkFollowStatus() {
  if (!userStore.isLoggedIn.value || isOwner.value || !post.value) return
  try {
    const res = await isFollowing(post.value.userId)
    isFollowed.value = res.isFollowing
  } catch (error) {
    // 静默失败
  }
}

// 评论相关
async function loadComments() {
  if (!post.value) return
  try {
    const result = await getComments(post.value.id, { page: 1, pageSize: 50 })
    comments.value = result.list
    commentTotal.value = result.total
  } catch (error) {
    console.error('加载评论失败:', error)
  }
}

function setReply(commentId: number, userId: number, nickname: string) {
  if (!userStore.isLoggedIn.value) {
    showLoginModal.value = true
    return
  }
  replyTo.value = { commentId, userId, nickname }
  commentContent.value = ''
}

async function submitComment() {
  if (!userStore.isLoggedIn.value) {
    showLoginModal.value = true
    return
  }
  if (!commentContent.value.trim() || !post.value) return

  try {
    await addComment({
      postId: post.value.id,
      parentId: replyTo.value?.commentId,
      replyUserId: replyTo.value?.userId,
      content: commentContent.value.trim(),
    })
    commentContent.value = ''
    replyTo.value = null
    toast.success('评论成功')
    loadComments()
  } catch (error) {
    toast.error('评论失败')
  }
}

async function handleDeleteComment(commentId: number) {
  if (!confirm('确定要删除这条评论吗？')) return
  try {
    await deleteComment(commentId)
    toast.success('已删除')
    loadComments()
  } catch (error) {
    toast.error('删除失败')
  }
}

onMounted(async () => {
  await loadPost()
  loadComments()
})
</script>
