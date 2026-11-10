import './Hero.css'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'

const LINKS = ['Languages', 'Global', 'Free', 'Kılavuz', 'SSS']

export default function Hero() {
  const { isLoggedIn, userName, signOut } = useAuth()

  return (
    <section className="hero" id="top">
      <header className="nav">
        <strong className="logo">Seju</strong>
        <nav>
          {LINKS.map((l) => (
            <a key={l} href={`#${l.toLowerCase()}`}>
              {l}
            </a>
          ))}
        </nav>

        {isLoggedIn ? (
          <button type="button" className="btn btn-primary btn-sm" onClick={signOut}>
            Çıkış Yap
          </button>
        ) : (
          <Link className="btn btn-primary btn-sm" to="/login">
            Giriş Yap
          </Link>
        )}
      </header>

      <div className="hero-content">
        <p className="eyebrow">Learnin English Words</p>
        <h1 className="title">Seju</h1>

        {isLoggedIn ? (
          <p className="eyebrow">Hoş geldin, {userName}</p>
        ) : (
          <div className="actions">
            <Link className="btn btn-primary" to="/login">
              Giriş Yap
            </Link>
            <Link className="btn btn-ghost" to="/login?mode=register">
              Kaydol
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}