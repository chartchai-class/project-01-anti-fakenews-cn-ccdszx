<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter, useRoute } from 'vue-router'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const isAdmin = computed(() => auth.isAdmin)
if (!isAdmin.value) router.replace({ name: 'news-view' })

const currentFilter = computed(() => (route.query.filter as string) || 'active')

// basic button card with tiny hover
const btnBase =
  'inline-flex flex-col items-center justify-center gap-2 ' +
  'w-[200px] h-[120px] rounded-2xl border border-gray-300 bg-white text-black ' +
  'text-2xl md:text-3xl font-semibold ' +
  'transition transform duration-150 ease-out hover:bg-gray-50 hover:-translate-y-0.5 '
</script>

<template>
  <div class="min-h-screen bg-gray-200">
    <div class="flex justify-center px-4 py-8">
      <span class="text-2xl md:text-3xl font-semibold p-4">Administrator</span>
    </div>

    <div class="flex justify-center gap-5">
      <!-- Users -->
      <router-link
        :to="{ name: 'admin-user', query: { page: 1, pageSize: 10 } }"
        :class="btnBase"
        aria-label="Users"
      >
        <!-- user icon -->
        <svg
          class="h-6 w-6 text-gray-700"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M16 14a4 4 0 10-8 0v2M12 7a3 3 0 110-6 3 3 0 010 6zM4 20v-1c0-2.2 3.6-4 8-4s8 1.8 8 4v1"
          />
        </svg>
        <span>Users</span>
      </router-link>

      <!-- News -->
      <router-link
        :to="{ name: 'admin-news', query: { filter: currentFilter, page: 1, pageSize: 10 } }"
        :class="btnBase"
        aria-label="News"
      >
        <!-- news/paper icon -->
        <svg
          class="h-6 w-6 text-gray-700"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="1.6"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M4 7a2 2 0 012-2h11a2 2 0 012 2v10a3 3 0 01-3 3H6a3 3 0 01-3-3V7zM9 9h8M9 13h8M9 17h5"
          />
        </svg>
        <span>News</span>
      </router-link>
    </div>

    <main class="max-w-5xl mx-auto p-4">
      <router-view />
    </main>
  </div>
</template>
