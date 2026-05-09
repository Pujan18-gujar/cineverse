import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password.length < 6) return setError('Password must be at least 6 characters.')
    setLoading(true)
    setError('')
    try {
      await signup(form.name, form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0A0A0A' }}>
      <div style={{ width: '420px', background: '#111', border: '1px solid rgba(201,168,76,0.3)', padding: '52px 48px' }}>
        <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: '24px', fontWeight: 300, letterSpacing: '5px', color: '#E8CC7A', textAlign: 'center', marginBottom: '8px', textTransform: 'uppercase' }}>Cineverse</div>
        <div style={{ textAlign: 'center', fontSize: '11px', color: '#555', letterSpacing: '1.5px', marginBottom: '40px' }}>Create your free account</div>

        {error && <div style={{ background: 'rgba(220,50,50,0.1)', border: '1px solid rgba(220,50,50,0.3)', color: '#ff7070', padding: '13px', fontSize: '12px', marginBottom: '24px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {[
            { label: 'Full Name', key: 'name', type: 'text', placeholder: 'Your Name' },
            { label: 'Email Address', key: 'email', type: 'email', placeholder: 'your@email.com' },
            { label: 'Password', key: 'password', type: 'password', placeholder: 'Min. 6 characters' },
          ].map(({ label: lbl, key, type, placeholder }) => (
            <div key={key} style={{ marginBottom: '20px' }}>
              <label style={label}>{lbl}</label>
              <input type={type} required placeholder={placeholder} value={form[key]} onChange={(e) => setForm({ ...form, [key]: e.target.value })} style={input} />
            </div>
          ))}
          <button type="submit" disabled={loading} style={{ width: '100%', padding: '14px', background: '#C9A84C', color: '#0A0A0A', fontSize: '11px', fontWeight: 700, letterSpacing: '2px', textTransform: 'uppercase', marginTop: '12px' }}>
            {loading ? 'Creating account...' : "Create Account — It's Free"}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '28px', fontSize: '12px', color: '#444' }}>
          Already have an account? <Link to="/login" style={{ color: '#C9A84C' }}>Login here</Link>
        </div>
      </div>
    </div>
  )
}

const label = { display: 'block', fontSize: '10px', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#666', marginBottom: '8px' }
const input = { width: '100%', padding: '13px 16px', background: '#1A1A1A', border: '1px solid rgba(255,255,255,0.08)', color: '#F5F0E8', fontSize: '13px', outline: 'none' }