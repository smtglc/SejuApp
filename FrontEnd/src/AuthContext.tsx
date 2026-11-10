import { createContext, useContext, useState, type ReactNode } from 'react'
import type { TokenDto } from './api/types'

interface AuthState {
  userName: string | null
  isLoggedIn: boolean
  signIn: (tokens: TokenDto, userName: string) => void
  signOut: () => void
}

const AuthContext = createContext<AuthState | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Sayfa yenilenince giriş durumu kaybolmasın diye başlangıç değerini localStorage'dan okuyoruz
  const [userName, setUserName] = useState<string | null>(() =>
    localStorage.getItem('accessToken') ? localStorage.getItem('userName') : null
  )

  const signIn = (tokens: TokenDto, name: string) => {
    localStorage.setItem('accessToken', tokens.accessToken)
    localStorage.setItem('refreshToken', tokens.refreshToken)
    localStorage.setItem('userName', name)
    setUserName(name)
  }

  const signOut = () => {
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    localStorage.removeItem('userName')
    setUserName(null)
  }

  return (
    <AuthContext.Provider value={{ userName, isLoggedIn: userName !== null, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth, AuthProvider içinde kullanılmalı')
  return ctx
}