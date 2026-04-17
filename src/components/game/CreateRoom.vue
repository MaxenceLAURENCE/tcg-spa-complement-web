<template>
  <NCard title="Créer une partie">
    <NSpace vertical size="large">
      <DeckSelector v-model="selectedDeckId" />
      <NButton
        type="primary"
        block
        :disabled="!selectedDeckId || !!gameStore.currentRoomId"
        :loading="!!gameStore.currentRoomId"
        @click="handleCreateRoom"
      >
        Créer une partie
      </NButton>
    </NSpace>
  </NCard>
</template>

<script setup lang="ts">
import { NButton, NCard, NSpace } from 'naive-ui'
import { ref } from 'vue'

import { useGameStore } from '@/store/game.store'

import DeckSelector from './DeckSelector.vue'

const gameStore = useGameStore()
const selectedDeckId = ref<number | null>(null)

const handleCreateRoom = () => {
  if (selectedDeckId.value) {
    gameStore.createRoom(selectedDeckId.value)
  }
}
</script>
