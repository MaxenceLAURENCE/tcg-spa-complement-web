<template>
  <div class="deck-details-page">
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
      <div v-if="deck">
        <NH1>{{ deck.name }}</NH1>
        <NButton style="margin-bottom: 24px" @click="router.push('/')"
          >Retour à la liste</NButton
        >

        <NGrid x-gap="16" y-gap="16" cols="1 s:2 m:3 l:5" responsive="screen">
          <NGi v-for="dc in deckCards" :key="dc.id">
            <SingleCard :card="dc" size="md" />
          </NGi>
        </NGrid>
      </div>
    </NSpin>
  </div>
</template>

<script setup lang="ts">
import { NAlert, NButton, NGi, NGrid, NH1, NSpin } from 'naive-ui'
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import SingleCard from '@/components/cards/SingleCard.vue'
import { useApi } from '@/composables/useApi'
import type { Card } from '@/types/card'
import type { Deck } from '@/types/deck'

const api = useApi()
const route = useRoute()
const router = useRouter()

const deckId = route.params.id as string
const deck = ref<Deck | null>(null)
const deckCards = ref<Card[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

const fetchDeckDetails = async () => {
  try {
    errorMessage.value = ''
    isLoading.value = true
    // 1. Récupérer le deck
    const deckData = await api.getDeck(deckId)
    deck.value = deckData

    // 2. Récupérer toutes les cartes pour trouver les détails de celles du deck
    const allCards = await api.getCards()
    const cardIds = deckData.cards.map((dc) => dc.cardId)
    deckCards.value = allCards.filter((c) => cardIds.includes(c.id))
  } catch (_error) {
    errorMessage.value = 'Erreur lors du chargement des détails du deck.'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchDeckDetails()
})
</script>

<style scoped>
.deck-details-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
