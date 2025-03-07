import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useEventDetailsQuery } from '@/redux/features/eventApislice'
import { useFollowOrganizerMutation, useOrganizerDetailQuery } from '@/redux/features/userApislice'
import { useAppSelector } from '@/redux/store'
import { Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import React from 'react'
import { toast } from 'sonner'

interface HostCardProps {
    id: number
}

const HostCard: React.FC<HostCardProps> = ({
    id
}) => {
    const { data, isLoading, refetch } = useOrganizerDetailQuery({ id: id }, {
        skip: !id
    })
    const { isAuthenticated, userInfo } = useAppSelector((state) => state.user)
    const router = useRouter()
    const pathName = usePathname()
    const [Follow] = useFollowOrganizerMutation()

    const handleFollow = async () => {
        try {
            const response = await Follow({
                id: id
            }).unwrap()
            toast.success(response.message)
            refetch()
        } catch (error: any) {
            const errorMessage = error?.data?.message || 'Something went wrong. Please try again.';
        }
    }

    return (
        <>
            {
                isLoading ? (
                    <Skeleton className='w-[200px] h-[100px] rounded-lg' />
                ) : (
                    <div className='w-full flex gap-x-4 mt-6'>
                        <Avatar className='w-[70px] h-[70px]'>
                            <AvatarFallback className='text-[18px] font-bold'>
                                {data?.organizer.user.full_name[0][0]}
                            </AvatarFallback >
                        </Avatar >
                        <div className='flex flex-col gap-y-2 '>
                            <Link className='text-[14px] font-medium' href={`/organizer/${id}`}>
                                {data?.organizer.user.full_name}
                            </Link>
                            <div className='flex gap-x-2 '>
                                <Button variant={"outline"}
                                    className='text-[13px] '>
                                    contact
                                </Button>
                                {
                                    isAuthenticated ? (
                                        <Button className='bg-backgroudBluishGrey hover:bg-backgroudBluishGrey/80 text-[13px]' onClick={handleFollow}>
                                            <Plus className='w-3 h-3 text-white' />
                                            {
                                                data?.organizer.followers.includes(userInfo?.id || 0) ? "Following" : "Follow"
                                            }
                                        </Button>
                                    ) :
                                        <Button className='bg-backgroudBluishGrey hover:bg-backgroudBluishGrey/80 text-[13px]' onClick={() => router.push(`/login?redirct=${pathName}`)}>
                                            <Plus className='w-3 h-3 text-white' />
                                            Follow
                                        </Button>
                                }
                            </div>
                        </div>
                    </div >
                )
            }
        </>
    )
}

export default HostCard