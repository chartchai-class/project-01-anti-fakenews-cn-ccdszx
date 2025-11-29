import type { Comment as CommentType } from '@/types'
import apiClient from './AxiosCLient'


export default {
  getByNews(newsId: number,perPage: number, page: number) {
    return apiClient.get<CommentType[]>(`/news/${newsId}/comments?_limit=${perPage}&_page=${page}`)
  },

  getComment(id: number) {
    return apiClient.get<CommentType[]>('/comments/' + id)
  },
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  saveComment(comment: CommentType) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...commentData } = comment
    return apiClient.post('/comments', commentData)
  },
  deleteComment(id: number) {
    return apiClient.delete('/comments/' + id)
  },
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars

  adminRemoveComment(id: number) {
    return apiClient.put(`/admin/comments/${id}/remove`)
  },
}
