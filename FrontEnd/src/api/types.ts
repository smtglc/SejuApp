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