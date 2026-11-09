import { useEffect, useState } from 'react'
import './Hero.css'
import { Link } from 'react-router-dom'


const LINKS = ['Languages', 'Global', 'Free','Kılavuz', 'SSS']

export default function Hero() {
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
        <Link className="btn btn-primary btn-sm" to="/login">
          Giriş Yap
        </Link>
      </header>

      <div className="hero-content">
        <p className="eyebrow">
          Learnin English Words
        </p>
        <h1 className="title">Seju</h1>

       <div className="actions">
        <Link className="btn btn-primary" to="/login">
         Giriş Yap
        </Link>
        <Link className="btn btn-ghost" to="/login?mode=register">
         Kaydol
          </Link>
           </div>
      </div>
    </section>
  )
}
