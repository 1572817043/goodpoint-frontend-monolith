<template>
  <div class="min-h-screen bg-apple-gray-50">
    <NavBar title="收货地址" />

    <main class="pt-16 pb-24">
      <div class="max-w-lg mx-auto px-4">

        <!-- 地址列表 -->
        <div v-if="addresses.length > 0" class="space-y-3 mt-4">
          <div
            v-for="addr in addresses"
            :key="addr.id"
            class="bg-white rounded-2xl shadow-sm p-4"
          >
            <div class="flex items-start justify-between">
              <div class="flex-1 min-w-0">
                <div class="flex items-center gap-2 mb-1">
                  <span class="text-sm font-medium text-apple-gray-800">{{ addr.name }}</span>
                  <span class="text-sm text-apple-gray-500">{{ addr.phone }}</span>
                  <span
                    v-if="addr.isDefault === 1"
                    class="text-xs px-1.5 py-0.5 rounded bg-klein-blue/10 text-klein-blue"
                  >默认</span>
                </div>
                <p class="text-sm text-apple-gray-500 leading-relaxed">
                  {{ addr.fullAddress }}
                </p>
              </div>
              <button
                class="shrink-0 ml-3 p-1"
                @click="openEdit(addr)"
              >
                <svg class="w-4 h-4 text-apple-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
            </div>

            <div class="flex items-center justify-between mt-3 pt-3 border-t border-apple-gray-100">
              <button
                class="flex items-center gap-1.5"
                @click="handleSetDefault(addr)"
              >
                <div
                  class="w-4 h-4 rounded-full border-2 flex items-center justify-center"
                  :class="addr.isDefault === 1 ? 'border-klein-blue' : 'border-apple-gray-300'"
                >
                  <div
                    v-if="addr.isDefault === 1"
                    class="w-2 h-2 rounded-full bg-klein-blue"
                  ></div>
                </div>
                <span class="text-xs text-apple-gray-500">默认地址</span>
              </button>
              <button
                class="text-xs text-red-400"
                @click="handleDelete(addr)"
              >
                删除
              </button>
            </div>
          </div>
        </div>

        <!-- 空状态 -->
        <div v-else class="py-20 text-center">
          <svg class="w-16 h-16 mx-auto text-apple-gray-200 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <p class="text-sm text-apple-gray-400">暂无收货地址</p>
        </div>

        <!-- 添加按钮 -->
        <button
          class="fixed bottom-6 left-1/2 -translate-x-1/2 max-w-lg w-[calc(100%-2rem)] mx-auto bg-klein-blue text-white py-3 rounded-2xl text-sm font-medium shadow-lg active:scale-[0.98] transition-transform"
          @click="openAdd"
        >
          新增收货地址
        </button>
      </div>
    </main>

    <!-- 新增/编辑弹窗 -->
    <Teleport to="body">
      <Transition name="fade">
        <div v-if="showModal" class="fixed inset-0 z-50">
          <div class="absolute inset-0 bg-black/40" @click="showModal = false"></div>
          <div class="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl max-w-lg mx-auto">
            <div class="flex items-center justify-between px-5 py-4 border-b border-apple-gray-100">
              <span class="text-base font-medium text-apple-gray-800">
                {{ editingId ? '编辑地址' : '新增地址' }}
              </span>
              <button class="text-sm text-klein-blue font-medium" @click="handleSave">
                保存
              </button>
            </div>

            <div class="px-5 py-4 space-y-4">
              <div class="flex gap-3">
                <input
                  v-model="form.name"
                  type="text"
                  placeholder="收货人"
                  maxlength="20"
                  class="flex-1 px-4 py-2.5 bg-apple-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-klein-blue/20"
                />
                <input
                  v-model="form.phone"
                  type="tel"
                  placeholder="手机号"
                  maxlength="11"
                  class="flex-1 px-4 py-2.5 bg-apple-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-klein-blue/20"
                />
              </div>

              <div class="flex gap-3">
                <input
                  v-model="form.province"
                  type="text"
                  placeholder="省份"
                  class="flex-1 px-4 py-2.5 bg-apple-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-klein-blue/20"
                />
                <input
                  v-model="form.city"
                  type="text"
                  placeholder="城市"
                  class="flex-1 px-4 py-2.5 bg-apple-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-klein-blue/20"
                />
                <input
                  v-model="form.district"
                  type="text"
                  placeholder="区/县"
                  class="flex-1 px-4 py-2.5 bg-apple-gray-50 rounded-xl text-sm outline-none focus:ring-2 focus:ring-klein-blue/20"
                />
              </div>

              <textarea
                v-model="form.detail"
                placeholder="详细地址（街道、楼栋、门牌号）"
                rows="2"
                class="w-full px-4 py-2.5 bg-apple-gray-50 rounded-xl text-sm outline-none resize-none focus:ring-2 focus:ring-klein-blue/20"
              ></textarea>

              <label class="flex items-center gap-2 cursor-pointer">
                <input
                  v-model="form.isDefault"
                  type="checkbox"
                  :true-value="1"
                  :false-value="0"
                  class="w-4 h-4 rounded text-klein-blue focus:ring-klein-blue/20"
                />
                <span class="text-sm text-apple-gray-600">设为默认地址</span>
              </label>
            </div>

            <div class="h-8"></div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import NavBar from '../../components/layout/NavBar.vue'
import {
  getAddresses,
  addAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} from '../../api/modules/address'
import type { Address, AddressDTO } from '../../api/modules/address'
import { useToast } from '../../composables/useToast'

const toast = useToast()

const addresses = ref<Address[]>([])
const showModal = ref(false)
const editingId = ref<number | null>(null)

const defaultForm = (): AddressDTO & { isDefault: number } => ({
  name: '',
  phone: '',
  province: '',
  city: '',
  district: '',
  detail: '',
  isDefault: 0,
})

const form = ref(defaultForm())

async function loadAddresses() {
  try {
    addresses.value = await getAddresses()
  } catch {
    toast.error('加载地址失败')
  }
}

function openAdd() {
  editingId.value = null
  form.value = defaultForm()
  showModal.value = true
}

function openEdit(addr: Address) {
  editingId.value = addr.id
  form.value = {
    name: addr.name,
    phone: addr.phone,
    province: addr.province,
    city: addr.city,
    district: addr.district,
    detail: addr.detail,
    isDefault: addr.isDefault,
  }
  showModal.value = true
}

async function handleSave() {
  if (!form.value.name.trim()) return toast.error('请输入收货人')
  if (!form.value.phone.trim()) return toast.error('请输入手机号')
  if (!form.value.province.trim()) return toast.error('请输入省份')
  if (!form.value.city.trim()) return toast.error('请输入城市')
  if (!form.value.detail.trim()) return toast.error('请输入详细地址')

  try {
    if (editingId.value) {
      await updateAddress(editingId.value, form.value)
      toast.success('地址已更新')
    } else {
      await addAddress(form.value)
      toast.success('地址已添加')
    }
    showModal.value = false
    loadAddresses()
  } catch {
    toast.error('保存失败')
  }
}

async function handleDelete(addr: Address) {
  if (!confirm('确定删除该地址吗？')) return
  try {
    await deleteAddress(addr.id)
    toast.success('已删除')
    loadAddresses()
  } catch {
    toast.error('删除失败')
  }
}

async function handleSetDefault(addr: Address) {
  if (addr.isDefault === 1) return
  try {
    await setDefaultAddress(addr.id)
    toast.success('已设为默认')
    loadAddresses()
  } catch {
    toast.error('设置失败')
  }
}

onMounted(loadAddresses)
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
