import apiClient from '../api/apiClient'

export async function login(credentials) {
  const response = await apiClient.post('/api/auth/login', credentials)
  return response.data
}

export async function register(userData) {
  const response = await apiClient.post('/api/users', userData)
  return response.data
}