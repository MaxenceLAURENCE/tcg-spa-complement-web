<template>
  <NCard title="Parties disponibles">
    <NSpin :show="!gameStore.isConnected">
      <NSpace vertical size="large">
        <NAlert
          v-for="room in gameStore.rooms"
          :key="room.id"
          :title="room.name"
          type="info"
        >
          <template #header>
            <div class="room-header">
              <span>{{ room.name }}</span>
              <span class="room-players">{{ room.playerCount }}/2</span>
            </div>
          </template>
          <NSpace vertical size="small">
            <NText depth="3">Hôte : {{ room.id }}</NText>
            <DeckSelector v-model="selectedDeckIds[room.id]" />
            <NButton
              size="small"
              type="info"
              secondary
              :disabled="!selectedDeckIds[room.id] || room.playerCount >= 2"
              @click="handleJoinRoom(room.id)"
            >
              Rejoindre
            </NButton>
          </NSpace>
        </NAlert>
        <NEmpty
          v-if="gameStore.rooms.length === 0"
          description="Aucune partie disponible"
        />
      </NSpace>
    </NSpin>
  </NCard>
</template>

<script setup lang="ts">
import { NAlert, NButton, NCard, NEmpty, NSpace, NSpin, NText } from 'naive-ui'
import { reactive } from 'vue'

import { useGameStore } from '@/store/game.store'

import DeckSelector from './DeckSelector.vue'

const gameStore = useGameStore()
const selectedDeckIds = reactive<Record<string, number | null>>({})

const handleJoinRoom = (roomId: string) => {
  const deckId = selectedDeckIds[roomId]
  if (deckId) {
    gameStore.joinRoom(roomId, deckId)
  }
}
</script>

<style scoped>
.room-header {
  display: flex;
  justify-content: space-between;
  width: 100%;
}
.room-players {
  font-weight: bold;
}
</style>
