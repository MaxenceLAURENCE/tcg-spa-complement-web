import { defineStore } from 'pinia'
import { io, type Socket } from 'socket.io-client'
import { computed, ref } from 'vue'

import router from '@/router'
import type { GameState, Room } from '@/types/index'

import { useAuthStore } from './auth.store'

export const useGameStore = defineStore('game', () => {
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)
  const rooms = ref<Room[]>([])
  const currentRoomId = ref<string | null>(null)
  const gameState = ref<GameState | null>(null)
  const error = ref<string | null>(null)
  const gameResult = ref<{ winnerId: number | null } | null>(null)

  const authStore = useAuthStore()

  const isMyTurn = computed(() => {
    return gameState.value?.activePlayerId === authStore.user?.id
  })

  /** Plateau de jeu */
  const boards = computed(() => {
    if (!gameState.value) return null
    return {
      self: {
        active: gameState.value.players.self.activePokemon,
        bench: gameState.value.players.self.bench,
      },
      opponent: {
        active: gameState.value.players.opponent.activePokemon,
        bench: gameState.value.players.opponent.bench,
      },
    }
  })

  /**
   * Initialise la connexion Socket.io avec le token JWT
   */
  const connect = () => {
    if (socket.value?.connected) return

    const auth = useAuthStore()
    if (!auth.token) return

    socket.value = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token: auth.token },
    })

    socket.value.on('connect', () => {
      isConnected.value = true
    })

    // --- Événements Lobby ---
    socket.value.on('roomsList', (data: Room[]) => {
      rooms.value = data
    })

    socket.value.on('roomsListUpdated', () => {
      socket.value?.emit('getRooms')
    })

    socket.value.on('roomCreated', (id: string) => {
      currentRoomId.value = id
    })

    // --- Événements Game ---
    socket.value.on('gameStarted', (state: GameState) => {
      gameState.value = state
      gameResult.value = null
      router.push('/game')
    })

    socket.value.on('gameStateUpdated', (state: GameState) => {
      gameState.value = state
    })

    socket.value.on('gameEnded', (result: { winnerId: number | null }) => {
      gameResult.value = result
      if (gameState.value) {
        gameState.value.status = 'finished'
        gameState.value.winnerId = result.winnerId
      }
    })

    socket.value.on('opponentDisconnected', () => {
      error.value = "L'adversaire s'est déconnecté."
      if (gameState.value) {
        gameState.value.status = 'disconnected'
      }
    })

    socket.value.on('error', (msg: string) => {
      error.value = msg
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
    })
  }

  /**
   * Remet le store à son état initial
   */
  const resetGame = () => {
    gameState.value = null
    currentRoomId.value = null
    gameResult.value = null
    error.value = null
  }

  /**
   * Quitte la connexion socket
   */
  const disconnect = () => {
    socket.value?.disconnect()
    socket.value = null
    isConnected.value = false
    resetGame()
  }

  /**
   * Actions du Lobby
   */
  const createRoom = (deckId: number) => {
    socket.value?.emit('createRoom', { deckId })
  }

  const joinRoom = (roomId: string, deckId: number) => {
    socket.value?.emit('joinRoom', { roomId, deckId })
  }

  /**
   * Actions de Jeu
   */
  const drawCards = (count: number = 1) => {
    socket.value?.emit('drawCards', { count })
  }

  const playCard = (cardId: number) => {
    socket.value?.emit('playCard', { cardId })
  }

  const attack = () => {
    socket.value?.emit('attack')
  }

  const endTurn = () => {
    socket.value?.emit('endTurn')
  }

  return {
    isConnected,
    rooms,
    currentRoomId,
    gameState,
    error,
    gameResult,
    isMyTurn,
    boards,
    connect,
    disconnect,
    resetGame,
    createRoom,
    joinRoom,
    drawCards,
    playCard,
    attack,
    endTurn,
  }
})
