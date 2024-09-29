import { ISession } from '@/types/session';
import { useSession } from 'next-auth/react'
import { useState } from 'react';
import { FollowModalContent } from './follow-modal-content';
import { useGetNotifications, useGetUserAbout } from '@/services/queries';
import { useRouter } from 'next/navigation';
import { useFollowUser } from '@/services/mutations';
import { FollowersUserList } from './followers-user-list';
import { FollowingUserList } from './following-user-list';
import { ActionModal } from '../action-modal';

export const UserProfileSidebar = ({ subEmail } : { subEmail: string}) => {
    const router = useRouter()

    const { data: session ,update } = useSession() as { data: ISession  , update :any};
    const sessionSubEmail = session?.email.split('@')[0]
    const [modalController, setModalController] = useState({
        title: 'Followers',
        isOpen: false
    })

    const { user ,mutate : mutateAbout} = useGetUserAbout(subEmail)
    const { mutate : mutateSessionAbout} = useGetUserAbout(sessionSubEmail)
    const { mutate : mutateNotifications} = useGetNotifications()

    const { trigger, isMutating } = useFollowUser()

    const handleFollowUser = (userId: string) => {
        if (!session) {
            router.push('/login')
            return
        }
        trigger(
            {
                userId
            },
            {
                optimisticData:  session?.followingIDs.includes(userId) ? session?.followingIDs.filter((id) => id !== userId) : [...session?.followingIDs, userId],
                rollbackOnError: true,
                onSuccess: () => {
                    mutateAbout()
                    update({
                        ...session,
                        followingIDs:  session?.followingIDs.includes(userId) ? session?.followingIDs.filter((id) => id !== userId) : [...session?.followingIDs, userId]
                    });
                    mutateSessionAbout()
                    mutateNotifications()
                }
            }
        )
    }

    return (
        <>
            <ActionModal
                isOpen={modalController.isOpen}
                handleClose={() => setModalController({ ...modalController, isOpen: false })}
                title={`${modalController.title} List`}
                content={<FollowModalContent
                    followUser={handleFollowUser}
                    modalController={modalController}
                    user={user}
                />}
            />

            <div className="col-span-12  sm:col-span-3    pt-5" >
                <FollowersUserList
                    user={user}
                    setModalController={setModalController}
                    handleFollowUser={handleFollowUser}
                    isMutating={isMutating}
                />

                <FollowingUserList
                    user={user}
                    setModalController={setModalController}
                />
            </div>
        </>

    )
}