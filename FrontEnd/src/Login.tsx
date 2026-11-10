import './Login.css'
import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { login, register } from './api/auth'
import { useAuth } from './AuthContext'
import { ApiError } from './api/client'
import type { IdentityError } from './api/types'

type Mode = 'login' | 'register'

function getErrorMessage(err: unknown): string {
  if (err instanceof ApiError) {
    if (err.status === 401) return 'Kullanıcı adı veya şifre hatalı.'
    if (Array.isArray(err.data)) {
      return (err.data as IdentityError[]).map((e) => e.description).join(' ')
    }
    return 'İşlem başarısız, bilgileri kontrol et.'
  }
  return 'Sunucuya ulaşılamadı. Backend çalışıyor mu?'
}

export default function Login() {
  const [params] = useSearchParams()
  const navigate = useNavigate()
  const [mode, setMode] = useState<Mode>(params.get('mode') === 'register' ? 'register' : 'login')

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [userName, setUserName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [info, setInfo] = useState('')
  const [loading, setLoading] = useState(false)

  const isRegister = mode === 'register'
const { signIn } = useAuth()
  const switchMode = (m: Mode) => {
    setMode(m)
    setError('')
    setInfo('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setInfo('')

    if (isRegister && password !== confirm) {
      setError('Şifreler eşleşmiyor.')
      return
    }

    setLoading(true)
    try {
      if (isRegister) {
        await register({ firstName, lastName, userName, email, password })
        setMode('login')
        setPassword('')
        setConfirm('')
        setInfo('Kayıt başarılı. Şimdi giriş yapabilirsin.')
      } else {
         const tokens = await login({ userName, password })
            signIn(tokens, userName)
          setInfo('Giriş başarılı! Yönlendiriliyorsun...')
         setTimeout(() => navigate('/'), 1000)
      }
    } catch (err) {
      setError(getErrorMessage(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page auth">
      <Link to="/" className="auth-back">← Ana sayfa</Link>

      <div className="auth-card">
        <h1>{isRegister ? 'Hesap oluştur' : 'Giriş yap'}</h1>
        <p className="auth-sub">{isRegister ? 'Birkaç bilgi ile başla.' : 'Hesabına giriş yap.'}</p>

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <>
              <label>
                Ad
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" required />
              </label>
              <label>
                Soyad
                <input value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" required />
              </label>
            </>
          )}

          <label>
            Kullanıcı adı
            <input value={userName} onChange={(e) => setUserName(e.target.value)} autoComplete="username" required />
          </label>

          {isRegister && (
            <label>
              E-posta
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="ornek@mail.com" required />
            </label>
          )}

          <label>
            Şifre
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} autoComplete={isRegister ? 'new-password' : 'current-password'} required />
          </label>

          {isRegister && (
            <label>
              Şifre (tekrar)
              <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" required />
            </label>
          )}

          {info && <p className="auth-info">{info}</p>}
          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
            {loading ? 'Bekle...' : isRegister ? 'Kaydol' : 'Giriş Yap'}
          </button>
        </form>

        <p className="auth-switch">
          {isRegister ? 'Zaten hesabın var mı?' : 'Hesabın yok mu?'}{' '}
          <button type="button" onClick={() => switchMode(isRegister ? 'login' : 'register')}>
            {isRegister ? 'Giriş yap' : 'Kaydol'}
          </button>
        </p>
      </div>
    </main>
  )
}