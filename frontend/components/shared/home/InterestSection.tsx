"use client"
import React, { useEffect, useState } from 'react'
import { EventType } from '@/lib/type'
import { useAppSelector } from '@/redux/store'
import { toast } from 'sonner'
import { useAddFavoriteEventMutation, useInterestedEventQuery } from '@/redux/features/eventApislice'
import { Skeleton } from '@/components/ui/skeleton'
import Event from '../Event/Event'
import { Button } from '@/components/ui/button'

const InterestSection = () => {
    const [page, setPage] = useState(1)
    const [interestedEvent, setInterestedEvent] = useState<EventType[]>([])
    const { userInfo } = useAppSelector((state) => state.user)
    const [AddFavorite] = useAddFavoriteEventMutation()
    const { data, isLoading } = useInterestedEventQuery({
        page
    })

    useEffect(() => {
        if (data?.results && data.results.length > 0) {
            setInterestedEvent((prevState) => {
                const newEvent = data.results.filter((event) => !prevState.some(
                    (prevEvent) => prevEvent.id === event.id
                ))
                return [...prevState, ...newEvent]
            })
        }
    }, [data])

    const addFavoriteEvent = async (id: string) => {
        try {
            const response = await AddFavorite({
                id: id
            }).unwrap()
            if (userInfo?.id) {
                setInterestedEvent((prevState) => {
                    return prevState.map((event) => {
                        if (event.id === id) {
                            const userId = userInfo.id
                            const isFavorited = event.favorited.includes(userId)
                            return {
                                ...event,
                                favorited: isFavorited ?
                                    event.favorited.filter((uid) => uid !== userId) :
                                    [...event.favorited, userId]
                            };
                        }
                        return event
                    })
                })
            }
            toast.success(response.message)
        } catch (error: any) {
            const errorMessage = error?.data?.message || 'Something went wrong. Please try again.';
        }
    }
    return (
        <div className='w-full'>
            <h1 className='text-[18px] md:text-[25px] text-[#2D2C3C] font-bold mt-10 mb-5'>Events Based on your interest</h1>
            <div className='w-full flex flex-col justify-center items-center'>
                <div className="w-full grid md:grid-cols-2 lg:grid-cols-3 gap-y-8 mt-8 duration-300 transition-all justify-center items-start">
                    {
                        isLoading ? (
                            <>
                                {
                                    [1, 2, 3].map((index) => (
                                        <Skeleton key={index}
                                            className="w-[330px] h-[290px] rounded-xl" />
                                    ))
                                }
                            </>
                        ) : (
                            interestedEvent.length > 0 ? (
                                <>
                                    {
                                        interestedEvent.map((event, id) => (
                                            <Event key={id} data={event} onClick={addFavoriteEvent} />
                                        ))
                                    }
                                </>
                            ) : (
                               <div className='w-full flex h-full justify-center items-center'>
                                 <h6 className='text-center text-[12px] md:text-[14px] w-full'>
                                 No event matching your interest, select more interest and hobbies to get Recommandations.
                                 </h6>
                               </div> 
                            )
                        )
                    }
                </div>
                {
                    data?.next && (
                        <Button disabled={isLoading} className="w-[350px] mt-10"
                            variant={"outline"}
                            onClick={() => setPage((prev) => prev + 1)}>
                            {
                                isLoading ? "loading..." : "Show more"
                            }
                        </Button>
                    )
                }
            </div>
        </div>
    )
}

export default InterestSection