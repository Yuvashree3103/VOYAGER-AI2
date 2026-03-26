import axios from 'axios'
import toast from 'react-hot-toast'

const defaultApiBaseUrl = (() => {
  if (typeof window === 'undefined') return 'http://localhost:5000/api'
  const host = window.location.hostname || 'localhost'
  const protocol = window.location.protocol === 'https:' ? 'https:' : 'http:'
  return `${protocol}//${host}:5000/api`
})()

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || defaultApiBaseUrl

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    if (error.code === 'ECONNABORTED') {
      toast.error('Request timeout')
    } else if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error.response?.data || error)
  }
)

// ============ AUTH APIS ============
export const authAPI = {
  login: (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  profile: () => api.get('/auth/profile'),
}

// ============ TRIP APIS (BudgetTracker uses this) ============
export const tripAPI = {
  // Cost prediction
  predictCost: (data) => api.post('/predict-cost', data),
  
  // Trip planning
  recommendTrip: (data) => api.post('/recommend-trip', data),
  selectTransport: (data) => api.post('/select-transport', data),
  
  // Itinerary
  optimizeItinerary: (data) => api.post('/optimize-itinerary', data),
}

// ============ AI APIS (GROQ) ============
export const aiAPI = {
  askQuestion: (data) => api.post('/ask', data),
  chat: (data) => api.post('/chat', data),
  clearSession: (data) => api.post('/clear', data),
}
// ============ PLANNER APIS ============
export const plannerAPI = {
  planTrip: (data) => api.post('/plan-trip', data),
  trainModel: () => api.post('/train-model'),
  modelStatus: () => api.get('/model-status'),
}

// ============ ADVANCED PLANNER APIS (NEW) ============
export const advancedPlannerAPI = {
  // Main trip planning endpoint
  planTrip: (data) => api.post('/plan-trip-v2', data),
  
  // Interest validation
  validateInterests: (data) => api.post('/validate-interests', data),
  
  // Get available interests for a city
  getInterests: (city) => api.get(`/interests/${city}`),
  
  // Get all available cities
  getCities: () => api.get('/cities'),
  
  // Budget estimation
  estimateBudget: (data) => api.post('/budget-estimate', data),
}
// ============ SERVICES APIS ============
export const servicesAPI = {
  getWeather: () => api.get('/weather'),
  getEmergencyContacts: () => api.get('/emergency-contacts'),
  getNearestEmergency: (data) => api.post('/nearest-emergency', data),
  translate: (data) => api.post('/translate', data),
  searchImages: (params) => api.get('/images/search', { params }),
  getRoute: (data) => api.post('/maps/route', data),
  getNearby: (data) => api.post('/maps/nearby', data),
}

// ============ TRAVEL CATALOG APIS ============
export const travelAPI = {
  getCatalog: () => api.get('/catalog'),
  getAgencies: () => api.get('/agencies'),
  getAgency: (id) => api.get(`/agencies/${id}`),
  getGuides: () => api.get('/guides'),
  getPackages: () => api.get('/packages'),
  getFoods: (location) => api.get('/foods', { params: location ? { location } : undefined }),
  getFeatures: () => api.get('/features'),
  getCarouselImages: () => api.get('/carousel-images'),
}

export default api
