<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar />

    <main class="pt-16 pb-8">
      <div class="max-w-lg mx-auto px-4">

        <!-- 用户卡片 -->
        <div class="bg-white rounded-2xl shadow-sm p-5 mb-4">
          <div class="flex items-center gap-4">
            <!-- 头像 -->
            <div class="relative group cursor-pointer shrink-0" @click="triggerAvatarUpload">
              <img
                :src="userStore.state.avatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'"
                :alt="userStore.state.nickname"
                class="w-16 h-16 rounded-2xl object-cover"
              />
              <div v-if="isAvatarUploading" class="absolute inset-0 rounded-2xl bg-black/40 flex items-center justify-center">
                <svg class="w-5 h-5 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
              </div>
              <div v-else class="absolute inset-0 rounded-2xl bg-black/20 opacity-0 group-hover:opacity-100 transition-fast flex items-center justify-center">
                <svg class="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                </svg>
              </div>
              <input ref="avatarInputRef" type="file" accept="image/*" class="hidden" @change="handleAvatarUpload" />
            </div>

            <!-- 信息 -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center gap-2">
                <h1 class="text-lg font-bold text-apple-gray-800 truncate">{{ userStore.state.nickname }}</h1>
                <button class="shrink-0" @click="openEditModal">
                  <svg class="w-3.5 h-3.5 text-apple-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
              </div>
              <p class="text-sm text-apple-gray-400 mt-1">{{ maskedPhone }}</p>
            </div>
          </div>
        </div>

        <!-- 数据统计 -->
        <div class="bg-white rounded-2xl shadow-sm mb-4">
          <div class="grid grid-cols-4 divide-x divide-apple-gray-100">
            <button
              v-for="item in statItems"
              :key="item.label"
              class="py-4 text-center hover:bg-apple-gray-50 transition-fast first:rounded-l-2xl last:rounded-r-2xl"
              @click="item.action"
            >
              <p class="text-lg font-bold text-apple-gray-800">{{ item.value }}</p>
              <p class="text-xs text-apple-gray-400 mt-0.5">{{ item.label }}</p>
            </button>
          </div>
        </div>

        <!-- 内容菜单 -->
        <div class="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
          <button class="w-full flex items-center justify-between px-5 py-3.5 hover:bg-apple-gray-50 transition-fast" @click="router.push(`/community/user/${userStore.state.userId}`)">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center">
                <svg class="w-4 h-4 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </div>
              <span class="text-sm text-apple-gray-700">我的帖子</span>
            </div>
            <svg class="w-4 h-4 text-apple-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
          <div class="border-t border-apple-gray-100 mx-5"></div>
          <button class="w-full flex items-center justify-between px-5 py-3.5 hover:bg-apple-gray-50 transition-fast" @click="router.push('/my-goods')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                <svg class="w-4 h-4 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
              </div>
              <span class="text-sm text-apple-gray-700">我的发布</span>
            </div>
            <svg class="w-4 h-4 text-apple-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
          <div class="border-t border-apple-gray-100 mx-5"></div>
          <button class="w-full flex items-center justify-between px-5 py-3.5 hover:bg-apple-gray-50 transition-fast" @click="router.push('/favorites')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center">
                <svg class="w-4 h-4 text-yellow-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" /></svg>
              </div>
              <span class="text-sm text-apple-gray-700">帖子收藏</span>
            </div>
            <svg class="w-4 h-4 text-apple-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
          <div class="border-t border-apple-gray-100 mx-5"></div>
          <button class="w-full flex items-center justify-between px-5 py-3.5 hover:bg-apple-gray-50 transition-fast" @click="router.push('/sign')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center">
                <svg class="w-4 h-4 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              </div>
              <span class="text-sm text-apple-gray-700">每日签到</span>
            </div>
            <svg class="w-4 h-4 text-apple-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
          <div class="border-t border-apple-gray-100 mx-5"></div>
          <button class="w-full flex items-center justify-between px-5 py-3.5 hover:bg-apple-gray-50 transition-fast" @click="router.push('/coupons')">
            <div class="flex items-center gap-3">
              <div class="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center">
                <svg class="w-4 h-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" /></svg>
              </div>
              <span class="text-sm text-apple-gray-700">我的优惠券</span>
            </div>
            <svg class="w-4 h-4 text-apple-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
          </button>
        </div>

        <!-- 交易菜单 -->
        <div class="bg-white rounded-2xl shadow-sm mb-4">
          <div class="grid grid-cols-4">
            <button
              v-for="item in tradeMenuItems"
              :key="item.label"
              class="flex flex-col items-center py-4 hover:bg-apple-gray-50 transition-fast first:rounded-l-2xl last:rounded-r-2xl"
              @click="item.action"
            >
              <div class="w-10 h-10 rounded-xl flex items-center justify-center mb-1.5" :class="item.iconBg">
                <svg class="w-5 h-5" :class="item.iconColor" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="item.icon" />
                </svg>
              </div>
              <span class="text-xs text-apple-gray-600">{{ item.label }}</span>
            </button>
          </div>
        </div>

        <!-- 注册时间 -->
        <div class="bg-white rounded-2xl shadow-sm px-5 py-3.5 mb-4">
          <div class="flex items-center justify-between">
            <span class="text-sm text-apple-gray-500">注册时间</span>
            <span class="text-sm text-apple-gray-400">{{ formatDate(profileData.createTime) }}</span>
          </div>
        </div>

        <!-- 退出登录 -->
        <button
          class="w-full bg-white rounded-2xl shadow-sm py-3.5 text-sm text-red-500 hover:bg-red-50 transition-fast"
          @click="handleLogout"
        >
          退出登录
        </button>

      </div>
    </main>

    <!-- 编辑资料弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showEditModal" class="fixed inset-0 z-50">
          <div class="absolute inset-0 bg-black/40" @click="showEditModal = false"></div>
          <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-w-lg mx-auto">
            <div class="flex items-center justify-between px-5 py-4 border-b border-apple-gray-100">
              <span class="text-base font-medium text-apple-gray-800">编辑资料</span>
              <button class="text-sm text-klein-blue font-medium" @click="showEditModal = false">完成</button>
            </div>
            <div class="flex items-center justify-between px-5 py-4 border-b border-apple-gray-50">
              <span class="text-sm text-apple-gray-600">头像</span>
              <div class="flex items-center gap-3">
                <img :src="userStore.state.avatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'" class="w-10 h-10 rounded-xl object-cover" />
                <button class="text-sm text-klein-blue" @click="triggerAvatarUpload">修改</button>
              </div>
            </div>
            <div class="flex items-center justify-between px-5 py-4">
              <span class="text-sm text-apple-gray-600">昵称</span>
              <div class="flex items-center gap-2">
                <input v-model="editNickname" type="text" maxlength="20" class="text-sm text-apple-gray-800 text-right outline-none bg-transparent w-32" placeholder="请输入昵称" />
                <button class="text-sm text-klein-blue font-medium" @click="saveNickname">保存</button>
              </div>
            </div>
            <div class="h-8"></div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 关注列表弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showFollowingModal" class="fixed inset-0 z-50">
          <div class="absolute inset-0 bg-black/40" @click="showFollowingModal = false"></div>
          <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-w-lg mx-auto max-h-[70vh] flex flex-col">
            <div class="flex items-center justify-between px-5 py-4 border-b border-apple-gray-100 shrink-0">
              <span class="text-base font-medium text-apple-gray-800">关注</span>
              <button @click="showFollowingModal = false">
                <svg class="w-5 h-5 text-apple-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div class="flex-1 overflow-y-auto">
              <div v-if="followingList.length === 0" class="py-16 text-center">
                <p class="text-sm text-apple-gray-400">暂无关注</p>
              </div>
              <div v-for="user in followingList" :key="user.id" class="flex items-center justify-between px-5 py-3.5">
                <div class="flex items-center gap-3 min-w-0">
                  <img :src="user.avatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'" class="w-10 h-10 rounded-full object-cover shrink-0" />
                  <span class="text-sm text-apple-gray-700 truncate">{{ user.nickname }}</span>
                </div>
                <button class="shrink-0 ml-3 px-4 py-1.5 text-xs rounded-full transition-fast" :class="user.isFollowing !== false ? 'bg-apple-gray-100 text-apple-gray-400' : 'bg-apple-gray-800 text-white'" @click="toggleFollow(user)">
                  {{ user.isFollowing !== false ? '已关注' : '关注' }}
                </button>
              </div>
            </div>
            <div class="h-4 shrink-0"></div>
          </div>
        </div>
      </Transition>
    </Teleport>

    <!-- 粉丝列表弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showFollowersModal" class="fixed inset-0 z-50">
          <div class="absolute inset-0 bg-black/40" @click="showFollowersModal = false"></div>
          <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-w-lg mx-auto max-h-[70vh] flex flex-col">
            <div class="flex items-center justify-between px-5 py-4 border-b border-apple-gray-100 shrink-0">
              <span class="text-base font-medium text-apple-gray-800">粉丝</span>
              <button @click="showFollowersModal = false">
                <svg class="w-5 h-5 text-apple-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div class="flex-1 overflow-y-auto">
              <div v-if="followersList.length === 0" class="py-16 text-center">
                <p class="text-sm text-apple-gray-400">暂无粉丝</p>
              </div>
              <div v-for="user in followersList" :key="user.id" class="flex items-center justify-between px-5 py-3.5">
                <div class="flex items-center gap-3 min-w-0">
                  <img :src="user.avatar || 'https://api.dicebear.com/7.x/thumbs/svg?seed=default'" class="w-10 h-10 rounded-full object-cover shrink-0" />
                  <span class="text-sm text-apple-gray-700 truncate">{{ user.nickname }}</span>
                </div>
                <button class="shrink-0 ml-3 px-4 py-1.5 text-xs rounded-full transition-fast" :class="user.isFollowing ? 'bg-apple-gray-100 text-apple-gray-400' : 'bg-apple-gray-800 text-white'" @click="toggleFollow(user)">
                  {{ user.isFollowing ? '已关注' : '关注' }}
                </button>
              </div>
            </div>
            <div class="h-4 shrink-0"></div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import NavBar from '../../components/layout/NavBar.vue'
