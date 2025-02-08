import { Card } from '@/components/ui/card'
import { EventType } from '@/lib/type'
import Image from 'next/image'
import React from 'react'
import { format, isSameMonth, getDate, getMonth } from 'date-fns'
import { Ticket } from 'lucide-react'
import { StarIcon as SolidStar } from "@heroicons/react/24/solid"
import { StarIcon as OutlineStar } from "@heroicons/react/24/outline"
import { motion } from "framer-motion"
import { useAppSelector } from '@/redux/store'
import { useRouter } from 'next/navigation'

interface EventProps {
    data: EventType,
    onClick:(id:string)=>void
}
const Event: React.FC<EventProps> = ({
    data,
    onClick
}) => {
    const { userInfo, isAuthenticated } = useAppSelector((state) => state.user)
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
        <Card className='w-[330px] h-[290px]'>
            <div className='relative w-full h-[58%] shadow-md'>
                <Image src={data.image}
                    layout='fill'
                    alt='event image'
                    objectFit='cover'
                    className='rounded-t-xl cursor-pointer'
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
                        onClick={()=>onClick(data.id)}>
                        {
                            data.favorited?.includes(userInfo?.id || 0) ? <SolidStar className='text-[#2B293D] size-5' /> :
                                <OutlineStar className='text-[#2B293D] size-5' />
                        }
                    </motion.div>
                }
            </div>
            <div className='w-full px-4 py-3 flex gap-x-2'>
                <div className='w-[20%] flex flex-col  text-[16px] font-semibold justify-start items-center'>
                    <span className='text-[#4539B4] text-[16px] font-semibold'>
                        {format(data.start_date, 'MMM')}
                    </span>
                    {
                        isSameMonthDifferenceDate(data.start_date, data.end_date) ? <span>
                            {format(data.start_date, "d")} - {format(data.end_date, "d")}
                        </span> :
                            <span>
                                {format(data.start_date, "d")}
                            </span>
                    }
                </div>
                <div className='w-[80%] flex flex-col '>
                    <span className='text-[12px]  text-[#2D2C3C] font-semibold line-clamp-2'>{data.title}</span>
                    <span className='text-[12px] line-clamp-1 text-[#5A5A5A]'>{data.location}</span>
                    {
                        isDifferentMonth(data.start_date, data.end_date) ? <span className='text-[12px] text-[#5A5A5A] line-clamp-1'>
                            {format(data.start_date, 'yyyy-MMM-dd hh:mm a')} - {format(data.end_date, 'yyyy-mmm-dd hh:mm a')}
                        </span> : <span className='text-[12px] text-[#5A5A5A] line-clamp-1'>
                            {format(data.start_date, 'hh:mm a')} - {format(data.end_date, "hh:mm a")}
                        </span>
                    }
                    {
                        data.eventType == "Free" ? <span className='text-[12px] line-clamp-2 text-[#5A5A5A] flex gap-x-1'>
                            <Ticket className='w-4 h-4' />
                            <span>
                                Free
                            </span>
                        </span> : <span className='text-[12px] line-clamp-2 text-[#5A5A5A] flex gap-x-1'>
                            <Ticket className='w-4 h-4' />
                            <span>
                                ${data.price}
                            </span>
                        </span>
                    }
                </div>
            </div>
        </Card>
    )
}

export default Event