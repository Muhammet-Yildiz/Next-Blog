import axiosInstance from "./fetcher"

export const likePost = async (url : string,  { arg }: { arg: { id : string  ,likesCount : number} }) => {
    
    return await axiosInstance.post(url, arg)
    
}

export const savePost = async (url : string,  { arg }: { arg: { id : string } }) => {
    
    return await axiosInstance.post(url, arg)
    
}

export const followUser = async (url : string,  { arg }: { arg: { userId : string } }) => {
    
    return await axiosInstance.post(url, arg)
    
}


export const createPost = async (url : string,  { arg }: { arg: FormData }) => {
    
    return await axiosInstance.post(url, arg)
    
}

export const editPost = async (url : string,  { arg }: { arg: FormData }) => {
    
    return await axiosInstance.put(url, arg)
    
}

export const createComment = async (url : string,  { arg }: { arg: { postId : string , content : string } }) => {
    
    return await axiosInstance.post(url, arg)
    
}

export const deletePost = async (url : string,  { arg }: { arg: { id : string } }) => {
    
    return await axiosInstance.delete(url, { data: arg })
    
}

export const deleteComment = async (url : string,  { arg }: { arg: { id : string } }) => {
    
    return await axiosInstance.delete(url, { data: arg })
}


export const updateAccount = async (url : string,  { arg }: { arg: FormData }) => {
    
    await axiosInstance.post(url, arg)
    
}

export const deleteAccount = async (url : string ) => {
    
    return await axiosInstance.delete(url)
    
}   

export const changePassword = async (url : string,  { arg }: { arg: { oldPassword : string , newPassword : string } }) => {
    
    return await axiosInstance.post(url, arg)
    
}

export const forgotPassword = async (url : string,  { arg }: { arg: { email : string } }) => {
    
    return await axiosInstance.post(url, arg)
    
}
export const resetPassword = async (url : string,  { arg }: { arg: { token : string , password : string } }) => {
    
    return await axiosInstance.post(url, arg)
    
}

export const deleteNotification = async (url : string,  { arg }: { arg: { id : string } }) => {
    
    return await axiosInstance.delete(url, { data: arg })
    
}

export const markNotificationsAsRead = async (url : string) => {
    
    return await axiosInstance.post(url)
    
}