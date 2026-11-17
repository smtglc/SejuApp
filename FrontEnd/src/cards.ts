// Kavanozdaki kartların saklanması.
// ŞİMDİLİK tarayıcıda (localStorage), kullanıcı adına göre ayrı tutulur.
// Backend'de Card hazır olunca sadece bu dosyadaki fonksiyonların içi
// API çağrısıyla değişecek, JarScreen.tsx'e dokunmana gerek kalmayacak.

export interface StoredCard {
  id: string
  word: string
  meaning: string
}

const storageKey = (user: string) => `seju_cards_${user}`

export function loadCards(user: string): StoredCard[] {
  try {
    const raw = localStorage.getItem(storageKey(user))
    return raw ? (JSON.parse(raw) as StoredCard[]) : []
  } catch {
    return []
  }
}

export function saveCards(user: string, cards: StoredCard[]) {
  try {
    localStorage.setItem(storageKey(user), JSON.stringify(cards))
  } catch {
    // Depolama dolu ya da kapalıysa sessizce geç
  }
}

export function newId(): string {
  return crypto.randomUUID?.() ?? `${Date.now()}-${Math.random().toString(16).slice(2)}`
}

// Fisher-Yates karıştırma
export function shuffle<T>(items: T[]): T[] {
  const a = [...items]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}
