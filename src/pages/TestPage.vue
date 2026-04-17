<template>
  <div style="padding: 20px">
    <h1>Test des composants</h1>

    <NAlert
      v-if="errorMessage"
      title="Erreur de chargement"
      type="error"
      closable
      style="margin-bottom: 20px"
    >
      {{ errorMessage }}
    </NAlert>

    <div v-if="allCards.length > 0">
      <NTabs type="line" animated>
        <NTabPane name="card" tab="SingleCard">
          <NSpace vertical :size="24">
            <div>
              <h3>Taille MD</h3>
              <SingleCard :card="allCards[0]" size="md" />
            </div>
            <div>
              <h3>Taille SM</h3>
              <SingleCard :card="allCards[0]" size="sm" />
            </div>
            <div>
              <h3>États (Sélectionné / Désactivé)</h3>
              <NSpace>
                <SingleCard :card="allCards[0]" size="md" is-selected />
                <SingleCard :card="allCards[0]" size="md" is-disabled />
              </NSpace>
            </div>
            <div>
              <h3>Barre de HP</h3>
              <SingleCard :card="allCards[0]" size="md" :current-hp="15" />
            </div>
          </NSpace>
        </NTabPane>

        <NTabPane name="grid" tab="CardGrid">
          <NSpace vertical :size="24">
            <div>
              <h3>Grille de sélection (Max 3)</h3>
              <p>Sélectionnés : {{ selectedIds.join(', ') }}</p>
              <CardGrid
                v-model:selected-ids="selectedIds"
                :cards="allCards.slice(0, 12)"
                :max="3"
              />
            </div>
            <div>
              <h3>Grille SM</h3>
              <CardGrid :cards="allCards.slice(0, 12)" size="sm" />
            </div>
          </NSpace>
        </NTabPane>
      </NTabs>
    </div>

    <NEmpty v-else-if="!errorMessage" description="Chargement des cartes..." />
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'

import CardGrid from '@/components/cards/CardGrid.vue'
import SingleCard from '@/components/cards/SingleCard.vue'
import { useApi } from '@/composables/useApi'
import type { Card } from '@/types/card'

const allCards = ref<Card[]>([])
const selectedIds = ref<number[]>([])
const errorMessage = ref('')

const api = useApi()

onMounted(async () => {
  try {
    errorMessage.value = ''
    allCards.value = await api.getCards()
  } catch (_error) {
    errorMessage.value = 'Impossible de charger les cartes.'
  }
})
</script>
