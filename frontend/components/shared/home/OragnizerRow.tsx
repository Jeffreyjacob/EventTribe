import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { OrganizerType } from '@/lib/type'
import { useFollowOrganizerMutation, useGetOrganizerlistQuery } from '@/redux/features/userApislice'
import React, { useEffect, useState } from 'react'
import OrganizerCard from '../organizer/OrganizerCard'
import { toast } from 'sonner'
import { useAppSelector } from '@/redux/store'

const OragnizerRow = () => {
  const { data, isLoading } = useGetOrganizerlistQuery()
  const [Follow] = useFollowOrganizerMutation()
  const FollowHandler = async (id: number) => {
    try {
      const response = await Follow({
        id:id
      }).unwrap()
      toast.success(response.message)
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Something went wrong. Please try again.';
    }
  }

  console.log(data?.results)
  return (
    <div className='w-full max-w-6xl mx-auto max-xl:px-7 my-10'>
      <h1 className='text-[18px] md:text-[25px] text-[#2D2C3C] font-bold  mb-5'>Popular Organizer's</h1>
      <ScrollArea className='w-full flex gap-x-3  whitespace-nowrap px-3 py-5'>
        {
          isLoading ? (
            <div className='w-full grid sm:grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-5'>
              {
                [1, 2, 3, 4].map((skeleton) => (
                  <Skeleton key={skeleton}
                    className='w-[200px] h-[250px]' />
                ))
              }
            </div>
          ) : (
            <div className='w-full flex gap-x-7 w-max'>
              {
                data?.results.map((organizer, index) => (
                  <OrganizerCard key={index}
                    data={organizer}
                    followbtn={FollowHandler} />
                ))
              }
            </div>
          )
        }
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  )
}

export default OragnizerRow