import { userStore } from '../../stores/user'
import { getMe } from '../../api/modules/auth'
import { uploadImage } from '../../api/modules/upload'
import { getUserPosts, getFavoritePosts } from '../../api/modules/community'
import { getFollowing, getFollowers, followUser, unfollowUser } from '../../api/modules/follow'
import { useToast } from '../../composables/useToast'

const toast = useToast()
const router = useRouter()

const isAvatarUploading = ref(false)
const avatarInputRef = ref<HTMLInputElement | null>(null)
const showEditModal = ref(false)
const editNickname = ref('')
const showFollowingModal = ref(false)
const showFollowersModal = ref(false)

const profileData = ref({ createTime: '', phone: '' })
const stats = ref({ posts: 0, favorites: 0, following: 0, followers: 0 })
const followingList = ref<any[]>([])
const followersList = ref<any[]>([])

const maskedPhone = computed(() => {
  const phone = profileData.value.phone || ''
  return phone.length >= 7 ? phone.slice(0, 3) + '****' + phone.slice(7) : phone
})

const statItems = computed(() => [
  { label: '帖子', value: stats.value.posts, action: () => router.push('/my-goods') },
  { label: '收藏', value: stats.value.favorites, action: () => router.push('/favorites') },
  { label: '关注', value: stats.value.following, action: () => { loadFollowingList(); showFollowingModal.value = true } },
  { label: '粉丝', value: stats.value.followers, action: () => { loadFollowersList(); showFollowersModal.value = true } },
])

