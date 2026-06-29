import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
})

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('synvex_token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (error) => Promise.reject(error),
)

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status

    const messages = {
      400: 'The request could not be processed.',
      401: 'Authentication is required.',
      403: 'You do not have permission to perform this action.',
      500: 'The server encountered an error.',
    }

    if (status === 401) {
      localStorage.removeItem('synvex_token');
      localStorage.removeItem('synvex_user');

      delete apiClient.defaults.headers.common.Authorization;
    }

    if (messages[status]) {
      error.status = status
      error.friendlyMessage =
        error.response?.data?.message || messages[status]
    }

    return Promise.reject(error)
  }
)

export default apiClient