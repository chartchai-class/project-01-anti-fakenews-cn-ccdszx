<script setup lang="ts">
import { type Comment } from '@/types'
import { useAuthStore } from '@/stores/auth'
const auth = useAuthStore()

const props = defineProps<{
  comment: Comment
  isDeleting?: boolean
  hasError?: boolean
  onRequestDelete: (id: number, contentPreview: string) => void
}>()

function handleDeleteComment() {
  if (props.isDeleting) return
  const preview = props.comment.content.slice(0, 20) || 'this comment'
  props.onRequestDelete(props.comment.id, preview)
}
</script>

<template>
  <div class="relative w-full max-w-md rounded-lg border border-gray-200 bg-white p-4 space-y-3">
    <div class="flex items-start justify-between">
      <div class="flex items-start gap-3">
        <div v-if="comment.usercomment?.image?.length">
          <img
            v-for="image in comment.usercomment.image"
            :key="image"
            :src="image"
            alt="comment image"
            class="h-12 w-12 rounded-full object-cover sm:h-12 sm:w-12"
          />
        </div>
        <div class="flex flex-col">
          <span class="text-[14px] font-semibold text-black leading-snug">
            {{ comment.usercomment.firstname }} {{ comment.usercomment.lastname }}
          </span>
          <span class="text-[10px] text-gray-500 leading-snug">
            {{ comment.created_at }}
          </span>
        </div>
      </div>

      <span
        class="inline-flex items-center px-1 py-1 rounded uppercase text-[12px] font-bold uppercase tracking-wide whitespace-nowrap leading-none"
        :class="
          comment.voteLabel === 'NOT_FAKE' ? 'bg-green-600 text-white ' : 'bg-red-600 text-white '
        "
      >
        {{ comment.voteLabel === 'NOT_FAKE' ? 'NOT FAKE' : 'FAKE' }}
      </span>
    </div>

    <!-- content -->
    <p class="text-sm text-gray-900 leading-6 break-words">
      {{ comment.content }}
    </p>
    <button
      v-if="auth.isAdmin === true"
      class="text-[10px] font-semibold text-red-200 bg-red-600 rounded px-2 py-[2px] hover:bg-red-50 hover:text-red-700 absolute bottom-2 right-3 disabled:opacity-50 disabled:cursor-not-allowed"
      :disabled="isDeleting"
      @click.stop.prevent="handleDeleteComment"
    >
      <span v-if="isDeleting">Deleting…</span>
      <span v-else>X Delete</span>
    </button>
    <!-- images (optional) -->
    <div v-if="comment.image?.length" class="grid grid-cols-3 gap-2">
      <img
        v-for="image in comment.image"
        :key="image"
        :src="image"
        alt="comment image"
        class="aspect-square w-full object-cover rounded-md ring-1 ring-gray-200"
      />
    </div>
  </div>
</template>
