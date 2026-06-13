<template>
  <router-view />
  <LoginModal
    v-model:visible="userStore.showLoginModal.value"
  />
  <ProfileSetupModal
    v-model:visible="userStore.showProfileSetupModal.value"
  />
  <ToastContainer />
</template>

<script setup lang="ts">
import { userStore } from './stores/user'
import LoginModal from './components/common/LoginModal.vue'
import ProfileSetupModal from './components/common/ProfileSetupModal.vue'
import ToastContainer from './components/common/ToastContainer.vue'
</script>
