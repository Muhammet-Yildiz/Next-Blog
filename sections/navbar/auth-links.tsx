import React from 'react'
import Link from 'next/link'
import { LuPenSquare } from 'react-icons/lu'
import { ISession } from '@/types/session'
import { ThemeSwitcher } from './theme-switcher'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export const AuthLinks = () => {
    const { data: session } = useSession() as { data: ISession }
    const router = useRouter()
    return (
        <>
            <div className='flex items-center gap-2  px-3 py-2 text-sm bg-violet-100 rounded-sm  font-medium shadow-sm cursor-pointer dark:bg-neutral-800/80 '
                onClick={() => router.push('/write')}  >

                <LuPenSquare
                    size={16}
                    className='text-violet-600  dark:text-violet-500/60'
                />
                <p className='text-violet-600  dark:text-violet-500/60'>
                    Write
                </p>
            </div>

            {!session?.email && (
                <>
                    <ThemeSwitcher />

                    <Link href={'/login'} className='dark:text-gray-500/80' >
                        Login
                    </Link>
                    <Link href={'/register'} className='dark:text-gray-500/80'>
                        Register
                    </Link>
                </>
            )}

        </>
    )
}