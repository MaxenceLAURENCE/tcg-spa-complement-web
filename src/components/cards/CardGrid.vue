<template>
  <NGrid :cols="6" :x-gap="16" :y-gap="16">
    <NGi v-for="card in cards" :key="card.id">
      <SingleCard
        :card="card"
        :size="size"
        :is-selected="selectedIds.includes(card.id)"
        :is-disabled="isCardDisabled(card.id)"
        class="clickable-card"
        @click="handleCardClick(card.id)"
      />
    </NGi>
  </NGrid>
</template>

<script setup lang="ts">
import SingleCard from '@/components/cards/SingleCard.vue'
import type { Card } from '@/types/card'

// Explication props : par défaut : aucune carte sélectionnée, pas de limite max, taille moyenne (md)
// lister les carte a afficher :
// <CardGrid :cards="allCards" />

// Liste contenant les IDs des cartes actuellement sélectionnées :
// <CardGrid :cards="allCards" v-model:selected-ids="mesIds" />

// Nombre maximum de cartes pouvant être sélectionnées :
// <CardGrid :cards="allCards" :max="10" />

// Taille des cartes :
// <CardGrid :cards="allCards" size="sm" />
const props = withDefaults(
  defineProps<{
    cards: Card[]
    selectedIds?: number[]
    max?: number
    size?: 'sm' | 'md'
  }>(),
  {
    selectedIds: () => [],
    max: undefined,
    size: 'md',
  },
)

// gestion des signal pour carte cliquée ou pas :
const emit = defineEmits<(e: 'update:selectedIds', value: number[]) => void>()

const isCardDisabled = (cardId: number) => {
  if (props.max === undefined) return false
  const isSelected = props.selectedIds.includes(cardId)
  return !isSelected && props.selectedIds.length >= props.max
}

const handleCardClick = (cardId: number) => {
  const newSelectedIds = [...props.selectedIds]
  const index = newSelectedIds.indexOf(cardId)

  if (index > -1) {
    newSelectedIds.splice(index, 1)
  } else if (props.max === undefined || newSelectedIds.length < props.max) {
    newSelectedIds.push(cardId)
  } else {
    // si on a atteint le max, on ne fait rien pour les cartes non sélectionnées
    return
  }

  emit('update:selectedIds', newSelectedIds)
}
</script>

<style scoped>
.clickable-card {
  cursor: pointer;
}
</style>
