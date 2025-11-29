<script setup lang="ts">
import { useNewsStore } from '@/stores/new'
import { storeToRefs } from 'pinia'

const store = useNewsStore()
const { news } = storeToRefs(store)
</script>

<template>
  <div v-if="news" class="p-12 text-gray-800">
    <nav class="mb-5 flex justify-center gap-4">
  <router-link
    :to="{ name: 'news-view' }"
    class="group relative w-32 h-16 rounded-2xl border border-gray-300 transition-colors duration-150"
    :class="{
      'bg-black text-white': $route.name === 'news-view',
      'bg-white text-black hover:bg-black hover:text-white': $route.name !== 'news-view'
    }"
  >
    <span
      class="pointer-events-none absolute inset-0 grid place-items-center font-semibold text-xl md:text-2xl"
    >
      Home
    </span>
  </router-link>

  <router-link
    :to="{ name: 'news-detail-view', params: { id: $route.params.id } }"
    class="group relative w-32 h-16 rounded-2xl border border-gray-300 transition-colors duration-150"
    :class="{
      'bg-black text-white': $route.name === 'news-detail-view',
      'bg-white text-black hover:bg-black hover:text-white': $route.name !== 'news-detail-view'
    }"
  >
    <span
      class="pointer-events-none absolute inset-0 grid place-items-center font-semibold text-xl md:text-2xl"
    >
      Detail
    </span>
  </router-link>

  <router-link
    :to="{ name: 'news-vote-view', params: { id: $route.params.id } }"
    class="group relative w-32 h-16 rounded-2xl border border-gray-300 transition-colors duration-150"
    :class="{
      'bg-black text-white': $route.name === 'news-vote-view',
      'bg-white text-black hover:bg-black hover:text-white': $route.name !== 'news-vote-view'
    }"
  >
    <span
      class="pointer-events-none absolute inset-0 grid place-items-center font-semibold text-xl md:text-2xl"
    >
      Vote
    </span>
  </router-link>
</nav>
    <router-view :news="news"></router-view>
  </div>
</template>
