"use client"
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

interface EventParamsType {
   title:string,
   page:number,
   page_size:number
}

const BookedEventTab = () => {
    const router = useRouter()
    const [EventParams,setEventParams] = useState<EventParamsType>({
     title:"",
     page:1,
     page_size:10
    })

    const HandleEventTitle = (title:string)=>{
      setEventParams((prevState)=>({
         ...prevState,
         title:title
      }))
    }
    return (
        <div className='w-full pt-8'>
            <Card className='w-full px-3 md:px-5 py-4 h-full min-h-[50vh]'>
                <div className='w-full flex justify-between items-center my-4'>
                    <h3 className='text-[14px] font-semibold text-[##484848]'>Events</h3>
                    <div className='flex flex-col md:flex-row gap-3'>
                        <Button className='max-md:text-[12px] bg-primaryColor-900 hover:bg-primaryColor-700 text-white  w-fit' onClick={() => router.push('organizerDashboard/create')}>
                            Add Event
                        </Button>
                        <Input type='text'
                            placeholder='Search...'
                            className='hidden md:block w-[250px]'
                            value={EventParams.title}
                            onChange={(e) => HandleEventTitle(e.target.value)}
                        />
                    </div>
                </div>
                <div className='w-full my-3'>
                    {/** visible search input for only small screen */}
                    <Input type='text'
                        placeholder='Search...'
                        className='md:hidden'
                        value={EventParams.title}
                        onChange={(e) => HandleEventTitle(e.target.value)} />
                </div>
            </Card>
        </div>
    )
}

export default BookedEventTab