export interface RegisterRequest {
  firstName: string
  lastName: string
  userName: string
  email: string
  password: string
}

export interface LoginRequest {
  userName: string
  password: string
}

export interface TokenDto {
  accessToken: string
  refreshToken: string
}

export interface IdentityError {
  code: string
  description: string
}

// Backend ResponseDeckDto alanlarıyla eşleşir.
export interface Deck {
  id: string
  name: string
  description: string | null
  cards: Card[]
}

// Backend şu an Id döndürmüyor; alan ileride eklendiğinde silme otomatik etkinleşir.
export interface Card {
  id?: string
  word: string
  meaning: string
}

export interface CreateDeckRequest {
  name: string
  description: string
}

export interface CreateCardRequest {
  word: string
  meaning: string
}
