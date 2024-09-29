import { IPost } from "./post"

export type IBasicUser = {
    id: string
    username?: string
    name?: string
    email: string
    image: string
    info: string
}

export type IBasicUsers = IBasicUser[]


export type IAbout = {
    posts: IPost[]
    followers: IBasicUser[]
    following: IBasicUser[]
    followersIDs: string[]
    followingIDs: string[]
    followingStatus : boolean
} & IBasicUser  