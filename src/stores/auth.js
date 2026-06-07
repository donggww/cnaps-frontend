import { defineStore } from 'pinia'
import { login } from '@/api/auth'

const STORAGE_KEY = 'cnaps_auth'

function loadAuth() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return { token: '', user: null }
}

export const useAuthStore = defineStore('auth', {
  state: () => loadAuth(),
  actions: {
    async login(payload) {
      const result = await login(payload)
      this.token = result.token
      this.user = {
        username: result.username,
        institutionName: result.institutionName,
        environmentName: result.environmentName,
      }
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: this.token, user: this.user }))
    },
    logout() {
      this.token = ''
      this.user = null
      localStorage.removeItem(STORAGE_KEY)
    },
  },
})
