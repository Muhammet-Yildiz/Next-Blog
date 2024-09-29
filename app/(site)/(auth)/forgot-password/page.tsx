"use client"
import Image from 'next/image'
import Link from 'next/link'
import { darumadrop } from '@/lib/fonts'
import { ForgotPasswordForm } from '@/components/auth/forgot-password-form'
export default function ForgotPasswordPage() {
  return (
    <div className="fixed left-0  h-screen top-0 flex justify-center items-center">

      <div className='fixed left-0  h-full lg:w-6/12 w-full '>
        <div className="flex  flex-col justify-center items-center  h-screen  bg-slate-50 dark:bg-black">
        
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Link href={'/'}  className={` ${darumadrop.className}  transition-colors duration-300 font-bold text-[30px] text-violet-600 dark:text-slate-300 text-center mx-auto block`} >
              NEXT-BLOG
            </Link>
            <h2 className="mt-10 text-center text-lg font-semibold leading-4 tracking-tight text-gray-700 font-sans dark:text-gray-400/70 ">
               Forgot password
            </h2>
            <p className="mt-8 text-center text-[0.95rem] font-normal leading-6 tracking-tight text-gray-500 font-sans px-10  sm:px-0 dark:text-gray-500/80 ">
               Please enter your email address yo`&apos;`d like your password reset information sent to
            </p>
          </div>

          <div className="mt-8 mx-auto w-full max-w-sm font-sans ">
            <ForgotPasswordForm />
          </div>

          <p className="mt-10 text-center text-sm text-gray-500 font-sans">
          {`Did you remember your password? 😃`}
            <a href="/login" className="font-semibold leading-6 text-violet-600 hover:text-violet-500 ml-[10px] dark:text-violet-500/80" >
              Login
            </a>
          </p>
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
