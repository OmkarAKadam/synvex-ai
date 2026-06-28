import apiClient from '../api/apiClient'

export async function getAllTasks() {
  const response = await apiClient.get('/api/tasks')
  return response.data
}

export async function getTaskById(id) {
  const response = await apiClient.get(`/api/tasks/${id}`)
  return response.data
}

export async function createTask(payload) {
  const response = await apiClient.post('/api/tasks', payload)
  return response.data
}

export async function updateTask(id, payload) {
  const response = await apiClient.put(`/api/tasks/${id}`, payload)
  return response.data
}

export async function updateTaskStatus(id, status) {
  const response = await apiClient.patch(`/api/tasks/${id}/status`, { status })
  return response.data
}

export async function deleteTask(id) {
  await apiClient.delete(`/api/tasks/${id}`)
}