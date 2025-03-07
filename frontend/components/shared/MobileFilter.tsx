import React from 'react'
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '../ui/drawer'
import { Button } from '../ui/button'
import { ArrowDown, ArrowUp, SlidersHorizontal } from 'lucide-react'
import { SearchCategoryData, SearchDateData, SearchEventTypeData } from '@/lib/type'
import { Checkbox } from '../ui/checkbox'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'

interface MobileFilterProps {
    searchParams: {
        page: number
        eventType: string,
        location: string,
        category: string,
        date: string,
        page_size: number
    },
    categoryCount: number,
    handleShowmore: () => void
    handleCategory: (value: string) => void,
    handleEventType: (value: string) => void,
    handleDate: (value: string) => void
}

const MobileFilter: React.FC<MobileFilterProps> = ({
    searchParams,
    categoryCount,
    handleShowmore,
    handleCategory,
    handleEventType,
    handleDate
}) => {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                <SlidersHorizontal className='w-5 h-5 text-[#252C32] cursor-pointer' />
            </DrawerTrigger>
            <DrawerContent className='px-10'>
                <DrawerHeader>
                    <DrawerTitle>Filters</DrawerTitle>
                </DrawerHeader>
               
                <ScrollArea className='h-[400px] w-full px-10 py-10'>
                    <div className='flex flex-col gap-y-4'>
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
                                                checked={searchParams.eventType === eventType.value}
                                                onCheckedChange={() => handleEventType(eventType.value)}
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
                                                checked={searchParams.date === date.value}
                                                onCheckedChange={() => handleDate(date.value)}
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
                                                checked={searchParams.category === category.value}
                                                onCheckedChange={() => handleCategory(category.value)}
                                            />
                                            <label className='text-[13px] text-[2B293D] capitalize'>
                                                {category.name}
                                            </label>
                                        </div>
                                    ))
                                }
                                <button onClick={handleShowmore}
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
                <DrawerFooter>
                    <DrawerClose>
                        <Button variant="outline" className='w-full'>Cancel</Button>
                    </DrawerClose>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>

    )
}

export default MobileFilter