import type { User } from './auth.js'
import type { Card } from './card.js'

export interface Room {
  id: string
  name: string
  playerCount: number
}

export interface CardInGame {
  id: string // Identifiant de la carte pendant le jeu
  card: Card
  currentHp: number
}

export interface InGamePlayer {
  user: User
  hand: Card[]
  deckCount: number
  discard: Card[]
  activePokemon: CardInGame | null
  bench: CardInGame[]
  hasPlayedEnergy: boolean
  hasAttacked: boolean
}

export interface GameState {
  id: string
  players: {
    self: InGamePlayer
    opponent: InGamePlayer
  }
  turn: number
  activePlayerId: number
  winnerId: number | null
  status: 'waiting' | 'playing' | 'finished' | 'disconnected'
  logs: string[]
}
