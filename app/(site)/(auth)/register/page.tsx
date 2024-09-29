"use client"
import Image from 'next/image'
import { FaGithub } from 'react-icons/fa'
import { FcGoogle } from 'react-icons/fc'
import Link from 'next/link'
import { signIn } from 'next-auth/react';
import { RegisterForm } from '@/components/auth/register-form'
import { darumadrop } from '@/lib/fonts'
export default function RegisterPage() {
  return (
    <div className="fixed left-0  h-screen top-0 flex justify-center items-center" >
      <div className='fixed left-0  h-full lg:w-6/12 w-full ' >
        <div className="flex  flex-col justify-center    items-center  h-screen   bg-slate-50 dark:bg-black">
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <Link href={'/'} className={` ${darumadrop.className} transition-colors duration-300 font-bold text-[30px] text-violet-600 dark:text-slate-300 text-center mx-auto block`} >
              NEXT-BLOG
            </Link>
            
            <h2 className="mt-6 text-center text-md font-semibold leading-4 tracking-tight text-gray-600 font-sans dark:text-neutral-400 ">
              Sign up to your account
            </h2>
          </div>

          <div className="mt-4 mx-auto w-full max-w-sm font-sans ">
            <RegisterForm />

            <div className="mt-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-zinc-700/80" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-slate-50 text-gray-500 dark:bg-black
                   dark:text-zinc-600/90">Or continue with</span>
                </div>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <div
                  className="w-full inline-flex justify-center py-3 px-3 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium leading-6 text-gray-700 hover:bg-gray-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-700
                 cursor-pointer   transition duration-400 ease-in-out   dark:bg-zinc-800/70 dark:text-zinc-400
                 dark:border-zinc-700 "
                  onClick={() => signIn('github')}
                >
                  <span className="sr-only">Sign up with GitHub</span>
                  <FaGithub size={22} />
                </div>

                <div className="w-full inline-flex justify-center py-3 px-3 border border-gray-300 rounded-md shadow-sm bg-white  leading-6 text-gray-700 hover:bg-gray-100 
                 transition duration-400 ease-in-out  cursor-pointer dark:bg-zinc-800/70 dark:text-zinc-400
                 dark:border-zinc-700"
                  onClick={() => signIn('google')}
                >
                  <span className="sr-only">Sign up with Google</span>
                  <FcGoogle size={22} />
                </div>

              </div>
            </div>
          </div>

          <p className="mt-5 text-center text-sm text-gray-500 font-sans">
            Already have an account?
            <a href="/login" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500 ml-[10px] dark:text-violet-500/80" >
              Sign In
            </a>
          </p>
        </div>
      </div>

      <div className=' fixed  right-0 h-full w-6/12 overflow-hidden hidden lg:block'  >
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
