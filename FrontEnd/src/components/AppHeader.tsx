import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../AuthContext'

export default function AppHeader() {
  const { userName, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = () => {
    signOut()
    navigate('/login')
  }

  return (
    <header className="app-header">
      <Link className="app-logo" to="/decks">Seju</Link>
      <div className="user-actions">
        <span>{userName}</span>
        <button type="button" className="btn btn-outline btn-small" onClick={handleSignOut}>Çıkış yap</button>
      </div>
    </header>
  )
}
