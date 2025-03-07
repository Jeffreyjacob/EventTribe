"use client"
import { AspectRatio } from '@/components/ui/aspect-ratio'
import { useAddFavoriteEventMutation, useEventDetailsQuery, useRelatedeventsQuery } from '@/redux/features/eventApislice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import Image from 'next/image'
import { useParams, usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { StarIcon as SolidStar, TicketIcon } from "@heroicons/react/24/solid"
import { StarIcon as OutlineStar } from "@heroicons/react/24/outline"
import { CalendarDays, Clock2, MapPin, Share } from 'lucide-react'
import { format, getMonth } from 'date-fns'
import { Button } from '@/components/ui/button'
import Mapcontainer from '@/components/shared/map/Mapcontainer'
import HostCard from '@/components/shared/organizer/HostCard'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import { Skeleton } from '@/components/ui/skeleton'
import Event from '@/components/shared/Event/Event'
import { toast } from 'sonner'
import { setEvent } from '@/redux/features/checkoutSlice'

const Page = () => {
  const { id } = useParams()
  const { data, isLoading, refetch } = useEventDetailsQuery({ id: id as string })
  const { data: RelatedEvent, isLoading: RelatedEventLoading, refetch: RelatedEventRefetch } = useRelatedeventsQuery({ id: id as string }, {
    skip: !id
  })
  const pathName = usePathname()
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [AddFavorite] = useAddFavoriteEventMutation()
  const { userInfo, isAuthenticated } = useAppSelector((state) => state.user)
  const isDifferentMonth = (startDate: string, endDate: string) => {
    const start_date = new Date(startDate)
    const end_date = new Date(endDate)

    return getMonth(start_date) != getMonth(end_date)
  }
  const handleFavorite = async (id: string) => {
    try {
      const response = await AddFavorite({
        id: id
      }).unwrap()
      refetch()
      RelatedEventRefetch()
      toast.success(response.message)
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Something went wrong. Please try again.';
    }
  }
  const handleBuyTicket = ()=>{
     if(isAuthenticated){
       if (data){
        dispatch(setEvent({event:data}))
       }
       router.push("/checkout")
     }else{
       router.push(`/login?redirect=${pathName}`) 
     }
  }
  console.log(data)
  return (
    <div>
      {
        isLoading ? (
          <div className='w-full max-w-6xl mx-auto max-xl:px-7 py-10 flex flex-col gap-y-8 '>
            <Skeleton className='w-full h-[250px] md:h-[400px] rounded-lg' />
            <Skeleton className='w-full h-[70px] rounded-lg' />
            <Skeleton className='w-full h-[120px] rounded-lg' />
            <Skeleton className='w-full h-[290px] rounded-lg' />
          </div>
        ) : (
          <div className='w-full max-w-6xl mx-auto max-xl:px-7 py-10 flex flex-col gap-y-8 '>
            <Image src={data?.image || ""}
              alt='event image'
              objectFit="fill"
              width={800}
              height={400}
              className="rounded-md shadow-xl shadow-gray-400 w-full h-[250px] md:h-[400px]"
            />

            <div className='w-full flex justify-around items-start'>
              <h6 className='text-[17px] md:text-[28px] font-bold w-[80%]'>
                {data?.title}
              </h6>
              <div className='flex gap-x-4 w-[20%] justify-end'>
                {
                  isAuthenticated && <>
                    {
                      data?.favorited.includes(userInfo?.id || 0) ? <SolidStar className='size-8 text-[#2B293D] cursor-pointer hover:scale-110' 
                      onClick={()=>handleFavorite(data.id || "")} /> :
                        <OutlineStar className='size-8 text-[#2B293D] cursor-pointer hover:scale-110'
                         onClick={()=>handleFavorite(data?.id || "")}/>
                    }
                  </>
                }
                <Share className='w-7 h-7  text-[#2B293D] cursor-pointer hover:scale-110' />
              </div>
            </div>

            {/**Date and ticket */}
            <div className='w-full flex justify-around items-start gap-x-4'>
              <div className='w-[50%] md:w-[80%] flex flex-col gap-y-2 md:gap-y-3 '>
                <h6 className='text-[16px] md:text-[19px]  text-[#2D2C3C] font-bold'>
                  Date and Time
                </h6>
                <p className='text-[14px] text-[#2D2C3C] flex gap-x-2'>
                  <CalendarDays className='w-5 h-5' />
                  {
                    isDifferentMonth(data?.start_date || "", data?.end_date || "") ? (
                      <>
                        <span>
                          {data?.start_date ? format(new Date(data.start_date), "d MMMM yyyy") : ""}
                        </span>
                        -
                        <span>
                          {data?.end_date ? format(new Date(data.start_date), "d MMMM yyyy") : ""}
                        </span>
                      </>
                    ) : (
                      <span>
                        {data?.start_date ? format(new Date(data.start_date), "d MMMM yyyy") : ""}
                      </span>
                    )
                  }
                </p>
                <p className='flex gap-x-1  md:gap-x-2 text-[12px]  md:text-[14px]'>
                  <Clock2 className='w-4 h-4 md:w-5 md:h-5 ' />
                  <span>
                    {data?.start_date ? format(data.start_date, "hh:mm a") : ""}
                  </span>
                  -
                  <span>
                    {data?.end_date ? format(data.end_date, "hh:mm a") : ""}
                  </span>
                </p>
              </div>
              <div className='w-[50%] md:w-[20%] flex flex-col'>
                <Button className='w-fit bg-backgroundYellow hover:bg-backgroundYellow/80 text-[#2B293D] text-[16px] md:text-[18px] mb-2 ' onClick={handleBuyTicket}
                  disabled={data?.organizer == userInfo?.id}>
                  <TicketIcon className=' size-5 text-[#2B293D]' />
                  Buy Ticket
                </Button>

                <h6 className='text-[14px] md:text-[16px] font-semibold  text-[#2B293D] pb-1'>
                  Ticket Information
                </h6>
                <p className='text-[12px] md:text-[13px] text-start font-semibold text-[#2B293D]'>
                  <span>
                    standard Ticket
                  </span> :
                  <span>
                    {data?.eventType == "Free" ? "Free" : `$ ${data?.price} each`}
                  </span>
                </p>
              </div>
            </div>

            {/**location */}
            <div className='w-full flex flex-col gap-y-2'>
              <h6 className='text-[16px] md:text-[19px]  text-[#2D2C3C] font-bold'>
                Location
              </h6>
              <div className='text-[14px] text-[#2D2C3C] w-full  md:w-[50%] gap-y-4'>
                <div className='w-full flex  gap-x-2  mb-5'>
                  <MapPin className='w-5 h-5' />
                  <span className='w-300px]'>
                    {data?.location}
                  </span>
                </div>
                {
                  data?.location !== "online" && <Mapcontainer address={data?.location || ""} />
                }
              </div>
            </div>

            {/**organizer details */}
            <div>
              <h6 className='text-[16px] md:text-[19px] text-[#2D2C3C] font-bold '>
                Host By
              </h6>
              <HostCard id={data?.organizer || 0} />
            </div>

            {/**Event description */}

            <div>
              <h6 className='text-[16px] md:text-[19px] text-[#2D2C3C] font-bold '>
                Event Description
              </h6>
              <p className='text-[#5A5A5A] text-[13px]  mt-5 leading-6'>
                {data?.description}
              </p>
            </div>

            {/**Related event */}
            <div>
              <h6 className='text-[16px] md:text-[19px] text-[#2D2C3C] font-bold '>
                Other events you may like
              </h6>
              <ScrollArea className='w-full flex gap-x-3  whitespace-nowrap px-3 py-5'>
                {
                  RelatedEventLoading ? (
                    <div className='w-full flex gap-y-8 mt-8 duration-300 transition-all'>
                      {
                        [1, 2, 3].map((index) => (
                          <Skeleton key={index}
                            className="w-[330px] h-[290px] rounded-xl" />
                        ))
                      }
                    </div>
                  ) :
                    <div className='w-full flex gap-x-4 mt-8 duration-300 transition-all'>
                      {
                        RelatedEvent?.map((event, index) => (
                          <Event data={event} key={index} onClick={handleFavorite} />
                        ))
                      }
                    </div>
                }
                <ScrollBar orientation="horizontal" />
              </ScrollArea>
            </div>

          </div>
        )
      }
    </div>
  )
}
export default Page