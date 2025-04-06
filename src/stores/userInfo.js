import { defineStore, acceptHMRUpdate } from 'pinia'

export const useUserInfo = defineStore('userInfoState', {
  state: () => ({ username: '' }),
  getters: {},
  actions: {
    setUsername(name) {
      this.username = name
    },
    deleteUsername() {
      this.username = ''
    },
  },
})

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserInfo, import.meta.hot))
}
