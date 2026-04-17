<template>
  <div class="player-hand">
    <div class="deck-section">
      <div class="deck-visual">
        <div class="deck-count">{{ player.deckCount }}</div>
      </div>
      <NText size="small" depth="3" class="deck-label">DECK</NText>
    </div>

    <div class="hand-section">
      <NScrollbar x-scrollable>
        <div class="hand-cards">
          <div
            v-for="(card, index) in player.hand"
            :key="`${card.id}-${index}`"
            class="hand-card-item"
            :style="{ '--index': index }"
            @click="handlePlayCard(card.id)"
          >
            <SingleCard
              :card="card"
              size="sm"
              :is-disabled="!gameStore.isMyTurn || !!player.activePokemon"
              class="hand-card"
            />
          </div>
        </div>
      </NScrollbar>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NScrollbar, NText } from 'naive-ui'

import SingleCard from '@/components/cards/SingleCard.vue'
import { useGameStore } from '@/store/game.store'
import type { InGamePlayer } from '@/types/game'

const props = defineProps<{
  player: InGamePlayer
}>()

const gameStore = useGameStore()

const handlePlayCard = (cardId: number) => {
  if (gameStore.isMyTurn && !props.player.activePokemon) {
    gameStore.playCard(cardId)
  }
}
</script>

<style scoped>
.player-hand {
  display: flex;
  align-items: center;
  gap: 24px;
  padding: 8px;
  background-color: rgba(255, 255, 255, 0.5);
  border-radius: 8px;
}

.deck-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.deck-visual {
  width: 50px;
  height: 70px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 4px;
  border: 2px solid #fff;
  box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  font-weight: bold;
  position: relative;
}

.deck-visual::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 100%;
  height: 100%;
  background: #1d4ed8;
  border-radius: 4px;
  z-index: -1;
}

.deck-count {
  font-size: 1.2em;
}

.deck-label {
  font-weight: bold;
  letter-spacing: 0.05em;
}

.hand-section {
  flex: 1;
  overflow: hidden;
}

.hand-cards {
  display: flex;
  gap: 8px;
  padding: 8px 4px;
  justify-content: center;
}

.hand-card-item {
  transition: transform 0.2s ease;
  cursor: pointer;
}

.hand-card-item:hover {
  transform: translateY(-20px) scale(1.05);
  z-index: 10;
}

.hand-card {
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}
</style>
