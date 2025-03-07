import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { AlignRight, CircleUser } from 'lucide-react'
import React, { useState } from 'react'
import Logo from '../Logo'
import { Separator } from '@/components/ui/separator'
import Link from 'next/link'
import { NavLink } from '@/lib/type'
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useLogoutMutation } from '@/redux/features/userApislice'
import { logout } from '@/redux/features/userSlice'
import { toast } from 'sonner'

const ToggleMenu = () => {
    const {isAuthenticated,userInfo,refreshToken} = useAppSelector((state)=>state.user)
    const [open,setOpen] = useState(false)
    const dispatch = useAppDispatch()
    const [Logout,{isLoading}] = useLogoutMutation()
    const router = useRouter()
    const onHandleClose = ()=>{
          setOpen(false)
    }
    const onHandleLogout = async ()=>{
        try{
            const response = await Logout({
                refresh:refreshToken as string
            }).unwrap()
            router.push("/")
            dispatch(logout())
        }catch(error:any){
            console.log(error)
            const errorMessage = error?.data?.message || "Something went wrong,try again!"
            toast.error(errorMessage)
        }
    }

    return (
        <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger>
            <AlignRight className='text-white w-[35px] h-[35px]' />
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle className='flex gap-2 items-center'>
                        {
                            isAuthenticated ? (
                                <>
                                   <CircleUser className='w-[35px] h-[35px] text-backgroundNavyBlue'/>
                                   <p className='text-[19px] font-bold capitalize'>
                                     {userInfo?.full_name}
                                   </p>
                                </>
                            ):(
                               <Logo className='text-backgroundYellow text-[14px]'/>
                            )
                        }
                    </SheetTitle>
                    <Separator className='mt-4 mb-2'/>
                    <SheetDescription className='flex flex-col gap-3 mx-8'>
                        {
                          isAuthenticated && (
                            <>
                                <Link href={"/account"} className='hover:text-backgroundNavyBlue capitalize' onClick={onHandleClose}>
                                  Account
                                </Link>
                                {
                                    userInfo?.role == "Organizer" && <Link href={"/organizerDashboard"}
                                    className='hover:text-backgroundNavyBlue capitalize' onClick={onHandleClose}>
                                      Organizer Dashboard
                                    </Link>
                                }
                               <Link href={"/bookedEvent"} className='hover:text-backgroundNavyBlue capitalize' onClick={onHandleClose}>
                                  Booked Events
                                </Link>
                                <Link href={"/favorite"} className='hover:text-backgroundNavyBlue capitalize' onClick={onHandleClose}>
                                  Favorite
                                </Link>
                                <Link href={"/calender"} className='hover:text-backgroundNavyBlue capitalize' onClick={onHandleClose}>
                                  Calender
                                </Link>
                            </>
                          ) 
                        }
                        {
                         NavLink.map((link,index)=>(
                            <Link href={link.href} key={index} onClick={onHandleClose} className='hover:text-backgroundNavyBlue capitalize'>
                                {link.name}
                            </Link>
                         ))
                        }
                        {
                            isAuthenticated ? (
                                <Button onClick={onHandleLogout} className='bg-backgroundYellow text-white hover:bg-backgroundYellow/50'>
                                    Logout
                                </Button>
                            ):(
                                <Button className='' onClick={()=>router.push("/login")}>
                                    Login
                                </Button>
                            )
                        }
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>

    )
}

export default ToggleMenu