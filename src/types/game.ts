import { defineStore } from 'pinia'
import { io, type Socket } from 'socket.io-client'
import { computed, ref } from 'vue'

import router, { ROUTES } from '@/router'
import type { RealGameState, Room } from '@/types/index'

import { useAuthStore } from './auth.store'

export const useGameStore = defineStore('game', () => {
  const socket = ref<Socket | null>(null)
  const isConnected = ref(false)
  const rooms = ref<Room[]>([])
  const currentRoomId = ref<string | null>(null)
  const gameState = ref<RealGameState | null>(null)
  const error = ref<string | null>(null)
  const gameResult = ref<{ winnerId: number | null } | null>(null)
  const logs = ref<string[]>([])

  const authStore = useAuthStore()

  /** Identifie si c'est mon tour via le socket ID */
  const isMyTurn = computed(() => {
    if (!gameState.value || !socket.value) return false
    return gameState.value.currentPlayerSocketId === socket.value.id
  })

  /** Mappe l'état host/guest vers self/opponent pour les composants */
  const players = computed(() => {
    if (!gameState.value || !socket.value) return null

    const isHost = socket.value.id === gameState.value.host.socketId
    const selfState = isHost ? gameState.value.host : gameState.value.guest
    const opponentState = isHost ? gameState.value.guest : gameState.value.host

    const mapPlayer = (ps: unknown, isMe: boolean) => {
      if (!ps) return null
      return {
        ...ps,
        activePokemon: ps.activeCard,
        deckCount: ps.deck?.length || 0,
        discard: Array(ps.score || 0).fill({}), // Simulation pour l'affichage des KOs
        user: isMe ? authStore.user : ps.user || { username: 'Adversaire' },
      }
    }

    return {
      self: mapPlayer(selfState, true),
      opponent: mapPlayer(opponentState, false),
    }
  })

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

    socket.value.on('roomsList', (data: Room[]) => {
      rooms.value = data
    })

    socket.value.on('roomsListUpdated', () => {
      socket.value?.emit('getRooms')
    })

    socket.value.on('roomCreated', (data: unknown) => {
      currentRoomId.value = data.roomId || data
    })

    socket.value.on('gameStarted', (payload: unknown) => {
      gameState.value = payload.gameState || payload
      gameResult.value = null
      logs.value = [payload.message || 'La partie commence !']
      router.push(ROUTES.GAME)
    })

    socket.value.on('gameStateUpdated', (payload: unknown) => {
      gameState.value = payload.gameState || payload
      if (payload.message) logs.value.push(payload.message)
    })

    socket.value.on('gameEnded', (result: unknown) => {
      gameResult.value = result
      if (gameState.value) {
        gameState.value.status = 'finished'
      }
    })

    socket.value.on('opponentDisconnected', () => {
      error.value = "L'adversaire s'est déconnecté."
      if (gameState.value) {
        gameState.value.status = 'disconnected'
      }
    })

    socket.value.on('error', (payload: unknown) => {
      error.value = payload.message || payload
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
    })
  }

  const resetGame = () => {
    gameState.value = null
    currentRoomId.value = null
    gameResult.value = null
    error.value = null
    logs.value = []
  }

  const disconnect = () => {
    socket.value?.disconnect()
    socket.value = null
    isConnected.value = false
    resetGame()
  }

  const createRoom = (deckId: number) => {
    socket.value?.emit('createRoom', { deckId })
  }

  const joinRoom = (roomId: string, deckId: number) => {
    socket.value?.emit('joinRoom', { roomId, deckId })
  }

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
    players,
    logs,
    error,
    gameResult,
    isMyTurn,
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
