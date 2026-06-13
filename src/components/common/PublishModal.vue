<template>
  <!-- 发布弹窗 -->
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        @click.self="handleClose"
      >
        <div class="w-full max-w-lg mx-4 bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
          <!-- 头部 -->
          <div class="px-6 pt-6 pb-4 border-b border-apple-gray-100">
            <div class="flex items-center justify-between">
              <h2 class="text-lg font-bold text-apple-gray-800">发布闲置</h2>
              <button
                class="w-8 h-8 rounded-full bg-apple-gray-100 flex items-center justify-center hover:bg-apple-gray-200 transition-fast"
                @click="handleClose"
              >
                <svg class="w-4 h-4 text-apple-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <!-- 表单 -->
          <div class="px-6 py-4 space-y-4">
            <!-- 图片上传 -->
            <div>
              <label class="block text-sm text-apple-gray-600 mb-1.5">商品图片</label>
              <div class="flex gap-2 flex-wrap">
                <div
                  v-for="(img, index) in form.images"
                  :key="index"
                  class="w-20 h-20 rounded-lg overflow-hidden relative group"
                >
                  <img :src="img" class="w-full h-full object-cover" />
                  <button
                    class="absolute top-1 right-1 w-5 h-5 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                    @click="removeImage(index)"
                  >
                    <svg class="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                <button
                  v-if="form.images.length < 9"
                  class="w-20 h-20 rounded-lg border-2 border-dashed border-apple-gray-300 flex flex-col items-center justify-center text-apple-gray-400 hover:border-apple-gray-400 transition-fast"
                  :class="{ 'opacity-50 cursor-not-allowed': isUploading }"
                  :disabled="isUploading"
                  @click="triggerUpload"
                >
                  <svg v-if="isUploading" class="w-6 h-6 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  <template v-else>
                    <svg class="w-6 h-6 mb-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                    <span class="text-xs">添加</span>
                  </template>
                </button>
              </div>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleUpload"
              />
            </div>

            <!-- 标题 -->
            <div>
              <label class="block text-sm text-apple-gray-600 mb-1.5">商品标题</label>
              <input
                v-model="form.title"
                type="text"
                placeholder="描述一下你的闲置谷子"
                class="w-full h-11 px-4 bg-apple-gray-50 rounded-xl border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm"
              />
            </div>

            <!-- 描述 -->
            <div>
              <label class="block text-sm text-apple-gray-600 mb-1.5">商品描述</label>
              <textarea
                v-model="form.description"
                rows="3"
                placeholder="详细描述商品状态、来源等"
                class="w-full px-4 py-3 bg-apple-gray-50 rounded-xl border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm resize-none"
              />
            </div>

            <!-- 价格 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-apple-gray-600 mb-1.5">售价</label>
                <input
                  v-model="form.price"
                  type="number"
                  placeholder="¥0.00"
                  class="w-full h-11 px-4 bg-apple-gray-50 rounded-xl border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm"
                />
              </div>
              <div>
                <label class="block text-sm text-apple-gray-600 mb-1.5">原价（选填）</label>
                <input
                  v-model="form.originalPrice"
                  type="number"
                  placeholder="¥0.00"
                  class="w-full h-11 px-4 bg-apple-gray-50 rounded-xl border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm"
                />
              </div>
            </div>

            <!-- 分类和成色 -->
            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm text-apple-gray-600 mb-1.5">分类</label>
                <select
                  v-model="form.category"
                  class="w-full h-11 px-4 bg-apple-gray-50 rounded-xl border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm"
                >
                  <option value="">请选择</option>
                  <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                </select>
              </div>
              <div>
                <label class="block text-sm text-apple-gray-600 mb-1.5">成色</label>
                <select
                  v-model="form.goodsCondition"
                  class="w-full h-11 px-4 bg-apple-gray-50 rounded-xl border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm"
                >
                  <option value="">请选择</option>
                  <option value="全新">全新</option>
                  <option value="几乎全新">几乎全新</option>
                  <option value="轻微使用">轻微使用</option>
                  <option value="明显使用">明显使用</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 底部按钮 -->
          <div class="px-6 py-4 border-t border-apple-gray-100 flex gap-3">
            <button
              class="flex-1 h-11 bg-apple-gray-100 text-apple-gray-600 rounded-xl font-medium hover:bg-apple-gray-200 transition-fast"
              @click="handleClose"
            >
              取消
            </button>
            <button
              class="flex-1 h-11 bg-klein-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-fast flex items-center justify-center gap-2"
              :class="{ 'opacity-60 cursor-not-allowed': isSubmitting }"
              :disabled="isSubmitting"
              @click="handleSubmit"
            >
              <svg
                v-if="isSubmitting"
                class="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span>{{ isSubmitting ? '发布中...' : '发布' }}</span>
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { publishGoods } from '../../api/modules/market'
import { uploadImage } from '../../api/modules/upload'
import { useToast } from '../../composables/useToast'

const toast = useToast()

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'publish-success'): void
}>()

const categories = ['手办', '立牌', '徽章', '挂件', '钥匙扣', '流沙麻将', '明信片', '文件夹']

const fileInput = ref<HTMLInputElement | null>(null)
const isSubmitting = ref(false)
const isUploading = ref(false)

const form = reactive({
  title: '',
  description: '',
  images: [] as string[],
  price: '',
  originalPrice: '',
  category: '',
  goodsCondition: '',
})

// 触发文件选择
function triggerUpload() {
  fileInput.value?.click()
}

// 处理图片上传
async function handleUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    toast.error('图片大小不能超过5MB')
    input.value = ''
    return
  }

  isUploading.value = true
  try {
    const url = await uploadImage(file, 'goods')
    form.images.push(url)
  } catch (error) {
    toast.error('图片上传失败')
  } finally {
    isUploading.value = false
    input.value = ''
  }
}

// 移除图片
function removeImage(index: number) {
  form.images.splice(index, 1)
}

// 提交发布
async function handleSubmit() {
  if (!form.title.trim()) {
    toast.error('请输入商品标题')
    return
  }
  if (!form.price || Number(form.price) <= 0) {
    toast.error('请输入有效的售价')
    return
  }
  if (!form.category) {
    toast.error('请选择分类')
    return
  }
  if (!form.goodsCondition) {
    toast.error('请选择成色')
    return
  }

  isSubmitting.value = true
  try {
    await publishGoods({
      title: form.title,
      description: form.description,
      images: form.images,
      price: Number(form.price),
      originalPrice: form.originalPrice ? Number(form.originalPrice) : undefined,
      category: form.category,
      goodsCondition: form.goodsCondition,
    })
    toast.success('发布成功')
    emit('publish-success')
    handleClose()
  } catch (error: any) {
    toast.error(error.message || '发布失败')
  } finally {
    isSubmitting.value = false
  }
}

// 关闭弹窗
function handleClose() {
  emit('update:visible', false)
}

// 监听弹窗关闭，重置表单
watch(() => props.visible, (val) => {
  if (!val) {
    form.title = ''
    form.description = ''
    form.images = []
    form.price = ''
    form.originalPrice = ''
    form.category = ''
    form.goodsCondition = ''
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
