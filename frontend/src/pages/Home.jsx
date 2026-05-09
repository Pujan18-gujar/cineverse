import { useEffect, useState } from 'react'
import axios from 'axios'
import { Link, useNavigate } from 'react-router-dom'
import MovieCard from '../components/MovieCard'

export default function Home() {
  const [trending, setTrending] = useState([])
  const [newRel, setNewRel]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [search, setSearch]     = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    Promise.all([
      axios.get('/api/movies/trending'),
      axios.get('/api/movies/new-releases'),
    ]).then(([t, n]) => {
      setTrending(t.data)
      setNewRel(n.data)
    }).catch(console.error)
    .finally(() => setLoading(false))
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (search.trim()) navigate(`/movies?search=${encodeURIComponent(search.trim())}`)
  }

  return (
    <div>
      {/* ── HERO ──────────────────────────────────────────── */}
      <div style={{ height: '100vh', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#0d0d0d 0%,#1a1200 50%,#0a0a0a 100%)', overflow: 'hidden', flexDirection: 'column', textAlign: 'center', padding: '0 24px' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top,rgba(0,0,0,1) 0%,rgba(0,0,0,0.3) 100%)' }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: '760px', width: '100%' }}>
          <div style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', color: '#C9A84C', marginBottom: '20px' }}>
            Hollywood · Bollywood · Tollywood · Marathi · Mollywood · Punjabi · Tamil
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 'clamp(48px,7vw,96px)', fontWeight: 300, lineHeight: 1, marginBottom: '20px' }}>
            Cinema Without <em style={{ color: '#E8CC7A', fontStyle: 'italic' }}>Borders</em>
          </h1>
          <p style={{ fontSize: '14px', lineHeight: 1.8, color: '#aaa', maxWidth: '500px', margin: '0 auto 36px', fontWeight: 300 }}>
            700+ movies across 7 industries. Discover where to watch, free or premium.
          </p>

          {/* SEARCH BAR */}
          <form onSubmit={handleSearch} style={{ display: 'flex', maxWidth: '540px', margin: '0 auto 32px', width: '100%' }}>
            <input
              type="text"
              placeholder="Search movies, directors, actors..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ flex: 1, padding: '16px 24px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(201,168,76,0.35)', borderRight: 'none', color: '#F5F0E8', fontSize: '13px', outline: 'none' }}
            />
            <button type="submit" style={{ padding: '16px 24px', background: '#C9A84C', border: 'none', color: '#0A0A0A', fontSize: '16px', fontWeight: 700, cursor: 'pointer' }}>🔍</button>
          </form>

          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
            <Link to="/movies">
              <button style={{ padding: '14px 36px', background: '#C9A84C', color: '#0A0A0A', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', border: 'none', cursor: 'pointer' }}>▶ Browse Movies</button>
            </Link>
            <Link to="/premium">
              <button style={{ padding: '14px 36px', background: 'transparent', color: '#F5F0E8', fontSize: '11px', fontWeight: 500, letterSpacing: '2px', textTransform: 'uppercase', border: '1px solid rgba(255,255,255,0.2)', cursor: 'pointer' }}>Go Premium ✦</button>
            </Link>
          </div>
        </div>
      </div>

      {/* ── TICKER ────────────────────────────────────────── */}
      <div style={{ background: '#C9A84C', padding: '10px 0', overflow: 'hidden', whiteSpace: 'nowrap' }}>
        <div style={{ display: 'inline-block', animation: 'ticker 30s linear infinite' }}>
          {['🌍 Hollywood','★','🎭 Bollywood','★','🎬 Tollywood','★','🏔️ Marathi','★','🌴 Mollywood','★','🎵 Punjabi','★','🎶 Tamil','★','4K HD','★','No Ads','★',
            '🌍 Hollywood','★','🎭 Bollywood','★','🎬 Tollywood','★','🏔️ Marathi','★','🌴 Mollywood','★','🎵 Punjabi','★','🎶 Tamil','★','4K HD','★','No Ads','★',
          ].map((t, i) => <span key={i} style={{ color: '#0A0A0A', fontSize: '10px', fontWeight: 700, letterSpacing: '3px', textTransform: 'uppercase', padding: '0 24px' }}>{t}</span>)}
        </div>
        <style>{`@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      </div>

      {/* ── TRENDING NOW ──────────────────────────────────── */}
      <div style={{ padding: '60px 64px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '38px', fontWeight: 300 }}>
            🔥 Trending <span style={{ color: '#C9A84C', fontStyle: 'italic' }}>Now</span>
          </h2>
          <Link to="/movies" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#C9A84C', textDecoration: 'none' }}>View All →</Link>
        </div>
        {loading ? <p style={{ color: '#555', fontSize: '12px', letterSpacing: '2px' }}>Loading...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: '20px' }}>
            {trending.map(m => <MovieCard key={m._id} movie={m} />)}
            {trending.length === 0 && <p style={{ color: '#444', gridColumn: '1/-1' }}>No trending movies yet.</p>}
          </div>
        )}
      </div>

      {/* ── NEW RELEASES ──────────────────────────────────── */}
      <div style={{ padding: '0 64px 80px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '32px', paddingBottom: '20px', borderBottom: '1px solid rgba(201,168,76,0.2)' }}>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '38px', fontWeight: 300 }}>
            ✨ New <span style={{ color: '#C9A84C', fontStyle: 'italic' }}>Releases</span>
          </h2>
          <Link to="/movies" style={{ fontSize: '10px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#C9A84C', textDecoration: 'none' }}>View All →</Link>
        </div>
        {loading ? <p style={{ color: '#555', fontSize: '12px', letterSpacing: '2px' }}>Loading...</p> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: '20px' }}>
            {newRel.map(m => <MovieCard key={m._id} movie={m} />)}
            {newRel.length === 0 && <p style={{ color: '#444', gridColumn: '1/-1' }}>No new releases yet.</p>}
          </div>
        )}
      </div>
    </div>
  )
}