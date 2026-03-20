<template>
  <h1>Connexion</h1>

  <NAlert v-if="errorMessage" title="Erreur de connexion" type="error" closable>
    {{ errorMessage }}
  </NAlert>

  <NForm @submit.prevent="handleSignIn">
    <NFormItem label="Email">
      <NInput v-model:value="email" round type="text" placeholder="Email" />
    </NFormItem>
    <NFormItem label="Mot de passe">
      <NInput
        v-model:value="password"
        round
        type="password"
        show-password-on="mousedown"
        placeholder="Mot de passe"
        @keydown.enter="handleSignIn"
      />
    </NFormItem>
    <NButton
      :disabled="email === '' || password === ''"
      round
      type="primary"
      @click="handleSignIn"
      >Se connecter</NButton
    >
    <div>
      <NText>Pas encore de compte ? </NText>
      <RouterLink to="/sign-up">S'inscrire</RouterLink>
    </div>
  </NForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/store/auth.store'
const authStore = useAuthStore()
const router = useRouter()

const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleSignIn = async () => {
  try {
    errorMessage.value = ''
    await authStore.signIn({
      email: email.value,
      password: password.value,
    })
    router.push('/')
  } catch (_error) {
    errorMessage.value = 'Identifiants incorrects.'
  }
}
</script>
