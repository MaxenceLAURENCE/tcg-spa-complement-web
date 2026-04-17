<template>
  <NForm @submit.prevent="handleSubmit">
    <NFormItem
      label="Nom du deck"
      :validation-status="nameStatus"
      :feedback="nameFeedback"
    >
      <NInput v-model:value="localName" placeholder="Entrez le nom du deck" />
    </NFormItem>

    <NAlert
      v-if="localSelectedIds.length !== 10"
      type="info"
      style="margin-bottom: 24px"
    >
      Vous devez sélectionner exactement 10 cartes ({{
        localSelectedIds.length
      }}/10).
    </NAlert>

    <NSpace justify="end" style="margin-top: 24px">
      <NButton @click="emit('cancel')">Annuler</NButton>
      <NButton
        type="primary"
        :disabled="localSelectedIds.length !== 10 || !localName"
        :loading="loading"
        @click="handleSubmit"
      >
        Enregistrer
      </NButton>
    </NSpace>

    <NSpin :show="loadingCards">
      <CardGrid
        v-model:selected-ids="localSelectedIds"
        :cards="allCards"
        :max="10"
        size="sm"
      />
    </NSpin>
  </NForm>
</template>

<script setup lang="ts">
import {
  NAlert,
  NButton,
  NForm,
  NFormItem,
  NInput,
  NSpace,
  NSpin,
} from 'naive-ui'
import { computed, ref, watch } from 'vue'

import CardGrid from '@/components/cards/CardGrid.vue'
import type { Card } from '@/types/card'

// Explication props :
// Nom initial du deck :
// <DeckForm :initial-name="string" />

// Liste initiale des IDs de cartes sélectionnées :
// <DeckForm :initial-selected-ids="number[]" />

// Liste de toutes les cartes disponibles pour la sélection :
// <DeckForm :all-cards="Card[]" />

// Indique si les cartes sont en cours de chargement depuis l'API :
// <DeckForm :loading-cards="boolean" />

// Indique si le formulaire est en train d'enregistrer les données :
// <DeckForm :loading="boolean" />
const props = defineProps<{
  initialName?: string
  initialSelectedIds?: number[]
  allCards: Card[]
  loadingCards: boolean
  loading: boolean
}>()

const emit = defineEmits<{
  (e: 'submit', data: { name: string; cards: number[] }): void
  (e: 'cancel'): void
}>()

const localName = ref(props.initialName || '')
const localSelectedIds = ref<number[]>(props.initialSelectedIds || [])

watch(
  () => props.initialName,
  (newVal) => {
    if (newVal) localName.value = newVal
  },
)

watch(
  () => props.initialSelectedIds,
  (newVal) => {
    if (newVal) localSelectedIds.value = [...newVal]
  },
)

const nameStatus = computed(() => (localName.value ? undefined : 'error'))
const nameFeedback = computed(() =>
  localName.value ? undefined : 'Le nom est obligatoire',
)

const handleSubmit = () => {
  if (localSelectedIds.value.length === 10 && localName.value) {
    emit('submit', {
      name: localName.value,
      cards: localSelectedIds.value,
    })
  }
}
</script>
