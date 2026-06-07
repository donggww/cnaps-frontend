import { defineStore } from 'pinia'

import { login, type LoginPayload } from '@/api/auth'

interface AuthUser {
  username: string
  institutionName: string
  environmentName: string
}

interface AuthState {
  token: string
  user: AuthUser | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    token: '',
    user: null,
  }),
  actions: {
    async login(payload: LoginPayload) {
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

