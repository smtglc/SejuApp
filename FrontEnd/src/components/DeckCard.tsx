import { Link } from 'react-router-dom'
import type { Deck } from '../api/types'

interface DeckCardProps {
  deck: Deck
  onDelete: (deck: Deck) => void
  deleting: boolean
}

export default function DeckCard({ deck, onDelete, deleting }: DeckCardProps) {
  return (
    <article className="deck-card">
      <p className="deck-count">{deck.cards?.length ?? 0} kart</p>
      <h2>{deck.name}</h2>
      <p className="deck-description">{deck.description || 'Açıklama eklenmemiş.'}</p>
      <div className="deck-card-actions">
        <Link className="btn btn-primary btn-small" to={`/decks/${deck.id}`}>Aç</Link>
        <button type="button" className="icon-button" aria-label={`${deck.name} destesini sil`} onClick={() => onDelete(deck)} disabled={deleting}>⌫</button>
      </div>
    </article>
  )
}
