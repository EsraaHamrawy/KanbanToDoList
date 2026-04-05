import { Link } from 'react-router-dom'
import './NotFound.css'

export default function NotFound() {
  return (
    <main className="not-found-page">
      <section className="not-found-card">
        <p className="not-found-card__eyebrow">404</p>
        <h1>Page not found</h1>
        <p>The route you opened doesn’t exist. Go back home to the board.</p>
        <Link to="/home" className="not-found-card__link">
          Go to home
        </Link>
      </section>
    </main>
  )
}
