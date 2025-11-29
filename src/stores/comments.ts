import { defineStore } from 'pinia'
import type { Comment } from '@/types'

export const useCommentsStore = defineStore('comments', {
  state: () => ({
    list: [] as Comment[],
    total: 0
  }),
  actions: {
    setComments(payload: { list: Comment[]; total: number }) {
      this.list = payload.list
      this.total = payload.total
    },
    reset() {
      this.list = []
      this.total = 0
    }
  }
})
