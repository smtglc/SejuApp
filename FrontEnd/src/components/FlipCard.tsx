import { useState, type KeyboardEvent, type MouseEvent } from 'react'
import type { Card } from '../api/types'

interface FlipCardProps {
  card: Card
  onDelete?: (card: Card) => void
  deleting?: boolean
  large?: boolean
}

export default function FlipCard({ card, onDelete, deleting = false, large = false }: FlipCardProps) {
  const [flipped, setFlipped] = useState(false)
  const deleteCard = (event: MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation()
    onDelete?.(card)
  }
  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      event.preventDefault()
      setFlipped((value) => !value)
    }
  }

  return (
    <div className={`flip-card ${large ? 'flip-card-large' : ''}`} onClick={() => setFlipped((value) => !value)} onKeyDown={handleKeyDown} role="button" tabIndex={0} aria-label="Kartı çevir">
      <span className={`flip-card-inner ${flipped ? 'is-flipped' : ''}`}>
        <span className="flip-card-face flip-card-front">
          {onDelete && <span className="card-delete-wrap"><button type="button" className="card-delete" aria-label="Kartı sil" title={card.id ? 'Kartı sil' : 'Backend kart kimliğini döndürmediği için silinemiyor'} onClick={deleteCard} disabled={!card.id || deleting}>⌫</button></span>}
          <strong>{card.word}</strong>
          <small>{large ? 'Ön yüz · İngilizce' : 'Çevirmek için tıkla'}</small>
        </span>
        <span className="flip-card-face flip-card-back">
          {onDelete && <span className="card-delete-wrap"><button type="button" className="card-delete" aria-label="Kartı sil" title={card.id ? 'Kartı sil' : 'Backend kart kimliğini döndürmediği için silinemiyor'} onClick={deleteCard} disabled={!card.id || deleting}>⌫</button></span>}
          <strong>{card.meaning}</strong>
          <small>{large ? 'Arka yüz · Türkçe' : 'Arka yüz'}</small>
        </span>
      </span>
    </div>
  )
}
