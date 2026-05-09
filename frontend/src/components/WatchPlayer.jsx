import { useState, useEffect, useRef } from "react";

// ─── Hardcoded trailer map for popular movies ────────────────────────────────
// Format: imdbId → YouTube video ID
const TRAILER_MAP = {
  // Hollywood
  'tt4154796': 'TcMBFSGVi1c', // Avengers Endgame
  'tt4154756': '6ZfuNTqbHE8', // Infinity War
  'tt3896198': 'dQ0TS9a3roo', // Guardians Vol 2
  'tt2015381': 'd96cjJhvlMA', // Guardians Vol 1
  'tt3501632': 'FyInFyGNlck', // Thor Ragnarok
  'tt1843866': 'yTDJGFHscrA', // Captain America Winter Soldier
  'tt3498820': '8ugaeA-nMTc', // Captain America Civil War
  'tt0848228': 'eOrNdBpGMv8', // Avengers
  'tt1300854': 'Ke1H3Zi_f_o', // Iron Man 3
  'tt1228705': 'NiGOKFkYaik', // Iron Man 2
  'tt0371746': 'wKtcmiifycU', // Iron Man 1
  'tt0133093': 'm8e-FF8MsqU', // Matrix
  'tt0468569': 'EXeTwQWrcwY', // Dark Knight
  'tt1375666': 'YoHD9XEInc0', // Inception
  'tt0816692': 'zSWdZVtXT7E', // Interstellar
  'tt1853728': 'GLoSzOKIX-M', // Django
  'tt1345836': 'GLoSzOKIX-M', // Dark Knight Rises
  'tt0110912': 's7EdQ4FqbhY', // Pulp Fiction
  'tt6751668': 'F9L4q-0Pi4E', // Parasite
  'tt0120737': 'V75dMMIW2B4', // LOTR Fellowship
  'tt9376612': 'giXco2jaZ_4', // Shang Chi
  'tt9362722': 'aWzlQ2N6qqg', // Spiderman No Way Home
  'tt10648342': 'SZPSoqBO7EY', // Thor Love Thunder

  // Bollywood
  'tt2338151': 'x_7YlGv9u1g', // PK
  'tt1187043': 'z8tRSn4rVP4', // 3 Idiots
  'tt2649554': 'k4yXQkG2P1A', // Bajrangi Bhaijaan
  'tt3893642': 'x_7YlGv9u1g', // Dangal
  'tt4742044': 'bKnFbKbkDXU', // Bahubali 1
  'tt4849438': 'P7ACkX3RZRs', // Bahubali 2
  'tt5013056': '9N1aP6KBzrg', // Dangal
  'tt2762822': 'G6KyVhEf_qU', // Queen
  'tt2178784': 'LMFpVQB8aBc', // Kahaani
  'tt2452186': 'c_Vp-C4h5dg', // Barfi
  'tt1798587': 'Id9bFHPxh1M', // Zindagi Na Milegi Dobara
  'tt2028550': 'nfKGxl1qbBo', // Ship of Theseus
  'tt5034838': 'aVnNalv5pHk', // Raazi
  'tt6694922': 'xqmKSMX7PoA', // Uri
  'tt8107536': 'ZLxLcVCTthQ', // Kabir Singh
  'tt9032400': '9eMKFDNOiGM', // RRR
  'tt10166622': 'k4yXQkG2P1A', // Brahmastra

  // Tollywood / South
  'tt8178634': '9eMKFDNOiGM', // RRR
  'tt13320662': 'GzWWqkONQZc', // KGF 2
  'tt6143790': 'OKBMCL0YFCU', // KGF 1
  'tt7677826': 'JiRpPLx-G0k', // Master
  'tt7075022': '4MVhDJBJSfs', // Vikram
  'tt5943374': 'hLYQBMQPbco', // Baahubali 2 Tamil
  'tt5758778': 'Xjh3CclsGSo', // 96 Tamil
  'tt5574140': 'bKnFbKbkDXU', // Baahubali 1 Telugu
  'tt5367098': 'M-Gr1EcFBMo', // Mersal
};

// ─── Fallback: search YouTube for trailer ─────────────────────────────────
function getTrailerId(movie) {
  if (movie?.imdbId && TRAILER_MAP[movie.imdbId]) {
    return TRAILER_MAP[movie.imdbId];
  }
  // Fallback: use a search embed (YouTube will show results)
  return null;
}

