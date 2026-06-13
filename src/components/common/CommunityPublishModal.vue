<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        @click.self="handleClose"
      >
        <div class="w-full max-w-md mx-4 bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] flex flex-col">
          <!-- 头部 -->
          <div class="px-5 pt-5 pb-3 flex items-center justify-between flex-shrink-0">
            <h2 class="text-lg font-bold text-apple-gray-800">发布动态</h2>
            <button
              class="w-8 h-8 rounded-full bg-apple-gray-100 flex items-center justify-center hover:bg-apple-gray-200 transition-fast"
              @click="handleClose"
            >
              <svg class="w-4 h-4 text-apple-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- 可滚动内容区 -->
          <div class="flex-1 overflow-y-auto px-5 pb-5">
            <!-- 图片上传区域 -->
            <div class="mb-3">
              <!-- 已上传图片网格 -->
              <div v-if="imageList.length > 0" class="grid grid-cols-3 gap-2 mb-2">
                <div
                  v-for="(img, index) in imageList"
                  :key="index"
                  class="relative aspect-square rounded-lg overflow-hidden group"
                >
                  <img :src="img.url" class="w-full h-full object-cover" />
                  <button
                    class="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-fast"
                    @click="removeImage(index)"
                  >
                    <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                  <!-- 第一张图的封面标记 -->
                  <div v-if="index === 0" class="absolute bottom-1 left-1 px-1.5 py-0.5 bg-klein-blue text-white text-xs rounded">
                    封面
                  </div>
                </div>

                <!-- 添加图片按钮 -->
                <div
                  v-if="imageList.length < 9"
                  class="aspect-square rounded-lg border-2 border-dashed border-apple-gray-300 flex items-center justify-center cursor-pointer hover:border-klein-blue transition-fast"
                  @click="triggerUpload"
                >
                  <svg v-if="isUploading" class="w-8 h-8 animate-spin text-apple-gray-400" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <svg v-else class="w-8 h-8 text-apple-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 4v16m8-8H4" />
                  </svg>
                </div>
              </div>

              <!-- 空状态：首次上传 -->
              <div
                v-else
                class="w-full h-48 rounded-xl border-2 border-dashed border-apple-gray-300 flex flex-col items-center justify-center cursor-pointer hover:border-klein-blue transition-fast"
                @click="triggerUpload"
                @dragover.prevent
                @drop.prevent="handleDrop"
              >
                <svg v-if="isUploading" class="w-10 h-10 animate-spin text-apple-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <template v-else>
                  <svg class="w-10 h-10 text-apple-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="text-sm text-apple-gray-400">点击或拖拽上传图片</p>
                  <p class="text-xs text-apple-gray-300 mt-1">最多9张，支持 JPG、PNG</p>
                </template>
              </div>

              <input
                ref="fileInput"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                class="hidden"
                @change="handleFileChange"
              />
            </div>

            <!-- 文字描述 -->
            <div class="mb-3">
              <textarea
                v-model="content"
                placeholder="分享你的收藏心得..."
                maxlength="500"
                rows="3"
                class="w-full px-4 py-3 bg-apple-gray-50 rounded-xl border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm resize-none"
              ></textarea>
              <div class="flex justify-end mt-1">
                <span class="text-xs" :class="content.length >= 450 ? 'text-red-400' : 'text-apple-gray-300'">
                  {{ content.length }}/500
                </span>
              </div>
            </div>

            <!-- 话题标签 -->
            <div class="mb-3">
              <div class="flex flex-wrap gap-2 mb-2">
                <span
                  v-for="tag in selectedTags"
                  :key="tag"
                  class="inline-flex items-center gap-1 px-3 py-1 bg-klein-blue/10 text-klein-blue text-xs rounded-full"
                >
                  #{{ tag }}
                  <button @click="removeTag(tag)" class="hover:text-red-500">
                    <svg class="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </span>
              </div>
              <div class="flex gap-2">
                <input
                  v-model="tagInput"
                  type="text"
                  placeholder="添加话题标签"
                  maxlength="20"
                  class="flex-1 h-9 px-3 bg-apple-gray-50 rounded-lg border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm"
                  @keydown.enter.prevent="addTag"
                />
                <button
                  class="px-3 h-9 bg-apple-gray-100 text-apple-gray-600 rounded-lg text-sm hover:bg-apple-gray-200 transition-fast"
                  :disabled="!tagInput.trim()"
                  @click="addTag"
                >
                  添加
                </button>
              </div>
            </div>

            <!-- 地点 -->
            <div class="mb-4">
              <div class="flex items-center gap-2">
                <svg class="w-5 h-5 text-apple-gray-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <input
                  v-model="location"
                  type="text"
                  placeholder="添加地点（可选）"
                  maxlength="50"
                  class="flex-1 h-9 px-3 bg-apple-gray-50 rounded-lg border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm"
                />
              </div>
            </div>

            <!-- 发布按钮 -->
            <button
              class="w-full h-11 bg-apple-gray-800 text-white rounded-xl font-medium hover:bg-apple-gray-700 transition-fast flex items-center justify-center gap-2"
              :class="{ 'opacity-60 cursor-not-allowed': !canPublish || isPublishing }"
              :disabled="!canPublish || isPublishing"
              @click="handlePublish"
            >
              <svg v-if="isPublishing" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span>{{ isPublishing ? '发布中...' : '发布' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useToast } from '../../composables/useToast'
import { createPost } from '../../api/modules/community'
import { http } from '../../api'

const toast = useToast()

interface ImageItem {
  url: string
  height: number
}

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'published', post: any): void
}>()

