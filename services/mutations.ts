import { changePassword, createComment, createPost, deleteAccount, deleteComment, deleteNotification, deletePost, editPost, followUser, forgotPassword, likePost, markNotificationsAsRead, resetPassword, savePost, updateAccount, } from "./api";
import { useGetSavedPosts } from "./queries";
import useSWRMutation from "swr/mutation";

export function useLikePost() {
    return useSWRMutation('/posts/like', likePost);
}

export function useFollowUser() {
    return useSWRMutation('/users/follow', followUser)
}

export function useSavePost() {

    const { mutate } = useGetSavedPosts();

    return useSWRMutation('/posts/saved', savePost, {
        onSuccess: () => {
            mutate();
        },
    });
}


export function useCreatePost() {
    return useSWRMutation('/posts', createPost);
}

export function useCreateComment() {
    return useSWRMutation('/comments', createComment);
}

export function useEditPost() {
    return useSWRMutation('/posts', editPost)
}

export function useDeletePost() {
    return useSWRMutation('/posts', deletePost);
}

export function useDeleteComment() {
    return useSWRMutation('/comments', deleteComment);
}


export function useUpdateAccount() {
    return useSWRMutation('/account', updateAccount);
}

export function useDeleteAccount() {
    return useSWRMutation('/account', deleteAccount);
}


export function useChangePassword() {
    return useSWRMutation('/account/change-password', changePassword);
}


export function useForgotPassword() {
    return useSWRMutation('/auth/forgot-password', forgotPassword);
}


export function useResetPassword() {
    return useSWRMutation('/auth/reset-password', resetPassword);
}
export function useDeleteNotification() {
    return useSWRMutation('/notifications', deleteNotification);
}

export function useMarkNotificationsAsRead() {

    return useSWRMutation('/notifications',  markNotificationsAsRead);

}