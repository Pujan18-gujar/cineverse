import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A' }}>
      <div style={{ width: '420px', background: '#111', border: '1px solid rgba(201,168,76,0.3)', padding: '52px 48px' }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '24px', fontWeight: 300, letterSpacing: '5px', color: '#E8CC7A', textAlign: 'center', marginBottom: '8px', textTransform: 'uppercase' }}>Cineverse</div>
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#555', letterSpacing: '1.5px', marginBottom: '40px' }}>Welcome back</div>

        {error && <div style={{ background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.3)', color: '#ff7070', padding: '13px', fontSize: '12px', marginBottom: '24px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '20px' }}>
            <label style={label}>Email Address</label>
            <input type="email" required placeholder="your@email.com" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={input} />
          </div>
          <div style={{ marginBottom: '32px' }}>
            <label style={label}>Password</label>
            <input type="password" required placeholder="••••••••" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} style={input} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#C9A84C', color: '#0A0A0A', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase' }}>
            {loading ? 'Logging in...' : 'Login to Cineverse'}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '12px', color: '#444' }}>
          New here? <Link to="/signup" style={{ color: '#C9A84C' }}>Create free account</Link>
        </div>
      </div>
    </div>
  )
}

const label = { display: 'block', fontSize: '10px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#666', marginBottom: '8px' }
const input = { width: '100%', padding: '13px 16px', background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F0E8', fontSize: '13px', outline: 'none' }