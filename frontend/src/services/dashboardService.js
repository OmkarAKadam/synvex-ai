import apiClient from '../api/apiClient'

export async function getDashboard() {
  const response = await apiClient.get('/api/dashboard')
  return response.data
}