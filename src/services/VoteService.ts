import apiClient from './AxiosCLient'
import type { VoteRequest, VoteResponse } from '@/types'

export default {
  savevoteandComment(newsId: number, output: VoteRequest) {
    return apiClient.post<VoteResponse>(`/news/${newsId}/vote`, output)
  },
  getCounts(newsId: number) {
    return apiClient.get<{ fakeCount: number; notFakeCount: number; myVote: string | null }>(
      `/news/${newsId}/vote/counts`
    )
  },
}
