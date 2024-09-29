"use client"
import { TResetPasswordSchema, resetPasswordSchema } from "@/lib/zod/types"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter, useSearchParams } from "next/navigation";
import { useResetPassword } from "@/services/mutations";
import { useState } from "react";
import { IoEye, IoEyeOff } from "react-icons/io5";
import { useCheckResetToken } from "@/services/queries";
import { AboutPageSpinner as Spinner } from "../about/loading/about-page-spinner";

export const ResetPasswordForm = () => {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful },
        getValues,
        reset,
        setError
    } = useForm<TResetPasswordSchema>({
        resolver: zodResolver(resetPasswordSchema)
    })
    const router = useRouter()
    const searchParams = useSearchParams()
    const [showPassword, setShowpassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [disableButton, setDisableButton] = useState(false);
    const { user, userLoading, isError } = useCheckResetToken(searchParams.get('token') as string)

    const { trigger, data: resetData } = useResetPassword()

    const onSubmit = async (data: TResetPasswordSchema) => {
        setDisableButton(true)

        trigger({
            token: searchParams.get('token') as string,
            password: data.password
        }, {
            onError: (error) => {
                console.log(error)
                toast.error(error.message)
                setDisableButton(false)
            }
        })
    }

    if (userLoading) return <Spinner />

    if (isError) return <div className=" text-base leading-7  text-center w-full py-2 bg-red-50 text-red-500" > {isError.message}</div>


    return (
        <>
            {
                resetData ?
                    <div className=" text-sm  text-center bg-violet-50 py-2 mt-6 dark:bg-zinc-800/50">
                        <p className="mt-10 text-center text-sm text-gray-500 font-sans leading-7
                            dark:text-gray-400
                        ">
                            Parolanız başarıyla güncellendi.
                            Yeni parolanız ile giriş yapabilirsiniz .
                        </p>
                        <br />
                        <button
                            onClick={() => {
                                router.push("/login")
                            }}
                            className="border-t  text-sm font-semibold leading-6 text-violet-500 hover:text-indigo-500 w-full mt-3 b py-3 
                                dark:border-neutral-800 dark:text-violet-400 dark:hover:text-violet-300
                            "
                        >
                            Login
                        </button>

                    </div>

                    :
                    <>
                        <h2 className="mt-10 text-center text-lg font-semibold leading-4 tracking-tight text-gray-700 font-sans dark:text-gray-400 ">
                            Set a password
                        </h2>
                        <p className="mt-8 text-center text-[0.95rem] font-normal leading-6 tracking-tight text-gray-500 font-sans  ">
                            The password of your account connected to   <b className='text-violet-500'>  {user?.email} </b>will be updated. </p>

                        <form className="space-y-6 mt-6" onSubmit={handleSubmit(onSubmit)} >

                            <div className="input-wrapper mb-[12px]">
                                <label htmlFor="password" className={`label text-gray-500 text-[11px] font-semibold mb-1 ${errors.password ? 'text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                    New Password
                                </label>
                                <div className="relative">
                                    <input type={showPassword ? 'text' : 'password'} id="password"
                                        className={`input sm:text-sm sm:leading-6 ring-1 ${errors.password ? 'ring-red-400 dark:ring-red-400' : 'ring-gray-200'}`}
                                        {...register("password")} />
                                    <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400 text-lg" onClick={() => setShowpassword(!showPassword)}>
                                        {showPassword ? <IoEyeOff /> : <IoEye />}
                                    </div>
                                </div>
                                {errors.password && <div className='error-text'>{errors.password.message}</div>}
                            </div>

                            <div className="input-wrapper">
                                <label htmlFor="confirmPassword" className={`label text-gray-500 text-[11px] font-semibold mb-1 ${errors.confirmPassword ? 'text-red-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                    Confirm Password
                                </label>
                                <div className="relative">
                                    <input type={showConfirmPassword ? 'text' : 'password'} id="confirmPassword"
                                        className={`input sm:text-sm sm:leading-6 ring-1 ${errors.confirmPassword ? 'ring-red-400 dark:ring-red-400' : 'ring-gray-200'}`}
                                        {...register("confirmPassword")} />
                                    <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400 text-lg" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ? <IoEyeOff /> : <IoEye />}
                                    </div>
                                </div>
                                {errors.confirmPassword && <div className='error-text'>{errors.confirmPassword.message}</div>}
                            </div>

                            <div>
                                <button
                                    disabled={disableButton}
                                    type="submit"
                                    className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:bg-gray-300 disabled:cursor-default   dark:hover:bg-violet-500 dark:bg-violet-500/80 dark:disabled:bg-gray-500  "
                                >
                                    Save
                                </button>
                            </div>
                        </form>
                    </>
            }

        </>

    )
}