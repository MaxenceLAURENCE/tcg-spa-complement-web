<template>
  <NModal :show="true" :closable="false" :mask-closable="false">
    <NCard
      style="width: 450px"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
      class="end-game-card"
    >
      <div class="result-container">
        <div class="result-animation" :class="{ 'is-winner': isWinner }">
          <div v-if="isWinner" class="trophy">🏆</div>
          <div v-else class="defeat">💀</div>
        </div>

        <NH1 class="result-title">
          {{ isWinner ? 'Victoire !' : 'Défaite' }}
        </NH1>

        <NText depth="3" class="result-message">
          {{
            isWinner
              ? 'Excellent combat ! Vous avez maîtrisé le terrain.'
              : 'Le combat était rude. Ne baissez pas les bras !'
          }}
        </NText>

        <div class="result-stats">
          <NStatistic label="KOs infligés" :value="KOsInflicted" />
          <NStatistic label="KOs subis" :value="KOsSuffered" />
        </div>
      </div>

      <template #footer>
        <NButton type="primary" block size="large" @click="handleBackToLobby">
          Retour au lobby
        </NButton>
      </template>
    </NCard>
  </NModal>
</template>

<script setup lang="ts">
import { NButton, NCard, NH1, NModal, NStatistic, NText } from 'naive-ui'
import { computed } from 'vue'
import { useRouter } from 'vue-router'

import { useAuthStore } from '@/store/auth.store'
import { useGameStore } from '@/store/game.store'

const gameStore = useGameStore()
const authStore = useAuthStore()
const router = useRouter()

const isWinner = computed(() => {
  return gameStore.gameResult?.winnerId === authStore.user?.id
})

const KOsInflicted = computed(() => {
  return gameStore.gameState?.players.opponent.discard.length || 0
})

const KOsSuffered = computed(() => {
  return gameStore.gameState?.players.self.discard.length || 0
})

const handleBackToLobby = () => {
  gameStore.resetGame()
  router.push('/')
}
</script>

<style scoped>
.end-game-card {
  border-radius: 24px;
  text-align: center;
}

.result-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding: 20px 0;
}

.result-animation {
  font-size: 80px;
  line-height: 1;
  margin-bottom: 10px;
}

.result-title {
  margin: 0;
  font-size: 3em;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.is-winner .result-title {
  color: #18a058;
}

.result-message {
  font-size: 1.1em;
  max-width: 300px;
}

.result-stats {
  display: flex;
  gap: 48px;
  margin-top: 24px;
  padding: 16px 32px;
  background-color: #f9fafb;
  border-radius: 16px;
}
</style>
