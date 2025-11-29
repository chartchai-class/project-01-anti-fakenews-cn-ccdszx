<script setup lang="ts">
import { ref, watch, onMounted, computed } from 'vue'
import NewsService from '@/services/NewsService'
import { useRouter } from 'vue-router'

const props = defineProps<{ page: number; pageSize: number; filter: string }>()
const router = useRouter()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const items = ref<any[]>([])
const total = ref(0)
const loading = ref(false)
const err = ref<string | null>(null)

const page = computed(() => props.page)
const pageSize = computed(() => props.pageSize)
const filter = computed(() => (props.filter || 'removed').toLowerCase())
const totalPages = computed(() => Math.max(1, Math.ceil(total.value / pageSize.value)))

function load() {
  loading.value = true
  err.value = null
  NewsService.adminListNews(filter.value, pageSize.value, page.value)
    .then((res) => {
      items.value = res.data
      total.value = Number(res.headers['x-total-count'] || 0)
    })
    .catch((e) => (err.value = e?.message ?? 'load error'))
    .finally(() => (loading.value = false))
}
function goFilter(nextFilter: string) {
  router.push({
    name: 'admin-news',
    query: { filter: nextFilter, page: 1, pageSize: pageSize.value },
  })
}

watch(() => [page.value, pageSize.value, filter.value], load, { immediate: true })
onMounted(load)
</script>

<template>
  <section class="max-w-5xl mx-auto p-4 backdrop-blur shadow-xl rounded-xl p-5">
    <!-- Header -->
    <div class="mb-4 flex items-center justify-end">
      <span class="text-[11px] px-2 py-0.5 rounded-full bg-gray-50 text-gray-700">
        Total : {{ total }}
      </span>
    </div>

    <!-- Filters (basic) -->
    <div class="mb-4 flex items-center gap-2">
      <span class="text-sm text-gray-700">Filter</span>
      <div class="ml-auto flex gap-2">
        <button
          class="px-3 py-1 rounded border text-sm"
          :class="
            filter === 'removed'
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-900 border-gray-300'
          "
          @click="goFilter('removed')"
        >
          Removed
        </button>
        <button
          class="px-3 py-1 rounded border text-sm"
          :class="
            filter === 'active'
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-900 border-gray-300'
          "
          @click="goFilter('active')"
        >
          Active
        </button>
        <button
          class="px-3 py-1 rounded border text-sm"
          :class="
            filter === 'all'
              ? 'bg-black text-white border-black'
              : 'bg-white text-gray-900 border-gray-300'
          "
          @click="goFilter('all')"
        >
          All
        </button>
      </div>
    </div>

    <!-- States -->
    <div v-if="loading" class="p-3 rounded border bg-white">Loading…</div>
    <div v-else-if="err" class="p-3 rounded border bg-white">
      <div class="text-xs text-red-700 bg-red-50 border border-red-200 rounded px-2 py-1">
        {{ err }}
      </div>
    </div>

    <div v-else class="space-y-3">
      <router-link
        v-for="n in items"
        :key="n.id"
        :to="{
          name: 'admin-news-comments',
          params: { newsId: n.id },
          query: { page: 1, pageSize: 10 },
        }"
        class="group block rounded bg-white ring-1 ring-gray-200 transition hover:bg-gray-50 hover:ring-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      >
        <div class="p-3 flex items-center gap-3 cursor-pointer">
          <img
            v-if="n.image?.length"
            :src="n.image[0]"
            alt=""
            class="w-20 h-14 object-cover rounded"
          />

          <div class="flex-1 min-w-0">
            <div class="flex items-center gap-2">
              <h3 class="font-semibold text-gray-900 truncate">{{ n.topic }}</h3>
              <span
                v-if="n.removed"
                class="text-[11px] px-2 py-0.5 rounded-full border bg-red-50 text-red-700"
                >REMOVED</span
              >
            </div>
            <p class="text-xs text-gray-500 truncate">
              {{ n.created_at }} • fake={{ n.fakeCount }} • notFake={{ n.notFakeCount }} • status={{
                n.status
              }}
            </p>
          </div>

          <!-- subtle hint on desktop -->
          <span class="hidden md:inline text-xs text-gray-500 group-hover:text-gray-700"
            >Comments ›</span
          >
        </div>
      </router-link>
    </div>

    <!-- Pagination -->
    <div class="mt-4 flex items-center gap-2 justify-end">
      <router-link
        v-if="page > 1"
        :to="{ name: 'admin-news', query: { filter: filter, page: page - 1, pageSize } }"
      >
        <button class="px-3 py-1 rounded border text-sm bg-white hover:bg-gray-50">‹ Prev</button>
      </router-link>

      <div class="text-sm text-gray-700">Page {{ page }} / {{ totalPages }}</div>

      <router-link
        v-if="page < totalPages"
        :to="{ name: 'admin-news', query: { filter: filter, page: page + 1, pageSize } }"
      >
        <button class="px-3 py-1 rounded border text-sm bg-white hover:bg-gray-50">Next ›</button>
      </router-link>
    </div>
  </section>
</template>
