import apiClient from '../api/apiClient'

export async function getCurrentUser() {
  const response = await apiClient.get('/api/users/me')
  return response.data
}

export async function updateCurrentUser(userData) {
  const response = await apiClient.put('/api/users/me', userData)
  return response.data
}

export async function deleteCurrentUser() {
  const response = await apiClient.delete('/api/users/me')
  return response.data
}