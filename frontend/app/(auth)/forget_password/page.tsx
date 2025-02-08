"use client"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useSendPasswordResetEmailMutation } from '@/redux/features/userApislice'
import { zodResolver } from '@hookform/resolvers/zod'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'
import forgetPasswordImage from '@/assets/danny-howe-bn-D2bCvpik-unsplash.jpg'

const formSchema = z.object({
  email: z.string().email('email is invalid').min(1, 'email is required'),
})

const Page = () => {
  
  const router = useRouter()
  const [passwordResetEmail,{isLoading}] = useSendPasswordResetEmailMutation()
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: ''
    },
  })

  async function onSubmit(values: z.infer<typeof formSchema>) {
     try{
       const response = await passwordResetEmail({
         email: values.email
       }).unwrap()
       form.reset()
       toast.success(response.message)
     }catch(error:any){
         console.log(error)
         const errorMessage = error?.data?.message || 'Something went wrong. Please try again.';
         toast.error(errorMessage)
     }
  }
  return (
    <div className='w-full h-full flex flex-col lg:flex-row'>
      <div className='w-full lg:w-8/12 flex flex-col justify-center items-center my-10 space-y-5'>
      <h4 className='font-semibold text-[30px] text-primaryColor-900 my-5 '>
          Forget your Password
        </h4>
        <p className='text-[#484848] text-[14px] font-normal mb-7 w-[360px]'>
        Please enter the email address associated with your account. We'll promptly send you a link to reset your password.
        </p>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 min-w-[350px]">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email"
                      className=' w-full md:w-[360px] h-[44px]'
                      {...field} />
                  </FormControl>

                  <FormMessage />
                </FormItem>
              )}
            />

            
            <Button type="submit" className='w-full md:w-[360px] h-[44px] bg-backgroundNavyBlue hover:bg-backgroudBluishGrey' disabled={isLoading}>
               {
                isLoading ? "sending...":"Send reset link"
               }
            </Button>

              <div className='text-[#484848] font-normal text-[12px] mt-5 text-center mb-7'>
                <span>Go back to </span>
                <Link href="/login" className='text-primaryColor-900 font-bold ml-1'>
                  Login Page
                </Link>
              </div>
          </form>
        </Form>

      </div>
      <div className='w-full lg:w-1/3 hidden lg:block fixed right-0'>
        <Image src={forgetPasswordImage} className='h-screen object-cover' alt='forget_password' />
      </div>
    </div>
  )
}

export default Page