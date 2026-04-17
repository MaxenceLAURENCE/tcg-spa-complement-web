<template>
  <div class="action-bar">
    <div class="turn-info">
      <div class="turn-status" :class="{ 'is-my-turn': gameStore.isMyTurn }">
        {{ gameStore.isMyTurn ? 'À vous de jouer' : "Attente de l'adversaire" }}
      </div>
      <div class="turn-count">Tour {{ gameStore.gameState?.turn || 1 }}</div>
    </div>

    <div class="actions">
      <NSpace>
        <NButton
          type="primary"
          secondary
          :disabled="!canDraw"
          @click="gameStore.drawCards()"
        >
          <template #icon>
            <div class="i-heroicons-plus-circle-20-solid"></div>
          </template>
          Piocher
        </NButton>

        <NButton
          type="error"
          :disabled="!canAttack"
          @click="gameStore.attack()"
        >
          <template #icon>
            <div class="i-heroicons-bolt-20-solid"></div>
          </template>
          Attaquer
        </NButton>

        <NButton
          type="warning"
          secondary
          :disabled="!gameStore.isMyTurn"
          @click="gameStore.endTurn()"
        >
          <template #icon>
            <div class="i-heroicons-forward-20-solid"></div>
          </template>
          Fin de tour
        </NButton>
      </NSpace>
    </div>

    <div class="logs-container">
      <div class="logs-label">Journal :</div>
      <div ref="logsList" class="logs-list">
        <div
          v-for="(log, i) in gameStore.gameState?.logs.slice(-3)"
          :key="i"
          class="log-entry"
        >
          {{ log }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NButton, NSpace } from 'naive-ui'
import { computed } from 'vue'

import { useGameStore } from '@/store/game.store'

const gameStore = useGameStore()

const canDraw = computed(() => {
  if (!gameStore.isMyTurn || !gameStore.gameState) return false
  const p = gameStore.gameState.players.self
  return p.hand.length < 5 && p.deckCount > 0
})

const canAttack = computed(() => {
  if (!gameStore.isMyTurn || !gameStore.gameState) return false
  const p = gameStore.gameState.players.self
  const o = gameStore.gameState.players.opponent
  return !!p.activePokemon && !!o.activePokemon && !p.hasAttacked
})
</script>

<style scoped>
.action-bar {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
  height: 100%;
}

.turn-info {
  display: flex;
  flex-direction: column;
}

.turn-status {
  font-weight: bold;
  font-size: 1.1em;
  color: #6b7280;
}

.turn-status.is-my-turn {
  color: #18a058;
}

.turn-count {
  font-size: 0.8em;
  color: #9ca3af;
}

.actions {
  flex: 1;
  display: flex;
  justify-content: center;
}

.logs-container {
  width: 250px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  font-size: 0.85em;
}

.logs-label {
  font-weight: bold;
  color: #9ca3af;
  font-size: 0.75em;
  text-transform: uppercase;
}

.logs-list {
  background-color: #f3f4f6;
  padding: 4px 8px;
  border-radius: 4px;
  height: 48px;
  overflow: hidden;
}

.log-entry {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #4b5563;
}
</style>
