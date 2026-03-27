<template>
  <NCard
    hoverable
    class="pokemon-card"
    :class="[size, { 'is-selected': isSelected, 'is-disabled': isDisabled }]"
  >
    <div class="card-content">
      <img :src="card.imgUrl" :alt="card.name" class="pokemon-image" />
      <span class="pokedex-number">#{{ card.pokedexNumber }}</span>
      <span class="pokemon-name">{{ card.name }}</span>
      <NTag
        :color="{ textColor: 'white', color: typeColor }"
        :bordered="false"
        class="pokemon-type"
      >
        {{ card.type }}
      </NTag>
      <div class="pokemon-stats">
        <span>❤️ {{ card.hp }}</span>
        <span>⚔️ {{ card.attack }}</span>
      </div>
      <div v-if="currentHp !== undefined" class="hp-bar">
        <NProgress
          type="line"
          :percentage="(currentHp / card.hp) * 100"
          :show-indicator="false"
        />
        <div class="hp-text">{{ currentHp }} / {{ card.hp }} HP</div>
      </div>
    </div>
  </NCard>
</template>

<script setup lang="ts">
import { computed } from 'vue'

import type { Card } from '@/types/card'

// Explication props :
// pour la taille :
// <SigleCard :card="card" size="sm" /> ou <SigleCard :card="card" size="md" />                               <!-- Standard -->

// pour la séléction :
// <SigleCard :card="card" size="md" is-selected />
// <SigleCard :card="card" size="md" is-disabled />

// pour la vie :
// <SigleCard :card="card" size="md" :current-hp="15" />
const props = defineProps<{
  card: Card
  size?: 'sm' | 'md'
  isSelected?: boolean
  isDisabled?: boolean
  currentHp?: number
}>()

const typeColor = computed(() => {
  // couleur selon le type de la carte
  switch (props.card.type) {
    case 'Fire':
      return '#F08030'
    case 'Water':
      return '#6890F0'
    case 'Grass':
      return '#78C850'
    case 'Electric':
      return '#F8D030'
    case 'Psychic':
      return '#F85888'
    case 'Ice':
      return '#98D8D8'
    case 'Dragon':
      return '#7038F8'
    case 'Dark':
      return '#705848'
    case 'Fairy':
      return '#EE99AC'
    case 'Fighting':
      return '#C03028'
    case 'Poison':
      return '#A040A0'
    case 'Ground':
      return '#E0C068'
    case 'Flying':
      return '#A890F0'
    case 'Bug':
      return '#A8B820'
    case 'Rock':
      return '#B8A038'
    case 'Ghost':
      return '#705898'
    case 'Steel':
      return '#B8B8D0'
    case 'Normal':
      return '#A8A878'
    default:
      return '#A8A878'
  }
})
</script>

<style scoped>
.pokemon-card {
  border-radius: 8px;
  transition: all 0.3s ease;
}

.pokemon-card.md {
  max-width: 220px;
}

.pokemon-card.sm {
  max-width: 160px;
}

.pokemon-card.is-selected {
  border: 2px solid #18a058;
  box-shadow: 0 0 10px rgba(24, 160, 88, 0.4);
}

.pokemon-card.is-disabled {
  opacity: 0.6;
  filter: grayscale(80%);
  cursor: not-allowed;
  pointer-events: none;
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.pokemon-image {
  object-fit: contain;
  margin-bottom: 12px;
}

.md .pokemon-image {
  width: 140px;
  height: 140px;
}

.sm .pokemon-image {
  width: 80px;
  height: 80px;
}

.pokedex-number {
  color: #888;
  font-size: 0.9em;
  margin-bottom: 4px;
}

.sm .pokedex-number {
  font-size: 0.8em;
}

.pokemon-name {
  margin: 0 0 10px 0;
  font-size: 1.1em;
  font-weight: 600;
  color: #333;
}

.sm .pokemon-name {
  font-size: 0.9em;
  margin-bottom: 5px;
}

.pokemon-type {
  margin-bottom: 12px;
  font-weight: 600;
  padding: 0 12px;
  border-radius: 4px;
}

.sm .pokemon-type {
  margin-bottom: 8px;
  padding: 0 8px;
}

.pokemon-stats {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #555;
  font-size: 0.95em;
}

.sm .pokemon-stats {
  font-size: 0.8em;
  gap: 4px;
}

.hp-bar {
  width: 100%;
  margin-top: 12px;
}

.hp-text {
  font-size: 0.8em;
  margin-top: 4px;
  color: #666;
}
</style>
