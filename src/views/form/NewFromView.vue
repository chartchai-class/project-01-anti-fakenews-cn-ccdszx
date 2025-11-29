<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useMessageStore } from '@/stores/message'
import ImageUpload from '@/components/ImageUpload.vue'
import NewsService from '@/services/NewsService'
import type { News as NewsType } from '@/types'

// Only the fields users should input
const news = ref<{
  topic: string
  shortDetail: string
  detail: string
  image: string[]
}>({
  topic: '',
  shortDetail: '',
  detail: '',
  image: [],
})

const router = useRouter()
const store = useMessageStore()

function saveNews() {
  // Send only user-entered fields; backend will fill id/created_at/reporter/status/counts/comments
  NewsService.saveNews({
    topic: news.value.topic,
    shortDetail: news.value.shortDetail,
    detail: news.value.detail,
    image: news.value.image,
  } as unknown as NewsType)
    .then((response) => {
      router.push({ name: 'news-detail-view', params: { id: response.data.id } })
      store.updateMessage('You successfully created news: ' + response.data.topic)
      setTimeout(() => {
        store.resetMessage()
      }, 3000)
    })
    .catch(() => {
      router.push({ name: 'news-view' })
      store.updateMessage('Failed to create news: ' + news.value.topic)
      setTimeout(() => {
        store.resetMessage()
      }, 3000)
    })
}
</script>

<template>
  <!-- Center + compact padding -->
  <div class="min-h-screen w-full bg-gradient-to-b px-3 py-10 grid place-items-center">
    <div
      class="w-full max-w-sm sm:max-w-md md:max-w-lg rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-xl p-4 sm:p-5"
    >
      <h1
        class="text-center font-bold text-white tracking-tight text-2xl sm:text-3xl md:text-4xl mb-4"
      >
        Create your News
      </h1>

      <form @submit.prevent="saveNews" class="text-white">
        <!-- 1 column on all screens (tighter) -->
        <div class="grid grid-cols-1 gap-4">
          <!-- Topic -->
          <div class="space-y-1">
            <label for="topic" class="block text-sm font-medium">Topic</label>
            <input
              id="topic"
              v-model="news.topic"
              type="text"
              class="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 placeholder-white/50"
              placeholder="Headline"
              required
            />
          </div>

          <!-- Short detail -->
          <div class="space-y-1">
            <label for="shortDetail" class="block text-sm font-medium">Short detail</label>
            <input
              id="shortDetail"
              v-model="news.shortDetail"
              type="text"
              class="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 placeholder-white/50"
              placeholder="One-line summary"
              required
            />
          </div>

          <!-- Detail -->
          <div class="space-y-1">
            <label for="detail" class="block text-sm font-medium">Detail</label>
            <textarea
              id="detail"
              v-model="news.detail"
              class="w-full rounded-lg border border-white/20 bg-white/5 px-3 py-2 outline-none focus:ring-2 focus:ring-white/30 h-28 sm:h-32 overflow-y-auto resize-y [scrollbar-width:none] [-ms-overflow-style:'none'] [&::-webkit-scrollbar]:hidden placeholder-white/50"
              placeholder="Write the full news content"
              required
            ></textarea>
          </div>

          <!-- Images -->
          <div class="space-y-1">
            <label class="block text-sm font-medium">Images</label>
            <ImageUpload v-model="news.image" />
          </div>
        </div>

        <!-- Actions: compact buttons -->
        <div class="mt-6 grid grid-cols-2 gap-3">
          <button
            type="submit"
            class="w-full rounded-full px-4 py-2.5 text-sm font-semibold bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 active:scale-[0.99] transition"
          >
            Submit
          </button>

          <router-link
            :to="{ name: 'news-view' }"
            class="w-full rounded-full px-4 py-2.5 text-sm font-semibold bg-red-600 text-white text-center shadow-lg hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 active:scale-[0.99] transition"
          >
            Cancel
          </router-link>
        </div>
      </form>
    </div>
  </div>
</template>
