import axios from 'axios'
import { baseURL } from './helper'

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor → attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = token
  }
  return config
})

// Response interceptor → check both success + error cases
api.interceptors.response.use(
  (response) => {
    const message = response?.data?.error || response?.data?.message
    if (message === 'Invalid token') {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return response
  },
  (error) => {
    const message = error?.response?.data?.error || error?.response?.data?.message
    if (message === 'Invalid token') {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
