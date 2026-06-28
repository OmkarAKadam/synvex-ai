import apiClient from '../api/apiClient'

export async function getAllGoals() {
  const response = await apiClient.get('/api/goals')
  return response.data
}

export async function getGoalById(id) {
  const response = await apiClient.get(`/api/goals/${id}`)
  return response.data
}

export async function createGoal(payload) {
  const response = await apiClient.post('/api/goals', payload)
  return response.data
}

export async function updateGoal(id, payload) {
  const response = await apiClient.put(`/api/goals/${id}`, payload)
  return response.data
}

export async function updateGoalProgress(id, progressPercentage) {
  const response = await apiClient.patch(`/api/goals/${id}/progress`, { progressPercentage })
  return response.data
}

export async function deleteGoal(id) {
  await apiClient.delete(`/api/goals/${id}`)
}