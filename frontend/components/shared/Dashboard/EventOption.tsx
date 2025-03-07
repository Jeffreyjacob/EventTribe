import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Ellipsis, Eye, Pen } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React from 'react'
import DeleteEventPopover from './DeleteEventPopover'

interface EventOptionProps {
    id: string
}

const EventOption: React.FC<EventOptionProps> = ({
    id
}) => {
    const router = useRouter()
    return (
        <DropdownMenu>
            <DropdownMenuTrigger>
                <Ellipsis className='text-[#475467] w-4 h-4' />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem className='flex gap-2 text-[13px]' onClick={() => router.push(`/eventDetail/${id}`)}>
                    <Eye className='text-[#475467] w-4 h-4' />
                    View
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='flex gap-2 text-[13px]' onClick={() => router.push(`/organizerDashboard/edit?id=${id}`)}>
                    <Pen className='text-[#475467] w-4 h-4' />
                    Edit
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className='flex gap-2 text-[13px]' asChild>
                    <DeleteEventPopover id={id} />
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default EventOption