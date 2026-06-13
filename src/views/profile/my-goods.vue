<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar />

    <main class="pt-16 pb-8">
      <div class="max-w-4xl mx-auto px-4">

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
          <h1 class="text-xl font-bold text-apple-gray-800">我的发布</h1>
        </div>

        <!-- 加载中 -->
        <div v-if="isLoading && goodsList.length === 0" class="text-center py-20">
          <svg class="w-8 h-8 animate-spin text-apple-gray-400 mx-auto mb-4" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
          </svg>
          <p class="text-sm text-apple-gray-400">加载中...</p>
        </div>

        <!-- 空状态 -->
        <div v-else-if="!isLoading && goodsList.length === 0" class="text-center py-20">
          <svg class="w-16 h-16 mx-auto text-apple-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
          </svg>
          <p class="text-apple-gray-400 mb-2">还没有发布商品</p>
          <p class="text-sm text-apple-gray-300">去市场发布你的闲置谷子吧</p>
          <router-link
            to="/market"
            class="inline-block mt-4 px-6 py-2 bg-klein-blue text-white rounded-full text-sm hover:bg-blue-600 transition-fast"
          >
            去发布
          </router-link>
        </div>

        <!-- 商品列表 -->
        <div v-else class="space-y-4">
          <div
            v-for="goods in goodsList"
            :key="goods.id"
            class="bg-white rounded-2xl shadow-sm overflow-hidden"
          >
            <!-- 商品主体 - 点击跳详情 -->
            <div
              class="flex cursor-pointer hover:bg-apple-gray-50 transition-fast"
              @click="router.push(`/market/${goods.id}`)"
            >
              <!-- 图片 -->
              <div class="w-28 h-28 flex-shrink-0">
                <img
                  :src="goods.images?.[0] || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                  :alt="goods.title"
                  class="w-full h-full object-cover"
                />
              </div>

              <!-- 信息 -->
              <div class="flex-1 p-3 min-w-0">
                <h3 class="text-sm font-medium text-apple-gray-800 line-clamp-2 mb-1">{{ goods.title }}</h3>
                <div class="flex items-baseline gap-2 mb-1">
                  <span class="text-lg font-bold text-red-500">¥{{ goods.price }}</span>
                  <span v-if="goods.originalPrice" class="text-xs text-apple-gray-400 line-through">
                    ¥{{ goods.originalPrice }}
                  </span>
                </div>
                <div class="flex items-center gap-2">
                  <span class="text-xs px-2 py-0.5 bg-apple-gray-100 rounded-full text-apple-gray-500">
                    {{ goods.goodsCondition }}
                  </span>
                  <span class="text-xs text-apple-gray-400">{{ goods.viewCount }} 浏览</span>
                  <span class="text-xs text-apple-gray-400">{{ goods.likeCount }} 想要</span>
                </div>
              </div>
            </div>

            <!-- 操作栏 -->
            <div class="flex border-t border-apple-gray-100">
              <button
                class="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-apple-gray-600 hover:bg-apple-gray-50 transition-fast"
                @click="openEditModal(goods)"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                编辑
              </button>
              <div class="w-px bg-apple-gray-100"></div>
              <button
                class="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-orange-500 hover:bg-orange-50 transition-fast"
                @click="openPriceModal(goods)"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                调价
              </button>
              <div class="w-px bg-apple-gray-100"></div>
              <button
                class="flex-1 flex items-center justify-center gap-1.5 py-2.5 text-xs text-apple-gray-500 hover:bg-apple-gray-50 transition-fast"
                @click="handleDelete(goods)"
              >
                <svg class="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
                下架
              </button>
            </div>
          </div>
        </div>

        <!-- 加载更多 -->
        <div v-if="goodsList.length > 0 && goodsList.length < total" class="mt-6 text-center">
          <button
            class="px-8 py-2.5 bg-white text-apple-gray-600 rounded-full text-sm hover:bg-apple-gray-100 transition-fast"
            @click="loadMore"
            :disabled="isLoading"
          >
            {{ isLoading ? '加载中...' : '加载更多' }}
          </button>
        </div>

      </div>
    </main>

    <!-- 调价弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showPriceModal"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          @click.self="showPriceModal = false"
        >
          <div class="w-full max-w-xs mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
            <div class="px-6 pt-6 pb-4">
              <h3 class="text-lg font-bold text-apple-gray-800 mb-1">调整价格</h3>
              <p class="text-xs text-apple-gray-400">当前价格 ¥{{ editingGoods?.price }}</p>
            </div>
            <div class="px-6 pb-4">
              <label class="block text-sm text-apple-gray-600 mb-1.5">新价格</label>
              <input
                v-model="newPrice"
                type="number"
                placeholder="¥0.00"
                class="w-full h-11 px-4 bg-apple-gray-50 rounded-xl border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm"
              />
            </div>
            <div class="px-6 py-4 border-t border-apple-gray-100 flex gap-3">
              <button
                class="flex-1 h-10 bg-apple-gray-100 text-apple-gray-600 rounded-xl text-sm font-medium hover:bg-apple-gray-200 transition-fast"
                @click="showPriceModal = false"
              >
                取消
              </button>
              <button
                class="flex-1 h-10 bg-klein-blue text-white rounded-xl text-sm font-medium hover:bg-blue-600 transition-fast"
                @click="handleUpdatePrice"
              >
                确认
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 编辑弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div
          v-if="showEditModal"
          class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
          @click.self="showEditModal = false"
        >
          <div class="w-full max-w-lg mx-4 bg-white rounded-2xl shadow-xl overflow-hidden max-h-[90vh] overflow-y-auto">
            <div class="px-6 pt-6 pb-4 border-b border-apple-gray-100">
              <div class="flex items-center justify-between">
                <h3 class="text-lg font-bold text-apple-gray-800">编辑商品</h3>
                <button
                  class="w-8 h-8 rounded-full bg-apple-gray-100 flex items-center justify-center hover:bg-apple-gray-200 transition-fast"
                  @click="showEditModal = false"
                >
                  <svg class="w-4 h-4 text-apple-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            <div class="px-6 py-4 space-y-4">
              <!-- 图片 -->
              <div>
                <label class="block text-sm text-apple-gray-600 mb-1.5">商品图片</label>
                <div class="flex gap-2 flex-wrap">
                  <div
                    v-for="(img, index) in editForm.images"
                    :key="index"
                    class="w-16 h-16 rounded-lg overflow-hidden relative group"
                  >
                    <img :src="img" class="w-full h-full object-cover" />
                    <button
                      class="absolute top-0.5 right-0.5 w-4 h-4 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
                      @click="editForm.images.splice(index, 1)"
                    >
                      <svg class="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  <button
                    v-if="editForm.images.length < 9"
                    class="w-16 h-16 rounded-lg border-2 border-dashed border-apple-gray-300 flex items-center justify-center text-apple-gray-400 hover:border-apple-gray-400 transition-fast"
                    @click="triggerEditUpload"
                  >
                    <svg class="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </button>
                </div>
                <input ref="editFileInput" type="file" accept="image/*" class="hidden" @change="handleEditUpload" />
              </div>

              <!-- 标题 -->
              <div>
                <label class="block text-sm text-apple-gray-600 mb-1.5">商品标题</label>
                <input
                  v-model="editForm.title"
                  type="text"
                  class="w-full h-11 px-4 bg-apple-gray-50 rounded-xl border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm"
                />
              </div>

              <!-- 描述 -->
              <div>
                <label class="block text-sm text-apple-gray-600 mb-1.5">商品描述</label>
                <textarea
                  v-model="editForm.description"
                  rows="3"
                  class="w-full px-4 py-3 bg-apple-gray-50 rounded-xl border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm resize-none"
                />
              </div>

              <!-- 分类和成色 -->
              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm text-apple-gray-600 mb-1.5">分类</label>
                  <select
                    v-model="editForm.category"
                    class="w-full h-11 px-4 bg-apple-gray-50 rounded-xl border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm"
                  >
                    <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
                  </select>
                </div>
                <div>
                  <label class="block text-sm text-apple-gray-600 mb-1.5">成色</label>
                  <select
                    v-model="editForm.goodsCondition"
                    class="w-full h-11 px-4 bg-apple-gray-50 rounded-xl border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm"
                  >
                    <option value="全新">全新</option>
                    <option value="几乎全新">几乎全新</option>
                    <option value="轻微使用">轻微使用</option>
                    <option value="明显使用">明显使用</option>
                  </select>
                </div>
              </div>
            </div>

            <div class="px-6 py-4 border-t border-apple-gray-100 flex gap-3">
              <button
                class="flex-1 h-11 bg-apple-gray-100 text-apple-gray-600 rounded-xl font-medium hover:bg-apple-gray-200 transition-fast"
                @click="showEditModal = false"
              >
                取消
              </button>
              <button
                class="flex-1 h-11 bg-klein-blue text-white rounded-xl font-medium hover:bg-blue-600 transition-fast"
                :class="{ 'opacity-60 cursor-not-allowed': isSubmitting }"
                :disabled="isSubmitting"
                @click="handleUpdateGoods"
              >
                {{ isSubmitting ? '保存中...' : '保存' }}
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../../components/layout/NavBar.vue'
import { getMyGoods, deleteGoods, updateGoods } from '../../api/modules/market'
import { uploadImage } from '../../api/modules/upload'
import { useToast } from '../../composables/useToast'
import type { SecondHandGoods } from '../../api/modules/market'

