import { defineStore } from 'pinia'

export const useBarangayStore = defineStore('barangay', {
  state: () => ({
    list: [],
  }),
  actions: {
    async loadBarangays() {
      try {
        const response = await fetch('/data/butuan-barangays.json')
        const data = await response.json()
        this.list = data
      } catch (error) {
        console.error('Error loading barangays:', error)
      }
    },
  },
})
