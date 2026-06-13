import { createContext, useContext, useState, useEffect } from 'react'
import { login as loginApi } from '../api/authApi'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  useEffect(() => {
    const savedToken = localStorage.getItem('token')
    const savedUser = localStorage.getItem('user')
    if (savedToken && savedUser) {
      setToken(savedToken)
      setUser(JSON.parse(savedUser))
    }
  }, [])

  const login = async (username, password) => {
    const res = await loginApi(username, password)
    const { token: jwt, role, username: name } = res.data
    const userData = { username: name, role }
    localStorage.setItem('token', jwt)
    localStorage.setItem('user', JSON.stringify(userData))
    setToken(jwt)
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
  }

  const hasRole = (role) => user?.role === role
  const isAuthenticated = !!token

  return (
    <AuthContext.Provider value={{ user, token, login, logout, hasRole, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
