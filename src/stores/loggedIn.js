import { defineStore, acceptHMRUpdate } from 'pinia'

export const useLoggedIn = defineStore('loggedIn', {
  state: () => ({ isLoggedIn: false }),
  getters: {},
  actions: {
    login() {
      this.isLoggedIn = true
    },
    logout() {
      this.isLoggedIn = false
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useLoggedIn, import.meta.hot))
}
