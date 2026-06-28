import apiClient from '../api/apiClient'

export async function breakdownGoal(payload) {
  const response = await apiClient.post('/api/ai/goal-breakdown', payload)
  return response.data
}

export async function generateDailyPlan(payload) {
  const response = await apiClient.post('/api/daily/plan', payload)
  return response.data
}

export async function analyzeRisk(payload) {
  const response = await apiClient.post('/api/risk/analyze', payload)
  return response.data
}

export async function generateReplanning(payload) {
  const response = await apiClient.post('/api/replanning/generate', payload)
  return response.data
}

export async function analyzeAnalytics(payload) {
  const response = await apiClient.post('/api/analytics/analyze', payload)
  return response.data
}