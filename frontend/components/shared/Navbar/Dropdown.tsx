import { Button } from '@/components/ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { useLogoutMutation } from '@/redux/features/userApislice'
import { logout } from '@/redux/features/userSlice'
import { useAppDispatch, useAppSelector } from '@/redux/store'
import { CircleUser } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

const Dropdown = () => {
    const dispatch = useAppDispatch()
    const [Logout,{isLoading}] = useLogoutMutation()
    const {refreshToken} = useAppSelector((state)=>state.user)
    const router = useRouter()
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
        <DropdownMenu>
            <DropdownMenuTrigger>
              <CircleUser className='w-[35px] h-[35px] text-white'/>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Booked Events</DropdownMenuItem>
                <DropdownMenuItem>Organizer Dashboard</DropdownMenuItem>
                <DropdownMenuItem>Favorite</DropdownMenuItem>
                <DropdownMenuItem>Calender</DropdownMenuItem>
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