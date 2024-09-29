"use client"
import { TSignUpSchema, signUpSchema } from "@/lib/zod/types"
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const RegisterForm = () => {

    const router = useRouter()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting, isSubmitSuccessful },
        getValues,
        reset,
        setError
    } = useForm<TSignUpSchema>({
        resolver: zodResolver(signUpSchema)
    })

    const onSubmit = async (data: TSignUpSchema) => {
        try {

            const response = await axios.post('/api/auth/signup', data)
            toast.success('Account created successfully!')
            router.push('/login')
        }
        catch (error: any) {
            console.log(error)
            if (error.response.status === 422) {
                setError("email", {
                    type: "server",
                    message: error.response.data,
                });
            }

            toast.error(error.response.data)
        }


    }
    return (
        <form className="space-y-4"  onSubmit={handleSubmit(onSubmit)}>
            <div className="input-wrapper" >
                <label htmlFor="username" className={`label ${errors.username ? 'text-red-400' : 'text-gray-900 dark:text-gray-400'}`}>
                    Username
                </label>
                <input type="text" {...register("username")}
                    className={`input  sm:text-sm sm:leading-6
                      ${errors.username ? 'ring-2 ring-red-400 dark:ring-red-400 ' : 'ring-gray-300 ring-1'} `}
                />
                {
                    errors.username && <div className='error-text'>
                        {`${errors.username.message}`}
                    </div>
                }
            </div>

            <div className="input-wrapper " >
                <label htmlFor="email"
                    className={`label ${errors.email ? 'text-red-400' : 'text-gray-900 dark:text-gray-400'}`}
                >
                    Email address
                </label>
                <input type='email' {...register("email")}
                    className={`input  sm:text-sm sm:leading-6
                    ${errors.email ? 'ring-2 ring-red-400  dark:ring-red-400' : 'ring-1 ring-gray-300'}
                    `} />
                {
                    errors.email && <div className='error-text'>
                        {`${errors.email.message}`}
                    </div>
                }
            </div>

            <div className="input-wrapper">

                <div className="flex items-center justify-between">
                    <label htmlFor="password" className={`label ${errors.password ? 'text-red-400' : 'text-gray-900 dark:text-gray-400'}`}  >
                        Password
                    </label>
                </div>

                <input type='password' {...register("password")}
                    className={`input  sm:text-sm sm:leading-6   ${errors.password ? 'ring-2 ring-red-400 dark:ring-red-400' : 'ring-1 ring-gray-300'} `} />
                {
                    errors.password && <p className='error-text'>
                        {`${errors.password.message}`}
                    </p>
                }
            </div>
            <div className="input-wrapper">
                <label htmlFor="passwordConfirmation"
                    className={`label ${errors.confirmPassword ? 'text-red-400' : 'text-gray-900 dark:text-gray-400'}`}
                >
                    Confirm Password
                </label>
                <input type='password' {...register("confirmPassword")} className={`input  sm:text-sm sm:leading-6 ${errors.confirmPassword ? 'ring-2 ring-red-400 dark:ring-red-400' : 'ring-1 ring-gray-300'} `}
                />
                {
                    errors.confirmPassword && <p className='error-text'>
                        {`${errors.confirmPassword.message}`}
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
                    Register
                </button>
            </div>
        </form>
    )
}