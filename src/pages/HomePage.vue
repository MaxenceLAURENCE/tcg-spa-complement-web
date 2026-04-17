<template>
  <div class="container">
    <div class="section">
      <NH1>Jouer</NH1>
      <NGrid :cols="24" :x-gap="24" :y-gap="24" responsive="screen">
        <NGi :span="24" :m="12">
          <CreateRoom />
        </NGi>
        <NGi :span="24" :m="12">
          <RoomList />
        </NGi>
      </NGrid>
    </div>

    <div class="section divider">
      <DeckList />
    </div>
  </div>
</template>

<script setup lang="ts">
import { NGi, NGrid, NH1 } from 'naive-ui'
import { onMounted } from 'vue'

import DeckList from '@/components/decks/DeckList.vue'
import CreateRoom from '@/components/game/CreateRoom.vue'
import RoomList from '@/components/game/RoomList.vue'
import { useGameStore } from '@/store/game.store'

const gameStore = useGameStore()

onMounted(() => {
  gameStore.connect()
})
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
}
.section {
  margin-bottom: 48px;
}
.divider {
  border-top: 1px solid #efeff5;
  padding-top: 24px;
}
</style>
