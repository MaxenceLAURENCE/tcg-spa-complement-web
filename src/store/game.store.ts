import { defineStore } from 'pinia'
import { io, type Socket } from 'socket.io-client'
import { ref } from 'vue'

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
      router.push('/game')
    })

    socket.value.on('gameStateUpdated', (state: GameState) => {
      gameState.value = state
    })

    socket.value.on('error', (msg: string) => {
      error.value = msg
    })

    socket.value.on('disconnect', () => {
      isConnected.value = false
      if (gameState.value) {
        gameState.value.status = 'disconnected'
      }
    })
  }

  /**
   * Quitte la connexion socket
   */
  const disconnect = () => {
    socket.value?.disconnect()
    socket.value = null
    isConnected.value = false
    gameState.value = null
    currentRoomId.value = null
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
    connect,
    disconnect,
    createRoom,
    joinRoom,
    playCard,
    attack,
    endTurn,
  }
})
