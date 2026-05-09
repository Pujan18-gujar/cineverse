import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { useAuth } from '../context/AuthContext'

export default function MovieCard({ movie }) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [hovered, setHovered] = useState(false)
  const [inWatchlist, setInWatchlist] = useState(false)

  const toggleWatchlist = async (e) => {
    e.stopPropagation()
    if (!user) return navigate('/login')
    try {
      await axios.post(`/api/movies/${movie._id}/watchlist`)
      setInWatchlist((p) => !p)
    } catch { alert('Error updating watchlist') }
  }

  const handleClick = () => {
    navigate(`/movie/${movie._id}`)
  }

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        cursor: 'pointer',
        transform: hovered ? 'translateY(-8px)' : 'none',
        transition: 'transform 0.3s ease, box-shadow 0.3s ease',
        boxShadow: hovered ? '0 20px 40px rgba(201,168,76,0.3)' : '0 4px 12px rgba(0,0,0,0.5)',
        borderRadius: '8px',
        overflow: 'hidden',
        background: '#111',
        border: hovered ? '1px solid #C9A84C' : '1px solid #222',
      }}
    >
      {/* Poster */}
      <div style={{ width: '100%', aspectRatio: '2/3', borderRadius: '2px', overflow: 'hidden', position: 'relative' }}>
        {movie.posterPath
          ? <img
              src={movie.posterPath}
              alt={movie.title}
              style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={e => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex' }}
            />
          : null
        }
        <div style={{
          width: '100%', height: '100%', display: movie.posterPath ? 'none' : 'flex',
          alignItems: 'center', justifyContent: 'center', background: '#1a1a1a',
          flexDirection: 'column', gap: '8px'
        }}>
          <span style={{ fontSize: '48px' }}>🎬</span>
          <span style={{ color: '#555', fontSize: '12px', textAlign: 'center', padding: '0 8px' }}>{movie.title}</span>
        </div>

        {/* Premium Badge */}
        {movie.isPremium && (
          <div style={{
            position: 'absolute', top: 10, right: 10,
            background: '#C9A84C', color: '#000',
            padding: '3px 8px', borderRadius: '4px',
            fontSize: '10px', fontWeight: 'bold'
          }}>
            PREMIUM
          </div>
        )}

        {/* New Badge */}
        {movie.isNewRelease && (
          <div style={{
            position: 'absolute', top: 10, left: 10,
            background: 'rgba(0,0,0,0.8)', color: '#22c55e',
            padding: '3px 8px', borderRadius: '4px',
            fontSize: '10px', fontWeight: 'bold', border: '1px solid #22c55e'
          }}>
            NEW
          </div>
        )}

        {/* Hover Overlay */}
        {hovered && (
          <div style={{
            position: 'absolute', inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: '12px'
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: '50%',
              border: '2px solid #C9A84C',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <span style={{ color: '#C9A84C', fontSize: '20px' }}>ℹ</span>
            </div>
            <span style={{ color: '#fff', fontSize: '12px' }}>View Details</span>
            <button
              onClick={toggleWatchlist}
              style={{
                width: 40, height: 40, borderRadius: '50%',
                background: inWatchlist ? '#C9A84C' : 'transparent',
                border: '2px solid #C9A84C',
                color: inWatchlist ? '#000' : '#C9A84C',
                cursor: 'pointer', fontSize: '18px',
                display: 'flex', alignItems: 'center', justifyContent: 'center'
              }}
            >
              {inWatchlist ? '✓' : '+'}
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div style={{ padding: '12px' }}>
        <div style={{
          fontSize: '13px', fontWeight: 500, marginBottom: '4px',
          whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          color: '#fff'
        }}>
          {movie.title}
        </div>
        <div style={{ fontSize: '11px', color: '#888', display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ color: '#C9A84C' }}>★ {movie.rating?.toFixed(1)}</span>
          <span>{movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : '—'}</span>
          <span style={{ color: '#555', fontSize: '10px' }}>{movie.industry}</span>
        </div>
        {movie.genres && movie.genres.length > 0 && (
          <div style={{ marginTop: '6px', fontSize: '10px', color: '#666' }}>
            {movie.genres.slice(0, 2).join(' · ')}
          </div>
        )}
      </div>
    </div>
  )
}