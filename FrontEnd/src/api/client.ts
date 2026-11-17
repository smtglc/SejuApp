const BASE_URL = import.meta.env.VITE_API_URL

type UnauthorizedHandler = () => void
let unauthorizedHandler: UnauthorizedHandler | null = null

// React dışındaki API katmanının oturum kapatma işlemini tetiklemesini sağlar.
export const setUnauthorizedHandler = (handler: UnauthorizedHandler | null) => {
  unauthorizedHandler = handler
}

export class ApiError extends Error {
  status: number
  data: unknown

  constructor(status: number, data: unknown) {
    super(`HTTP ${status}`)
    this.status = status
    this.data = data
  }
}

// API'nin farklı hata gövdelerini kullanıcıya okunabilir bir metne çevirir.
export function getApiErrorMessage(error: unknown, fallback = 'İşlem tamamlanamadı. Lütfen tekrar dene.') {
  if (!(error instanceof ApiError)) return fallback
  if (typeof error.data === 'string' && error.data) return error.data
  if (error.data && typeof error.data === 'object') {
    const data = error.data as Record<string, unknown>
    if (typeof data.message === 'string') return data.message
    if (typeof data.title === 'string') return data.title
    if (data.errors && typeof data.errors === 'object') return Object.values(data.errors).flat().join(' ')
  }
  return fallback
}

async function request<T>(path: string, method: string, body?: unknown): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(localStorage.getItem('accessToken')
        ? { Authorization: `Bearer ${localStorage.getItem('accessToken')}` }
        : {}),
    },
    ...(body === undefined ? {} : { body: JSON.stringify(body) }),
  })

  const text = await res.text()
  let data: unknown = null
  try {
    data = text ? JSON.parse(text) : null
  } catch {
    data = text
  }

  if (!res.ok) {
    if (res.status === 401) {
      unauthorizedHandler?.()
      window.location.assign('/login')
    }
    throw new ApiError(res.status, data)
  }
  return data as T
}

export const get = <T>(path: string) => request<T>(path, 'GET')
export const post = <T>(path: string, body: unknown) => request<T>(path, 'POST', body)
export const put = <T>(path: string, body: unknown) => request<T>(path, 'PUT', body)
export const del = <T>(path: string) => request<T>(path, 'DELETE')
