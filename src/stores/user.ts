import { reactive, computed, ref } from 'vue'
import { login as loginApi, loginByPassword as loginByPasswordApi, loginVerify as loginVerifyApi, sendSmsCode as sendSmsCodeApi, setPassword as setPasswordApi, getMe as getMeApi, updateProfile as updateProfileApi } from '../api/modules/auth'

/**
 * 用户状态管理（轻量级方案，使用 reactive）
 * 后续如需更复杂的状态管理，可迁移到 Pinia
 */

// 状态接口
interface UserState {
  isLoggedIn: boolean
  token: string
  userId: number | null
  nickname: string
  avatar: string
}

// 从 localStorage 恢复登录状态
function loadState(): UserState {
  const token = localStorage.getItem('token') || ''
  const userId = localStorage.getItem('userId')
  const nickname = localStorage.getItem('nickname') || ''
  const avatar = localStorage.getItem('avatar') || ''

  return {
    isLoggedIn: !!token,
    token,
    userId: userId ? Number(userId) : null,
    nickname,
    avatar,
  }
}

// 全局响应式状态
const state = reactive<UserState>(loadState())

// 计算属性
const isLoggedIn = computed(() => state.isLoggedIn)

// 发送验证码
async function sendSmsCode(phone: string): Promise<void> {
  await sendSmsCodeApi(phone)
}

// 登录（调用后端接口）
async function login(phone: string, code: string): Promise<void> {
  const result = await loginApi(phone, code)
  applyLoginResult(result)
}

// 密码登录
async function loginByPassword(phone: string, password: string): Promise<void> {
  const result = await loginByPasswordApi(phone, password)
  applyLoginResult(result)
}

// 二次验证登录
async function loginVerify(phone: string, code: string): Promise<void> {
  const result = await loginVerifyApi(phone, code)
  applyLoginResult(result)
}

// 应用登录结果
function applyLoginResult(result: { token: string; userId: number; nickname: string; avatar: string; hasPassword: boolean }) {
  state.isLoggedIn = true
  state.token = result.token
  state.userId = result.userId
  state.nickname = result.nickname
  state.avatar = result.avatar
  hasPassword.value = result.hasPassword

  localStorage.setItem('token', result.token)
  localStorage.setItem('userId', String(result.userId))
  localStorage.setItem('nickname', result.nickname)
  localStorage.setItem('avatar', result.avatar)

  // 如果没有密码，弹出完善资料弹窗
  if (!result.hasPassword) {
    showProfileSetupModal.value = true
  }
}

// 登出
function logout() {
  state.isLoggedIn = false
  state.token = ''
  state.userId = null
  state.nickname = ''
  state.avatar = ''

  localStorage.removeItem('token')
  localStorage.removeItem('userId')
  localStorage.removeItem('nickname')
  localStorage.removeItem('avatar')
}

// 全局登录弹窗状态（供 Axios 拦截器触发）
const showLoginModal = ref(false)

// 完善资料弹窗状态
const showProfileSetupModal = ref(false)

// 是否已设置密码
const hasPassword = ref(true)

// 登录后跳转路径（401时保存当前路径，登录成功后跳回）
const redirectPath = ref('')

// 设置密码
async function setPassword(password: string): Promise<void> {
  await setPasswordApi(password)
  hasPassword.value = true
}

// 拉取最新用户信息
async function fetchUserInfo(): Promise<void> {
  const result = await getMeApi()
  state.nickname = result.nickname
  state.avatar = result.avatar
  localStorage.setItem('nickname', result.nickname)
  localStorage.setItem('avatar', result.avatar)
}

// 修改个人资料
async function updateProfile(data: { nickname?: string; avatar?: string }): Promise<void> {
  await updateProfileApi(data)
  if (data.nickname !== undefined) {
    state.nickname = data.nickname
    localStorage.setItem('nickname', data.nickname)
  }
  if (data.avatar !== undefined) {
    state.avatar = data.avatar
    localStorage.setItem('avatar', data.avatar)
  }
}

// 导出
export const userStore = {
  state,
  isLoggedIn,
  sendSmsCode,
  login,
  loginByPassword,
  loginVerify,
  setPassword,
  fetchUserInfo,
  updateProfile,
  logout,
  showLoginModal,
  showProfileSetupModal,
  hasPassword,
  redirectPath,
}
