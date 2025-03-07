import { EventType } from '@/lib/type'
import { useAppSelector } from '@/redux/store'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'
import { StarIcon as SolidStar } from "@heroicons/react/24/solid"
import { StarIcon as OutlineStar } from "@heroicons/react/24/outline"
import { motion } from "framer-motion"
import { format, getDate, getMonth, isSameMonth } from 'date-fns'
import { Ticket } from 'lucide-react'

interface SearchEventProps {
    data: EventType,
    onClick: (id: string) => void
}

const SearchEvent: React.FC<SearchEventProps> = ({
    data,
    onClick
}) => {
    const { isAuthenticated, userInfo } = useAppSelector((state) => state.user)
    const router = useRouter()
    const isSameMonthDifferenceDate = (startDate: string, endDate: string) => {
            const start_date = new Date(startDate)
            const end_date = new Date(endDate)
    
            return isSameMonth(start_date, end_date) && getDate(start_date) !== getDate(end_date);
        }
    
        const isDifferentMonth = (startDate: string, endDate: string) => {
            const start_date = new Date(startDate)
            const end_date = new Date(endDate)
    
            return getMonth(start_date) != getMonth(end_date)
        }
    return (
        <div className='w-full flex gap-x-4'>
            <div className='relative w-[50%] h-[190px] rounded-lg  shadow-md shadow-gray-400'>
                <Image src={data.image}
                    layout='fill'
                    alt='event image'
                    objectFit='cover'
                    className='cursor-pointer rounded-lg'
                    onClick={() => router.push(`/eventDetail/${data.id}`)}
                />
                <div className=' absolute bottom-0 left-0 p-1 text-[#2D2C3C] font-semibold rounded-tr-lg text-[11px] bg-backgroundYellow'>
                    {data.category}
                </div>
                {
                    isAuthenticated && <motion.div
                        whileTap={{ scale: 0.8 }} // Shrinks when clicked
                        animate={{ scale: 1 }} // Returns to normal
                        transition={{ type: "spring", stiffness: 300, damping: 15 }} // Smooth bounce
                        className=' absolute top-2 right-4 cursor-pointer bg-white p-2 rounded-full  shadow shadow-gray-500'
                        onClick={() => onClick(data.id)}>
                        {
                            data.favorited?.includes(userInfo?.id || 0) ? <SolidStar className='text-[#2B293D] size-5' /> :
                                <OutlineStar className='text-[#2B293D] size-5' />
                        }
                    </motion.div>
                }
            </div>
            <div className='w-[50%] h-[190px] py-2 flex flex-col gap-y-2'>
                 <h6 className='text-[#2D2C3C] text-[16px] font-semibold line-clamp-2'>
                    {data.title}
                 </h6>
                 <p className='text-[14px] text-[#5A5A5A] font-semibold'>
                    {
                        isDifferentMonth(data.start_date,data.end_date) ? (
                            <span>
                                 {format(data.start_date, 'yyyy-MMM-dd')} - {format(data.end_date, 'yyyy-mmm-dd')}
                            </span>
                        ):(
                            <>
                             {
                                isSameMonthDifferenceDate(data.start_date,data.end_date)?
                                <span className='flex gap-x-2'>
                                  {format(data.start_date,"MMM")} 
                                  <span className='flex gap-x-1'>
                                  {format(data.start_date,"dd")} - {format(data.end_date,"dd")}
                                  </span>
                                </span>:
                                <span>
                                   {format(data.start_date,"MMM-dd")}
                                </span>
                             }
                            </>
                        )
                    }
                 </p>
                 <p className='text-[14px] font-semibold text-[#5A5A5A] line-clamp-1'>
                    {data.location}
                 </p>
                 <p className='text-[14px] text-[#5A5A5A]'>
                     {format(data.start_date, 'hh:mm a')} - {format(data.end_date, "hh:mm a")}
                 </p>

                 <p className='text-[14px] text-[#287921] font-semibold'>
                 {
                        data.eventType == "Free" ? <span className='flex gap-x-1'>
                            <Ticket className='w-5 h-5' />
                            <span>
                                Free
                            </span>
                        </span> : <span className='flex gap-x-1'>
                            <Ticket className='w-5 h-5' />
                            <span>
                                ${data.price}
                            </span>
                        </span>
                    }
                 </p>

            </div>
        </div>
    )
}

export default SearchEvent