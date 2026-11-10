import { post } from './client'
import type { LoginRequest, RegisterRequest, TokenDto } from './types'

export const register = (data: RegisterRequest) =>
  post<{ message: string }>('/api/Authentication/register', data)

export const login = (data: LoginRequest) =>
  post<TokenDto>('/api/Authentication/login', data)

// Şimdilik localStorage. Güvenlik tartışmasını Adım 5'te yapacağız.
export const saveTokens = (t: TokenDto) => {
  localStorage.setItem('accessToken', t.accessToken)
  localStorage.setItem('refreshToken', t.refreshToken)
}