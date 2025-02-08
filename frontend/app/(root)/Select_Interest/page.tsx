"use client"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Interest, UpdateUserDefault } from '@/lib/type'
import { cn } from '@/lib/utils'
import { useGetUserQuery, useUpdateInterestMutation, useUpdateUserMutation } from '@/redux/features/userApislice'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'
import ProtectedRoutes from '../ProtectedRoutes'

const Page = () => {
  const [selectedInterest, SetSelectInterest] = useState<string[]>([])
  const [updateUser, { isLoading }] = useUpdateInterestMutation()
  const { data } = useGetUserQuery()
  const router = useRouter()
  useEffect(() => {
    if (data) {
      SetSelectInterest(data.interest || [])
    }
  }, [data])

  const OnHandleSelected = (value: string) => {
    SetSelectInterest((prevState) =>
      prevState.includes(value)
        ? prevState.filter((interest) => interest !== value)
        : [...prevState, value]
    );
  }
  const SaveChange = async () => {
    try {
      const response = await updateUser({
        interest: selectedInterest
      }).unwrap()
      toast.success(response.message)
      router.push("/")
    } catch (error: any) {
      console.log(error)
      const errorMessage = error?.data?.message || "Something went wreng, try again!"
      toast.error(errorMessage)
    }
  }
  return (
    <ProtectedRoutes>
      <div className='w-full max-w-6xl mx-auto max-xl:px-7  mb-10'>
        <h4 className='text-[#2D2C3C] text-[20px] font-bold mt-10'>
          Share your interest with us
        </h4>
        <p className='text-[#2D2C3C] text-[14px]'>Choose your interests below to get personalized event suggestions.</p>
        <div className='w-full flex flex-col gap-y-5 my-5'>
          {
            Interest.map((interest, index) => (
              <div className='w-full flex flex-col gap-y-4' key={index} >
                <h6 className='text-[14px] font-semibold'>{interest.title}</h6>
                <div className='w-full flex gap-x-4 flex-wrap max-md:gap-y-3'>
                  {interest.categories.map((category) => (
                    <div key={category.name}
                      className={cn('text-[#6F6F6F] text-nowrap text-[12px] p-2 rounded-full border-[#6F6F6F] border-[1px] bg-[#F8F7FA] cursor-pointer transition-all duration-300', {
                        "bg-[#6F6F6F] text-white": selectedInterest.includes(category.value)
                      })}
                      onClick={() => OnHandleSelected(category.value)}>
                      {category.name}
                    </div>
                  ))}
                </div>
                <Separator />
              </div>
            ))
          }
        </div>
        <div className='w-full flex justify-end mt-8'>
          <Button className='bg-backgroundNavyBlue hover:bg-backgroundNavyBlue/95 text-white w-fit'
            onClick={SaveChange}
            disabled={isLoading}>
            {
              isLoading ? "...Saving" : "Save my interests"
            }
          </Button>
        </div>
      </div>
    </ProtectedRoutes>
  )
}

export default Page