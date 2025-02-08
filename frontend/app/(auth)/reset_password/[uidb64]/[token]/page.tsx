"use client"
import { useSetNewPasswordMutation } from '@/redux/features/userApislice'
import { zodResolver } from '@hookform/resolvers/zod'
import { useParams, useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import resetImage from '@/assets/danny-howe-bn-D2bCvpik-unsplash.jpg'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import { toast } from 'sonner'
import PasswordVisibleButton from '@/components/shared/PasswordVisibleButton'

const formSchema = z.object({
  password: z.string().min(7, { message: "Your password must be at least 7 characters" }),
  confirmPassword: z.string()
}).refine((data) => data.password == data.confirmPassword, {
  message: "both password must match",
  path: ['confirmPassword']
})

export const page = () => {
  const { uidb64, token } = useParams()
  const router = useRouter()
  const [SetNewPassword, { isLoading }] = useSetNewPasswordMutation()
  const [passwordVisibity, setPasswordVisibity] = useState(true)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: ""
    }
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const response = await SetNewPassword({
        password: values.password,
        confirmPassword: values.confirmPassword,
        uidb64: uidb64 as string,
        token: token as string
      }).unwrap()
      form.reset()
      toast.success(response.message)
      router.push('/login')
    } catch (error: any) {
      console.log(error)
      const errorMessage = error?.data?.message || 'Something went wrong. Please try again.'
      toast.error(errorMessage)
    }
  }

  return (
    <div className='w-full h-full flex flex-col lg:flex-row'>
      <div className='w-full lg:w-8/12 flex flex-col justify-center items-center my-10'>
        <h4 className='font-semibold text-[30px] text-primaryColor-900 my-5 '>
          Reset your password
        </h4>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 min-w-[350px]">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <div className='relative'>
                      <Input
                        type={passwordVisibity ? "password":"text"}
                        placeholder="Enter your password"
                        className=' w-full md:w-[360px] h-[44px]'
                        {...field} />
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
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl>
                    <Input
                      type='password'
                      placeholder="confirm your password"
                      className=' w-full md:w-[360px] h-[44px]'
                      {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className='w-full md:w-[360px] h-[44px] bg-backgroundNavyBlue hover:bg-backgroundNavyBlue hover:opacity-85' disabled={isLoading}>
              {
                isLoading ? "Loading..." : "Reset password"
              }
            </Button>
          </form>
        </Form>
      </div>
      <div className='w-full lg:w-1/3 hidden lg:block fixed right-0'>
        <Image src={resetImage} className='h-screen object-cover' alt='signup' />
      </div>
    </div>
  )
}

export default page
