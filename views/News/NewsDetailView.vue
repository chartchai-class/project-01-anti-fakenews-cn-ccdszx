<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import CommentService from '@/services/CommentService'
import type { Comment, News } from '@/types'
import CommentCard from '@/components/CommentCard.vue'

const props = defineProps<{
  news: News
  page: number
  pageSize: number
}>()

import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()
const comments = ref<Comment[]>([])

const totalComments = ref(0)

const page = computed(() => props.page)
const pageSize = computed(() => props.pageSize)

const hasPrev = computed(() => page.value > 1)
const hasNext = computed(() => page.value < totalPages.value)

const currentPage = ref<number>(props.page || 1)
const currentPageSize = ref<number>(props.pageSize || 5)

const totalPages = computed(() => {
  const size = currentPageSize.value > 0 ? currentPageSize.value : 1
  const pages = Math.ceil(totalComments.value / size)
  return pages === 0 ? 1 : pages
})

const pages = computed(() => {
  return Array.from({ length: totalPages.value }, (_, i) => i + 1)
})

function loadComments() {
  CommentService.getByNews(props.news.id, pageSize.value, page.value)
    .then((res) => {
      comments.value = res.data
      totalComments.value = Number(res.headers['x-total-count'] || 0)
    })
    .catch((err) => {
      console.error('loadComments error:', err)
    })
}

watch(
  () => [props.page, props.pageSize],
  ([newPage, newSize]) => {
    const pageNorm = newPage && newPage > 0 ? newPage : 1
    const sizeNorm = newSize && newSize > 0 ? newSize : 5

    const sizeChanged = sizeNorm !== currentPageSize.value
    const pageChanged = pageNorm !== currentPage.value

    if (!sizeChanged && !pageChanged) return

    if (sizeChanged) {
      currentPageSize.value = sizeNorm
      currentPage.value = 1
    } else if (pageChanged) {
      currentPage.value = pageNorm
    }

    loadComments()
  },
)

const showConfirm = ref(false)
const pendingDeleteId = ref<number | null>(null)
const pendingDeletePreview = ref('')

const deletingId = ref<number | null>(null)
const deleteErrorId = ref<number | null>(null)

const noticeMessage = ref('')
const noticeType = ref<'success' | 'error'>('success')
const noticeVisible = ref(false)

function showNotice(msg: string, type: 'success' | 'error') {
  noticeMessage.value = msg
  noticeType.value = type
  noticeVisible.value = true
  setTimeout(() => {
    noticeVisible.value = false
  }, 2500)
}

function recomputeNewsStatus() {
  if (props.news.notFakeCount > props.news.fakeCount) {
    // eslint-disable-next-line vue/no-mutating-props
    props.news.status = 'NOT_FAKE'
  } else if (props.news.fakeCount > props.news.notFakeCount) {
    // eslint-disable-next-line vue/no-mutating-props
    props.news.status = 'FAKE'
  } else {
    // eslint-disable-next-line vue/no-mutating-props
    props.news.status = 'TIE'
  }
}

function askDeleteComment(id: number, previewText: string) {
  pendingDeleteId.value = id
  pendingDeletePreview.value = previewText
  showConfirm.value = true
}

function cancelDeleteComment() {
  showConfirm.value = false
  pendingDeleteId.value = null
  pendingDeletePreview.value = ''
  deleteErrorId.value = null
}

function confirmDeleteComment() {
  if (pendingDeleteId.value === null) {
    cancelDeleteComment()
    return
  }

  const idToDelete = pendingDeleteId.value

  // ปิด modal ก่อน
  showConfirm.value = false
  pendingDeleteId.value = null

  // ล้าง preview
  pendingDeletePreview.value = ''

  // ทำงานหลัก
  onDeleteComment(idToDelete)
}

