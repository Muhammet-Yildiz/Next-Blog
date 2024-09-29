"use client"
import { TSignInSchema, signInSchema } from "@/lib/zod/types"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { getSession, signIn } from 'next-auth/react'
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useSWRConfig } from "swr";
import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";

export const LoginForm = () => {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful },
        getValues,
        reset,
        setError
    } = useForm<TSignInSchema>({
        resolver: zodResolver(signInSchema)
    })
    const searchParams = useSearchParams();
    const router = useRouter()
    const { cache } = useSWRConfig()

    const onSubmit = async (data: TSignInSchema) => {

        const res = await signIn('credentials', {
            ...data,
            redirect: false,
        })
        // console.log("res : ", res)

        if (res?.error) {
            setError("email", {
                type: "server",
                message: '',
            });
            setError("password", {
                type: "server",
                message: '',
            });
            toast.error(res.error)
        }
        else {
            const session = await getSession();

            if (session) {
                const nextUrl = searchParams.get('next');
                toast.success("Logged in successfully");

                const cacheKeysArray = Array.from(cache.keys());
                for (const key of cacheKeysArray) {
                    cache.delete(key);
                }

                router.push(nextUrl ? nextUrl : '/');
            } else {
                toast.error("Session could not be established");
            }
        }



    }
    return (
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} >
            <div className="input-wrapper " >
                <label htmlFor="email" className={`label ${errors.email ? 'text-red-400 ' : 'text-gray-900 dark:text-gray-400'}`}>
                    Email address
                </label>
                <input type='email' {...register("email")}
                    className={`input  sm:text-sm sm:leading-6  ${errors.email ? 'ring-2 ring-red-400 dark:ring-red-400' : 'ring-1 ring-gray-300'}`}
                />
                {
                    errors.email && <div className='error-text'>
                        {`${errors.email.message}`}
                    </div>
                }
            </div>

            <div className="input-wrapper">

                <div className="flex items-center justify-between">
                    <label htmlFor="password"
                        className={`label ${errors.password ? 'text-red-400 ' : 'text-gray-900 dark:text-gray-400'}`}
                    >
                        Password
                    </label>
                    <div className="text-[13px] mb-2">
                        <a href="/forgot-password" className="font-semibold text-violet-600 hover:text-violet-500 dark:text-violet-500/80">
                            Forgot password?
                        </a>
                    </div>
                </div>

                <div className="relative">

                    <input type={showPassword ? 'text' : 'password'} {...register("password")}
                        className={`input  sm:text-sm sm:leading-6  ${errors.password ? 'ring-2 ring-red-400 dark:ring-red-400' : 'ring-1 ring-gray-300'} `}
                    />
                    <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400 text-lg" onClick={() => setShowPassword(!showPassword)}>
                        {showPassword ? <IoEyeOff /> : <IoEye />}
                    </div>
                </div>
                {
                    errors.password && <p className='error-text'>
                        {`${errors.password.message}`}
                    </p>
                }
            </div>

            <div>
                <button
                    disabled={isSubmitting || isSubmitSuccessful}
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-violet-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 dark:bg-violet-500/80
                    disabled:bg-gray-300 disabled:cursor-default dark:hover:bg-violet-500 dark:disabled:bg-gray-500
                    "
                >
                    Login
                </button>
            </div>
        </form>
    )
}