export interface News{
    id: number;
    topic: string;
    shortDetail: string;
    detail: string;
    created_at: string;
    reporter: UserReporter;
    comments: Comment[];
    fakeCount: number
    notFakeCount: number
    status: NewsStatus;
    image: string[];
}

export type NewsStatus = 'UNVERIFIED' | 'FAKE' | 'NOT_FAKE' | 'TIE'

export type VoteLabel = 'FAKE' | 'NOT_FAKE'

export interface Comment{
    id: number;
    content: string;
    created_at: string;
    usercomment: UserReporter
    voteLabel: VoteLabel
    image: string[]
}

export interface NewsState{
  news: News | null;
}

export interface UserReporter {
  id: number
  firstname: string
  lastname: string
  username: string
  email: string
  image: string[]
}
 
export interface VoteRequest {
  label: VoteLabel
  content: string
  image: string[]
}

export interface VoteResponse {
  fakeCount: number
  notFakeCount: number
  myVote: VoteLabel | null
  comment: Comment
}

export interface MessageState {
  message: string
}

export type Role = 'ROLE_READER' | 'ROLE_ADMIN' | 'ROLE_MEMBER' | string

export type AdminUser = {
  id: number
  firstname: string
  lastname: string
  username: string
  email: string
  image: string[]
  roles: Role[]
  enabled: boolean
  created_at: string
}