function onDeleteComment(commentId: number) {
  deleteErrorId.value = null
  deletingId.value = commentId

  // --- 1) optimistic update comment list
  // หา comment ที่จะถูกลบก่อน เพื่อใช้ปรับคะแนนข่าว
  const target = comments.value.find((c) => c.id === commentId)
  if (target) {
    // update score บนข่าวทันที
    // สมมติว่า comment.voteLabel === 'NOT_FAKE' หมายถึงโหวตสนับสนุนว่า "ไม่ใช่ข่าวปลอม"
    if (target.voteLabel === 'NOT_FAKE') {
      // eslint-disable-next-line vue/no-mutating-props
      props.news.notFakeCount = Math.max(props.news.notFakeCount - 1, 0)
    } else if (target.voteLabel === 'FAKE') {
      // eslint-disable-next-line vue/no-mutating-props
      props.news.fakeCount = Math.max(props.news.fakeCount - 1, 0)
    }

    // คำนวณสถานะใหม่
    recomputeNewsStatus()
  }

  // ตัดคอมเมนต์ออกจาก list ในจอทันที (optimistic)
  comments.value = comments.value.filter((c) => c.id !== commentId)

  // ลด totalComments ในจอทันทีด้วย
  if (totalComments.value > 0) {
    totalComments.value = totalComments.value - 1
  }

  // --- 2) call API ลบจริง
  return CommentService.adminRemoveComment(commentId)
    .then(() => {
      showNotice('Comment deleted.', 'success')
      // reload อีกรอบจาก server เพื่อ sync ความจริง
      return loadComments()
    })
    .catch(() => {
      showNotice('Failed to delete comment.', 'error')
      deleteErrorId.value = commentId
      // reload ก็ยังควรทำ เพื่อคืน state ให้ตรงกับ backend
      return loadComments()
    })
    .finally(() => {
      deletingId.value = null
    })
}

const nf = computed(() => Number(props.news?.notFakeCount) || 0)
const f = computed(() => Number(props.news?.fakeCount) || 0)

const isUnverified = computed(() => nf.value === 0 && f.value === 0) // ไม่มีโหวต
const isTie = computed(() => !isUnverified.value && nf.value === f.value)
const nfIsMajor = computed(() => nf.value > f.value)
const fIsMajor = computed(() => f.value > nf.value)

function buildClasses(baseColor: 'green' | 'red', isMajor: boolean) {
  const size =
    isUnverified.value || isTie.value || isMajor
      ? 'px-4 py-2 text-[18px] md:text-[30px] shadow-lg'
      : 'px-2 py-1 text-[14px] md:text-[16px]'

  const ring = isUnverified.value
    ? 'ring-4 ring-gray-400'
    : isTie.value
      ? 'ring-4 ring-yellow-400'
      : isMajor
        ? 'ring-2 ring-white/60'
        : 'ring-1 ring-white/20'

  const bg = baseColor === 'green' ? 'bg-green-600' : 'bg-red-600'

  return [
    'inline-flex items-center gap-2 rounded-md uppercase text-white transition-all duration-200 font-bold',
    bg,
    size,
    ring,
  ]
}

const nfClass = computed(() => buildClasses('green', nfIsMajor.value))
const fClass = computed(() => buildClasses('red', fIsMajor.value))

onMounted(() => {
  loadComments()
})
</script>

