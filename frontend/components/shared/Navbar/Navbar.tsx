"use client"
import React, { useEffect, useState } from 'react'
import Logo from '../Logo'
import { NavLink } from '@/lib/type'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { useAppSelector } from '@/redux/store'
import Dropdown from './Dropdown'
import { Button } from '@/components/ui/button'
import ToggleMenu from './ToggleMenu'

const Navbar = () => {
    const pathName = usePathname()
    const {isAuthenticated} = useAppSelector((state)=>state.user)
    const router = useRouter()
    const [isScolled,setIsScolled] = useState(false)

    useEffect(()=>{
        const handleScroll = ()=>{
            setIsScolled(window.scrollY > 10)
        }
        window.addEventListener('scroll',handleScroll)

        return ()=> window.removeEventListener("scroll",handleScroll)
    },[isScolled])
    return (
        <div className={cn('w-full h-full bg-[#2B293D] transition-all duration-300 shadow-md sticky top-0 py-4 z-50',{
            'bg-[#2B293D]/95 backdrop-blur-lg':isScolled
        })}>
            <div className='w-full max-w-6xl mx-auto flex justify-between items-center max-xl:px-7'>
                <Logo className='text-[18px] font-normal text-backgroundYellow flex gap-x-1' />
                <div className='hidden lg:flex lg:gap-x-3 xl:gap-x-6 '>
                   {
                    NavLink.map((link,index)=>{
                        const active = pathName === link.href
                        return (
                        <Link href={link.href} key={index}
                        className={cn('text-white text-[15px] font-semibold',{
                            " border-b-[2px] text-white":active
                        })}>
                            {link.name}
                        </Link>
                        )
                    })
                   }
                </div>
                <div>
                    {/**Large screen */}
                   <div className='hidden lg:flex gap-x-3'>
                        {
                            isAuthenticated ? (
                                <div className='flex gap-x-3'>
                                    {/**user authenticated */}
                                    <Dropdown/>
                                </div>
                            ):(
                              <div className='flex gap-x-2'>
                                 {/**User logged out */}
                                  <Button className='bg-transparent hover:bg-transparent hover:border-backgroundYellow border-none hover:border-[1px] text-white hover:text-white rounded-xl' variant={'outline'} onClick={()=>router.push("/login")}>
                                     Login
                                  </Button>
                                  <Button className='bg-backgroundYellow hover:bg-backgroundYellow hover:opacity-85 rounded-xl' onClick={()=>router.push("/signup")}>
                                     Sign up
                                  </Button>
                              </div> 
                            )
                        }
                   </div>

                   {/**Small Screen */}
                   <div className='flex lg:hidden'>
                        <ToggleMenu/>
                   </div>
                </div>
            </div>
        </div>
    )
}

export default Navbar