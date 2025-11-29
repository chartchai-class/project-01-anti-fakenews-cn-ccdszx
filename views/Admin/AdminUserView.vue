<script setup lang="ts">
import { ref, onMounted, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import UserService from '@/services/UserService'
import UserCard from '@/components/UserCard.vue'
import { useUsersBus } from '@/stores/users'
import type { AdminUser } from '@/types'

const router = useRouter()
const bus = useUsersBus()

const props = defineProps({
  page: { type: Number, required: true },
  pageSize: { type: Number, required: true },
})

const page = computed(() => props.page)
const pageSize = computed(() => props.pageSize)
const pageSizeOption = [5, 10, 20]

const users = ref<AdminUser[]>([])
const totalUsers = ref(0)

const totalPages = computed(() => Math.max(1, Math.ceil(totalUsers.value / pageSize.value)))
const hasPrev = computed(() => page.value > 1)
const hasNext = computed(() => page.value < totalPages.value)

// For "Showing X–Y of Z"
const showingFrom = computed(() =>
  totalUsers.value === 0 ? 0 : (page.value - 1) * pageSize.value + 1,
)
const showingTo = computed(() => Math.min(page.value * pageSize.value, totalUsers.value))

// Build compact page list with ellipses (optional numbered buttons)
const pageList = computed<(number | string)[]>(() => {
  const current = page.value
  const total = totalPages.value
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)
  if (current <= 4) return [1, 2, 3, 4, 5, '…', total]
  if (current >= total - 3) return [1, '…', total - 4, total - 3, total - 2, total - 1, total]
  return [1, '…', current - 1, current, current + 1, '…', total]
})

type LoadTarget = number | 'prev' | 'next' | { pageSize: number }

/** Single entry point: navigate (if target given) OR fetch (no args) */
function loadUsers(target?: LoadTarget) {
  // When a target is provided, compute new query, push route, and exit.
  if (target !== undefined) {
    let newPage = page.value
    let newSize = pageSize.value

    if (typeof target === 'number') newPage = target
    else if (target === 'prev') newPage = page.value - 1
    else if (target === 'next') newPage = page.value + 1
    else if (typeof target === 'object' && 'pageSize' in target) {
      newSize = target.pageSize
      newPage = 1
    }

    // Clamp using known totalPages (fallback to 1 if not loaded yet)
    const tp = totalPages.value || 1
    newPage = Math.max(1, Math.min(tp, newPage))

    // No-op if nothing changes
    if (newPage === page.value && newSize === pageSize.value) return

    router.push({ name: 'admin-user', query: { page: newPage, pageSize: newSize } })
    return
  }

  // No target: perform the fetch for the current route state
  UserService.getUsers(pageSize.value, page.value)
    .then((res) => {
      users.value = res.data as AdminUser[]
      totalUsers.value = Number(res.headers['x-total-count'] || 0)
    })
    .catch(() => router.push({ name: 'news-view' }))
}

onMounted(() => loadUsers())
watch([page, pageSize], () => loadUsers())
watch(
  () => bus.version,
  () => loadUsers(),
)
</script>

<template>
  <section class="max-w-3xl mx-auto p-4 backdrop-blur shadow-xl rounded-xl p-5">
    <!-- Page size control (uses loadUsers only) -->
    <div class="mb-3 flex">
      <span class="text-sm text-gray-900 px-8">Page size</span>
      <div class="ml-auto flex items-center gap-3">
        <div class="flex gap-1">
          <button
            v-for="size in pageSizeOption"
            :key="size"
            class="px-2.5 py-1 rounded-full border text-sm leading-none transition"
            :class="
              pageSize === size
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
            "
            @click="loadUsers({ pageSize: size })"
          >
            {{ size }}
          </button>
        </div>
      </div>
    </div>

    <!-- Users -->
    <div class="flex flex-col items-center gap-3">
      <UserCard v-for="u in users" :key="u.id" :user="u" />
    </div>

    <div class="mb-2 text-xs text-gray-600 text-center p-3">
      Showing {{ showingFrom }} – {{ showingTo }} of {{ totalUsers }}
    </div>

    <!-- Pagination (Prev/Next + optional numbers) -->
    <nav class="mt-4 flex items-center justify-center py-4" aria-label="Pagination">
      <ul class="inline-flex items-center gap-3">
        <!-- Prev -->
        <li v-if="hasPrev">
          <button
            type="button"
            class="inline-flex items-center gap-1 rounded border border-gray-300 bg-white px-2 py-1 text-sm hover:bg-gray-50"
            @click="loadUsers('prev')"
            aria-label="Previous page"
          >
            <span class="-ml-0.5">‹</span>
            <span>Prev</span>
          </button>
        </li>

        <!-- Page numbers with ellipses (optional; keep or remove) -->
        <li v-for="p in pageList" :key="`p-${p}-${pageSize}`">
          <span v-if="p === '…'" class="px-2 py-1 text-xs text-gray-500 select-none">…</span>
          <button
            v-else
            type="button"
            :aria-current="p === page ? 'page' : undefined"
            class="px-2.5 py-1 rounded border text-sm leading-none transition disabled:opacity-60"
            :class="
              p === page
                ? 'bg-black text-white border-black'
                : 'bg-white text-gray-900 border-gray-300 hover:bg-gray-50'
            "
            :disabled="p === page"
            @click="loadUsers(p as number)"
          >
            {{ p }}
          </button>
        </li>

        <!-- Next -->
        <li v-if="hasNext">
          <button
            type="button"
            class="inline-flex items-center gap-2 rounded border border-gray-300 bg-white px-2 py-1 text-sm hover:bg-gray-50"
            @click="loadUsers('next')"
            aria-label="Next page"
          >
            <span>Next</span>
            <span class="mr-0.5">›</span>
          </button>
        </li>
      </ul>
    </nav>
  </section>
</template>
