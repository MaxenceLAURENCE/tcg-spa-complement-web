<template>
  <div class="game-page">
    <div v-if="!gameStore.players" class="loading-container">
      <NSpin size="large" />
      <NText>En attente du début de la partie...</NText>
    </div>

    <div v-else class="game-container">
      <!-- Zone Adversaire (Haut) -->
      <div class="zone opponent-zone">
        <GameZone
          :player="gameStore.players.opponent"
          :score="gameStore.players.self?.score || 0"
          is-opponent
        />
      </div>

      <!-- Barre d'actions (Milieu) -->
      <div class="action-bar-container">
        <ActionBar />
      </div>

      <!-- Zone Joueur (Bas) -->
      <div class="zone player-zone">
        <GameZone
          :player="gameStore.players.self"
          :score="gameStore.players.opponent?.score || 0"
        />
        <PlayerHand :player="gameStore.players.self" />
      </div>
    </div>

    <EndGameModal v-if="gameStore.gameResult" />
  </div>
</template>

<script setup lang="ts">
import { onUnmounted } from 'vue'

import ActionBar from '@/components/game/ActionBar.vue'
import EndGameModal from '@/components/game/EndGameModal.vue'
import GameZone from '@/components/game/GameZone.vue'
import PlayerHand from '@/components/game/PlayerHand.vue'
import { useGameStore } from '@/store/game.store'

const gameStore = useGameStore()

onUnmounted(() => {
  gameStore.resetGame()
})
</script>

<style scoped>
.game-page {
  height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  background-color: #f5f7f9;
}

.loading-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 16px;
}

.game-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  gap: 16px;
  overflow: hidden;
}

.zone {
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.05);
  padding: 16px;
  position: relative;
}

.opponent-zone {
  border-top: 4px solid #f87171;
}

.player-zone {
  border-bottom: 4px solid #60a5fa;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.action-bar-container {
  height: 80px;
  display: flex;
  align-items: center;
}
</style>
