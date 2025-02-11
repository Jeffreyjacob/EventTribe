"use client"
import SelectButton from '@/components/shared/SelectButton'
import { Input } from '@/components/ui/input'
import { MapPin, Search } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const locationData = [
  { name: "On Site", value: "onsite" },
  { name: "Online", value: "online" }
]

interface SearchParamsType {
   page:number
   eventType:string,
   location:string,
   category:string,
   date:string
}

const Page = () => {
  const [location, setLocation] = useState("onsite")
  const UrlParams = useSearchParams()
  const searchCategory = UrlParams.get('category')
  const [SearchParams,setSearchParams] = useState<SearchParamsType>({
     page:1,
     eventType:"",
     location:"",
     category:"",
     date:""
  })

  useEffect(()=>{
     if(searchCategory){
        setSearchParams((prevState)=>({
          ...prevState,
          category:searchCategory
        }))
     }
  },[])

  const handleLocation = (value: string) => {
    setLocation(value)
  }
  console.log(SearchParams)
  return (
    <div className='w-full'>
      <div className='w-full h-[200px] md:h-[240px] bg-gradient-to-r from-[#2B293D] via-[#2D2C3C]/80 to-[#2B293D] flex flex-col justify-center items-center max-md:px-7'>

        <div className='w-full sm:w-[80%] md:w-[53%] '>
          <h6 className='text-[19px] md:text-[25px] font-bold text-white'>
            Explore a world of events. Find what excites you!
          </h6>
          <div className='w-full h-[40px] md:h-[55px]  bg-white rounded-lg mt-7 flex gap-x-2 px-4'>
            <div className='w-[60%] md:w-[70%] flex justify-center items-center gap-x-2'>
              <Search className='w-[18px] md:w-[25px] h-[18px] md:h-[25px]text-[#5A5A5A]' />
              <Input className="w-full placeholder:text-[#5A5A5A] border-none outline-none shadow-none focus:outline-none focus:ring-0 focus:ring-offset-0 focus:border-transparent text-[12px] md:text-[14px] "
                placeholder='Seach event' />
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
    </div>
  )
}

export default Page