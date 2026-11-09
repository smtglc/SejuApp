import { useState, type FormEvent } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import './Login.css'

type Mode = 'login' | 'register'

export default function Login() {
  const [params] = useSearchParams()
  const [mode, setMode] = useState<Mode>(params.get('mode') === 'register' ? 'register' : 'login')

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const isRegister = mode === 'register'

  const switchMode = (m: Mode) => {
    setMode(m)
    setError('')
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')

    if (isRegister && password !== confirm) {
      setError('Şifreler eşleşmiyor.')
      return
    }
    if (password.length < 6) {
      setError('Şifre en az 6 karakter olmalı.')
      return
    }

    setLoading(true)
    try {
      // TODO: Backend'e bağla. Örnek:
      // const res = await fetch('http://localhost:3000/api/auth/' + mode, {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ name, email, password }),
      // })
      // if (!res.ok) throw new Error('İşlem başarısız')
      console.log(mode, { name, email, password })
    } catch {
      setError('Bir hata oluştu, tekrar dene.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page auth">
      <Link to="/" className="auth-back">
        ← Ana sayfa
      </Link>

      <div className="auth-card">
        <h1>{isRegister ? 'Hesap oluştur' : 'Giriş yap'}</h1>
        <p className="auth-sub">
          {isRegister ? 'Birkaç bilgi ile başla.' : 'Hesabına giriş yap.'}
        </p>

        <form onSubmit={handleSubmit} className="auth-form">
          {isRegister && (
            <label>
              Ad Soyad
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="name"
                required
              />
            </label>
          )}

          <label>
            E-posta
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              placeholder="ornek@mail.com"
              required
            />
          </label>

          <label>
            Şifre
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
              required
            />
          </label>

          {isRegister && (
            <label>
              Şifre (tekrar)
              <input
                type="password"
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                autoComplete="new-password"
                required
              />
            </label>
          )}

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
