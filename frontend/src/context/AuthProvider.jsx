import { useMemo, useState } from 'react'
import { login as loginService } from '../services/authService'
import AuthContext from './authContext'

const TOKEN_STORAGE_KEY = 'synvex_token'
const USER_STORAGE_KEY = 'synvex_user'

function readStoredUser() {
  const storedUser = localStorage.getItem(USER_STORAGE_KEY)

  if (!storedUser) {
    return null
  }

  try {
    return JSON.parse(storedUser)
  } catch {
    localStorage.removeItem(USER_STORAGE_KEY)
    return null
  }
}

function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_STORAGE_KEY))
  const [user, setUser] = useState(readStoredUser)

  const login = async (credentials) => {
    const response = await loginService(credentials)
    const jwt = response.token

    localStorage.setItem(TOKEN_STORAGE_KEY, jwt)
    localStorage.removeItem(USER_STORAGE_KEY)
    setToken(jwt)
    setUser(null)

    return response
  }

  const logout = () => {
    localStorage.removeItem(TOKEN_STORAGE_KEY)
    localStorage.removeItem(USER_STORAGE_KEY)
    setToken(null)
    setUser(null)
  }

  const value = useMemo(
    () => ({
      token,
      user,
      isAuthenticated: Boolean(token),
      login,
      logout,
    }),
    [token, user],
  )

  return <AuthContext value={value}>{children}</AuthContext>
}

export default AuthProvider