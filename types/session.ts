export type ISessionUser = {
    id: string
    expires : string
    username?: string
    name?: string
    email: string
    image: string
    info: string
    followersIDs: string[]
    followingIDs: string[]
    savedPosts: string[]
    likedPosts: string[]
}


export type ISession = ISessionUser | null