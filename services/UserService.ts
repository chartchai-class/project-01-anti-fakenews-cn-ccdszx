
import apiClient from '@/services/AxiosCLient'
import type { Role } from '@/types'
import { mockUsers } from './mockData'

// Check if mock data is used
const USE_MOCK_DATA = import.meta.env.DEV && !import.meta.env.VITE_BACKEND_URL

export default {
  
  getUsers(perPage: number, page: number) {
    if (USE_MOCK_DATA) {
      // Mock pagination
      const start = (page - 1) * perPage
      const end = start + perPage
      return { data: mockUsers.slice(start, end) }
    }
    return apiClient.get(`/admin?_limit=${perPage}&_page=${page}`)
  },

  
  updateRoles(id: number, roles: Role[], enabled?: boolean) {
    if (USE_MOCK_DATA) {
      // Mock update user role
      const user = mockUsers.find(u => u.id === id)
      if (user) {
        user.roles = roles
        if (typeof enabled === 'boolean') {
          user.enabled = enabled
        }
      }
      return { 
        data: { 
          success: true, 
          message: 'User roles updated successfully',
          user: user 
        } 
      }
    }
    const params = typeof enabled === 'boolean' ? `?enabled=${enabled}` : ''
    return apiClient.put(`/admin/${id}/roles${params}`, roles)
  },
}