const router = useRouter()
const toast = useToast()

const categories = ['手办', '立牌', '徽章', '挂件', '钥匙扣', '流沙麻将', '明信片', '文件夹']

const goodsList = ref<SecondHandGoods[]>([])
const page = ref(1)
const pageSize = ref(10)
const total = ref(0)
const isLoading = ref(false)
const isSubmitting = ref(false)

// 调价弹窗
const showPriceModal = ref(false)
const editingGoods = ref<SecondHandGoods | null>(null)
const newPrice = ref('')

// 编辑弹窗
const showEditModal = ref(false)
const editFileInput = ref<HTMLInputElement | null>(null)
const editForm = reactive({
  id: 0,
  title: '',
  description: '',
  images: [] as string[],
  category: '',
  goodsCondition: '',
})

async function loadGoods(append = false) {
  if (isLoading.value) return

  isLoading.value = true
  try {
    const result = await getMyGoods({ page: page.value, pageSize: pageSize.value })
    if (append) {
      goodsList.value.push(...result.list)
    } else {
      goodsList.value = result.list
    }
    total.value = result.total
  } catch (error) {
    console.error('加载商品失败:', error)
  } finally {
    isLoading.value = false
  }
}

function loadMore() {
  if (isLoading.value || goodsList.value.length >= total.value) return
  page.value++
  loadGoods(true)
}

