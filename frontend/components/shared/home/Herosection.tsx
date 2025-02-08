import React, { useState } from 'react'
import CoverImage from '@/assets/lee-blanchflower-1dW1vEJLlCQ-unsplash.jpg'
import { Input } from '@/components/ui/input'
import { MapPin, Search } from 'lucide-react'
import SelectButton from '../SelectButton'

const locationData = [
    {name:"On Site",value:"onsite"},
    {name:"Online",value:"online"}
]

const Herosection = () => {
    const [location,setLocation] = useState("onsite")
    const handleLocation = (value:string)=>{
      setLocation(value)
    }
    return (
        <div className='w-full h-[300px] md:h-[350px] relative'
            style={{
                backgroundImage: `url(${CoverImage.src})`,
                backgroundPosition: "center",
                backgroundSize: "cover",
            }}>
            <div className=' absolute inset-0 pointer-events-none bg-black opacity-30' />
            <div className='relative z-10 h-full flex flex-col justify-center items-center'>
                <div className='w-[75%] md:w-[60%] '>
                    <h1 className='text-[18px] md:text-[25px] font-bold text-white'>
                        Don't miss out <br />
                        Explore  the <span className='text-backgroundYellow'>vibrant events</span> happening locally and globally
                    </h1>
                    <div className='w-full h-[50px] md:h-[70px]  bg-white rounded-lg mt-7 flex gap-x-2 px-4'>
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

export default Herosection