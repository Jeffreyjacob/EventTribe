"use client"

import Event from "@/components/shared/Event/Event"
import ExploreCategories from "@/components/shared/home/ExploreCategories"
import Herosection from "@/components/shared/home/Herosection"
import InterestSection from "@/components/shared/home/InterestSection"
import OragnizerRow from "@/components/shared/home/OragnizerRow"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { EventType } from "@/lib/type"
import { useAddFavoriteEventMutation, useAlleventsQuery } from "@/redux/features/eventApislice"
import { useAppSelector } from "@/redux/store"
import { MoveRight } from "lucide-react"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import interestCoverImage from "@/assets/interestCoverimage2.png"
import { useRouter } from "next/navigation"
import Cta from "@/components/shared/home/Cta"
import NewsLetter from "@/components/shared/home/NewsLetter"

export default function Home() {
  const [page, setPage] = useState(1)
  const [event, setEvent] = useState<EventType[]>([])
  const [AddFavorite] = useAddFavoriteEventMutation()
  const { data, isLoading } = useAlleventsQuery({ page }, {
    skip: false
  })
  const { userInfo, isAuthenticated } = useAppSelector((state) => state.user)
  const router = useRouter()

  useEffect(() => {
    if (data?.results && data.results.length > 0) {
      setEvent((prevState) => {
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
        setEvent((prevState) => {
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
    <main className='w-full flex flex-col h-full'>
      <Herosection />
      <ExploreCategories />
      <div className='w-full max-w-6xl mx-auto my-10 max-xl:px-7 '>
        <h1 className='text-[18px] md:text-[25px] text-[#2D2C3C] font-bold'>Popular Events</h1>
        <div className="w-full flex flex-col justify-center items-center">
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
                <>
                  {
                    event.map((event, id) => (
                      <Event key={id} data={event} onClick={addFavoriteEvent} />
                    ))
                  }
                </>
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

      {/** event based on your interest */}
      <div className='w-full max-w-6xl mx-auto my-10 max-xl:px-7 '>
        <div className='w-full h-[200px] flex flex-col justify-center items-center gap-y-2'
          style={{
            backgroundImage: `url(${interestCoverImage.src})`,
            backgroundSize: "cover",
            objectFit: "contain"
          }}>
          <h5 className='text-[#2D2C3C] text-[18px] md:text-[24px] font-bold'>
            Events specially curated for you!
          </h5>
          <p className='text-[#2D2C3C] text-[12px] md:text-[16px] max-md:px-5'>
            Get event suggestions tailored to your interests! Don't let your favorite events slip away.
          </p>
          <Button className='text-backgroundYellow  hover:scale-105 transition-all duration-300'
            onClick={() => router.push('/Select_Interest')}>
            Get Started
            <MoveRight className='text-backgroundYellow' />
          </Button>
        </div>
        <div className="w-full">
          {
            isAuthenticated && <InterestSection />
          }
        </div>
      </div>
      <OragnizerRow />
      <Cta/>
      <NewsLetter/>
    </main>
  )
}
