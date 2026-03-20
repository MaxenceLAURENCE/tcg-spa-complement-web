<template>
  <h1>Inscription</h1>

  <NAlert
    v-if="errorMessage"
    title="Erreur d'inscription"
    type="error"
    closable
  >
    {{ errorMessage }}
  </NAlert>

  <NForm @submit.prevent="handleSignUp">
    <NFormItem label="Nom utilisateur">
      <NInput
        v-model:value="username"
        round
        type="text"
        placeholder="Nom de l'utilisateur"
      />
    </NFormItem>
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
        @keydown.enter="handleSignUp"
      />
    </NFormItem>
    <NButton
      :disabled="username === '' || email === '' || password === ''"
      round
      type="primary"
      @click="handleSignUp"
      >S'inscrire</NButton
    >
    <div>
      <NText>Déjà un compte ? </NText>
      <RouterLink to="/sign-in">Se connecter</RouterLink>
    </div>
  </NForm>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/store/auth.store'
const authStore = useAuthStore()
const router = useRouter()

const username = ref('')
const email = ref('')
const password = ref('')
const errorMessage = ref('')

const handleSignUp = async () => {
  try {
    errorMessage.value = ''
    await authStore.signUp({
      username: username.value,
      email: email.value,
      password: password.value,
    })
    router.push('/')
  } catch (_error) {
    errorMessage.value = 'Informations incorrectes ou email déjà utilisé.'
  }
}
</script>
