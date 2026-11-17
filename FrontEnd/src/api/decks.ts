import { del, get, post } from './client'
import type { CreateDeckRequest, Deck } from './types'

// Mevcut ASP.NET controller rotaları burada merkezi olarak tutulur.
const DECKS_API = '/api/Deck'

export const getDecks = () => get<Deck[]>(`${DECKS_API}/all`)
export const getDeck = (id: string) => get<Deck>(`${DECKS_API}/${id}`)
export const createDeck = (data: CreateDeckRequest) => post<Deck>(`${DECKS_API}/create`, data)
export const deleteDeck = (id: string) => del<void>(`${DECKS_API}/${id}`)
