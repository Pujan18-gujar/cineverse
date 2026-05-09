import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) {
      navigate(`/movies?search=${encodeURIComponent(search.trim())}`)
      setShowSearch(false)
      setSearch('')
    }
  }

  return (
    <>
      <nav style={{ position: 'fixed', top: 0, width: '100%', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 48px', background: 'linear-gradient(180deg,rgba(0,0,0,0.96) 0%,transparent 100%)', borderBottom: '1px solid rgba(201,168,76,0.15)', boxSizing: 'border-box' }}>
        <Link to="/" style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '26px', fontWeight: 300, letterSpacing: '6px', color: '#E8CC7A', textTransform: 'uppercase', textDecoration: 'none' }}>
          Cine<span style={{ color: '#F5F0E8' }}>verse</span>
        </Link>

        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          <Link to="/" style={link}>Home</Link>
          <Link to="/movies" style={link}>All Movies</Link>
          <Link to="/premium" style={link}>Premium</Link>
          <button onClick={() => setShowSearch(s => !s)} style={{ background: 'none', border: 'none', color: '#aaa', fontSize: '16px', cursor: 'pointer', padding: '4px' }}>🔍</button>

          {user ? (
            <>
              <span style={{ ...link, color: '#C9A84C' }}>Hi, {user.name?.split(' ')[0]}</span>
              <button onClick={logout} style={outlineBtn}>Logout</button>
            </>
          ) : (
            <>
              <button onClick={() => navigate('/login')} style={outlineBtn}>Login</button>
              <button onClick={() => navigate('/signup')} style={filledBtn}>Join Free</button>
            </>
          )}
        </div>
      </nav>

      {showSearch && (
        <div style={{ position: 'fixed', top: '70px', left: 0, right: 0, zIndex: 99, background: 'rgba(10,10,10,0.98)', borderBottom: '1px solid rgba(201,168,76,0.2)', padding: '20px 48px' }}>
          <form onSubmit={handleSearch} style={{ display: 'flex', width: '100%', maxWidth: '600px', margin: '0 auto' }}>
            <input autoFocus type="text" placeholder="Search movies, directors, actors..."
              value={search} onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, padding: '14px 20px', background: '#1A1A1A', border: '1px solid rgba(201,168,76,0.3)', borderRight: 'none', color: '#F5F0E8', fontSize: '13px', outline: 'none' }} />
            <button type="submit" style={{ padding: '14px 24px', background: '#C9A84C', border: 'none', color: '#0A0A0A', fontWeight: 700, fontSize: '14px', cursor: 'pointer' }}>🔍</button>
            <button type="button" onClick={() => setShowSearch(false)} style={{ padding: '14px 16px', background: 'transparent', border: '1px solid rgba(255,255,255,0.1)', borderLeft: 'none', color: '#555', cursor: 'pointer', fontSize: '16px' }}>✕</button>
          </form>
        </div>
      )}
    </>
  )
}

const link = { fontSize: '11px', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', color: '#aaa', textDecoration: 'none' }
const outlineBtn = { padding: '9px 20px', border: '1px solid #C9A84C', background: 'transparent', color: '#C9A84C', fontSize: '10px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }
const filledBtn  = { padding: '9px 20px', border: '1px solid #C9A84C', background: '#C9A84C', color: '#0A0A0A', fontSize: '10px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', cursor: 'pointer' }



