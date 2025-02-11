"use client"
import React from 'react'
import CTAimage from "@/assets/CreateEventCTA.png"
import { Button } from '@/components/ui/button'
import { CalendarPlus2 } from 'lucide-react'
import { useAppSelector } from '@/redux/store'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

const Cta = () => {
    const { userInfo, isAuthenticated } = useAppSelector((state) => state.user)
    const router = useRouter()
    const handleCreateEvent = ()=>{
        if (userInfo?.role === "Organizer") {
            router.push("/createEvent")
        } else {
            toast.warning("You must sign up as an Organizer to create an event.")
        }
    }
    return (
        <div className='w-full h-[180px] flex justify-end items-center'
            style={{
                backgroundImage: `url(${CTAimage.src})`,
                backgroundSize: 'cover'
            }}>
            <div className='w-[57%] md:w-[70%] flex flex-col lg:flex-row pr-5 gap-y-4 lg:gap-x-5'>
                <div className='text-backgroundYellow'>
                    <h6 className='text-[15px] md:text-[20px] font-medium'>
                        Create an event with Eventify
                    </h6>
                    <p className='text-[12px] md:text-[14px] font-normal'>
                        Got a show, event, activity or a great experience? Partner with us & get listed on Eventify
                    </p>
                </div>
                <div>
                    {
                        isAuthenticated ? (
                                <Button className='bg-backgroundYellow lg:text-[17px] text-[#2B293D] font-semibold hover:bg-backgroundYellow/80 gap-x-2'
                                    onClick={handleCreateEvent}>
                                    <CalendarPlus2 className='w-3 h-3 lg:w-4 lg:h-4  text-[#2B293D]' />
                                    Create Event
                                </Button>

                            ) : (
                                <Button className='bg-backgroundYellow lg:text-[17px] text-[#2B293D] font-semibold hover:bg-backgroundYellow/80 gap-x-2'
                                    onClick={() => router.push("/login")}>
                                    <CalendarPlus2 className='w-3 h-3 lg:w-4 lg:h-4  text-[#2B293D]' />
                                    Create Event
                                </Button>
                            )
                    }
                </div>
            </div>
        </div >
    )
}

export default Cta