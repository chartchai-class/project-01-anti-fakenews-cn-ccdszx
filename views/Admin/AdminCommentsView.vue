<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import NewsService from '@/services/NewsService'

const props = defineProps<{ newsId: number; page: number; pageSize: number }>()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const items = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const deletingId = ref<number | null>(null)

const page = computed(() => props.page)
const pageSize = computed(() => props.pageSize)
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

function load() {
  loading.value = true
  NewsService.adminListComments(props.newsId, pageSize.value, page.value)
    .then((res) => {
      items.value = res.data
      total.value = Number(res.headers['x-total-count'] || 0)
    })
    .finally(() => (loading.value = false))
}

function removeComment(id: number) {
  if (deletingId.value) return
  deletingId.value = id
  NewsService.adminRemoveComment(id)
    .then(load)
    .catch(load)
    .finally(() => (deletingId.value = null))
}

watch(() => [page.value, pageSize.value, props.newsId], load, { immediate: true })
onMounted(load)
</script>

<template>
  <!-- match user view container -->
  <section class="max-w-3xl mx-auto backdrop-blur shadow-xl rounded-xl p-4">
    <!-- Header: title + total pill -->
    <div class="mb-4 flex items-center justify-end">
      <span class="text-[11px] px-2 py-0.5 rounded-sm bg-gray-50 text-gray-700">
        Total : {{ total }}
      </span>
    </div>

    <div class="mb-3 grid grid-cols-[1fr_auto_1fr] items-center w-full p-2">
      <!-- Left: title -->
      <h1 class="text-lg font-semibold text-gray-900 text-left">
        Comments of <span class="text-gray-500">(news #{{ props.newsId }})</span>
      </h1>

      <!-- Center: cancel button -->
      <router-link
        :to="{ name: 'admin-news', query: { filter: 'active', page: 1, pageSize: 10 } }"
        class="justify-self-center"
      >
        <button
          class="px-3 py-1 rounded border text-sm bg-red-600 text-white border-red-600 hover:bg-red-700 active:bg-red-800 active:scale-95 transition"
          aria-label="Cancel and go back to News"
        >
          Cancel
        </button>
      </router-link>

      <!-- Right: empty spacer to keep the button centered -->
      <div></div>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="p-3 rounded bg-white">Loading…</div>

    <!-- Empty -->
    <div v-else-if="items.length === 0" class="p-3 rounded bg-white text-sm text-gray-600">
      No comments found.
    </div>

    <!-- List (simple white cards with border, like user view) -->
    <div v-else class="space-y-3">
      <article v-for="c in items" :key="c.id" class="p-3 rounded bg-white flex items-start gap-3">
        <div class="flex-1 min-w-0 flex flex-col">
          <!-- header: name • date -->
          <div class="flex items-center gap-2 text-sm">
            <span class="font-semibold truncate">
              {{ c.usercomment?.username || 'unknown' }}
            </span>
            <span class="text-gray-400">•</span>
            <span class="text-gray-500 whitespace-nowrap">
              {{ c.created_at }}
            </span>
          </div>

          <!-- content -->
          <p class="mt-1 text-sm text-gray-900 break-words whitespace-pre-line">
            {{ c.content }}
          </p>

          <!-- meta -->
          <div class="mt-2 flex items-center gap-2 text-xs text-gray-500">
            <span
              class="inline-flex items-center rounded-full px-2 py-0.5 ring-1 ring-gray-200 bg-gray-50 text-gray-700"
            >
              voteLabel:
              <span class="ml-1 font-medium text-gray-800">{{ c.voteLabel || '—' }}</span>
            </span>

            <span
              v-if="c.removed"
              class="ml-auto inline-flex items-center px-2 py-0.5 rounded-full bg-red-50 text-red-700 ring-1 ring-red-200"
            >
              REMOVED
            </span>
          </div>
        </div>

        <!-- action button in user-view style (bordered, subtle hover) -->
        <button
          class="px-3 py-1 rounded border text-sm"
          :class="
            deletingId === c.id || c.removed
              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
              : 'bg-white text-red-700 border-red-300 hover:bg-red-50'
          "
          :disabled="deletingId === c.id || c.removed"
          @click="removeComment(c.id)"
        >
          {{ deletingId === c.id ? 'Deleting…' : 'Soft delete' }}
        </button>
      </article>
    </div>

    <!-- Pagination (centered, basic bordered buttons like user view) -->
    <nav class="mt-4 flex items-center justify-center gap-5">
      <router-link
        v-if="page > 1"
        :to="{
          name: 'admin-news-comments',
          params: { newsId: props.newsId },
          query: { page: page - 1, pageSize },
        }"
      >
        <button class="px-3 py-1 rounded border text-sm bg-white hover:bg-gray-50">‹ Prev</button>
      </router-link>
      <button
        v-else
        class="px-3 py-1 rounded border text-sm bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        aria-disabled="true"
      >
        ‹ Prev
      </button>

      <div class="text-sm text-gray-700">Page {{ page }} of {{ totalPages }}</div>

      <router-link
        v-if="page < totalPages"
        :to="{
          name: 'admin-news-comments',
          params: { newsId: props.newsId },
          query: { page: page + 1, pageSize },
        }"
      >
        <button class="px-3 py-1 rounded border text-sm bg-white hover:bg-gray-50">Next ›</button>
      </router-link>
      <button
        v-else
        class="px-3 py-1 rounded border text-sm bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed"
        aria-disabled="true"
      >
        Next ›
      </button>
    </nav>
  </section>
</template>
