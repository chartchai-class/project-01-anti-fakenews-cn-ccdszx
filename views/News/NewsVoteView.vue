<script setup lang="ts">
import ImageUpload from '@/components/ImageUpload.vue'
import * as yup from 'yup'
import VoteService from '@/services/VoteService'
import { useField, useForm } from 'vee-validate'
import type { News, VoteLabel, VoteRequest } from '@/types'
import { useRouter } from 'vue-router'
import { useNewsStore } from '@/stores/new'
import { onMounted, type Ref } from 'vue'

const props = defineProps<{ news: News }>()

const validationSchema = yup.object({
  label: yup.mixed().oneOf(['FAKE', 'NOT_FAKE'], 'Vote is required'),
  content: yup.string().max(500, 'Max 500 characters'),
  image: yup.array(yup.string()),
})

const router = useRouter()
const { errors, handleSubmit } = useForm({
  validationSchema,
  initialValues: {
    label: 'NOT_FAKE' as VoteLabel,
    content: '',
    image: [] as string[],
  },
})

const { value: label } = useField('label') as { value: Ref<VoteLabel> }
const { value: comment } = useField('content') as { value: Ref<string> }
const { value: image } = useField('image') as { value: Ref<string[]> }

function choose(value: VoteLabel) {
  label.value = value
}

const newsStore = useNewsStore()
const submit = handleSubmit((value: { label: VoteLabel; content: string; image: string[] }) => {
  const payload: VoteRequest = {
    label: value.label as VoteLabel,
    content: value.content || '',
    image: value.image || [],
  }

  VoteService.savevoteandComment(props.news.id, payload)
    .then(() => newsStore.fetchNews(props.news.id))
    .then(() => {
      router.push({ name: 'news-detail-view', params: { id: props.news.id } })
    })
    .catch((err) => {
      console.log('Error submitting vote:', err)
    })
})

onMounted(() => {
  if (!label.value) label.value = 'NOT_FAKE'
})
</script>

<template>
  <!-- BG  -->
  <div class="min-h-screen w-full bg-gradient-to-b px-3 py-10 grid place-items-center">
    <!-- Glass card -->
    <div
      class="w-full max-w-md sm:max-w-lg md:max-w-xl rounded-2xl bg-white/10 backdrop-blur-md border border-white/15 shadow-2xl p-4 sm:p-5"
    >
      <h2 class="text-center text-white font-semibold tracking-tight text-2xl sm:text-3xl mb-3">
        Vote on this News
      </h2>

      <div class="mb-4">
        <img
          v-if="news.image && news.image.length > 0"
          :src="news.image[0]"
          alt="News Image"
          class="w-full h-auto rounded-xl border border-white/10 max-h-80 sm:max-h-96 object-contain"
        />
      </div>

      <!-- Toggle -->
      <div
        class="flex w-full rounded-lg ring-1 ring-white/10 bg-white/5 overflow-hidden"
        role="tablist"
        aria-label="Vote"
      >
        <button
          type="button"
          class="w-1/2 px-3 py-2 text-sm font-semibold transition"
          :class="
            label === 'NOT_FAKE'
              ? 'bg-emerald-600 text-white'
              : 'text-white/90 hover:bg-emerald-50/10 hover:text-emerald-300'
          "
          @click="choose('NOT_FAKE')"
        >
          Not Fake
        </button>
        <button
          type="button"
          class="w-1/2 px-3 py-2 text-sm font-semibold transition"
          :class="
            label === 'FAKE'
              ? 'bg-red-600 text-white'
              : 'text-white/90 hover:bg-red-50/10 hover:text-red-300'
          "
          @click="choose('FAKE')"
        >
          Fake
        </button>
      </div>
      <p v-if="errors.label" class="text-xs text-red-400 mt-1">{{ errors.label }}</p>

      <!-- Comment -->
      <div class="mt-4 space-y-1">
        <label class="block text-sm font-medium text-white">
          Comment <span class="text-white/60 text-xs">(optional)</span>
        </label>
        <textarea
          v-model="comment"
          class="w-full h-28 sm:h-32 resize-none overflow-y-auto no-scrollbar rounded-lg border border-white/10 bg-white/5 p-3 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-indigo-400/60"
          placeholder="Add a short note…"
        ></textarea>
        <p v-if="errors.content" class="text-xs text-red-400">{{ errors.content }}</p>
      </div>

      <!-- Upload -->
      <div class="mt-3 space-y-1">
        <label class="block text-sm font-medium text-white">
          Images <span class="text-white/60 text-xs">(optional)</span>
        </label>
        <ImageUpload v-model="image" />
        <p v-if="errors.image" class="text-xs text-red-400">{{ errors.image }}</p>
      </div>

      <div class="grid grid-cols-2 gap-3 mt-5">
        <button
          type="button"
          class="w-full rounded-full px-5 py-3 text-base font-semibold bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/70 active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed transition"
          :disabled="!label"
          @click="submit"
        >
          Submit Vote
        </button>

        <router-link
          :to="{ name: 'news-detail-view', params: { id: props.news.id } }"
          class="w-full rounded-full px-5 py-3 text-base font-semibold bg-red-600 text-white text-center shadow-lg hover:bg-red-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400/70 active:scale-[0.99] transition"
        >
          Cancel
        </router-link>
      </div>
    </div>
  </div>
</template>
