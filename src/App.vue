<script setup lang="ts">
import Navbar from '@/components/Navbar.vue'
import { useAuthStore } from './stores/auth'
const authStore = useAuthStore()

const token = localStorage.getItem('access_token')
const user = localStorage.getItem('user')
if (token && user) {
  authStore.reload(token, JSON.parse(user))
} else {
  authStore.logout()
}
</script>
<template>
  <div id="app" class="bg-center min-h-screen pt-16 relative min-h-screen"
    :style="{
      backgroundImage: 'url(https://i.gifer.com/6bHy.gif)'
    }">
    <Navbar />
    <Router-view />
  </div>
</template>

<style scoped></style>
