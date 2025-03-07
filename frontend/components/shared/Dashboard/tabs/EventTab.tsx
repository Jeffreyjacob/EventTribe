"use client"
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import PaginationContainer from '../../pagination/PaginationContainer'
import { useOrganizerEventQuery } from '@/redux/features/eventApislice'
import { Skeleton } from '@/components/ui/skeleton'
import Image from 'next/image'
import EventOption from '../EventOption'

export interface EventParamsType {
   title:string,
   page:number,
   page_size:number
}

const EventTab = () => {
    const router = useRouter()
    const [EventParams,setEventParams] = useState<EventParamsType>({
     title:"",
     page:1,
     page_size:10
    })
    const {data,isLoading} = useOrganizerEventQuery({
        title:EventParams.title,
        page:EventParams.page,
        page_size:EventParams.page_size
    })

    const total_Pages = Math.ceil((data?.count || 1)/EventParams.page_size)
    const HandleEventTitle = (title:string)=>{
      setEventParams((prevState)=>({
         ...prevState,
         title:title
      }))
    }

    const onHandlePageChange = (page:number)=>{
       setEventParams((prevState)=>({
         ...prevState,
         page:page
       }))
    }
    return (
        <div className='w-full pt-8 pb-10'>
            <Card className='w-full px-3 md:px-5 py-4 h-full min-h-[50vh]'>
                <div className='w-full flex justify-between items-center my-4'>
                    <h3 className='text-[14px] font-semibold text-[##484848]'>Events</h3>
                    <div className='flex flex-col md:flex-row gap-3'>
                        <Button className='max-md:text-[12px] bg-backgroundNavyBlue hover:bg-backgroundNavyBlue/80 text-white  w-fit' onClick={() => router.push('organizerDashboard/create')}>
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
                <Table>
                    <TableCaption>
                        {
                            (data?.count || 0) > 0 && (
                                <PaginationContainer
                                    total_page={total_Pages}
                                    onPageChange={onHandlePageChange}
                                    currentPage={EventParams.page}
                                />
                            )
                        }
                    </TableCaption>
                    <TableHeader>
                        <TableRow className='text-[#484848] font-semibold'>
                            <TableHead className="w-[100px] max-md:text-[12px]">S/N</TableHead>
                            <TableHead className="w-[150px] max-md:text-[12px]">Name</TableHead>
                            <TableHead className='max-md:text-[12px]'>Category</TableHead>
                            <TableHead className='max-md:text-[12px]'>Price</TableHead>
                            <TableHead className='max-md:text-[12px] min-w-[150px]'>Location</TableHead>
                            <TableHead className='max-md:text-[12px]'>action</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {
                            isLoading ? <>
                                {
                                    [1, 2, 3, 4, 5, 6].map((skeleton, index) => (
                                        <TableRow key={index}>
                                            <TableCell colSpan={6}>
                                                <Skeleton className='w-full h-[40px]  rounded-lg' />
                                            </TableCell>
                                        </TableRow>
                                    ))
                                }
                            </> :
                                <>
                                    {data?.results.map((event, index) => (
                                        <TableRow key={index} className='text-[#484848] font-normal'>
                                            <TableCell>{index + 1}</TableCell>
                                            <TableCell className="max-md:text-[12px] min-w-[300px] ">
                                                <div className='w-full flex gap-x-2 justify-start items-center'>
                                                    <Image src={event.image}
                                                        alt='apartment-image'
                                                        width={40} height={50}
                                                        className='rounded-md shadow-md '
                                                    />
                                                    <span>
                                                        {event.title}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className='max-md:text-[12px]'>{event.category}</TableCell>
                                            <TableCell className='max-md:text-[12px]'> ${event.price}</TableCell>
                                            <TableCell className='max-md:text-[12px] min-w-[150px] w-[290px]'>{event.location}</TableCell>
                                            <TableCell className='text-center'>
                                                <EventOption id={event.id} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </>
                        }
                    </TableBody>

                </Table>
            </Card>
        </div>
    )
}

export default EventTab