"use client"
import Image from 'next/image'
import Link from 'next/link'
import { darumadrop } from '@/lib/fonts'
import { ResetPasswordForm } from '@/components/auth/reset-password-form'
export default function ResetPasswordPage() {
  return (
    <div className="fixed left-0  h-screen top-0 flex justify-center items-center">

      <div className='fixed left-0  h-full lg:w-6/12 w-full '  >
        <div className="flex  flex-col justify-center items-center  h-screen  bg-slate-50 dark:bg-black">
        
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Link href={'/'}    className={` ${darumadrop.className}  transition-colors duration-300 font-bold text-[30px]  text-center mx-auto block text-violet-600 dark:text-slate-300`}
            >
              NEXT-BLOG
            </Link>
            
          </div>

          <div className="mt-2 mx-auto w-full max-w-sm font-sans ">
            <ResetPasswordForm />
          </div>

        </div>
      </div>

      <div  className=' fixed  right-0 h-full w-6/12 overflow-hidden hidden lg:block'  >
        <Image src="/12.jpg" fill
          className='object-cover'
          alt='banner'
          loading='lazy'
          blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAA'
        />
      </div>

    </div>
  )
}