// ─── Main WatchPlayer Component ───────────────────────────────────────────
export default function WatchPlayer({ movie, onClose }) {
  const [loading, setLoading] = useState(true);
  const [trailerId, setTrailerId] = useState(null);
  const [useSearch, setUseSearch] = useState(false);
  const overlayRef = useRef(null);

  useEffect(() => {
    const id = getTrailerId(movie);
    if (id) {
      setTrailerId(id);
      setUseSearch(false);
    } else {
      setUseSearch(true);
    }

    // Lock body scroll
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [movie]);

  // Close on Escape key
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Close on backdrop click
  const handleBackdropClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  const searchQuery = `${movie?.title} ${movie?.releaseDate?.slice(0,4) || ''} official trailer`;
  const embedUrl = trailerId
    ? `https://www.youtube.com/embed/${trailerId}?autoplay=1&rel=0&modestbranding=1&color=white`
    : `https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`;

  return (
    <div
      ref={overlayRef}
      onClick={handleBackdropClick}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.92)',
        backdropFilter: 'blur(12px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        animation: 'fadeIn 0.3s ease',
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@600;700&family=Crimson+Pro:ital,wght@0,300;0,400;1,300&display=swap');
        @keyframes fadeIn { from { opacity:0; transform:scale(0.97) } to { opacity:1; transform:scale(1) } }
        @keyframes shimmer { 0%,100% { opacity:0.4 } 50% { opacity:1 } }
        @keyframes spin { to { transform: rotate(360deg) } }
        .watch-btn:hover { background: #e8cc7a !important; color: #0a0a0f !important; transform: scale(1.05); }
        .close-btn:hover { background: rgba(255,255,255,0.15) !important; }
        .platform-tag:hover { transform: translateY(-2px); box-shadow: 0 4px 15px rgba(201,168,76,0.4); }
      `}</style>

      {/* ── Player Container ── */}
      <div style={{
        width: '90vw', maxWidth: '960px',
        background: 'linear-gradient(135deg, #0d0d1a 0%, #111122 100%)',
        border: '1px solid rgba(201,168,76,0.3)',
        borderRadius: '16px',
        overflow: 'hidden',
        boxShadow: '0 40px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(201,168,76,0.1)',
        position: 'relative',
      }}>

        {/* ── Top bar ── */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '14px 20px',
          background: 'rgba(0,0,0,0.5)',
          borderBottom: '1px solid rgba(201,168,76,0.15)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* CineVerse logo text */}
            <span style={{
              fontFamily: 'Cinzel, serif', fontSize: 18, fontWeight: 700,
              color: '#C9A84C', letterSpacing: 2,
            }}>🎬 CineVerse</span>
            <span style={{
              background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)',
              color: '#C9A84C', fontSize: 10, fontWeight: 700,
              padding: '2px 8px', borderRadius: 20, letterSpacing: 1,
            }}>TRAILER</span>
          </div>

          <button
            className="close-btn"
            onClick={onClose}
            style={{
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
              color: '#fff', width: 32, height: 32, borderRadius: '50%',
              cursor: 'pointer', fontSize: 16, display: 'flex',
              alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s', fontWeight: 300,
            }}
          >✕</button>
        </div>

        {/* ── Video iframe ── */}
        <div style={{ position: 'relative', paddingTop: '56.25%', background: '#000' }}>
          {loading && (
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: '#000', gap: 16, zIndex: 2,
            }}>
              <div style={{
                width: 48, height: 48, border: '3px solid rgba(201,168,76,0.2)',
                borderTop: '3px solid #C9A84C', borderRadius: '50%',
                animation: 'spin 0.8s linear infinite',
              }}/>
              <span style={{ color: '#C9A84C', fontFamily: 'Cinzel, serif', fontSize: 13, letterSpacing: 2 }}>
                LOADING TRAILER...
              </span>
            </div>
          )}

          {trailerId ? (
            <iframe
              src={embedUrl}
              title={`${movie?.title} Trailer`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              onLoad={() => setLoading(false)}
              style={{
                position: 'absolute', top: 0, left: 0,
                width: '100%', height: '100%', border: 'none',
              }}
            />
          ) : (
            // Fallback: open YouTube search in new tab
            <div style={{
              position: 'absolute', inset: 0, display: 'flex',
              flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              background: 'linear-gradient(135deg, #0d0d1a, #1a1a2e)',
              gap: 20,
            }}>
              {/* Movie poster as bg */}
              {movie?.posterPath && (
                <div style={{
                  position: 'absolute', inset: 0, overflow: 'hidden', opacity: 0.15,
                }}>
                  <img src={movie.posterPath} alt="" style={{
                    width: '100%', height: '100%', objectFit: 'cover',
                    filter: 'blur(20px)',
                  }}/>
                </div>
              )}
              <div style={{ position: 'relative', textAlign: 'center', padding: '0 24px' }}>
                <div style={{ fontSize: 56, marginBottom: 12 }}>🎬</div>
                <p style={{
                  fontFamily: 'Cinzel, serif', color: '#E8CC7A',
                  fontSize: 15, letterSpacing: 2, marginBottom: 8,
                }}>{movie?.title}</p>
                <p style={{ color: '#888', fontSize: 13, marginBottom: 24, fontFamily: 'Crimson Pro, serif' }}>
                  Official trailer available on YouTube
                </p>
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(searchQuery)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    background: '#C9A84C', color: '#0a0a0f',
                    padding: '12px 28px', borderRadius: 50,
                    textDecoration: 'none', fontWeight: 700,
                    fontFamily: 'Cinzel, serif', fontSize: 13, letterSpacing: 1,
                    transition: 'all 0.2s',
                  }}
                >
                  ▶ Watch on YouTube
                </a>
              </div>
            </div>
          )}
        </div>

        {/* ── Movie Info Bar ── */}
        <div style={{
          padding: '16px 20px',
          background: 'linear-gradient(90deg, rgba(201,168,76,0.05) 0%, transparent 100%)',
          borderTop: '1px solid rgba(201,168,76,0.1)',
          display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between',
          flexWrap: 'wrap', gap: 12,
        }}>
          {/* Left: title + meta */}
          <div>
            <h2 style={{
              fontFamily: 'Cinzel, serif', color: '#E8CC7A',
              fontSize: 18, fontWeight: 700, margin: '0 0 6px',
              letterSpacing: 1,
            }}>{movie?.title}</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              {movie?.releaseDate && (
                <span style={{ color: '#888', fontSize: 12, fontFamily: 'Crimson Pro, serif' }}>
                  📅 {movie.releaseDate.slice(0, 4)}
                </span>
              )}
              {movie?.rating > 0 && (
                <span style={{
                  background: 'rgba(255,193,7,0.15)', border: '1px solid rgba(255,193,7,0.3)',
                  color: '#ffc107', fontSize: 12, padding: '2px 8px', borderRadius: 12,
                  fontWeight: 700,
                }}>⭐ {movie.rating}/10</span>
              )}
              {movie?.industry && (
                <span style={{
                  background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)',
                  color: '#C9A84C', fontSize: 11, padding: '2px 8px', borderRadius: 12,
                }}>🎬 {movie.industry}</span>
              )}
              {movie?.genres?.slice(0, 2).map(g => (
                <span key={g} style={{
                  background: 'rgba(255,255,255,0.05)', color: '#aaa',
                  fontSize: 11, padding: '2px 8px', borderRadius: 12,
                  border: '1px solid rgba(255,255,255,0.1)',
                }}>{g}</span>
              ))}
            </div>
          </div>

          {/* Right: streaming platforms */}
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: '#555', fontSize: 11 }}>Also on:</span>
            {movie?.streamingOn?.map(platform => (
              <span
                key={platform}
                className="platform-tag"
                style={{
                  background: getPlatformColor(platform),
                  color: '#fff', fontSize: 11, fontWeight: 700,
                  padding: '4px 10px', borderRadius: 8,
                  cursor: 'default', transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
                }}
              >{platform}</span>
            ))}
          </div>
        </div>

      </div>

      {/* ── Hint text ── */}
      <p style={{
        color: 'rgba(255,255,255,0.25)', fontSize: 12,
        marginTop: 16, fontFamily: 'Crimson Pro, serif',
        letterSpacing: 1,
      }}>Press ESC or click outside to close</p>
    </div>
  );
}

function getPlatformColor(platform) {
  const map = {
    'Netflix': '#E50914',
    'Prime Video': '#00A8E1',
    'Disney+ Hotstar': '#0A2647',
    'JioStar': '#6B3FA0',
    'ZEE5': '#8B2FC9',
    'MX Player': '#FF6B35',
    'Aha': '#FFBE00',
    'Sun NXT': '#FF6B00',
    'Manorama MAX': '#E63946',
  };
  return map[platform] || '#333';
}