<template>
  <div class="deck-page">
    <NH1>Modifier le deck</NH1>

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

    <DeckForm
      :initial-name="deckName"
      :initial-selected-ids="selectedCardIds"
      :all-cards="allCards"
      :loading-cards="isLoadingCards"
      :loading="isSaving"
      @submit="handleSubmit"
      @cancel="router.back()"
    />
  </div>
</template>

<script setup lang="ts">
import { NAlert, NH1, useMessage } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import DeckForm from '@/components/decks/DeckForm.vue'
import { useApi } from '@/composables/useApi'
import type { Card } from '@/types/card'

const api = useApi()
const route = useRoute()
const router = useRouter()
const message = useMessage()

const deckId = route.params.id as string
const deckName = ref('')
const selectedCardIds = ref<number[]>([])
const allCards = ref<Card[]>([])
const isLoadingCards = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')

const fetchAllCards = async () => {
  try {
    errorMessage.value = ''
    isLoadingCards.value = true
    allCards.value = await api.getCards()
  } catch (_error) {
    errorMessage.value = 'Erreur lors du chargement des cartes.'
  } finally {
    isLoadingCards.value = false
  }
}

const fetchDeck = async () => {
  try {
    errorMessage.value = ''
    const deck = await api.getDeck(deckId)
    deckName.value = deck.name
    selectedCardIds.value = deck.cards.map((dc) => dc.cardId)
  } catch (_error) {
    errorMessage.value = 'Erreur lors du chargement du deck.'
    router.push('/')
  }
}

const handleSubmit = async (data: { name: string; cards: number[] }) => {
  try {
    errorMessage.value = ''
    isSaving.value = true
    await api.updateDeck(deckId, data)
    message.success('Deck mis à jour avec succès.')
    router.push('/')
  } catch (_error) {
    errorMessage.value = "Erreur lors de l'enregistrement du deck."
  } finally {
    isSaving.value = false
  }
}

onMounted(() => {
  fetchAllCards()
  fetchDeck()
})
</script>

<style scoped>
.deck-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
