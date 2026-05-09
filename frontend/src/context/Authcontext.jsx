import { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const stored = localStorage.getItem('cineverse_user')
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        setUser(parsed)
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`
      } catch {
        localStorage.removeItem('cineverse_user')
      }
    }
    setLoading(false)
  }, [])

  // Normalize response — server_demo returns { token, user: {...} }
  const normalize = (data) => {
    if (data.user) {
      // server_demo.js format: { token, user: { _id, name, email, role } }
      return { ...data.user, token: data.token }
    }
    // Serverfinal.js format: { _id, name, email, role, token }
    return data
  }

  const login = async (email, password) => {
    const { data } = await axios.post('/api/auth/login', { email, password })
    const normalized = normalize(data)
    setUser(normalized)
    localStorage.setItem('cineverse_user', JSON.stringify(normalized))
    axios.defaults.headers.common['Authorization'] = `Bearer ${normalized.token}`
    return normalized
  }

  const signup = async (name, email, password) => {
    const { data } = await axios.post('/api/auth/signup', { name, email, password })
    const normalized = normalize(data)
    setUser(normalized)
    localStorage.setItem('cineverse_user', JSON.stringify(normalized))
    axios.defaults.headers.common['Authorization'] = `Bearer ${normalized.token}`
    return normalized
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('cineverse_user')
    delete axios.defaults.headers.common['Authorization']
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)