import { SectionTitle } from '@/components/sec-title'
import { WhoToFollowLoadingSkeleton } from '@/components/sidebar-menu/loading-skeletons/who-to-folow-skeleton'
import { RecommendedUser } from '@/components/sidebar-menu/recommended-user'
import { useGetFollowableUsers } from '@/services/queries'

export const WhoToFollow = () => {
    const {users , usersLoading , isError}  = useGetFollowableUsers()

    if (usersLoading) return  <WhoToFollowLoadingSkeleton />

    if (isError) return  <>There was a problem fetching the followable users request</>

    return (
      !usersLoading && <div>
            <SectionTitle title='Who to follow' />

            {users.map((user) => (
                <RecommendedUser
                    key={user.id}
                    user={user}
                />
            ))}

        </div>
    )
}