<template>
  <Teleport to="body">
    <Transition name="fade">
      <div
        v-if="visible"
        class="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        @click.self="handleClose"
      >
        <div class="w-full max-w-sm mx-4 bg-white rounded-2xl shadow-xl overflow-hidden">
          <!-- 头部 -->
          <div class="px-6 pt-6 pb-4">
            <div class="flex items-center justify-between mb-1">
              <h2 class="text-lg font-bold text-apple-gray-800">
                {{ step === 'verify' ? '安全验证' : '登录谷子雷达' }}
              </h2>
              <button
                class="w-8 h-8 rounded-full bg-apple-gray-100 flex items-center justify-center hover:bg-apple-gray-200 transition-fast"
                @click="handleClose"
              >
                <svg class="w-4 h-4 text-apple-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <p class="text-sm text-apple-gray-400">
              {{ step === 'verify' ? '为保障账户安全，请输入短信验证码' : '登录后即可点赞和抢购' }}
            </p>
          </div>

          <!-- 登录表单 -->
          <template v-if="step === 'login'">
            <!-- Tab 切换 -->
            <div class="px-6 mb-4">
              <div class="flex bg-apple-gray-100 rounded-xl p-1">
                <button
                  class="flex-1 py-2 text-sm rounded-lg transition-fast"
                  :class="loginType === 'sms' ? 'bg-white text-apple-gray-800 font-medium shadow-sm' : 'text-apple-gray-500'"
                  @click="loginType = 'sms'"
                >
                  验证码登录
                </button>
                <button
                  class="flex-1 py-2 text-sm rounded-lg transition-fast"
                  :class="loginType === 'password' ? 'bg-white text-apple-gray-800 font-medium shadow-sm' : 'text-apple-gray-500'"
                  @click="loginType = 'password'"
                >
                  密码登录
                </button>
              </div>
            </div>

            <div class="px-6 pb-6">
              <!-- 手机号 -->
              <div class="mb-4">
                <label class="block text-sm text-apple-gray-600 mb-1.5">手机号</label>
                <input
                  v-model="phone"
                  type="tel"
                  maxlength="11"
                  placeholder="请输入手机号"
                  class="w-full h-11 px-4 bg-apple-gray-50 rounded-xl border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm"
                />
              </div>

              <!-- 验证码登录 -->
              <template v-if="loginType === 'sms'">
                <div class="mb-6">
                  <label class="block text-sm text-apple-gray-600 mb-1.5">验证码</label>
                  <div class="flex gap-3">
                    <input
                      v-model="code"
                      type="text"
                      maxlength="6"
                      placeholder="请输入验证码"
                      class="flex-1 h-11 px-4 bg-apple-gray-50 rounded-xl border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm"
                      @input="code = code.replace(/\D/g, '')"
                    />
                    <button
                      class="w-28 h-11 text-sm rounded-xl transition-fast"
                      :class="canSendCode
                        ? 'bg-apple-gray-800 text-white hover:bg-apple-gray-700'
                        : 'bg-apple-gray-100 text-apple-gray-400 cursor-not-allowed'"
                      :disabled="!canSendCode"
                      @click="handleSendCode"
                    >
                      {{ codeButtonText }}
                    </button>
                  </div>
                </div>
              </template>

              <!-- 密码登录 -->
              <template v-else>
                <div class="mb-6">
                  <label class="block text-sm text-apple-gray-600 mb-1.5">密码</label>
                  <input
                    v-model="password"
                    type="password"
                    placeholder="请输入密码"
                    class="w-full h-11 px-4 bg-apple-gray-50 rounded-xl border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm"
                  />
                </div>
              </template>

              <!-- 登录按钮 -->
              <button
                class="w-full h-11 bg-apple-gray-800 text-white rounded-xl font-medium hover:bg-apple-gray-700 transition-fast flex items-center justify-center gap-2"
                :class="{ 'opacity-60 cursor-not-allowed': isLoading }"
                :disabled="isLoading"
                @click="handleLogin"
              >
                <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>{{ isLoading ? '登录中...' : '登录' }}</span>
              </button>
            </div>
          </template>

          <!-- 二次验证表单 -->
          <template v-else-if="step === 'verify'">
            <div class="px-6 pb-6">
              <div class="mb-4">
                <label class="block text-sm text-apple-gray-600 mb-1.5">验证码已发送至 {{ phone }}</label>
                <div class="flex gap-3">
                  <input
                    v-model="verifyCode"
                    type="text"
                    maxlength="6"
                    placeholder="请输入验证码"
                    class="flex-1 h-11 px-4 bg-apple-gray-50 rounded-xl border border-apple-gray-200 focus:border-klein-blue focus:outline-none transition-fast text-sm"
                    @input="verifyCode = verifyCode.replace(/\D/g, '')"
                  />
                  <button
                    class="w-28 h-11 text-sm rounded-xl transition-fast"
                    :class="canResendCode
                      ? 'bg-apple-gray-800 text-white hover:bg-apple-gray-700'
                      : 'bg-apple-gray-100 text-apple-gray-400 cursor-not-allowed'"
                    :disabled="!canResendCode"
                    @click="handleResendCode"
                  >
                    {{ resendButtonText }}
                  </button>
                </div>
              </div>

              <button
                class="w-full h-11 bg-apple-gray-800 text-white rounded-xl font-medium hover:bg-apple-gray-700 transition-fast flex items-center justify-center gap-2"
                :class="{ 'opacity-60 cursor-not-allowed': isLoading }"
                :disabled="isLoading"
                @click="handleVerify"
              >
                <svg v-if="isLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                <span>{{ isLoading ? '验证中...' : '验证并登录' }}</span>
              </button>

              <button
                class="w-full mt-3 h-11 bg-apple-gray-100 text-apple-gray-600 rounded-xl font-medium hover:bg-apple-gray-200 transition-fast text-sm"
                @click="step = 'login'"
              >
                返回登录
              </button>
            </div>
          </template>

          <!-- 底部提示 -->
          <div class="px-6 py-4 bg-apple-gray-50 border-t border-apple-gray-100">
            <p class="text-xs text-apple-gray-400 text-center">
              登录即表示同意《用户协议》和《隐私政策》
            </p>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { userStore } from '../../stores/user'
