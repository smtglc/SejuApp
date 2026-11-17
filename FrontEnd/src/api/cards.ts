import { del, get, post } from './client'
import type { Card, CreateCardRequest } from './types'

// Mevcut ASP.NET CardController rotaları.
const CARDS_API = '/api/Card'

export const getCards = (deckId: string) => get<Card[]>(`${CARDS_API}/${deckId}`)
export const createCard = (deckId: string, data: CreateCardRequest) =>
  post<void>(`${CARDS_API}/${deckId}`, data)
export const deleteCard = (cardId: string) => del<void>(`${CARDS_API}?cardId=${cardId}`)
