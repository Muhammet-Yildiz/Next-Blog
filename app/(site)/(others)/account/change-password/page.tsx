"use client"
import { radioCanada } from "@/lib/fonts";
import { changePasswordSchema, TChangePasswordSchema } from "@/lib/zod/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useState } from "react";
import { IoEye ,IoEyeOff } from "react-icons/io5";
import { useChangePassword } from "@/services/mutations";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
export default function ChangePasswordPage() {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues,
        reset,
        setError
    } = useForm<TChangePasswordSchema>({
        resolver: zodResolver(changePasswordSchema)
    });
    const router = useRouter()
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {trigger,isMutating } = useChangePassword()

    const onSubmit = async (data: TChangePasswordSchema) => {
         trigger({
            oldPassword: data.oldPassword,
            newPassword: data.newPassword
        }).then((res:any) => {
           
            toast.success("Password changed successfully")
            router.push('/account')
         
        }).catch((err) => {
            console.log(err);
            toast.error(err.message)
            setError('oldPassword', { message: err.message })
        })

    };

    return (
        <div className="max-w-xl mx-auto mt-10">
            <form className="font-sans flex flex-col justify-between min-h-[370px] relative"
                onSubmit={handleSubmit(onSubmit)}>

                <h5 className={`${radioCanada.className} text-center text-base mb-3 font-bold text-gray-500 bg-violet-50 py-2 font-sans dark:bg-zinc-800/80`}>
                    Change Password
                </h5>

                <div className="rounded-md w-full">
                    <div className="input-wrapper mb-[12px]">
                        <label htmlFor="oldPassword" className={`label text-gray-500 text-[11px] font-semibold mb-1 ${errors.oldPassword ? 'text-red-400' : 'text-gray-500'}`}>
                            Current Password
                        </label>
                        <div className="relative">
                            <input type={showOldPassword ? 'text' : 'password'} id="oldPassword"
                                className={`input sm:text-sm sm:leading-6 ring-1 ${errors.oldPassword ? 'ring-red-400 dark:ring-red-400' : 'ring-gray-200'}`}
                                {...register("oldPassword")} />
                            <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400 text-lg" onClick={() => setShowOldPassword(!showOldPassword)}>
                                {showOldPassword ? <IoEyeOff /> : <IoEye />}
                            </div>
                        </div>
                        {errors.oldPassword && <div className='error-text'>{errors.oldPassword.message}</div>}
                    </div>

                    <div className="input-wrapper mb-[12px]">
                        <label htmlFor="newPassword" className={`label text-gray-500 text-[11px] font-semibold mb-1 ${errors.newPassword ? 'text-red-400' : 'text-gray-500'}`}>
                            New Password
                        </label>
                        <div className="relative">
                            <input type={showNewPassword ? 'text' : 'password'} id="newPassword"
                                className={`input sm:text-sm sm:leading-6 ring-1 ${errors.newPassword ? 'ring-red-400 dark:ring-red-400' : 'ring-gray-200'}`}
                                {...register("newPassword")} />
                            <div className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-400 text-lg" onClick={() => setShowNewPassword(!showNewPassword)}>
                                {showNewPassword ? <IoEyeOff /> : <IoEye />}
                            </div>
                        </div>
                        {errors.newPassword && <div className='error-text'>{errors.newPassword.message}</div>}
                    </div>

                    <div className="input-wrapper">
                        <label htmlFor="confirmPassword" className={`label text-gray-500 text-[11px] font-semibold mb-1 ${errors.confirmPassword ? 'text-red-400' : 'text-gray-500'}`}>
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
                </div>

                <button type="submit" className= {`
                    ${isSubmitting || isMutating ? " bg-slate-200 cursor-default " : " bg-violet-500 hover:bg-violet-600 cursor-pointer"}
                    text-center text-white rounded-sm py-2 transition duration-300 ease-in-out text-[12px] font-semibold cursor-pointer z-50  w-44 self-end`} >
                    {isSubmitting || isMutating ? "Password Updating..." : " Change Password"}
                </button>

            </form>
        </div>
    );
}