import { defineStore } from 'pinia'
import { login } from '@/api/auth'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: '',
    user: null,
  }),
  actions: {
    async login(payload) {
      const result = await login(payload)
      this.token = result.token
      this.user = {
        username: result.username,
        institutionName: result.institutionName,
        environmentName: result.environmentName,
      }
    },
    logout() {
      this.token = ''
      this.user = null
    },
  },
})
