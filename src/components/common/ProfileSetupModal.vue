<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        @click.self="handleSkip"
      >
        <div class="w-full max-w-sm mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
          <!-- 头部 -->
          <div class="px-6 pt-6 pb-4">
            <div class="flex items-center justify-between mb-1">
              <h2 class="text-lg font-bold text-apple-gray-800">完善资料</h2>
              <button
                class="w-8 h-8 rounded-full bg-apple-gray-100 flex items-center justify-center hover:bg-apple-gray-200 transition-fast"
                @click="handleSkip"
              >
                <svg class="w-4 h-4 text-apple-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p class="text-sm text-apple-gray-400">设置密码后可用密码登录，也可以跳过</p>
          </div>

          <!-- 头像选择 -->
          <div class="px-6 mb-4">
            <label class="block text-sm text-apple-gray-600 mb-2">选择头像</label>
            <div class="flex items-center gap-3">
              <button
                v-for="avatar in avatarOptions"
                :key="avatar"
                class="w-12 h-12 rounded-full overflow-hidden border-2 transition-fast flex-shrink-0"
                :class="selectedAvatar === avatar ? 'border-klein-blue' : 'border-transparent hover:border-apple-gray-300'"
                @click="selectedAvatar = avatar"
              >
                <img :src="avatar" class="w-full h-full object-cover" />
              </button>
              <!-- 上传自定义头像 -->
              <button
                class="w-12 h-12 rounded-full border-2 border-dashed border-apple-gray-300 flex items-center justify-center hover:border-klein-blue transition-fast flex-shrink-0"
                @click="triggerUpload"
                :disabled="isUploading"
              >
                <svg v-if="isUploading" class="w-5 h-5 animate-spin text-apple-gray-400" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <svg v-else class="w-5 h-5 text-apple-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                </svg>
              </button>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="handleFileChange"
              />
            </div>
          </div>

          <!-- 设置密码 -->
          <div class="px-6 pb-6">
            <div class="mb-4">
              <label class="block text-sm text-apple-gray-600 mb-1.5">设置密码</label>
              <input
                v-model="password"
                type="password"
                placeholder="至少6位，留空则不设置"
                class="w-full h-11 px-4 bg-apple-gray-50 rounded-xl border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm"
              />
            </div>

            <div class="mb-6" v-if="password.length > 0">
              <label class="block text-sm text-apple-gray-600 mb-1.5">确认密码</label>
              <input
                v-model="confirmPassword"
                type="password"
                placeholder="再次输入密码"
                class="w-full h-11 px-4 bg-apple-gray-50 rounded-xl border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm"
              />
            </div>

            <button
              class="w-full h-11 bg-apple-gray-800 text-white rounded-xl font-medium hover:bg-apple-gray-700 transition-fast flex items-center justify-center gap-2"
              :class="{ 'opacity-60 cursor-not-allowed': isLoading }"
              :disabled="isLoading"
              @click="handleSave"
            >
              <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
              </svg>
              <span>{{ isLoading ? '保存中...' : '保存' }}</span>
            </button>

            <button
              class="w-full mt-3 h-11 bg-apple-gray-100 text-apple-gray-600 rounded-xl font-medium hover:bg-apple-gray-200 transition-fast text-sm"
              @click="handleSkip"
            >
              跳过
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { userStore } from '../../stores/user'
import { useToast } from '../../composables/useToast'
import { uploadImage } from '../../api/modules/upload'

const toast = useToast()

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
}>()

const defaultAvatars = [
  'https://api.dicebear.com/7.x/thumbs/svg?seed=anime1',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=anime2',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=anime3',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=anime4',
  'https://api.dicebear.com/7.x/thumbs/svg?seed=anime5',
]

const avatarOptions = ref<string[]>([...defaultAvatars])

const selectedAvatar = ref(userStore.state.avatar || avatarOptions[0])
const password = ref('')
const confirmPassword = ref('')
const isLoading = ref(false)
const isUploading = ref(false)
const fileInput = ref<HTMLInputElement | null>(null)

function triggerUpload() {
  fileInput.value?.click()
}

async function handleFileChange(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  if (file.size > 5 * 1024 * 1024) {
    toast.error('图片大小不能超过5MB')
    return
  }

  isUploading.value = true
  try {
    const url = await uploadImage(file, 'avatars')

    // 添加到头像选项并选中
    if (!avatarOptions.value.includes(url)) {
      avatarOptions.value.push(url)
    }
    selectedAvatar.value = url
    toast.success('头像上传成功')
  } catch (error: any) {
    toast.error(error.message || '上传失败')
  } finally {
    isUploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}

async function handleSave() {
  if (password.value.length > 0) {
    if (password.value.length < 6) {
      toast.error('密码至少6位')
      return
    }
    if (password.value !== confirmPassword.value) {
      toast.error('两次密码不一致')
      return
    }
  }

  isLoading.value = true
  try {
    if (password.value.length > 0) {
      await userStore.setPassword(password.value)
    }

    if (selectedAvatar.value !== userStore.state.avatar) {
      await userStore.updateProfile({ avatar: selectedAvatar.value })
    }

    toast.success('资料已完善')
    handleClose()
  } catch (error: any) {
    toast.error(error.message || '保存失败')
  } finally {
    isLoading.value = false
  }
}

function handleSkip() {
  handleClose()
}

function handleClose() {
  emit('update:visible', false)
}

watch(() => props.visible, (val) => {
  if (val) {
    // 重置头像选项，如果当前头像不在默认列表中则添加
    avatarOptions.value = [...defaultAvatars]
    if (userStore.state.avatar && !avatarOptions.value.includes(userStore.state.avatar)) {
      avatarOptions.value.push(userStore.state.avatar)
    }
    selectedAvatar.value = userStore.state.avatar || avatarOptions.value[0]
    password.value = ''
    confirmPassword.value = ''
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
