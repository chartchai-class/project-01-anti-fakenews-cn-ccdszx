import type { News as NewsType } from '@/types'
import apiClient from './AxiosClient'
import type { AxiosResponse } from 'axios'
import { getMockNews, mockNews } from './mockData'

// Check if mock data is used (used in development environment when there is no backend service)
const USE_MOCK_DATA = import.meta.env.DEV && !import.meta.env.VITE_BACKEND_URL

// Define service functions
const newsService = {

  getNews(perPage: number, page: number) {
    if (USE_MOCK_DATA) {
      const mockResult = getMockNews({ page, limit: perPage })
      return Promise.resolve({ data: mockResult.data } as AxiosResponse<NewsType[]>)
    }
    return apiClient.get('/news?_limit=' + perPage + '&_page=' + page)
  },

  getNew(id: number) {
    if (USE_MOCK_DATA) {
      const news = mockNews.find(n => n.id === id)
      return Promise.resolve({ data: news } as AxiosResponse<NewsType>)
    }
    return apiClient.get('/news/' + id)
  },
  
  // Add getNewsDetail as an alias for getNew
  getNewsDetail: function(id: number) {
    return this.getNew(id)
  },
  
  // Add getPaginationNews as an alias for getNews
  getPaginationNews: function(params: { page: number; limit: number }) {
    return this.getNews(params.limit, params.page).then(response => ({
      data: {
        items: response.data,
        total: mockNews.length
      }
    }))
  },

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  saveNews(news: NewsType) {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { success: true, message: 'News created successfully' } })
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...newsData } = news
    return apiClient.post('/news', newsData)
  },

  getNewsByKeyword(value: string, perPage: number, page: number) :
    Promise<AxiosResponse<NewsType[]>>{
      if (USE_MOCK_DATA) {
        const mockResult = getMockNews({ keyword: value, page, limit: perPage })
        return Promise.resolve({ data: mockResult.data } as AxiosResponse<NewsType[]>)
      }
      return apiClient.get<NewsType[]>('/news?topic=' + value + '&_limit=' +
        perPage + '&_page=' + page, )
    },

    deleteNews(id: number) {
      if (USE_MOCK_DATA) {
        return Promise.resolve({ data: { success: true, message: 'News deleted successfully' } })
      }
      return apiClient.delete('/news/' + id)
    },

    getNewsByStatus(status: string, perPage: number, page: number) :
    Promise<AxiosResponse<NewsType[]>>{
      if (USE_MOCK_DATA) {
        const mockResult = getMockNews({ status, page, limit: perPage })
        return Promise.resolve({ data: mockResult.data } as AxiosResponse<NewsType[]>)
      }
      return apiClient.get<NewsType[]>('/news?status=' + status + '&_limit=' +
        perPage + '&_page=' + page, )
    },

   adminListNews(filter: string, perPage: number, page: number) {
    if (USE_MOCK_DATA) {
      const mockResult = getMockNews({ filter, page, limit: perPage })
      return Promise.resolve({ data: mockResult.data })
    }
    return apiClient.get(`/admin/news?filter=${encodeURIComponent(filter)}&_limit=${perPage}&_page=${page}`)
  },
  adminRemoveNews(id: number) {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { success: true, message: 'News removed successfully' } })
    }
    return apiClient.put(`/admin/news/${id}/remove`)
  },

  // ===== Admin • Comments =====
  adminListComments(newsId: number, perPage: number, page: number) {
    if (USE_MOCK_DATA) {
      // Merge comments for all news
      const allComments = mockNews.flatMap(news => news.comments || [])
      return Promise.resolve({ data: allComments })
    }
    return apiClient.get(`/admin/news/${newsId}/comments?_limit=${perPage}&_page=${page}`)
  },
  adminRemoveComment(commentId: number) {
    if (USE_MOCK_DATA) {
      return Promise.resolve({ data: { success: true, message: 'Comment removed successfully' } })
    }
    return apiClient.put(`/admin/comments/${commentId}/remove`)
  },
}

// Default export
export default newsService

// Named exports, support individual imports
export const getNewsDetail = newsService.getNewsDetail
export const getPaginationNews = newsService.getPaginationNews
