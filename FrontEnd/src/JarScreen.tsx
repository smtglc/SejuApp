import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent as ReactKeyboardEvent,
} from 'react'
import Jar3D from './Jar3D'
import { loadCards, saveCards, newId, shuffle, type StoredCard } from './cards'
import './JarScreen.css'

// Kavanozun etrafında yanıp sönen yıldızlar (konum: kutuya göre yüzde)
const TWINKLES = [
  { x: '6%', y: '24%', size: 26, delay: '0s', dur: '3.2s' },
  { x: '90%', y: '14%', size: 34, delay: '0.8s', dur: '2.8s' },
  { x: '12%', y: '62%', size: 16, delay: '1.5s', dur: '3.6s' },
  { x: '88%', y: '52%', size: 20, delay: '0.4s', dur: '2.6s' },
  { x: '20%', y: '10%', size: 14, delay: '2.1s', dur: '3.4s' },
  { x: '80%', y: '80%', size: 14, delay: '1.1s', dur: '3s' },
]

type Drawn = { card: StoredCard; key: number; phase: 'rising' | 'shown' }

function Arrow({ dir }: { dir: 'left' | 'right' }) {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {dir === 'right' ? <path d="M5 12h14M13 6l6 6-6 6" /> : <path d="M19 12H5M11 6l-6 6 6 6" />}
    </svg>
  )
}

