import { defineStore } from 'pinia'
import axios from 'axios'
import type { AxiosInstance } from 'axios'
import type { AdminUser } from '@/types'
import { mockAuthData } from '@/services/mockData'

// Check if mock data is used
const USE_MOCK_DATA = import.meta.env.DEV && !import.meta.env.VITE_BACKEND_URL

const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
})


export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('access_token') as string | null,
    user: (localStorage.getItem('user')
      ? JSON.parse(localStorage.getItem('user') as string)
      : null) as AdminUser | null,
  }),
  getters: {
    currentUserName(): string {
      return this.user?.firstname || ''
    },
    currentUserLastname(): string {
      return this.user?.lastname || ''
    },
    currentUserImage(): string[]{
      return this.user?.image || []
    },

    authorizationHeader(): string {
      return `Bearer ${this.token}`
    },

      isAdmin(): boolean {
     return this.user?.roles.includes('ROLE_ADMIN') || false
    },
    isMember(): boolean {
      return this.user?.roles.includes('ROLE_MEMBER') || false
    },
    
    isReader(): boolean {
      return this.user?.roles.includes('ROLE_READER') || false
    },
    
    isAuthenticated(): boolean {
      return !!this.token
    },

  },
  actions: {
    login(email: string, password: string) {
      try {
        if (USE_MOCK_DATA) {
          // Login using mock data
          const result = mockAuthData.authenticate(email, password);
          if (result) {
            const { access_token, user: userData } = result;
            
            this.token = access_token;
            this.user = userData;
            
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            return { success: true };
          } else {
            return { success: false, error: new Error('Invalid credentials') };
          }
        } else {
          // Normal backend API login
          return apiClient
            .post('/api/v1/auth/authenticate', {
              username: email,
              password: password,
            })
            .then((response) => {
              this.token = response.data.access_token
              this.user = response.data.user

              console.log(this.user)
              localStorage.setItem('access_token', this.token as string)
              localStorage.setItem('user', JSON.stringify(this.user))
              return response
            })
        }
      } catch (error) {
        return { success: false, error };
      }
    },

    reload(token: string, user: AdminUser) {
      this.token = token
      this.user = user
    },

    logout() {
      console.log('logout')
      this.token = null
      this.user = null
      localStorage.removeItem('access_token')
      localStorage.removeItem('user')
    },
    
    checkAuth() {
      const storedToken = localStorage.getItem('access_token');
      const storedUser = localStorage.getItem('user');
      
      if (storedToken && storedUser) {
        this.token = storedToken;
        this.user = JSON.parse(storedUser);
      }
    },

    register(firstname: string, lastname: string, email: string, password: string , image: string[]) {
      try {
        if (USE_MOCK_DATA) {
          // Register using mock data
          const data = { firstname, lastname, email, password, image };
          const result = mockAuthData.register(data);
          if (result) {
            const { access_token, user: userData } = result;
            
            this.token = access_token;
            this.user = userData;
            
            localStorage.setItem('access_token', access_token);
            localStorage.setItem('user', JSON.stringify(userData));
            
            return { success: true };
          }
        } else {
          // Normal backend API registration
          return apiClient
            .post('/api/v1/auth/register', {
              firstname: firstname,
              lastname: lastname,
              email: email,
              password: password,
              image: image,
            })
            .then((response) => {
              console.log('Registered', response)
              this.token = response.data.access_token
              this.user = response.data.user
              localStorage.setItem('access_token', this.token as string)
              localStorage.setItem('user', JSON.stringify(this.user))
              return response
            })
        }
        return { success: false, error: new Error('Registration failed') };
      } catch (error) {
        return { success: false, error };
      }
    },


  },
})
