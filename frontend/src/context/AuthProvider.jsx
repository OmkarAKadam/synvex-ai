import { useEffect, useMemo, useState } from 'react'
import { login as loginService } from '../services/authService'
import { getCurrentUser } from '../services/userService'
import AuthContext from './authContext'

const TOKEN_STORAGE_KEY = 'synvex_token'

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY))
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const refreshUser = async () => {
    setLoading(true)
    try {
      const userData = await getCurrentUser()
      setCurrentUser(userData)
    } finally {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    const response = await loginService(credentials)
    const jwt = response.token

    localStorage.setItem(TOKEN_STORAGE_KEY, jwt)
    setToken(jwt)

    await refreshUser()

    return response
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    setToken(null)
    setCurrentUser(null)
  }

  useEffect(() => {
    if (token && !currentUser) {
      refreshUser()
    }
  }, [token])

  const value = useMemo(
    () => ({
      token,
      currentUser,
      loading,
      isAuthenticated: Boolean(token),
      login,
      logout,
      refreshUser,
    }),
    [token, currentUser, loading],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

export default AuthProvider