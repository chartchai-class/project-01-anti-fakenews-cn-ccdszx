// src/services/AxiosCLient.ts
import axios from 'axios'

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})


apiClient.interceptors.request.use(
  (request) => {
    const token = localStorage.getItem('access_token')
    console.log('token', token)
    
    if (token) {
      request.headers['Authorization'] = 'Bearer ' + token
    }
    return request
  },
  (error) => Promise.reject(error)
)

export default apiClient