const tradeMenuItems = computed(() => [
  {
    label: '我的买单',
    icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2',
    iconBg: 'bg-green-50',
    iconColor: 'text-green-500',
    action: () => router.push('/orders'),
  },
  {
    label: '我的卖单',
    icon: 'M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
    iconBg: 'bg-indigo-50',
    iconColor: 'text-indigo-500',
    action: () => router.push('/sales'),
  },
  {
    label: '我的评价',
    icon: 'M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z',
    iconBg: 'bg-yellow-50',
    iconColor: 'text-yellow-500',
    action: () => router.push('/my-reviews'),
  },
  {
    label: '收货地址',
    icon: 'M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z M15 11a3 3 0 11-6 0 3 3 0 016 0z',
    iconBg: 'bg-cyan-50',
    iconColor: 'text-cyan-500',
    action: () => router.push('/address'),
  },
])

function formatDate(dateStr: string): string {
  if (!dateStr) return ''
  const d = new Date(dateStr)
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`
}

function openEditModal() {
  editNickname.value = userStore.state.nickname
  showEditModal.value = true
}

function triggerAvatarUpload() {
  avatarInputRef.value?.click()
}

async function handleAvatarUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return
  if (file.size > 5 * 1024 * 1024) {
    toast.error('图片大小不能超过5MB')
    input.value = ''
    return
  }
  isAvatarUploading.value = true
  try {
    const url = await uploadImage(file, 'avatars')
    await userStore.updateProfile({ avatar: url })
    toast.success('头像已更新')
  } catch {
    toast.error('上传头像失败')
  } finally {
    isAvatarUploading.value = false
    input.value = ''
  }
}

async function saveNickname() {
  const nickname = editNickname.value.trim()
  if (!nickname) return
  try {
    await userStore.updateProfile({ nickname })
    toast.success('昵称已更新')
  } catch {
    toast.error('修改昵称失败')
  }
}

async function loadStats() {
  const userId = userStore.state.userId
  if (!userId) return
  const [p, f, fo, fr] = await Promise.allSettled([
    getUserPosts(userId, { page: 1, pageSize: 1 }),
    getFavoritePosts({ page: 1, pageSize: 1 }),
    getFollowing(userId),
    getFollowers(userId),
  ])
  if (p.status === 'fulfilled') stats.value.posts = (p.value as any).total || 0
  if (f.status === 'fulfilled') stats.value.favorites = (f.value as any).total || 0
  if (fo.status === 'fulfilled') stats.value.following = (fo.value as any).length || 0
  if (fr.status === 'fulfilled') stats.value.followers = (fr.value as any).length || 0
}

async function loadFollowingList() {
  const userId = userStore.state.userId
  if (!userId) return
  try {
    const list = await getFollowing(userId)
    followingList.value = (list as any[]).map(u => ({ ...u, isFollowing: true }))
  } catch {}
}

async function loadFollowersList() {
  const userId = userStore.state.userId
  if (!userId) return
  try {
    const list = await getFollowers(userId) as any[]
    const followingSet = new Set(followingList.value.map(u => u.id))
    followersList.value = list.map(u => ({ ...u, isFollowing: followingSet.has(u.id) }))
  } catch {}
}

async function toggleFollow(user: any) {
  try {
    if (user.isFollowing) {
      await unfollowUser(user.id)
      user.isFollowing = false
      stats.value.following--
    } else {
      await followUser(user.id)
      user.isFollowing = true
      stats.value.following++
    }
  } catch {
    toast.error('操作失败')
  }
}

function handleLogout() {
  if (confirm('确定要退出登录吗？')) {
    userStore.logout()
    toast.success('已退出登录')
    router.push('/')
  }
}

onMounted(async () => {
  if (!userStore.isLoggedIn.value) {
    userStore.showLoginModal.value = true
    router.replace('/')
    return
  }
  try {
    const data = await getMe()
    profileData.value.phone = data.phone
    profileData.value.createTime = data.createTime
    if (data.nickname) {
      userStore.state.nickname = data.nickname
      localStorage.setItem('nickname', data.nickname)
    }
    if (data.avatar !== undefined) {
      userStore.state.avatar = data.avatar
      localStorage.setItem('avatar', data.avatar)
    }
  } catch {}
  loadStats()
  loadFollowingList()
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