<template>
  <!-- BG gradient + center  -->
  <div class="min-h-screen w-full bg-gradient-to-b px-3 sm:px-4 py-8 grid">
    <!-- ===== Modals / Toast () ===== -->
    <div
      v-if="noticeVisible"
      class="fixed top-6 left-1/2 -translate-x-1/2 z-[3000] pointer-events-none"
    >
      <div
        class="text-white text-sm font-semibold px-4 py-2 rounded-lg shadow-lg text-center min-w-[200px]"
        :class="noticeType === 'success' ? 'bg-green-600' : 'bg-red-600'"
      >
        {{ noticeMessage }}
      </div>
    </div>

    <div
      v-if="auth.isAdmin === true && showConfirm"
      class="bg-gray-800 fixed top-6 left-1/2 -translate-x-1/2 z-[3100] w-[90%] max-w-sm text-white rounded-xl shadow-xl border border-white p-4 flex flex-col gap-3"
    >
      <div class="text-sm font-semibold text-gray-200">Delete this comment?</div>
      <div class="text-xs text-gray-400 break-words line-clamp-2">{{ pendingDeletePreview }}</div>
      <div class="flex justify-end gap-2 text-xs font-medium">
        <button
          class="px-3 py-1.5 rounded-lg border border-white/20 hover:bg-white/10"
          @click="cancelDeleteComment"
        >
          Cancel
        </button>
        <button
          class="px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-700"
          @click="confirmDeleteComment"
        >
          Delete
        </button>
      </div>
    </div>

    <div
      class="w-full max-w-[1400px] mx-auto rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-2xl p-4 sm:p-6 lg:p-8"
    >
      <!-- grid: main + sidebar -->
      <div class="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8 lg:gap-6">
        <!-- ===== main article ===== -->
        <div class="w-full">
          <!-- header/top badges -->
          <div class="px-1 sm:px-2 pt-2 sm:pt-3 pb-3 space-y-4">
            <div class="flex flex-wrap items-center gap-2">
              <span
                class="inline-flex items-center rounded bg-white/70 text-gray-800 px-3 py-1 text-xs ring-1 ring-white/40 font-bold text-[14px]"
              >
                Post by {{ news.reporter.firstname }} {{ news.reporter.lastname }}
              </span>
              <span
                class="inline-flex items-center rounded bg-white/70 text-gray-800 px-3 py-1 text-xs ring-1 ring-white/40 font-bold text-[14px]"
              >
                Post on {{ news.created_at }}
              </span>

              <div
                class="w-full sm:w-auto sm:ml-auto flex flex-wrap sm:flex-nowrap items-center gap-2 font-medium"
              >
                <!-- NOT FAKE -->
                <div :class="nfClass">
                  <span class="font-bold">NOT FAKE</span>
                  <span class="font-semibold">{{ news.notFakeCount }}</span>
                </div>
                <!-- FAKE -->
                <div :class="fClass">
                  <span class="font-bold">FAKE</span>
                  <span class="font-semibold">{{ news.fakeCount }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-xl border border-gray-200 shadow p-6 md:p-8 mb-6">
            <!-- title -->
            <div class="mb-6">
              <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                {{ news.topic }}
              </h1>
            </div>

            <!-- image -->
            <div class="mb-6" v-if="news.image && news.image.length > 0">
              <div class="w-full flex items-center justify-center overflow-hidden">
                <img
                  :src="news.image[0]"
                  alt="News Image"
                  class="block mx-auto w-full h-auto object-contain max-h-[60vh] lg:max-w-[820px] xl:max-w-[740px] 2xl:max-w-[700px]"
                />
              </div>
            </div>

            <!-- short detail -->
            <div class="mb-6">
              <h2 class="text-xl md:text-2xl font-semibold mb-4 text-gray-900">
                {{ news.shortDetail }}
              </h2>
            </div>

            <!-- detail -->
            <div class="pb-4">
              <p class="text-gray-800 leading-relaxed whitespace-pre-line">
                {{ news.detail }}
              </p>
            </div>
          </div>
        </div>

        <!-- ===== comments sidebar ===== -->
        <aside class="w-full max-w-[320px] justify-self-center lg:justify-self-start">
          <h2 class="text-base md:text-lg font-bold tracking-tight text-white text-center py-2">
            Comments
          </h2>

          <div class="space-y-3">
            <CommentCard
              v-for="c in comments"
              :key="c.id"
              :comment="c"
              :isDeleting="deletingId === c.id"
              :hasError="deleteErrorId === c.id"
              :onRequestDelete="askDeleteComment"
            />
          </div>

          <div class="mt-6">
            <div
              class="flex justify-center text-sm font-medium text-white/90 text-center flex-wrap"
            >
              Page {{ currentPage }} of {{ totalPages }}
              <span v-if="totalComments">&nbsp;•&nbsp;{{ totalComments }} comments total</span>
            </div>

            <div class="mt-3 flex flex-wrap justify-center gap-2 select-none">
              <router-link
                v-for="num in pages"
                :key="num"
                :to="{
                  name: 'news-detail-view',
                  params: { id: news.id },
                  query: { page: num, pageSize: currentPageSize },
                }"
              >
                <button
                  class="w-9 h-9 flex items-center justify-center rounded-full border transition"
                  :class="
                    num === currentPage
                      ? 'bg-white text-black border-white'
                      : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  "
                  :aria-current="num === currentPage ? 'page' : undefined"
                  :aria-label="`Go to page ${num}`"
                >
                  {{ num }}
                </button>
              </router-link>
            </div>

            <div class="mt-4 flex justify-center gap-3 select-none">
              <router-link
                v-if="hasPrev"
                :to="{
                  name: 'news-detail-view',
                  params: { id: news.id },
                  query: { page: currentPage - 1, pageSize: currentPageSize },
                }"
                class="flex"
              >
                <button
                  class="inline-flex h-10 min-w-[120px] items-center justify-center rounded-xl px-3 text-sm font-medium bg-black text-white border border-white/20 hover:bg-white/10 active:opacity-90 transition"
                >
                  ‹ Prev Page
                </button>
              </router-link>

              <router-link
                v-if="hasNext"
                :to="{
                  name: 'news-detail-view',
                  params: { id: news.id },
                  query: { page: currentPage + 1, pageSize: currentPageSize },
                }"
                class="flex"
              >
                <button
                  class="inline-flex h-10 min-w-[120px] items-center justify-center rounded-xl px-3 text-sm font-medium bg-black text-white border border-white/20 hover:bg-white/10 active:opacity-90 transition"
                >
                  Next Page ›
                </button>
              </router-link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>
