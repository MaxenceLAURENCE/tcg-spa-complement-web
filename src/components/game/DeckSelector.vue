<template>
  <div class="deck-selector">
    <NText strong>Choisissez votre deck de combat :</NText>

    <NAlert
      v-if="errorMessage"
      title="Erreur"
      type="error"
      closable
      style="margin-top: 8px"
      @close="errorMessage = ''"
    >
      {{ errorMessage }}
    </NAlert>

    <NSpin :show="isLoading">
      <NSelect
        v-model:value="selectedDeckId"
        :options="options"
        placeholder="Sélectionnez un deck de 10 cartes"
        :disabled="isLoading"
        @update:value="handleUpdate"
      />
      <NText v-if="decks.length === 0 && !isLoading" type="error" size="small">
        Vous devez d'abord créer un deck pour jouer.
      </NText>
    </NSpin>
  </div>
</template>

<script setup lang="ts">
import { NAlert, NSelect, NSpin, NText } from 'naive-ui'
import { computed, onMounted, ref } from 'vue'

import { useApi } from '@/composables/useApi'
import type { Deck } from '@/types/index'

// Explication props :
// pour le v-model du deck sélectionné :
// <DeckSelector v-model="selectedDeckId" />
const props = defineProps<{
  modelValue: number | null
}>()

const emit =
  defineEmits<(e: 'update:modelValue', value: number | null) => void>()

const api = useApi()
const decks = ref<Deck[]>([])
const isLoading = ref(true)
const errorMessage = ref('')

const selectedDeckId = ref<number | null>(props.modelValue)

const options = computed(() =>
  decks.value.map((d) => ({
    label: d.name,
    value: d.id,
  })),
)

const handleUpdate = (val: number | null) => {
  emit('update:modelValue', val)
}

onMounted(async () => {
  try {
    errorMessage.value = ''
    isLoading.value = true
    decks.value = await api.getMyDecks()
    // Auto-select first deck if available
    if (decks.value.length > 0 && !selectedDeckId.value) {
      selectedDeckId.value = decks.value[0].id
      emit('update:modelValue', selectedDeckId.value)
    }
  } catch (_error) {
    errorMessage.value = 'Impossible de charger vos decks.'
  } finally {
    isLoading.value = false
  }
})
</script>

<style scoped>
.deck-selector {
  margin-bottom: 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
