import Hero from './Hero'
import Background3D from './Background3D'

const CARDS = [
  {
    title: 'Özel ödüller',
    text: 'Sponsorlarımızın özel ödülleri yakında açıklanacak.',
  },
  {
    title: 'Sürpriz çekilişler ve hediyeler',
    text: 'Etkinlik boyunca katılımcıları sürpriz çekilişler ve hediyeler bekliyor.',
  },
  {
    title: 'Açık büfe',
    text: 'Etkinlik boyunca yiyecek ve içecek bizden.',
  },
]

export default function Home() {
  return (
    <main className="page">

      <Background3D />

      <Hero />

      <section
        id="oduller"
        className="section"
      >
        <p className="eyebrow">
          04 — Ödüller
        </p>

        <h2 className="section-title">
          70.000 ₺+ ödül havuzu.
        </h2>

        <div className="cards">
          {CARDS.map((card) => (
            <article
              key={card.title}
              className="card"
            >
              <h3>
                {card.title}
              </h3>

              <p>
                {card.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="juri"
        className="section"
        style={{
          minHeight: '80vh',
        }}
      >
        <p className="eyebrow">
          05 — Jüri
        </p>
      </section>

    </main>
  )
}