<script setup lang="ts">
import { useRoute, RouterLink, RouterView } from 'vue-router'

const route = useRoute()
</script>

<template>
  <!-- Fullscreen dark background -->
  <div class="mt-25 flex items-center justify-center">
    <!-- Auth card (only right side now) -->
    <div
      class="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col p-6 sm:p-8 relative"
    >
      <!-- Close button -->
      <button
        class="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        @click="$router.push({ name: 'news-view' })"
        aria-label="Close"
      >
        ✕
      </button>

      <!-- Tabs -->
      <div class="mb-6 pt-2">
        <div class="flex items-start justify-between relative gap-6">
          <!-- Sign In tab -->
          <RouterLink
            :to="{ name: 'login' }"
            class="flex-1 text-center font-bold text-base pb-2 relative select-none"
            :class="route.name === 'login' ? 'text-black' : 'text-gray-400'"
          >
            <span>Sign In</span>
            <span
              v-if="route.name === 'login'"
              class="absolute left-0 right-0 bottom-0 h-[3px] bg-black rounded-full"
            ></span>
          </RouterLink>

          <!-- Sign Up tab -->
          <RouterLink
            :to="{ name: 'register' }"
            class="flex-1 text-center font-bold text-base pb-2 relative select-none"
            :class="route.name === 'register' ? 'text-black' : 'text-gray-400'"
          >
            <span>Sign Up</span>
            <span
              v-if="route.name === 'register'"
              class="absolute left-0 right-0 bottom-0 h-[3px] bg-black rounded-full"
            ></span>
          </RouterLink>
        </div>
      </div>

      <!-- Form body -->
      <div class="flex-1">
        <RouterView />
      </div>
    </div>
  </div>
</template>
