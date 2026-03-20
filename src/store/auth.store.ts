import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import { useStorage } from '@/composables/useStorage'
import type { User } from '@/types'
import type { SignInPayload, SignUpPayload } from '@/types'

export const useAuthStore = defineStore('auth', () => {
  const { get } = useStorage()
  const token = ref(get<string>('token'))
  const user = ref(get<User>('user'))
  const useAPI = useApi()
  const { set } = useStorage()

  const isAuthenticated = computed((): boolean => {
    return token.value && user.value ? true : false
  })

  const signUp = async (payload: SignUpPayload) => {
    const { username, email, password } = payload
    const responce = await useAPI.signUp({
      username: username,
      email: email,
      password: password,
    })
    set('token', responce.token)
    set('user', responce.user)
    token.value = responce.token
    user.value = responce.user
  }

  const signIn = async (payload: SignInPayload) => {
    const { email, password } = payload
    const responce = await useAPI.signIn({
      email: email,
      password: password,
    })
    set('token', responce.token)
    set('user', responce.user)
    token.value = responce.token
    user.value = responce.user
  }

  const logout = async () => {
    set('token', '')
    set('user', null)
    token.value = ''
    user.value = null
  }

  return { token, user, isAuthenticated, signUp, signIn, logout }
})
