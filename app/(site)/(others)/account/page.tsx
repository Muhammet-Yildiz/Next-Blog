"use client"
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { signOut } from "next-auth/react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { ISession } from "@/types/session";
import { useForm } from "react-hook-form";
import { TUpdateAccountSchema, updateAccountSchema } from "@/lib/zod/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { DeleteAccountButton } from "@/components/delete-account-button";
import { useUpdateAccount } from "@/services/mutations";
import { CustomUserImage } from "@/components/custom-user-image";

export default function AccountPage() {
    const router = useRouter()
    const { data: session, update } = useSession() as { data: ISession, update: any };

    const [selectedFile, setSelectedFile] = useState<{ source: File | null, blobURI: string | null }>({
        source: null,
        blobURI: null
    })
    const { trigger, isMutating } = useUpdateAccount()

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        getValues,
        reset,
        setError
    } = useForm<TUpdateAccountSchema>({
        resolver: zodResolver(updateAccountSchema)
    })


    useEffect(() => {
        if (session) {
            reset({
                username: session?.username,
                email: session?.email,
                bio: session?.info,
                image: session?.image
            })
            setSelectedFile({ source: null, blobURI: session?.image })
        }
    }, [session, reset])

    const onSubmit = async (data: TUpdateAccountSchema) => {

        try {
            const formData = new FormData();

            formData.append("username", data.username);
            formData.append("email", data.email);
            formData.append("info", data.bio);
            selectedFile?.source && formData.append("image", selectedFile.source);

            trigger(formData).then(() => {
                if (session?.email !== data.email) {
                    signOut()
                    toast.success('Your profile has been updated successfully , please login again')
                }
                else {

                    update({
                        ...session,
                        username: data.username,
                        email: data.email,
                        info: data.bio,
                        image: selectedFile?.source?.name
                    });
                    toast.success('Your profile  has been updated successfully')
                    router.refresh()
                    router.push('/')

                }
            })

        } catch (error) {
            console.log(error);
        }


    }



    return (
        <div className="max-w-4xl mx-auto mt-10">
            <form className=" space-y-6 font-sans flex sm:flex-row  flex-col justify-between min-h-[380px] relative"
                onSubmit={handleSubmit(onSubmit)}  >
                <div className="w-1/2 flex flex-col items-center pt-10 relative mx-auto sm:mx-0">
                    <input
                        type="file"
                        onChange={({ target }) => {
                            if (target.files) {
                                const file = target.files[0];
                                file && setSelectedFile({
                                    source: file,
                                    blobURI: URL.createObjectURL(file)
                                })
                                reset({ image: file.name })
                            }
                        }}
                        className={`  absolute top-0  w-44 aspect-video rounded  items-center justify-center border-2 border-dashed cursor-pointer  min-h-[230px] mt-10
                    left-1/2 transform -translate-x-1/2  opacity-0 `} />

                    <div className="w-44 aspect-video rounded flex items-center justify-center border-2 border-dashed cursor-pointer min-h-[230px]  dark:border-zinc-700" >
                        {
                            getValues("image") || selectedFile.blobURI
                                ? (
                                    <CustomUserImage
                                        src={selectedFile.blobURI?.startsWith('blob') ? selectedFile.blobURI : getValues("image")}
                                        alt="profile" className="dark:border-zinc-900  border" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-center "  >
                                        <svg
                                            className="w-10 h-10 text-gray-400"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                            />
                                        </svg>
                                        <span className="text-gray-400 text-sm mt-3" >
                                            Select Image
                                        </span>
                                    </div>
                                )}

                    </div>
                    {
                        errors.image && <p className='text-red-500 mt-2 text-[13px]'>
                            Please upload an image
                        </p>
                    }
                </div>
                <div className="w-full sm:w-1/2">

                    <div className="input-wrapper mb-[12px]">

                        <label htmlFor="username" className={`label  ${errors.username ? ' text-red-400 ' : 'text-gray-500  '} text-gray-500  text-[11px]  font-semibold mb-1 `} >
                            Username
                        </label>

                        <input type='text' id="username"
                            className={`input  sm:text-sm sm:leading-6 ring-1  ${errors.username ? 'ring-red-400' : ' ring-gray-200'}`}
                            {...register("username")}
                        />
                        {
                            errors.username && <div className='error-text'>
                                {`${errors.username.message}`}
                            </div>
                        }
                    </div>
                    <div className="input-wrapper mb-[12px]" >
                        <label htmlFor="email"
                            className={`label text-gray-500 text-[11px]  font-semibold mb-1 ${errors.email ? ' text-red-400 ' : 'text-gray-500'} `} >
                            Email address
                        </label>
                        <input type='email' id='email'
                            className={`input  sm:text-sm sm:leading-6 ring-1
                            ${errors.email ? 'ring-red-400 ' : ' ring-gray-200'}`}
                            {...register("email")}
                        />
                        {
                            errors.email && <div className='error-text'>
                                {`${errors.email.message}`}
                            </div>
                        }
                    </div>
                    <div className="input-wrapper " >
                        <label htmlFor="bio" className={`label  text-gray-500 text-[11px]  font-semibold mb-1`} >
                            Bio
                        </label>
                        <textarea id="bio" cols={10} rows={2}
                            className={`input  sm:text-sm sm:leading-6 ring-1 ring-gray-200   resize-none `}
                            {...register("bio")}
                        ></textarea>
                    </div>
                </div>

                <button
                    disabled={isSubmitting || isMutating}
                    type="submit"
                    className={` absolute bottom-[-55px] sm:bottom-8 right-0   p-3  text-center  text-white rounded-sm py-2   transition duration-300   ease-in-out  text-[12px]   font-semibold cursor-pointer z-50  w-[150px] disabled:bg-slate-200
                        ${isSubmitting || isMutating ? " bg-slate-200 cursor-default " : " bg-violet-500 hover:bg-violet-600 cursor-pointer"} `} >
                    {isSubmitting || isMutating ? "  Account Updating..." : " Account Update"}
                </button>

            </form>


            <div className="w-full sm:w-1/2 flex justify-start sm:justify-end   items-center pt-24 relative gap-10 ml-5 pb-10">

                <button type="button" className=" border border-slate-400 p-3  text-center  text-slate-500
                rounded-sm   py-2  hover:bg-slate-100   transition duration-300
                ease-in-out  text-[12px]   font-semibold  disabled:bg-slate-300
                cursor-pointer z-50 w-[150px] "
                    onClick={() => router.push('/account/change-password')}
                >
                    Change Password
                </button>

                <DeleteAccountButton />

            </div>

        </div>

    )
}
