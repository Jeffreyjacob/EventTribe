import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useLogoutMutation } from '@/redux/features/userApislice'
import { logout } from '@/redux/features/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { CircleUser } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { toast } from 'sonner'

const Dropdown = () => {
    const dispatch = useAppDispatch()
    const [Logout, { isLoading }] = useLogoutMutation()
    const { refreshToken,userInfo} = useAppSelector((state) => state.user)
    const [open, setOpen] = useState(false)
    const router = useRouter()
    const onHandleLogout = async () => {
        try {
            const response = await Logout({
                refresh: refreshToken as string
            }).unwrap()
            router.push("/")
            dispatch(logout())
        } catch (error: any) {
            console.log(error)
            const errorMessage = error?.data?.message || "Something went wrong,try again!"
            toast.error(errorMessage)
        }
    }
    const handleClose = () => {
        setOpen(false)
    }

    return (
        <DropdownMenu open={open} onOpenChange={setOpen}>
            <DropdownMenuTrigger>
                <CircleUser className='w-[35px] h-[35px] text-white' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={()=>router.push("/account")}>
                    Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={()=>router.push("/bookedEvent")}>
                    Booked Events
                </DropdownMenuItem>
                 {
                    userInfo?.role == "Organizer" && <DropdownMenuItem onClick={()=>router.push("/organizerDashboard")}>
                    Organizer Dashboard
                </DropdownMenuItem>
                 }
                <DropdownMenuItem onClick={()=>router.push("/favorite")}>
                    Favorite
                </DropdownMenuItem>
                <DropdownMenuItem>
                    Calender
                </DropdownMenuItem>
                <DropdownMenuItem asChild className='focus:text-white focus:bg-backgroundYellow/85 focus-visible:outline-none'>
                    <Button className='bg-backgroundYellow hover:bg-backgroundYellow/85 text-white mt-3 w-full' onClick={onHandleLogout}>
                        Logout
                    </Button>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>

    )
}

export default Dropdown