import './Hero.css'
import { Link } from 'react-router-dom'
import { useAuth } from './AuthContext'
import JarScreen from './JarScreen'

const LINKS = ['Languages', 'Global', 'Free', 'Kılavuz', 'SSS']

export default function Hero() {
  const { isLoggedIn, userName, signOut } = useAuth()

  return (
    <section className={`hero ${isLoggedIn ? 'hero-logged-in' : ''}`} id="top">
      <header className="nav">
        <strong className="logo">Seju</strong>

        {/* Menü bağlantıları sadece giriş yapmamış kullanıcıya görünür */}
        {!isLoggedIn ? (
          <nav>
            {LINKS.map((link) => (
              <a key={link} href={`#${link.toLowerCase()}`}>
                {link}
              </a>
            ))}
          </nav>
        ) : (
          <span />
        )}

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

      {isLoggedIn ? (
        /* GİRİŞ SONRASI: sadece kavanoz */
        <JarScreen userName={userName} />
      ) : (
        /* GİRİŞ ÖNCESİ HERO (değişmedi) */
        <div className="hero-content">
          <div className="hero-copy">
            <p className="eyebrow">✦ MAGIC WORD JAR</p>

            <h1 className="title">
              Kelimeleri
              <br />
              kavanozdan çek.
            </h1>

            <p className="lead">
              Her tıklamada yeni bir kelime keşfet. Kartı çevir, anlamını öğren ve kelime
              hazineni büyüt.
            </p>

            <div className="actions">
              <Link className="btn btn-primary" to="/login">
                Hemen Başla
              </Link>

              <Link className="btn btn-ghost" to="/login?mode=register">
                Kaydol
              </Link>
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
