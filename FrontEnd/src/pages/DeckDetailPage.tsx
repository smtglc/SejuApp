import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import AppHeader from '../components/AppHeader'
import FlipCard from '../components/FlipCard'
import { getDeck } from '../api/decks'
import { createCard, deleteCard, getCards } from '../api/cards'
import { getApiErrorMessage } from '../api/client'
import type { Card, Deck } from '../api/types'
import '../decks.css'

export default function DeckDetailPage() {
  const { id = '' } = useParams()
  const [deck, setDeck] = useState<Deck | null>(null)
  const [cards, setCards] = useState<Card[]>([])
  const [word, setWord] = useState('')
  const [meaning, setMeaning] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    setLoading(true)
    try { const [deckData, cardData] = await Promise.all([getDeck(id), getCards(id)]); setDeck(deckData); setCards(cardData) } catch (err) { setError(getApiErrorMessage(err)) } finally { setLoading(false) }
  }
  useEffect(() => { if (id) void load() }, [id])

  const submit = async (event: FormEvent) => {
    event.preventDefault(); setSaving(true); setError('')
    try { await createCard(id, { word, meaning }); setWord(''); setMeaning(''); await load() } catch (err) { setError(getApiErrorMessage(err)) } finally { setSaving(false) }
  }
  const remove = async (card: Card) => {
    if (!card.id || !window.confirm(`“${card.word}” kartını silmek istediğine emin misin?`)) return
    try { await deleteCard(card.id); await load() } catch (err) { setError(getApiErrorMessage(err)) }
  }

  return <div className="app-shell"><AppHeader /><main className="content-shell">
    <Link className="back-link" to="/decks">← Destelerim</Link>
    {loading ? <p className="state-message">Deste yükleniyor...</p> : deck ? <>
      <section className="detail-heading"><div><h1>{deck.name}</h1><p>{cards.length} kart · {deck.description || 'Açıklama eklenmemiş.'}</p></div><Link className="btn btn-primary" to={`/decks/${id}/study`}>Çalışmaya başla</Link></section>
      <form className="panel card-form" onSubmit={submit}><label>İngilizce (ön yüz)<input value={word} onChange={(event) => setWord(event.target.value)} placeholder="apple" required /></label><label>Türkçe (arka yüz)<input value={meaning} onChange={(event) => setMeaning(event.target.value)} placeholder="elma" required /></label><button className="btn btn-primary" disabled={saving}>{saving ? 'Ekleniyor...' : 'Kart ekle'}</button></form>
      {error && <p className="form-error" role="alert">{error}</p>}
      {cards.length === 0 ? <p className="empty-state">Bu destede henüz kart yok.</p> : <section className="card-grid">{cards.map((card, index) => <FlipCard key={card.id ?? `${card.word}-${index}`} card={card} onDelete={(item) => { void remove(item) }} />)}</section>}
    </> : <p className="form-error" role="alert">{error || 'Deste bulunamadı.'}</p>}
  </main></div>
}
