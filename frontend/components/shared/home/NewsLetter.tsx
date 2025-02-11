import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import React from 'react'

const NewsLetter = () => {
    return (
        <div className='w-full bg-backgroundYellow mt-16'>
            <div className='w-full max-w-6xl mx-auto max-xl:px-7 flex flex-col md:flex-row py-9 gap-y-5'>
                <div className='w-full md:w-[50%] text-[#2D2C3C]'>
                    <h6 className='text-[20px] font-medium'>
                        Subscribe to our Newsletter
                    </h6>
                    <p className='text-[14px]'>
                        Receive our weekly newsletter & updates with new events from your favourite organizers & venues.
                    </p>
                </div>
                <div className='w-full md:w-[50%]'>
                    <div className=' flex w-[300px] md:w-[400px]'>
                        <Input type='text' placeholder='Enter your email address'
                            className=' placeholder:text-[#5A5A5A]/50  text-[13px] bg-white border-[#2B293D] border  h-[50px] rounded-tr-none rounded-br-none' />
                        <Button className='bg-[#2B293D] hover:bg-[#2B293D]/80 text-backgroundYellow h-[50px] rounded-tl-none rounded-bl-none'>
                            Subscribe
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default NewsLetter