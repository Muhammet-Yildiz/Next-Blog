import { IPost } from "./post"
import { IBasicUser } from "./user"

export type ITopic = {
  id: string
  name: string
}

export type IComment = {
  id: string
  content: string
  authorId: string
  postId: string
  createdAt: string
  updatedAt: string
  author: IBasicUser
  likesCount?: number
  likedBy: string[]
}


export type EditorJsContent = {
  time: number;
  blocks: Array<{
    type: string;
    data: any;
  }>;
  version: string;
};

export type SortType =
  'RECOMMENDED' |
  'MOST_RECENT' |
  'LEAST_RECENT' |
  'MOST_LIKED' |
  'LEAST_LIKED' |
  'MOST_VIEWED' |
  'LEAST_VIEWED' |
  'MOST_COMMENTED'

export type INotification = {
  id: string
  user: IBasicUser
  userId: string
  content: string
  createdAt: string
  actionBy: IBasicUser
  actionById: string
  type: string
  postId: string
  post: IPost
  isRead: boolean
}