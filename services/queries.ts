import { INotification, ITopic } from "@/types";
import { IPost, IPosts } from "@/types/post";
import { IAbout, IBasicUser, IBasicUsers } from "@/types/user";
import { useMemo } from "react";
import useSWR from "swr";
import { fetcher } from "./fetcher";
import useSWRInfinite from "swr/infinite";


export function useGetPost(slug: string) {
    const id = slug.split('--')[1]
    const { data, error, isValidating, isLoading, mutate } = useSWR(`/posts/${id}`);

    const memorizedVal = useMemo(
        () => ({
            post: (data?.post as IPost) || [],
            postLoading: isLoading,
            isError: error,
            isValidating: isValidating,
            mutate
        }),
        [data?.post, error, isValidating, isLoading, mutate]

    );
    return memorizedVal;
}


// Method Defines how to retrieve  posts with pagination 
export function useGetPosts(pageIndex: string, tag: string, sortType: string) {

    const { data, error, isValidating, isLoading, mutate } = useSWR(`/posts?page=${pageIndex}&tag=${tag}&sst=${sortType || 'MOST_RECENT'}`);

    const memorizedVal = useMemo(
        () => ({
            posts: (data?.posts as IPosts) || [],
            totalPages: (data?.totalPages as number) || 0,
            postsLoading: isLoading,
            isError: error,
            isValidating: isValidating,
            mutate
        }),
        [data?.posts, data?.totalPages, error, isValidating, isLoading, mutate]

    );
    return memorizedVal;
}



// Method Defines how to retrieve  posts with  infinite scroll
export function useGetPostsInfinite(tag: string, sortType: string) {

    const getKey = (pageIndex: number, previousPageData: any) => {
        if (previousPageData && !previousPageData.nextCursor) return null; // reached the end
        return `posts/infinite?cursor=${previousPageData ? previousPageData.nextCursor : ''}&tag=${tag}&sst=${sortType || 'MOST_RECENT'}`;
    };

    const { data, error, size, setSize } = useSWRInfinite(getKey, fetcher);


    const posts = data ? data.flatMap(d => d.posts) : [];
    const isLoadingInitialData = !data && !error;
    const isLoadingMore = isLoadingInitialData || (size > 0 && data && typeof data[size - 1] === 'undefined');
    const isReachingEnd = data && data[data.length - 1]?.posts?.length < 5;

    const memorizedVal = useMemo(
        () => ({
            posts: (posts as IPosts) || [],
            isLoadingMore,
            isLoadingInitialData,
            size,
            setSize,
            isReachingEnd,
            isError: error
        }),
        [data,posts, error, isLoadingMore, size, setSize, isReachingEnd , isLoadingInitialData]

    );


    return memorizedVal;

}


export function useGetSavedPosts() {
    const { data, error, isValidating, isLoading, mutate } = useSWR("/posts/saved");

    const memorizedVal = useMemo(
        () => ({
            posts: (data?.posts as IPosts) || [],
            postsLoading: isLoading,
            isError: error,
            isValidating: isValidating,
            mutate
        }),
        [data?.posts, error, isValidating, isLoading , mutate]
    );
    return memorizedVal;


}


export function useGetPopularPosts() {
    const { data, error, isValidating, isLoading } = useSWR("/posts/popular");

    const memorizedVal = useMemo(
        () => ({
            posts: (data?.posts as IPosts) || [],
            postsLoading: isLoading,
            isError: error,
            isValidating: isValidating
        }),
        [data?.posts, error, isValidating, isLoading]
    );
    return memorizedVal;
}





export function useGetTopics(filterType: 'userPreferred' | 'mostUsed' | 'all') {
    const { data, error, isValidating, isLoading, mutate } = useSWR("/topics?filterType=" + filterType);

    const memorizedVal = useMemo(
        () => ({
            topics: (data?.topics as ITopic[]) || [],
            topicsLoading: isLoading,
            isError: error,
            isValidating: isValidating,
            mutate
        }),
        [data?.topics, error, isValidating, isLoading, mutate]
    );
    return memorizedVal;
}



export function useGetFollowableUsers() {
    const { data, error, isValidating, isLoading } = useSWR("/users/recommended");

    const memorizedVal = useMemo(
        () => ({
            users: (data?.users as IBasicUsers) || [],
            usersLoading: isLoading,
            isError: error,
            isValidating: isValidating,
        }),
        [data?.users, error, isValidating, isLoading]
    );
    return memorizedVal;
}


export function useGetUserAbout(subEmail?: string) {
    const { data, error, isValidating, isLoading, mutate } = useSWR(subEmail ? `/about/${subEmail}` : null);


    const memorizedVal = useMemo(
        () => ({
            user: (data?.user as IAbout) || [],
            userLoading: isLoading,
            isError: error,
            isValidating: isValidating,
            mutate
        }),
        [data?.user, error, isValidating, isLoading , mutate]
    );
    return memorizedVal;
}

export function useSearchQuery(query: string) {
    const { data, error, isValidating, isLoading } = useSWR(query ? `/search?query=${query}` : null, {
        keepPreviousData: true,
    });
    const memorizedVal = useMemo(
        () => ({
            posts: (data?.posts as IPosts) || [],
            users: (data?.users as IBasicUsers) || [],
            topics: (data?.topics as ITopic[]) || [],
            isLoading,
            isError: error,
            isValidating: isValidating,
        }),
        [data?.posts, data?.users, data?.topics, error, isValidating, isLoading]

    );
    return memorizedVal;
}

export function useCheckResetToken(token: string) {

    const { data, error, isValidating, isLoading } = useSWR(token ? `/auth/reset-password?token=${token}` : null);

    const memorizedVal = useMemo(
        () => ({
            user: (data?.user as IBasicUser) || [],
            userLoading: isLoading,
            isError: error,
            isValidating: isValidating,

        }),
        [data?.user, error, isValidating, isLoading]

    );

    return memorizedVal;

}

export function useGetRecommendations(postId: string) {
    const { data, error, isValidating, isLoading ,mutate } = useSWR(postId ? `/posts/${postId}/recommend` : null);

    const memorizedVal = useMemo(
        () => ({
            author : (data?.author as IAbout) || {},
            authorPosts : (data?.authorPosts as IPosts) || [],
            relatedPosts : (data?.relatedPosts as IPosts) || [],
            isLoading,
            isError: error,
            isValidating: isValidating,
            mutate
        }),
        [ error, isValidating, isLoading ,data?.author, data?.authorPosts, data?.relatedPosts,mutate]

    );

    return memorizedVal;

}

export function useGetNotifications() {

    const { data, error, isValidating, isLoading ,mutate} = useSWR("/notifications");
    const memorizedVal = useMemo(
        () => ({
            allNotifications: (data?.allNotifications as INotification[]) || [],
            unReadNotifications: (data?.unReadNotifications as INotification[]) || [],
            notificationsLoading: isLoading,
            isError: error,
            isValidating: isValidating,
            mutate
        }),

        [data?.allNotifications, data?.unReadNotifications, error, isValidating, isLoading ,mutate]
    );

    return memorizedVal;
}