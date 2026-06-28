import apiClient from '../api/apiClient'

export async function login(credentials) {
  const response = await apiClient.post('/api/auth/login', credentials)
  return response.data
}

export async function register(userData) {
  const { confirmPassword, ...payload } = userData
  const response = await apiClient.post('/api/users', payload)
  return response.data
}

export async function forgotPassword(email) {
  const response = await apiClient.post('/api/auth/forgot-password', { email })
  return response.data
}

export async function resetPassword(token, newPassword) {
  const response = await apiClient.post('/api/auth/reset-password', { token, newPassword })
  return response.data
}

export async function changePassword(currentPassword, newPassword) {
  const response = await apiClient.put('/api/auth/change-password', { currentPassword, newPassword })
  return response.data
}