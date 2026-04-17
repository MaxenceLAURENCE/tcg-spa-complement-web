<template>
  <div class="game-zone" :class="{ 'is-opponent': isOpponent }">
    <div v-if="player" class="zone-info">
      <div class="player-details">
        <NAvatar
          round
          size="small"
          :src="`https://api.dicebear.com/7.x/avataaars/svg?seed=${player.user?.username || 'player'}`"
        />
        <NText strong class="player-name">{{
          player.user?.username || 'Joueur'
        }}</NText>
      </div>
      <div class="score-display">
        <NText depth="3" size="small">KOs</NText>
        <div class="ko-dots">
          <div
            v-for="i in 3"
            :key="i"
            class="ko-dot"
            :class="{ filled: i <= score }"
          ></div>
        </div>
      </div>
    </div>

    <div class="active-card-container">
      <div v-if="player?.activePokemon" class="active-card-wrapper">
        <SingleCard
          :card="player.activePokemon.card"
          :current-hp="player.activePokemon.currentHp"
          size="md"
        />
      </div>
      <div v-else class="card-placeholder">
        <div class="placeholder-border">
          <NEmpty description="Aucun Pokémon actif" size="small">
            <template #icon>
              <div class="i-heroicons-stop-20-solid"></div>
            </template>
          </NEmpty>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import SingleCard from '@/components/cards/SingleCard.vue'
import type { InGamePlayer } from '@/types/game'

defineProps<{
  player: InGamePlayer | null
  score: number
  isOpponent?: boolean
}>()
</script>

<style scoped>
.game-zone {
  display: flex;
  flex-direction: column;
  height: 100%;
  gap: 16px;
}

.is-opponent {
  flex-direction: column-reverse;
}

.zone-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 8px;
}

.player-details {
  display: flex;
  align-items: center;
  gap: 8px;
}

.player-name {
  font-size: 1.1em;
}

.score-display {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ko-dots {
  display: flex;
  gap: 4px;
}

.ko-dot {
  width: 12px;
  height: 12px;
  border-radius: 50%;
  border: 2px solid #e5e7eb;
}

.ko-dot.filled {
  background-color: #f87171;
  border-color: #f87171;
}

.active-card-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.active-card-wrapper {
  perspective: 1000px;
}

.card-placeholder {
  width: 180px;
  height: 250px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.placeholder-border {
  width: 100%;
  height: 100%;
  border: 2px dashed #e5e7eb;
  border-radius: 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: #f9fafb;
}
</style>