import { useToast } from '../../composables/useToast'
import { useRouter } from 'vue-router'

const toast = useToast()
const router = useRouter()

const props = defineProps<{
  visible: boolean
}>()

const emit = defineEmits<{
  (e: 'update:visible', value: boolean): void
  (e: 'login-success'): void
}>()

// 当前步骤：login=登录, verify=二次验证
const step = ref<'login' | 'verify'>('login')
const loginType = ref<'sms' | 'password'>('sms')

// 表单数据
const phone = ref('')
const code = ref('')
const password = ref('')
const verifyCode = ref('')
const isLoading = ref(false)
const isSendingCode = ref(false)

// 验证码倒计时
const countdown = ref(0)
let countdownTimer: number | null = null

// 二次验证倒计时
const resendCountdown = ref(0)
let resendTimer: number | null = null

const phoneReg = /^1\d{10}$/

const canSendCode = computed(() => {
  return phoneReg.test(phone.value) && countdown.value === 0 && !isLoading.value && !isSendingCode.value
})

const canResendCode = computed(() => {
  return resendCountdown.value === 0 && !isLoading.value && !isSendingCode.value
})

const codeButtonText = computed(() => {
  if (countdown.value > 0) return `${countdown.value}s 后重发`
  return '获取验证码'
})

const resendButtonText = computed(() => {
  if (resendCountdown.value > 0) return `${resendCountdown.value}s 后重发`
  return '重新发送'
})

function startCountdown(type: 'login' | 'resend') {
  const target = type === 'login' ? countdown : resendCountdown
  const timer = type === 'login' ? 'countdownTimer' : 'resendTimer'

  target.value = 60
  const intervalId = window.setInterval(() => {
    target.value--
    if (target.value <= 0) {
      clearInterval(intervalId)
      if (timer === 'countdownTimer') countdownTimer = null
      else resendTimer = null
    }
  }, 1000)

  if (timer === 'countdownTimer') countdownTimer = intervalId
  else resendTimer = intervalId
}

async function handleSendCode() {
  if (!canSendCode.value) return

  isSendingCode.value = true
  try {
    await userStore.sendSmsCode(phone.value)
    toast.success('验证码已发送')
    startCountdown('login')
  } catch (error: any) {
    toast.error(error.message || '发送失败，请稍后重试')
  } finally {
    isSendingCode.value = false
  }
}

async function handleResendCode() {
  if (!canResendCode.value) return

  isSendingCode.value = true
  try {
    await userStore.sendSmsCode(phone.value)
    toast.success('验证码已发送')
    startCountdown('resend')
  } catch (error: any) {
    toast.error(error.message || '发送失败，请稍后重试')
  } finally {
    isSendingCode.value = false
  }
}

async function handleLogin() {
  if (!phoneReg.test(phone.value)) {
    toast.error('请输入正确的手机号')
    return
  }

  if (loginType.value === 'sms') {
    if (!/^\d{6}$/.test(code.value)) {
      toast.error('请输入6位数字验证码')
      return
    }
  } else {
    if (password.value.length < 6) {
      toast.error('密码至少6位')
      return
    }
  }

  isLoading.value = true
  try {
    if (loginType.value === 'sms') {
      await userStore.login(phone.value, code.value)
    } else {
      await userStore.loginByPassword(phone.value, password.value)
    }
    toast.success('登录成功')
    emit('login-success')
    handleClose()
    const redirect = userStore.redirectPath.value
    if (redirect) {
      userStore.redirectPath.value = ''
      router.push(redirect)
    }
  } catch (error: any) {
    // 201 表示需要二次验证
    if (error?.response?.data?.code === 201) {
      step.value = 'verify'
      startCountdown('resend')
      toast.info(error.response.data.msg || '请验证手机号')
    } else {
      toast.error(error.message || '登录失败，请重试')
    }
  } finally {
    isLoading.value = false
  }
}

async function handleVerify() {
  if (!/^\d{6}$/.test(verifyCode.value)) {
    toast.error('请输入6位数字验证码')
    return
  }

  isLoading.value = true
  try {
    await userStore.loginVerify(phone.value, verifyCode.value)
    toast.success('登录成功')
    emit('login-success')
    handleClose()
    const redirect = userStore.redirectPath.value
    if (redirect) {
      userStore.redirectPath.value = ''
      router.push(redirect)
    }
  } catch (error: any) {
    toast.error(error.message || '验证失败，请重试')
  } finally {
    isLoading.value = false
  }
}

function handleClose() {
  emit('update:visible', false)
}

watch(() => props.visible, (val) => {
  if (!val) {
    phone.value = ''
    code.value = ''
    password.value = ''
    verifyCode.value = ''
    step.value = 'login'
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
