import { FooterLink } from '@/lib/type'
import Image from 'next/image'
import React from 'react'
import google from '@/assets/googlelogo.png'
import apple from '@/assets/applelogo.png'
import { Separator } from '@/components/ui/separator'

const Footer = () => {
  return (
    <div className=' bg-backgroundNavyBlue w-full h-full flex flex-col'>
      <div className='w-full max-w-6xl mx-auto max-xl:px-7 grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 my-5 xl:gap-x-3 max-xl:gap-y-4'>
        {
          FooterLink.map((link, index) => (
            <div className='flex flex-col gap-y-1' key={index}>
              <h3 className='text-[14px] text-white font-semibold mb-2'>{link.title}</h3>
              {
                link.sublink.map((sublink, index) => (
                  <div className='text-[12px] text-[#A9A9A9] ' key={index}>
                    {sublink.name}
                  </div>
                ))
              }
            </div>
          ))
        }
        <div>
          <h3 className='text-[14px] text-white font-semibold mb-2'>Download The App</h3>
          <Image src={google} className='w-[120px] mb-3' alt='google' />
          <Image src={apple} className='w-[120px]' alt='apple' />
        </div>
      </div>
      <div className='w-full flex flex-col mt-3 max-w-6xl mx-auto max-xl:px-7'>
          <Separator className='w-full bg-[#A9A9A9]' />
          <h6 className='text-[#A9A9A9] text-[13px] my-4 text-center'>
             2025 Eventify. All rights reserved.
          </h6>
        </div>
    </div>
  )
}

export default Footer