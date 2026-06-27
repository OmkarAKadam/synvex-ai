import { useMemo, useState } from 'react'
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

  const login = (jwt, authenticatedUser = null) => {
    localStorage.setItem(TOKEN_STORAGE_KEY, jwt)
    setToken(jwt)
    setUser(authenticatedUser)

    if (authenticatedUser) {
      localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(authenticatedUser))
    } else {
      localStorage.removeItem(USER_STORAGE_KEY)
    }
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