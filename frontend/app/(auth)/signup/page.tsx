"use client"
import Logo from '@/components/shared/Logo'
import PasswordVisibleButton from '@/components/shared/PasswordVisibleButton'
import SelectButton from '@/components/shared/SelectButton'
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useSignupMutation } from '@/redux/features/userApislice'
import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const formSchema = z.object({
    full_name: z.string().min(2, { message: "full name is required" }),
    email: z.string().min(2, { message: 'an email is required' }).email({ message: 'a valid email is required' }),
    password: z.string().min(7, { message: "password must be at 7 characters " }),
    role: z.enum(['User', 'Organizer'])
})

const Page = () => {
    const [passwordVisibity, setPasswordVisibity] = useState(true)
    const [SignUp, { isLoading }] = useSignupMutation()
    const router = useRouter()
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            full_name: "",
            email: "",
            password: "",
            role: "User"
        },
    })

    async function onSubmit(values: z.infer<typeof formSchema>) {
        try {
            const response = await SignUp({
                full_name: values.full_name,
                email: values.email,
                password: values.password,
                role: values.role
            }).unwrap()
            console.log(response)
            form.reset()
            toast.success("an otp has been sent to your email")
            router.push(`/verifyEmail?email=${response.email}`)
        } catch (error: any) {
            console.log(error)
            const errorMessage = error?.data?.email[0] || error?.data?.message || 'Something went wrong. Please try again.';
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
                        Sign up for personalized recommendations today!
                    </h4>
                </div>
            </div>
            <div className='w-full h-full lg:w-[65%] flex flex-col  items-center bg-white max-sm:px-7 max-sm:mt-10'>
                <div className='w-full h-full md:w-[450px] py-10'>
                    <h4 className='text-[#2D2C3C] text-[20px] sm:text-[25px] font-bold max-sm:pb-6 sm:pb-4'>
                        Create Account
                    </h4>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="max-sm:space-y-6 sm:space-y-4">
                            <FormField
                                control={form.control}
                                name="full_name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-[#636363] text-[13px] sm:text-[14px]'>Full Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter your full name" {...field} className='w-full placeholder:text-[#ACACAC] placeholder:text-[12px]' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
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
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className='text-[#636363] text-[13px] sm:text-[14px]'>Role</FormLabel>
                                        <FormControl>
                                            <SelectButton value={field.value} onChange={field.onChange}
                                                placeholder='select role' data={RoleOption} className='w-full' />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className='w-full bg-[#2B293D] hover:opacity-80 hover:bg-[#2B293D]' disabled={isLoading}>
                                {
                                    isLoading ? "Loading..." : "Create Account"
                                }
                            </Button>
                        </form>
                    </Form>
                    <p className='text-[#636363] text-[13px] sm:text-[14px] pt-5 w-full flex gap-x-1'>
                        Already have an account ?
                        <Link href='/login' className='text-[#2D2C3C] cursor-pointer' >
                            Log In
                        </Link>
                    </p>
                </div>
            </div>
        </div >
    )
}

export default Page