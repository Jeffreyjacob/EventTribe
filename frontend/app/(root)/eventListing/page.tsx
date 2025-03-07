"use client"
import SearchEvent from '@/components/shared/Event/SearchEvent'
import MobileFilter from '@/components/shared/MobileFilter'
import PaginationContainer from '@/components/shared/pagination/PaginationContainer'
import SelectButton from '@/components/shared/SelectButton'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { SearchCategoryData, SearchDateData, SearchEventTypeData } from '@/lib/type'
import { useAddFavoriteEventMutation, useSearchEventsQuery } from '@/redux/features/eventApislice'
import { useAppSelector } from '@/redux/store'
import { ArrowDown, ArrowUp, MapPin, Search } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { toast } from 'sonner'

const locationData = [
  { name: "On Site", value: "onsite" },
  { name: "Online", value: "online" }
]

const sortByData = [
  { name: "newest", value: "newest" },
  { name: "oldest", value: "oldest" }
]

interface SearchParamsType {
  page: number
  eventType: string,
  location: string,
  category: string,
  date: string,
  page_size: number
}

const Page = () => {
  const [location, setLocation] = useState("onsite")
  const UrlParams = useSearchParams()
  const searchCategory = UrlParams.get('category')
  const [SortBy, setSortBy] = useState('')
  const [categoryCount, setCategoryCount] = useState(1)
  const [AddFavorite] = useAddFavoriteEventMutation()
  const [SearchParams, setSearchParams] = useState<SearchParamsType>({
    page: 1,
    eventType: "",
    location: "",
    category: "",
    date: "",
    page_size: 6
  })

  useEffect(() => {
    if (searchCategory) {
      setSearchParams((prevState) => ({
        ...prevState,
        category: searchCategory
      }))
    }
  }, [])


  const { data, isLoading, refetch } = useSearchEventsQuery({
    page: SearchParams.page,
    location: SearchParams.location,
    category: SearchParams.category,
    eventType: SearchParams.eventType,
    date: SearchParams.date,
    page_size: SearchParams.page_size
  })

  const handleLocation = (value: string) => {
    setLocation(value)
  }

  const HandleEventType = (eventType: string) => {
    setSearchParams((prevState) => ({
      ...prevState,
      eventType: eventType
    }))
  }

  const HandleDate = (date: string) => {
    setSearchParams((prevState) => ({
      ...prevState,
      date: date
    }))
  }

  const HandleShowmore = () => {
    if (categoryCount > 3) {
      setCategoryCount(1)
    } else {
      setCategoryCount((prevstate) => prevstate + 1)
    }
  }

  const HandleCatgory = (category: string) => {
    setSearchParams((prevState) => ({
      ...prevState,
      category: category
    }))
  }

  const HandleSortby = (value: string) => {
    setSortBy(value)
  }

  const total_page = Math.ceil((data?.count || 0) / SearchParams.page_size)
  const handlePageChange = (value: number) => {
    setSearchParams((prevState) => ({
      ...prevState,
      page: value
    }))
  }


  const handleClearFilter = () => {
    setSearchParams({
      page: 1,
      eventType: "",
      page_size: 6,
      category: "",
      location: "",
      date: ""
    })
  }

  const handleChangeLocation = (value:string)=>{
      setSearchParams((prevState)=>({
        ...prevState,
        location:value
      }))
  }

  const addFavoriteEvent = async (id: string) => {
    try {
      const response = await AddFavorite({
        id: id
      }).unwrap()
      refetch()
      toast.success(response.message)
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Something went wrong. Please try again.';
    }
  }

  return (
    <div className='w-full'>
      {/**top hero search section */}
      <div className='w-full h-[200px] md:h-[240px] bg-gradient-to-r from-[#2B293D] via-[#2D2C3C]/80 to-[#2B293D] flex flex-col justify-center items-center max-md:px-7'>
        <div className='w-full sm:w-[80%] md:w-[53%] '>
          <h6 className='text-[19px] md:text-[25px] font-bold text-white'>
            Explore a world of events. Find what excites you!
          </h6>
          <div className='w-full h-[40px] md:h-[55px]  bg-white rounded-lg mt-7 flex gap-x-2 px-4'>
            <div className='w-[60%] md:w-[70%] flex justify-center items-center gap-x-2'>
              <Search className='w-[18px] md:w-[25px] h-[18px] md:h-[25px]text-[#5A5A5A]' />
              <Input className="w-full placeholder:text-[#5A5A5A] border-none outline-none shadow-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-transparent text-[12px] md:text-[14px] "
                placeholder='Seach event' 
                value={SearchParams.location}
                onChange={(e)=>handleChangeLocation(e.target.value)}
                 />
            </div>
            <div className=' border-l border-[#5A5A5A]/60 w-[40%] md:w-[30%] justify-start items-center gap-x-2 flex px-3'>
              <MapPin className='w-[18px] md:w-[25px] h-[18px] md:h-[25px] text-[#5A5A5A]' />
              <SelectButton placeholder='select location'
                data={locationData}
                className='w-full placeholder:text-[#5A5A5A] border-none outline-none shadow-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-transparent text-[12px] md:text-[14px]'
                value={location}
                onChange={handleLocation} />
            </div>
          </div>
        </div>
      </div>

      {/** event section */}
      <div className='w-full max-w-6xl mx-auto max-xl:px-7 py-10'>
        <div className='w-full flex gap-x-5'>
          {/**side bar large screen option */}
          <ScrollArea className='hidden lg:flex w-[17%] h-[750px]'>
            <div className='flex flex-col gap-y-4'>
              <h6 className='text-[17px] font-semibold '>
                Filters
              </h6>

              {/**price */}
              <div className='flex flex-col w-full gap-y-4 '>
                <h6 className='text-[15px] text-[#2D2C3C] font-semibold'>
                  Price
                </h6>
                <div className='flex flex-col gap-y-2'>
                  {
                    SearchEventTypeData.map((eventType, index) => (
                      <div className='flex gap-x-1 justify-start items-center' key={index}>
                        <Checkbox
                          id={eventType.value}
                          className='text-[#2D2C3C]/50'
                          checked={SearchParams.eventType === eventType.value}
                          onCheckedChange={() => HandleEventType(eventType.value)}
                        />
                        <label className='text-[13px] text-[2B293D]'>
                          {eventType.name}
                        </label>
                      </div>
                    ))
                  }
                </div>
                <Separator />
              </div>

              {/**date */}
              <div className='flex flex-col w-full gap-y-4 '>
                <h6 className='text-[15px] text-[#2D2C3C] font-semibold'>
                  Date
                </h6>
                <div className='flex flex-col gap-y-2'>
                  {
                    SearchDateData.map((date, index) => (
                      <div className='flex gap-x-1 justify-start items-center' key={index}>
                        <Checkbox
                          id={date.value}
                          className='text-[#2D2C3C]/50'
                          checked={SearchParams.date === date.value}
                          onCheckedChange={() => HandleDate(date.value)}
                        />
                        <label className='text-[13px] text-[2B293D] capitalize'>
                          {date.name}
                        </label>
                      </div>
                    ))
                  }
                </div>
                <Separator />
              </div>

              {/**category */}
              <div className='flex flex-col w-full gap-y-4 '>
                <h6 className='text-[15px] text-[#2D2C3C] font-semibold'>
                  Category
                </h6>
                <div className='flex flex-col gap-y-2'>
                  {
                    SearchCategoryData.slice(0, categoryCount * 11).map((category, index) => (
                      <div className='flex gap-x-1 justify-start items-center' key={index}>
                        <Checkbox
                          id={category.value}
                          className='text-[#2D2C3C]/50'
                          checked={SearchParams.category === category.value}
                          onCheckedChange={() => HandleCatgory(category.value)}
                        />
                        <label className='text-[13px] text-[2B293D] capitalize'>
                          {category.name}
                        </label>
                      </div>
                    ))
                  }
                  <button onClick={HandleShowmore}
                    className='w-fit bg-[#EFF8FF] text-blue-600 font-semibold text-[13px] py-2 px-3 mt-3 rounded-xl flex gap-1 items-center  transition-all duration-300'>
                    {
                      categoryCount > 3 ? (
                        <>
                          Show less
                          <ArrowUp className='w-4 h-4' />
                        </>
                      )
                        : (
                          <>
                            Show more
                            <ArrowDown className='w-4 h-4' />
                          </>
                        )
                    }

                  </button>
                </div>
                <Separator />
              </div>


            </div>
          </ScrollArea>

          {/** main section */}
          <div className='w-full lg:w-[83%] lg:border-l md:pl-10'>
            <div className='w-full flex justify-end items-center '>
              <div className='flex gap-x-4 items-center '>
                <button className='w-fit bg-[#EFF8FF] text-blue-600 font-semibold text-[12px] py-2 px-3 mt-3 rounded-xl flex gap-1 items-center  transition-all duration-300 hover:bg-blue-100' onClick={handleClearFilter} >
                  Clear Filter
                </button>
                <div className='flex lg:hidden'>
                  <MobileFilter searchParams={SearchParams}
                   categoryCount={categoryCount}
                   handleShowmore={HandleShowmore}
                   handleCategory={HandleCatgory}
                   handleDate={HandleDate}
                   handleEventType={HandleEventType} />
                </div>
                <div className='flex gap-x-2 text-[13px] items-center'>
                  <span>
                    Sort by:
                  </span>
                  <SelectButton placeholder='sort by' data={sortByData}
                    value={SortBy} className='w-fit text-[13px] text-[#2D2C3C] font-semibold'
                    onChange={HandleSortby} />
                </div>
              </div>
            </div>
            <div className='w-full min-h-[80vh]'>
              {
                isLoading ? (
                  <>
                    {
                      [1, 2, 3, 4].map((skeleton) => (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-10 pt-7 md:pt-10'>
                              <Skeleton className='w-full md:w-[50%] h-[190px]' />
                        </div>
                      ))
                    }
                  </>
                ) : (
                  <>
                    {
                      data?.results.length !== 0 ? (
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-10 pt-7 md:pt-10'>
                          {
                            data?.results.map((events, index) => (
                              <SearchEvent key={index}
                                data={events} onClick={addFavoriteEvent} />
                            ))
                          }
                        </div>
                      ) : (
                        <div className='w-full h-full flex items-center justify-center'>
                            <p className='text-[14px] font-semibold text-[#6F6F6F] text-center pt-32'>
                              No Event Founds, check filter options
                            </p>
                        </div>
                      )
                    }
                  </>
                )
              }
            </div>

            {/**pagination */}
            <div className='w-full flex justify-center items-center mt-10'>
              {
                (data?.results.length != 0) && <PaginationContainer
                  currentPage={SearchParams.page}
                  total_page={total_page}
                  onPageChange={handlePageChange}
                />
              }
            </div>

          </div>

        </div>
      </div>

    </div>
  )
}

export default Page