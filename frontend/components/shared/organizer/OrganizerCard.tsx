import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { OrganizerType } from '@/lib/type'
import { useAppSelector } from '@/redux/store'
import { useRouter } from 'next/navigation'
import React from 'react'
import placeholderImage from "@/assets/Profile_avatar_placeholder_large.png"

interface OrganizerCardProps {
  data: OrganizerType,
  followbtn: (id:number) => void
}

const OrganizerCard: React.FC<OrganizerCardProps> = ({
  data,
  followbtn
}) => {
  const { isAuthenticated,userInfo} = useAppSelector((state) => state.user)
  const router = useRouter()
  return (
    <Card className='w-[200px] h-[250px] flex flex-col justify-center items-center gap-y-2'>
      <Avatar className='w-[90px] h-[90px] cursor-pointer' onClick={()=>router.push(`/organizer/${data.user.id}`)}>
        <AvatarImage src={placeholderImage.src} alt="@shadcn" />
        <AvatarFallback className='text-[24px] font-bold uppercase text-[#2B293D]'>
          {data.user.full_name[0][0]}
        </AvatarFallback>
      </Avatar>
      <h5 className='text-[15px] font-bold text-[#2B293D] cursor-pointer' onClick={()=>router.push(`/organizer/${data.user.id}`)}>
        {data.user.full_name}
      </h5>
      <span className='text-[13px] text-[#5A5A5A]'>
        {data.followers.length} Followers
      </span>
      {
        isAuthenticated ? (
          <Button className='bg-backgroundYellow text-white hover:bg-backgroundYellow/50'
           onClick={()=>followbtn(data.user.id)}>
              {
                data.followers.includes(userInfo?.id || 0) ? "following" : "follow"
              }
          </Button>
        ): (
           <Button className='bg-backgroundYellow text-white hover:bg-backgroundYellow/50' 
            onClick={()=>router.push("/login")}>
              Follow
           </Button>
        )
      }
    </Card>
  )
}

export default OrganizerCard