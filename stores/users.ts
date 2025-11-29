import { defineStore } from 'pinia'

export const useUsersBus = defineStore('usersBus', {
  state: () => ({
    version: 0, // นับรอบการอัปเดต
  }),
  actions: {
    reload() {
      this.version++
    },
  },
})
