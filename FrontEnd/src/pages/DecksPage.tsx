import { useEffect, useState, type FormEvent } from 'react'
import AppHeader from '../components/AppHeader'
import DeckCard from '../components/DeckCard'
import { createDeck, deleteDeck, getDecks } from '../api/decks'
import { getApiErrorMessage } from '../api/client'
import { getCards } from '../api/cards'
import type { Deck } from '../api/types'
import '../decks.css'

export default function DecksPage() {
  const [decks, setDecks] = useState<Deck[]>([])
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  const loadDecks = async () => {
    setLoading(true)
    try {
      const deckList = await getDecks()
      const decksWithCards = await Promise.all(deckList.map(async (deck) => ({ ...deck, cards: await getCards(deck.id) })))
      setDecks(decksWithCards)
    } catch (err) { setError(getApiErrorMessage(err)) } finally { setLoading(false) }
  }
  useEffect(() => { void loadDecks() }, [])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    setError('')
    setSaving(true)
    try {
      await createDeck({ name, description })
      setName('')
      setDescription('')
      await loadDecks()
    } catch (err) { setError(getApiErrorMessage(err)) } finally { setSaving(false) }
  }

  const remove = async (deck: Deck) => {
    if (!window.confirm(`“${deck.name}” destesini silmek istediğine emin misin?`)) return
    setError('')
    try { await deleteDeck(deck.id); await loadDecks() } catch (err) { setError(getApiErrorMessage(err)) }
  }

  return <div className="app-shell"><AppHeader /><main className="content-shell">
    <section className="page-heading"><h1>Destelerim</h1><p>Çalışmak istediğin desteyi seç ya da yeni bir tane oluştur.</p></section>
    <form className="panel deck-form" onSubmit={submit}>
      <label>Deste adı<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Örn. İngilizce Günlük" required /></label>
      <label>Açıklama (isteğe bağlı)<input value={description} onChange={(event) => setDescription(event.target.value)} placeholder="Bu deste ne için?" /></label>
      <button className="btn btn-primary" disabled={saving}>{saving ? 'Oluşturuluyor...' : 'Deste oluştur'}</button>
    </form>
    {error && <p className="form-error" role="alert">{error}</p>}
    {loading ? <p className="state-message">Desteler yükleniyor...</p> : decks.length === 0 ? <p className="empty-state">Henüz deste yok, ilk destenizi oluşturun.</p> : <section className="deck-grid">{decks.map((deck) => <DeckCard key={deck.id} deck={deck} onDelete={(item) => { void remove(item) }} deleting={false} />)}</section>}
  </main></div>
}
