import { ExploreCategoriesData } from '@/lib/type'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React from 'react'

const ExploreCategories = () => {
    const router = useRouter()
    return (
        <div className='w-full max-w-6xl mx-auto flex max-xl:px-7 my-10'>
            <div className='w-full'>
                <h1 className='text-[18px] md:text-[25px] text-[#2D2C3C] font-bold'>Explore Categories</h1>
                <div className='w-full grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-x-3 mt-10 max-xl:gap-y-5'>
                    {
                        ExploreCategoriesData.map((categories,index) => (
                            <div className='flex flex-col gap-y-3 justify-center items-center hover:scale-105 transition-all duration-300 cursor-pointer'
                             key={index} 
                            onClick={()=>router.push(`/eventListing?category=${categories.value}`)}>
                              <Image src={categories.image} alt='category image'
                               className='w-[80px] h-[80px]'/>
                              <span className='text-[13px] md:text-[14px] font-semibold text-center'>
                                {categories.name}
                              </span>
                            </div>
                        ))
                    }
                </div>
            </div>
        </div>
    )
}

export default ExploreCategories