"use client"
import Logo from '@/components/shared/Logo'
import PasswordVisibleButton from '@/components/shared/PasswordVisibleButton'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useLoginMutation } from '@/redux/features/userApislice'
import { finishInitialLoad, setAuth } from '@/redux/features/userSlice'
import { useAppDispatch } from '@/redux/store'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
    email: z.string().min(2, { message: 'an email is required' }).email({ message: 'a valid email is required' }),
    password: z.string().min(7, { message: "password must be at 7 characters " }),
})

const Page = () => {
    const [passwordVisibity, setPasswordVisibity] = useState(true)
    const router = useRouter()
    const dispatch = useAppDispatch()
    const [Login,{isLoading}] = useLoginMutation()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    
    async function onSubmit(values: z.infer<typeof formSchema>) {
         try{
            const response = await Login({
                email:values.email,
                password:values.password
            }).unwrap()
            console.log(response)
            form.reset()
            dispatch(setAuth({
                accessToken:response.access_token,
                refreshToken:response.refresh_token,
                userInfo:{
                    email:response.email,
                    full_name:response.full_name,
                    role:response.role,
                    id:response.id
                }
            }))
            dispatch(finishInitialLoad())
            if(response.is_verified){
             router.push("/")
            }else{
              router.push(`/verifyEmail?email=${response.email}`)
            }
         }catch(error:any){
            console.log(error)
            const errorMessage = error?.data?.message || 'Something went wrong. Please try again.'
            toast.error(errorMessage)
         }
    }

    const RoleOption = [
        { name: "User", value: "User" },
        { name: "Organizer", value: "Organizer" },
    ]
    return (
        <div className='w-full h-full flex flex-col lg:flex-row justify-end'>
            <div className='w-full hidden lg:block lg:w-[35%] bg-backgroundNavyBlue p-4 h-screen fixed left-0'>
                <Logo className='w-full flex gap-x-1 text-[22px] font-normal text-backgroundYellow' />
                <div className='w-full flex justify-center pt-10'>
                    <h4 className='text-white text-[30px] font-bold w-[350px]'>
                        Discover tailored events.
                        Sign In for personalized recommendations today!
                    </h4>
                </div>
            </div>
            <div className='w-full h-full lg:w-[65%] flex flex-col  items-center bg-white max-md:px-7 mt-10'>
                <div className='w-full h-full md:w-[450px] py-10'>
                    <h4 className='text-[#2D2C3C] text-[20px] sm:text-[25px] font-bold max-sm:pb-6 sm:pb-4'>
                        Login
                    </h4>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                            <FormField
                                control={form.control}
                                name="email"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-[#636363] text-[13px] sm:text-[14px]'>Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your email" {...field} className='w-full placeholder:text-[#ACACAC] text-[12px]' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="password"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-[#636363] text-[13px] sm:text-[14px]'>Password</FormLabel>
                                        <FormControl>
                                            <div className='relative'>
                                                <Input
                                                    type={passwordVisibity ? "password" : "text"}
                                                    placeholder="Enter your password"
                                                    {...field} className='w-full placeholder:text-[#ACACAC] text-[12px] relative' />
                                                <PasswordVisibleButton
                                                    value={passwordVisibity}
                                                    Click={() => setPasswordVisibity(!passwordVisibity)}
                                                    className='absolute right-3 top-1/2 transform -translate-y-1/2 cursor-pointer'
                                                />
                                            </div>
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <div className='w-full flex justify-end items-center'>
                                <Link href="/forget_password" className='text-backgroundNavyBlue font-bold text-[12px]'>
                                    Forget password?
                                </Link>
                            </div>
                            <Button type="submit" className='w-full bg-[#2B293D] hover:opacity-80 hover:bg-[#2B293D] mt-5' disabled={isLoading}>
                                {
                                    isLoading ? "loading...":"Login"
                                }
                            </Button>
                        </form>
                    </Form>
                    <p className='text-[#636363] text-[13px] sm:text-[14px] pt-5 w-full flex gap-x-1'>
                        Don't have an account?
                        <Link href='/signup' className='text-[#2D2C3C] cursor-pointer' >
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div >
    )
}

export default Page