// 调价
function openPriceModal(goods: SecondHandGoods) {
  editingGoods.value = goods
  newPrice.value = String(goods.price)
  showPriceModal.value = true
}

async function handleUpdatePrice() {
  if (!editingGoods.value) return
  const price = Number(newPrice.value)
  if (!price || price <= 0) {
    toast.error('请输入有效价格')
    return
  }

  try {
    await updateGoods(editingGoods.value.id, {
      title: editingGoods.value.title,
      description: editingGoods.value.description,
      images: editingGoods.value.images,
      price,
      originalPrice: editingGoods.value.originalPrice,
      category: editingGoods.value.category,
      goodsCondition: editingGoods.value.goodsCondition,
    })
    editingGoods.value.price = price
    toast.success('价格已更新')
    showPriceModal.value = false
  } catch (error) {
    toast.error('调价失败')
  }
}

// 编辑
function openEditModal(goods: SecondHandGoods) {
  editForm.id = goods.id
  editForm.title = goods.title
  editForm.description = goods.description
  editForm.images = [...goods.images]
  editForm.category = goods.category
  editForm.goodsCondition = goods.goodsCondition
  showEditModal.value = true
}

function triggerEditUpload() {
  editFileInput.value?.click()
}

async function handleEditUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    toast.error('图片大小不能超过5MB')
    input.value = ''
    return
  }

  try {
    const url = await uploadImage(file, 'goods')
    editForm.images.push(url)
  } catch (error) {
    toast.error('图片上传失败')
  } finally {
    input.value = ''
  }
}

async function handleUpdateGoods() {
  if (!editForm.title.trim()) {
    toast.error('请输入商品标题')
    return
  }

  isSubmitting.value = true
  try {
    await updateGoods(editForm.id, {
      title: editForm.title,
      description: editForm.description,
      images: editForm.images,
      price: goodsList.value.find(g => g.id === editForm.id)?.price || 0,
      category: editForm.category,
      goodsCondition: editForm.goodsCondition,
    })

    // 更新列表数据
    const goods = goodsList.value.find(g => g.id === editForm.id)
    if (goods) {
      goods.title = editForm.title
      goods.description = editForm.description
      goods.images = [...editForm.images]
      goods.category = editForm.category
      goods.goodsCondition = editForm.goodsCondition
    }

    toast.success('已保存')
    showEditModal.value = false
  } catch (error) {
    toast.error('保存失败')
  } finally {
    isSubmitting.value = false
  }
}

// 下架
async function handleDelete(goods: SecondHandGoods) {
  if (!confirm(`确定要下架「${goods.title}」吗？`)) return

  try {
    await deleteGoods(goods.id)
    goodsList.value = goodsList.value.filter(g => g.id !== goods.id)
    total.value--
    toast.success('已下架')
  } catch (error) {
    toast.error('操作失败')
  }
}

onMounted(() => {
  loadGoods()
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

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
