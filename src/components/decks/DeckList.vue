<template>
  <div class="deck-list-container">
    <div class="header">
      <NH2>Mes Decks</NH2>
      <NButton type="primary" @click="handleCreateDeck"
        >Créer un nouveau deck</NButton
      >
    </div>

    <NAlert
      v-if="errorMessage"
      title="Erreur"
      type="error"
      closable
      style="margin-bottom: 24px"
      @close="errorMessage = ''"
    >
      {{ errorMessage }}
    </NAlert>

    <NSpin :show="isLoading">
      <NGrid v-if="decks.length > 0" x-gap="12" y-gap="12" :cols="4">
        <NGi v-for="deck in decks" :key="deck.id">
          <NCard :title="deck.name" hoverable>
            <template #footer>
              <NSpace justify="end">
                <NButton size="small" @click="handleViewDeck(deck.id)"
                  >Voir</NButton
                >
                <NButton
                  size="small"
                  type="info"
                  @click="handleEditDeck(deck.id)"
                  >Modifier</NButton
                >
                <NPopconfirm
                  positive-text="Supprimer"
                  negative-text="Annuler"
                  @positive-click="handleDeleteDeck(deck.id)"
                >
                  <template #trigger>
                    <NButton size="small" type="error">Supprimer</NButton>
                  </template>
                  Êtes-vous sûr de vouloir supprimer ce deck ?
                </NPopconfirm>
              </NSpace>
            </template>
          </NCard>
        </NGi>
      </NGrid>
      <NEmpty v-else description="Vous n'avez pas encore de deck." />
    </NSpin>
  </div>
</template>

<script setup lang="ts">
import {
  NAlert,
  NButton,
  NCard,
  NEmpty,
  NGi,
  NGrid,
  NH2,
  NPopconfirm,
  NSpace,
  NSpin,
  useMessage,
} from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import { useApi } from '@/composables/useApi'
import { ROUTES } from '@/router'
import type { Deck } from '@/types/deck'

const api = useApi()
const router = useRouter()
const message = useMessage()

const decks = ref<Deck[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

const fetchDecks = async () => {
  try {
    errorMessage.value = ''
    isLoading.value = true
    decks.value = await api.getMyDecks()
  } catch (_error) {
    errorMessage.value = 'Impossible de charger les decks.'
  } finally {
    isLoading.value = false
  }
}

const handleDeleteDeck = async (id: number) => {
  try {
    errorMessage.value = ''
    await api.deleteDeck(id)
    message.success('Deck supprimé avec succès.')
    await fetchDecks()
  } catch (_error) {
    errorMessage.value = 'Erreur lors de la suppression du deck.'
  }
}

const handleCreateDeck = () => {
  router.push(`${ROUTES.HOME}decks/new`)
}

const handleEditDeck = (id: number) => {
  router.push(`${ROUTES.HOME}decks/${id}/edit`)
}

const handleViewDeck = (id: number) => {
  router.push(`${ROUTES.HOME}decks/${id}`)
}

onMounted(() => {
  fetchDecks()
})
</script>

<style scoped>
.deck-list-container {
  padding: 24px;
}
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
</style>