const fileInput = ref<HTMLInputElement | null>(null)

const imageList = ref<ImageItem[]>([])
const content = ref('')
const selectedTags = ref<string[]>([])
const tagInput = ref('')
const location = ref('')
const isUploading = ref(false)
const isPublishing = ref(false)

const canPublish = computed(() => imageList.value.length > 0 && content.value.trim().length > 0)

function triggerUpload() {
  fileInput.value?.click()
}

async function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  await uploadFile(file)
  if (fileInput.value) fileInput.value.value = ''
}

function handleDrop(e: DragEvent) {
  const file = e.dataTransfer?.files?.[0]
  if (file && file.type.startsWith('image/')) {
    uploadFile(file)
  }
}

async function uploadFile(file: File) {
  if (imageList.value.length >= 9) {
    toast.error('最多上传9张图片')
    return
  }
  if (file.size > 5 * 1024 * 1024) {
    toast.error('图片大小不能超过5MB')
    return
  }

  isUploading.value = true
  try {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('directory', 'posts')

    const url = await http.post<any, string>('/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60000,
    })

    // 获取图片高度
    const height = await getImageHeight(url)
    imageList.value.push({ url, height })
    toast.success('图片上传成功')
  } catch (error: any) {
    toast.error(error.message || '上传失败')
  } finally {
    isUploading.value = false
  }
}

function getImageHeight(url: string): Promise<number> {
  return new Promise((resolve) => {
    const img = new Image()
    img.onload = () => {
      const ratio = img.height / img.width
      resolve(Math.round(200 * ratio))
    }
    img.onerror = () => resolve(200)
    img.src = url
  })
}

function removeImage(index: number) {
  imageList.value.splice(index, 1)
}

function addTag() {
  const tag = tagInput.value.trim()
  if (!tag) return
  if (selectedTags.value.length >= 5) {
    toast.error('最多添加5个话题')
    return
  }
  if (selectedTags.value.includes(tag)) {
    toast.error('话题已存在')
    return
  }
  selectedTags.value.push(tag)
  tagInput.value = ''
}

function removeTag(tag: string) {
  selectedTags.value = selectedTags.value.filter(t => t !== tag)
}

async function handlePublish() {
  if (!canPublish.value || isPublishing.value) return

  isPublishing.value = true
  try {
    const post = await createPost({
      imageUrl: imageList.value[0].url,
      imageHeight: imageList.value[0].height,
      images: imageList.value.map(img => img.url),
      content: content.value.trim(),
      location: location.value.trim() || undefined,
      tags: selectedTags.value.length > 0 ? selectedTags.value : undefined,
    })
    toast.success('发布成功')
    emit('published', post)
    handleClose()
  } catch (error: any) {
    toast.error(error.message || '发布失败')
  } finally {
    isPublishing.value = false
  }
}

function handleClose() {
  emit('update:visible', false)
}

watch(() => props.visible, (val) => {
  if (val) {
    imageList.value = []
    content.value = ''
    selectedTags.value = []
    tagInput.value = ''
    location.value = ''
    isUploading.value = false
    isPublishing.value = false
  }
})
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
