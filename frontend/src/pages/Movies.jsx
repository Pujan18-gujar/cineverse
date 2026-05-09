import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import axios from 'axios'
import MovieCard from '../components/MovieCard'

const GENRES = ['Action', 'Drama', 'Comedy', 'Romance', 'Thriller', 'Horror', 'Sci-Fi', 'Fantasy', 'Adventure', 'Crime', 'Mystery', 'Animation', 'Family']

export default function Movies() {
  const [searchParams] = useSearchParams()
  const urlSearch = searchParams.get('search') || ''

  const [movies, setMovies]         = useState([])
  const [loading, setLoading]       = useState(true)
  const [page, setPage]             = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [total, setTotal]           = useState(0)
  const [filters, setFilters]       = useState({ genre: '', search: urlSearch })

  useEffect(() => {
    setFilters(f => ({ ...f, search: urlSearch }))
    setPage(1)
  }, [urlSearch])

  useEffect(() => { fetchMovies() }, [filters, page])

  const fetchMovies = async () => {
    setLoading(true)
    try {
      const params = { page, limit: 32 }
      if (filters.genre)  params.genre  = filters.genre
      if (filters.search) params.search = filters.search
      const { data } = await axios.get('/api/movies', { params })
      setMovies(data.movies)
      setTotalPages(data.totalPages)
      setTotal(data.total)
    } catch (err) { console.error(err) }
    finally { setLoading(false) }
  }

  const setFilter = (key, val) => { setFilters(f => ({ ...f, [key]: val })); setPage(1) }

  const chip = (active) => ({
    padding: '8px 16px', background: active ? '#C9A84C' : 'transparent',
    border: `1px solid ${active ? '#C9A84C' : 'rgba(201,168,76,0.25)'}`,
    color: active ? '#0A0A0A' : '#aaa', fontSize: '10px', fontWeight: 600,
    letterSpacing: '1.5px', textTransform: 'uppercase', cursor: 'pointer',
  })

  return (
    <div style={{ paddingTop: '90px', minHeight: '100vh' }}>
      <div style={{ padding: '40px 64px 0', borderBottom: '1px solid rgba(201,168,76,0.15)', marginBottom: '40px' }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '52px', fontWeight: 300, marginBottom: '8px' }}>
          All <span style={{ color: '#C9A84C', fontStyle: 'italic' }}>Movies</span>
        </h1>
        <p style={{ color: '#555', fontSize: '12px', letterSpacing: '1px', marginBottom: '24px' }}>
          {total > 0 ? `${total} films found` : 'Browse our collection'}
        </p>

        {/* Search */}
        <input type="text" placeholder="Search movies, directors, actors..."
          value={filters.search}
          onChange={e => setFilter('search', e.target.value)}
          style={{ width: '100%', maxWidth: '500px', padding: '13px 20px', marginBottom: '24px', background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', color: '#F5F0E8', fontSize: '13px', outline: 'none' }} />

        {/* Genre filter only */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingBottom: '28px' }}>
          <button style={chip(!filters.genre)} onClick={() => setFilter('genre', '')}>All Genres</button>
          {GENRES.map(g => <button key={g} style={chip(filters.genre === g)} onClick={() => setFilter('genre', g)}>{g}</button>)}
        </div>
      </div>

      <div style={{ padding: '0 64px 80px' }}>
        {loading ? (
          <p style={{ color: '#555', letterSpacing: '2px', fontSize: '12px', padding: '40px 0' }}>Loading films...</p>
        ) : movies.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎬</div>
            <p style={{ color: '#555' }}>No movies found. Try different filters.</p>
          </div>
        ) : (
          <>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(170px,1fr))', gap: '20px', marginBottom: '60px' }}>
              {movies.map(m => <MovieCard key={m._id} movie={m} />)}
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px' }}>
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                style={{ ...chip(false), opacity: page === 1 ? 0.3 : 1 }}>← Prev</button>
              {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setPage(p)} style={{ ...chip(page === p), minWidth: '36px' }}>{p}</button>
              ))}
              {totalPages > 7 && <span style={{ color: '#555' }}>...</span>}
              <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                style={{ ...chip(false), opacity: page === totalPages ? 0.3 : 1 }}>Next →</button>
            </div>
            <p style={{ textAlign: 'center', color: '#444', fontSize: '11px', marginTop: '16px' }}>
              Page {page} of {totalPages} · {total} total films
            </p>
          </>
        )}
      </div>
    </div>
  )
}