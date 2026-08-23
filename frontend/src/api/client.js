import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
  },
})

// Add token to requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Add response interceptor to handle 401 errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

const api = {
  // Auth
  register: async (userData) => {
    const response = await apiClient.post('/auth/register', userData)
    return response.data
  },

  login: async (email, password) => {
    const formData = new URLSearchParams()
    formData.append('username', email)
    formData.append('password', password)
    const response = await apiClient.post('/auth/login', formData, {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    })
    return response.data
  },

  getCurrentUser: async () => {
    const response = await apiClient.get('/auth/me')
    return response.data
  },

  logout: async () => {
    const response = await apiClient.post('/auth/logout')
    return response.data
  },

  setAuthToken: (token) => {
    if (token) {
      apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`
    } else {
      delete apiClient.defaults.headers.common['Authorization']
    }
  },

  // Analysis
  analyze: async (text) => {
    const response = await apiClient.post('/analyze', { text })
    return response.data
  },

  getHistory: async (search = '', riskFilter = '') => {
    const params = new URLSearchParams()
    if (search) params.append('search', search)
    if (riskFilter) params.append('risk_filter', riskFilter)
    const response = await apiClient.get(`/history?${params}`)
    return response.data
  },

  getAnalysis: async (id) => {
    const response = await apiClient.get(`/history/${id}`)
    return response.data
  },

  deleteHistory: async (id) => {
    const response = await apiClient.delete(`/history/${id}`)
    return response.data
  },

  health: async () => {
    const response = await apiClient.get('/health')
    return response.data
  }
}

export default api