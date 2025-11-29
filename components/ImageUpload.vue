<script setup lang="ts">
import Uploader from 'vue-media-upload'
import { ref, watch } from 'vue'

type MediaItem = { name: string }

interface Props {
  modelValue?: string[] | string | null
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => []
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string[]): void
}>()

function normalizeToArray(v: unknown): string[] {
  if (Array.isArray(v)) return v.filter((x): x is string => typeof x === 'string')
  if (typeof v === 'string') return v ? [v] : []
  return []
}

function toMedia(list: string[]): MediaItem[] {
  return list.map((name) => ({ name }))
}

function toStringList(media: MediaItem[] | unknown): string[] {
  if (!Array.isArray(media)) return []
  return media
    .map((m) => (m && typeof m === 'object' && 'name' in m ? (m as MediaItem).name : null))
    .filter((x): x is string => typeof x === 'string')
}

const media = ref<MediaItem[]>([])

watch(
  () => props.modelValue,
  (val) => {
    media.value = toMedia(normalizeToArray(val))
  },
  { immediate: true }
)

const uploadUrl = ref(import.meta.env.VITE_UPLOAD_URL)

function onChanged(files: MediaItem[]) {
  emit('update:modelValue', toStringList(files))
}
</script>

<template>
  <Uploader :server="uploadUrl" :media="media" @change="onChanged" />
</template>
