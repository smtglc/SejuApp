import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import FlipCard from '../components/FlipCard'
import { getDeck } from '../api/decks'
import { getCards } from '../api/cards'
import type { Card, Deck } from '../api/types'
import '../decks.css'

export default function StudyPage() {
  const { id = '' } = useParams()
  const [deck, setDeck] = useState<Deck | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [index, setIndex] = useState(0)
  const [correct, setCorrect] = useState(0)
  const [wrong, setWrong] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => { void Promise.all([getDeck(id), getCards(id)]).then(([deckData, cardData]) => { setDeck(deckData); setCards(cardData) }).finally(() => setLoading(false)) }, [id])
  const answer = (known: boolean) => { if (known) setCorrect((value) => value + 1); else setWrong((value) => value + 1); setIndex((value) => value + 1) }
  useEffect(() => {
    const keydown = (event: KeyboardEvent) => { if (event.code === 'ArrowRight') answer(true); if (event.code === 'ArrowLeft') answer(false) }
    window.addEventListener('keydown', keydown); return () => window.removeEventListener('keydown', keydown)
  })

  const complete = index >= cards.length && cards.length > 0
  return <div className="app-shell"><AppHeader /><main className="study-shell">
    <Link className="back-link" to={`/decks/${id}`}>← Desteye dön</Link>
    {loading ? <p className="state-message">Kartlar yükleniyor...</p> : !deck || cards.length === 0 ? <p className="empty-state">Çalışmak için bu desteye kart eklemelisin.</p> : complete ? <section className="study-complete"><h1>Bitti!</h1><p>{correct} doğru, {wrong} yanlış</p><Link className="btn btn-primary" to={`/decks/${id}`}>Desteye dön</Link></section> : <section className="study-content"><h1>{deck.name}</h1><p>Kart {index + 1} / {cards.length} · Kartı çevirmek için tıkla</p><div className="progress"><span style={{ width: `${((index + 1) / cards.length) * 100}%` }} /></div><FlipCard card={cards[index]} large /><div className="study-actions"><button className="btn btn-outline" onClick={() => answer(false)}>Bilemedim</button><button className="btn btn-primary" onClick={() => answer(true)}>Bildim</button></div></section>}
  </main></div>
}
