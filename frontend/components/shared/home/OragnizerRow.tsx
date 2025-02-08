import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import { OrganizerType } from '@/lib/type'
import { useGetOrganizerlistQuery } from '@/redux/features/userApislice'
import React, { useEffect, useState } from 'react'
import OrganizerCard from '../organizer/OrganizerCard'

const OragnizerRow = () => {
    const {data,isLoading} = useGetOrganizerlistQuery()
    const [OrganizerList,setOrganizerList] = useState<OrganizerType[]>([])

    useEffect(()=>{
      if(data?.results){
         setOrganizerList(data.results || [])
      }
    },[data?.results])
    
    const FollowHandler = async (id:string)=>{
        try{
          console.log(id)
        }catch(error){

        }
    }

    console.log(data)
  return (
    <div className='w-full max-w-6xl mx-auto max-xl:px-7 my-10'>
          <h1 className='text-[18px] md:text-[25px] text-[#2D2C3C] font-bold  mb-5'>Popular Organizer's</h1>
          <ScrollArea className='w-full flex gap-x-3  whitespace-nowrap px-3 py-5'>
              {
                isLoading ? (
                    <div className='w-full grid sm:grid-cols-2 md:grid-cols-4 gap-x-3 gap-y-5'>
                       {
                        [1,2,3,4].map((skeleton)=>(
                            <Skeleton key={skeleton}
                            className='w-[200px] h-[350px]'/>
                        ))
                       }
                    </div>
                ):(
                    <div className='w-full flex gap-x-7 w-max'>
                     {
                        OrganizerList.map((organizer,index)=>(
                            <OrganizerCard key={index} 
                            data={organizer} 
                            followbtn={FollowHandler}/>
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