"use client"
import { TForgotPasswordSchema, forgotPasswordSchema } from "@/lib/zod/types"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useForgotPassword } from "@/services/mutations";

export const ForgotPasswordForm = () => {

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful },
        getValues,
        reset,
        setError
    } = useForm<TForgotPasswordSchema>({
        resolver: zodResolver(forgotPasswordSchema)
    })
    const router = useRouter()
    const { trigger } = useForgotPassword()

    const onSubmit = async (data: TForgotPasswordSchema) => {
        await trigger(data, {
            onSuccess: ({ data }) => {
                toast.success(data.message)
            },
            onError: (error) => {
                console.log(error)
                toast.error(error.message)
                setError("email", { message: error.message })
            }
        })
    }

    return (
        <>
            {
                isSubmitSuccessful ? <div className=" text-sm leading-7  text-center bg-violet-50 py-2 dark:bg-zinc-800/60 dark:text-zinc-400">

                    Password reset link has been sent successfully to
                    <b className="text-violet-500 dark:text-violet-500/70"  > {getValues("email")} </b>
                    <br />
                    <button
                        onClick={() => {
                            router.push("https://mail.google.com")
                        }}
                        className="border-t  text-sm font-semibold leading-6 text-violet-500 hover:text-indigo-500 w-full mt-3 b py-3 dark:text-violet-500/70 dark:border-zinc-800/60" >
                        Gmail uygulamasını aç
                    </button>

                </div> :
                    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)} >
                        <div className="input-wrapper " >
                            <label htmlFor="email" className={`label ${errors.email ? 'text-red-400' : 'text-gray-900 dark:text-gray-400'}`}>
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
                        <div>
                            <button
                                disabled={isSubmitting || isSubmitSuccessful}
                                type="submit"
                                className="flex w-full justify-center rounded-md bg-violet-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-violet-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:bg-gray-300 disabled:cursor-default dark:hover:bg-violet-500 dark:bg-violet-500/80 dark:disabled:bg-gray-500">
                                Continue
                            </button>
                        </div>
                    </form>
            }
        </>

    )
}