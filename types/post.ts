
import { IComment, ITopic } from "."
import { IBasicUser } from "./user"
  export type IPost = {
    id: string
    title: string
    content: string
    authorId: string
    published: boolean
    createdAt: string
    updatedAt: string
    image: string
    likesCount: number
    readingTime: number
    relatedTags?: ITopic[]
    currentTagName?: string
    author : IBasicUser & {
        followersIDs: string[]
    }
    comments: IComment[]
    viewCount: number
}

export type IPosts = IPost[]