<template>
  <div class="deck-form-page">
    <NH1>{{ isEdit ? 'Modifier le deck' : 'Créer un nouveau deck' }}</NH1>

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

    <NForm @submit.prevent="handleSubmit">
      <NFormItem
        label="Nom du deck"
        :validation-status="nameStatus"
        :feedback="nameFeedback"
      >
        <NInput v-model:value="deckName" placeholder="Entrez le nom du deck" />
      </NFormItem>

      <NAlert
        v-if="selectedCardIds.length !== 10"
        type="info"
        style="margin-bottom: 24px"
      >
        Vous devez sélectionner exactement 10 cartes ({{
          selectedCardIds.length
        }}/10).
      </NAlert>

      <NSpace justify="end" style="margin-top: 24px">
        <NButton @click="router.back()">Annuler</NButton>
        <NButton
          type="primary"
          :disabled="selectedCardIds.length !== 10 || !deckName"
          :loading="isSaving"
          @click="handleSubmit"
        >
          Enregistrer
        </NButton>
      </NSpace>

      <NSpin :show="isLoadingCards">
        <CardGrid
          v-model:selected-ids="selectedCardIds"
          :cards="allCards"
          :max="10"
          size="sm"
        />
      </NSpin>
    </NForm>
  </div>
</template>

<script setup lang="ts">
import {
  NAlert,
  NButton,
  NForm,
  NFormItem,
  NH1,
  NInput,
  NSpace,
  NSpin,
  useMessage,
} from 'naive-ui'
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'

import CardGrid from '@/components/cards/CardGrid.vue'
import { useApi } from '@/composables/useApi'
import type { Card } from '@/types/card'

const api = useApi()
const route = useRoute()
const router = useRouter()
const message = useMessage()

const deckId = route.params.id as string
const isEdit = computed(() => !!deckId)

const deckName = ref('')
const selectedCardIds = ref<number[]>([])
const allCards = ref<Card[]>([])
const isLoadingCards = ref(true)
const isSaving = ref(false)
const errorMessage = ref('')

const nameStatus = computed(() => (deckName.value ? undefined : 'error'))
const nameFeedback = computed(() =>
  deckName.value ? undefined : 'Le nom est obligatoire',
)

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
  if (!isEdit.value) return
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

const handleSubmit = async () => {
  if (selectedCardIds.value.length !== 10 || !deckName.value) return

  try {
    errorMessage.value = ''
    isSaving.value = true
    if (isEdit.value) {
      await api.updateDeck(deckId, {
        name: deckName.value,
        cards: selectedCardIds.value,
      })
      message.success('Deck mis à jour avec succès.')
    } else {
      await api.createDeck({
        name: deckName.value,
        cards: selectedCardIds.value,
      })
      message.success('Deck créé avec succès.')
    }
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
.deck-form-page {
  padding: 24px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>