export default function JarScreen({ userName }: { userName: string | null }) {
  const user = userName ?? 'guest'

  const [cards, setCards] = useState<StoredCard[]>(() => loadCards(user))
  const [hover, setHover] = useState(false)
  const [touched, setTouched] = useState(false) // ilk tıklamadan sonra ipucu kalkar
  const [shakeKey, setShakeKey] = useState(0)
  const [burst, setBurst] = useState(0)
  const [drawn, setDrawn] = useState<Drawn | null>(null)
  const [flipped, setFlipped] = useState(false)
  const [message, setMessage] = useState('')

  // Kart ekleme paneli
  const [editorOpen, setEditorOpen] = useState(false)
  const [editorFlipped, setEditorFlipped] = useState(false)
  const [word, setWord] = useState('')
  const [meaning, setMeaning] = useState('')
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const bag = useRef<StoredCard[]>([]) // karıştırılmış torba
  const lastId = useRef<string | null>(null)
  const busy = useRef(false)
  const timers = useRef<number[]>([])
  const wordRef = useRef<HTMLInputElement>(null)
  const meaningRef = useRef<HTMLInputElement>(null)

  const later = useCallback((ms: number, fn: () => void) => {
    timers.current.push(window.setTimeout(fn, ms))
  }, [])

  useEffect(() => {
    const list = timers.current
    return () => list.forEach((id) => window.clearTimeout(id))
  }, [])

  // ---------- Rastgele kart çekme (karıştırılmış torba) ----------
  const nextCard = () => {
    if (bag.current.length === 0) {
      bag.current = shuffle(cards)
      const n = bag.current.length
      // Aynı kart arka arkaya gelmesin
      if (n > 1 && bag.current[n - 1].id === lastId.current) {
        ;[bag.current[0], bag.current[n - 1]] = [bag.current[n - 1], bag.current[0]]
      }
    }
    const card = bag.current.pop()!
    lastId.current = card.id
    return card
  }

  const handleJarClick = () => {
    if (busy.current || editorOpen || saving) return

    setTouched(true)
    setShakeKey((k) => k + 1) // kavanoz titrer
    setDrawn(null)
    setFlipped(false)

    if (cards.length === 0) {
      setMessage('Kavanoz boş. Önce bir kart ekle.')
      return
    }
    setMessage('')
    busy.current = true

    later(450, () => {
      const card = nextCard()
      const key = Date.now()
      setDrawn({ card, key, phase: 'rising' })
      setBurst((b) => b + 1) // pırıltılar
      later(900, () =>
        setDrawn((d) => (d && d.key === key ? { ...d, phase: 'shown' } : d)),
      )
      busy.current = false
    })
  }

  // ---------- Kart ekleme ----------
  const openEditor = () => {
    setDrawn(null)
    setFlipped(false)
    setMessage('')
    setWord('')
    setMeaning('')
    setError('')
    setEditorFlipped(false)
    setSaving(false)
    setEditorOpen(true)
  }

  const closeEditor = useCallback(() => {
    setEditorOpen(false)
    setSaving(false)
  }, [])

  const goToBack = () => {
    const w = word.trim()
    if (!w) return
    if (cards.some((c) => c.word.toLowerCase() === w.toLowerCase())) {
      setError('Bu kelime zaten kavanozda.')
      return
    }
    setError('')
    setEditorFlipped(true)
  }

  const confirmCard = () => {
    const w = word.trim()
    const m = meaning.trim()
    if (!w || !m || saving) return

    const next = [...cards, { id: newId(), word: w, meaning: m }]
    setCards(next)
    saveCards(user, next)
    bag.current = [] // torba yeni kartı da kapsasın

    setSaving(true) // kart kavanoza doğru süzülür
    later(650, () => {
      setBurst((b) => b + 1)
      setShakeKey((k) => k + 1)
    })
    later(1100, closeEditor)
  }

  const onWordKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') goToBack()
  }
  const onMeaningKey = (e: ReactKeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') confirmCard()
  }

  // Esc ile paneli kapat
  useEffect(() => {
    if (!editorOpen) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !saving) closeEditor()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [editorOpen, saving, closeEditor])

  // Yüz değişince ilgili kutuya odaklan
  useEffect(() => {
    if (!editorOpen) return
    const id = window.setTimeout(() => {
      ;(editorFlipped ? meaningRef : wordRef).current?.focus()
    }, 350)
    return () => window.clearTimeout(id)
  }, [editorOpen, editorFlipped])

  return (
    <div className="jr-screen">
      <div className="jr-stage">
        <div className="jr-jar">
          <div className={`jr-aura ${hover ? 'is-hover' : ''}`} aria-hidden="true" />
          <div className="jr-floor" aria-hidden="true" />

          <div className={`jr-canvas ${hover ? 'is-hover' : ''}`}>
            <Jar3D shakeKey={shakeKey} onJarClick={handleJarClick} onHoverChange={setHover} />
          </div>

          {TWINKLES.map((t, i) => (
            <span
              key={i}
              className="jr-twinkle"
              aria-hidden="true"
              style={{ left: t.x, top: t.y, fontSize: t.size, animationDelay: t.delay, animationDuration: t.dur }}
            >
              ✦
            </span>
          ))}

          {/* "Buraya tıkla" ipucu: ilk çekişe kadar görünür */}
          {!touched && !editorOpen && (
            <span className="jr-hint" aria-hidden="true">
              <i />
              <svg width="18" height="22" viewBox="0 0 18 22" fill="#fff" stroke="#2a1157" strokeWidth="1.5" strokeLinejoin="round">
                <path d="M2 1.5v16l4.2-3.9 3 6.3 2.8-1.3-3-6.2H15z" />
              </svg>
            </span>
          )}

          {burst > 0 && (
            <div className="jr-sparkles" key={burst} aria-hidden="true">
              {Array.from({ length: 18 }, (_, i) => (
                <i
                  key={i}
                  style={{ '--a': `${i * 20}deg`, '--d': `${70 + (i % 4) * 32}px` } as CSSProperties}
                />
              ))}
            </div>
          )}

          {/* Kavanozdan çıkan kart */}
          {drawn && !editorOpen && (
            <div className={`jr-slot ${drawn.phase}`} key={drawn.key}>
              <div className="jr-bob">
                <button
                  type="button"
                  className={`jr-card ${flipped ? 'is-flipped' : ''}`}
                  onClick={() => drawn.phase === 'shown' && setFlipped((f) => !f)}
                  aria-label={flipped ? 'Kartı İngilizce yüze çevir' : 'Kartı çevir, Türkçesini gör'}
                >
                  <span className="jr-face jr-front">
                    <span className="jr-star">✦</span>
                    <small>English</small>
                    <b>{drawn.card.word}</b>
                  </span>
                  <span className="jr-face jr-back">
                    <span className="jr-star">✦</span>
                    <small>Türkçe</small>
                    <b>{drawn.card.meaning}</b>
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Yeni kart paneli */}
          {editorOpen && (
            <div
              className={`jr-slot editor ${saving ? 'drop' : ''}`}
              role="dialog"
              aria-label="Yeni kart ekle"
            >
              <div className="jr-persp">
                <div className={`jr-card ${editorFlipped ? 'is-flipped' : ''}`}>
                  <div className="jr-face jr-front" aria-hidden={editorFlipped}>
                    <span className="jr-star">✦</span>
                    <small>English</small>
                    <input
                      ref={wordRef}
                      value={word}
                      onChange={(e) => {
                        setWord(e.target.value)
                        setError('')
                      }}
                      onKeyDown={onWordKey}
                      placeholder="river"
                      maxLength={60}
                      autoComplete="off"
                      aria-label="İngilizce kelime"
                      tabIndex={editorFlipped ? -1 : 0}
                    />
                    {error && <em className="jr-error">{error}</em>}
                    <button
                      type="button"
                      className="jr-round jr-next"
                      onClick={goToBack}
                      disabled={!word.trim()}
                      aria-label="Arka yüze geç"
                      tabIndex={editorFlipped ? -1 : 0}
                    >
                      <Arrow dir="right" />
                    </button>
                  </div>

                  <div className="jr-face jr-back" aria-hidden={!editorFlipped}>
                    <span className="jr-star">✦</span>
                    <small>Türkçe</small>
                    <input
                      ref={meaningRef}
                      value={meaning}
                      onChange={(e) => setMeaning(e.target.value)}
                      onKeyDown={onMeaningKey}
                      placeholder="nehir"
                      maxLength={80}
                      autoComplete="off"
                      aria-label="Türkçe karşılığı"
                      tabIndex={editorFlipped ? 0 : -1}
                    />
                    <div className="jr-back-actions">
                      <button
                        type="button"
                        className="jr-round"
                        onClick={() => setEditorFlipped(false)}
                        aria-label="Ön yüze dön"
                        tabIndex={editorFlipped ? 0 : -1}
                      >
                        <Arrow dir="left" />
                      </button>
                      <button
                        type="button"
                        className="jr-ok"
                        onClick={confirmCard}
                        disabled={!meaning.trim() || saving}
                        tabIndex={editorFlipped ? 0 : -1}
                      >
                        Tamam
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        <button
          type="button"
          className="jr-add"
          onClick={editorOpen ? closeEditor : openEditor}
          disabled={saving}
        >
          {editorOpen ? 'Vazgeç' : '+ Kart ekle'}
        </button>

        <p className="jr-msg" role="status">
          {message}
        </p>

        {/* Klavye ve ekran okuyucu için kavanoz butonu */}
        <button type="button" className="sr-only" onClick={handleJarClick}>
          Kavanozdan kart çek
        </button>
        <p className="sr-only" aria-live="polite">
          {drawn ? drawn.card.word : ''}
        </p>
      </div>
    </div>
  )
}
