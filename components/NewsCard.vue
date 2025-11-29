<script setup lang="ts">
import { type News } from '@/types'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const props = defineProps<{
  news: News
  isFeatured?: boolean
  onDeleteNews: (id: number) => void | Promise<unknown>
  isDeleting?: boolean
  hasError?: boolean
  onRequestDelete: (id: number, title: string) => void
}>()

function handleDelete() {
  if (props.isDeleting) return
  const shortTitle = props.news.topic || 'this news'
  props.onRequestDelete(props.news.id, shortTitle)
}
</script>

<template>
  <div class="relative w-full">
    <div
      v-if="hasError"
      class="absolute top-2 left-3 z-30 bg-red-100 text-red-700 text-[11px] font-medium px-2 py-1 rounded shadow"
    >
      Failed to delete. Try again.
    </div>

    <button
      v-if="auth.isAdmin"
      @click.stop.prevent="handleDelete"
      class="absolute top-3 right-3 z-30 text-xs px-3 py-1 rounded shadow transition disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none bg-red-600 text-white hover:bg-red-700"
      :disabled="isDeleting"
    >
      <span v-if="isDeleting">Deleting…</span>
      <span v-else>X Delete</span>
    </button>

    <router-link
      :to="{ name: 'news-detail-view', params: { id: news.id } }"
      class="no-underline w-full"
    >
      <div
        v-if="isFeatured"
        class="relative h-[480px] bg-cover bg-center text-white p-6 flex items-end rounded-xl shadow-2xl overflow-hidden hover:shadow-3xl transition-all duration-300"
        :style="{ backgroundImage: `url(${news.image?.[0]})` }"
      >
        <div class="absolute inset-0 bg-opacity-50 rounded-xl"></div>
        <div class="relative z-10 w-full">
          <div class="flex items-center space-x-3 mb-3">
            <span
              class="text-[14px] font-bold px-2 py-1 rounded uppercase"
              :class="{
                'bg-green-600 text-white': news.status === 'NOT_FAKE',
                'bg-red-600 text-white': news.status === 'FAKE',
                'bg-yellow-400 text-black': news.status === 'TIE',
                'bg-gray-400 text-white':
                  news.status !== 'NOT_FAKE' && news.status !== 'FAKE' && news.status !== 'TIE',
              }"
            >
              {{ news.status === 'NOT_FAKE' ? 'NOT FAKE' : news.status }}
            </span>
          </div>
          <h2 class="text-3xl md:text-4xl font-bold mb-4 leading-tight">
            {{ news.topic }}
          </h2>
          <p class="text-sm text-gray-600 mb-3">{{ news.shortDetail }}</p>

          <div class="flex items-start gap-3">
            <img
              class="h-12 w-12 rounded-full object-cover sm:h-12 sm:w-12"
              :src="news.reporter.image && news.reporter.image.length ? news.reporter.image[0] : ''"
              alt="comment avatar"
            />

            <div class="flex flex-col">
              <span class="text-[18px] font-semibold text-white leading-snug">
                {{ news.reporter.firstname }} {{ news.reporter.lastname }}
              </span>
              <span class="text-[10px] text-gray-500 leading-snug">
                {{ news.created_at }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div
        v-else
        class="flex flex-row items-start bg-gray-100 rounded-xl shadow-md border border-gray-200 transition-all duration-300 mb-6"
      >
        <div class="w-1/3 p-3">
          <img
            :src="news.image?.[0]"
            alt="news image"
            class="rounded-lg object-cover w-full h-40 md:h-48 transition-transform duration-300"
          />
        </div>

        <div class="w-2/3 p-5">
          <div class="flex items-center space-x-2 mb-2">
            <span
              class="text-[14px] font-bold px-2 py-1 rounded uppercase"
              :class="{
                'bg-green-600 text-white': news.status === 'NOT_FAKE',
                'bg-red-600 text-white': news.status === 'FAKE',
                'bg-yellow-400 text-black': news.status === 'TIE',
                'bg-gray-400 text-white':
                  news.status !== 'NOT_FAKE' && news.status !== 'FAKE' && news.status !== 'TIE',
              }"
            >
              {{ news.status === 'NOT_FAKE' ? 'NOT FAKE' : news.status }}
            </span>
          </div>

          <h2 class="text-xl font-bold text-gray-900 mb-2 leading-tight">
            {{ news.topic }}
          </h2>
          <p class="text-sm text-gray-600 mb-3">{{ news.shortDetail }}</p>

          <div class="flex items-start gap-3">
            <img
              class="h-12 w-12 rounded-full object-cover sm:h-12 sm:w-12"
              :src="
                news.reporter.image && news.reporter.image.length
                  ? news.reporter.image[0]
                  : '/img/erin-lindford.jpg'
              "
              alt="comment avatar"
            />

            <div class="flex flex-col">
              <span class="text-[18px] font-semibold text-black leading-snug">
                {{ news.reporter.firstname }} {{ news.reporter.lastname }}
              </span>
              <span class="text-[10px] text-gray-500 leading-snug">
                {{ news.created_at }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </router-link>
  </div>
</template>
