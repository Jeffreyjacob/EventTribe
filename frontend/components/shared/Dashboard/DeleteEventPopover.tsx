import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog'
import { useDeleteEventMutation } from '@/redux/features/eventApislice'
import { Trash2 } from 'lucide-react'
import React, { useState } from 'react'
import { toast } from 'sonner'

interface DeleteEventPopOverProps {
    id: string
}

const DeleteEventPopover: React.FC<DeleteEventPopOverProps> = ({
    id
}) => {
    const [Open,setOpen] = useState(false)
    const [DeleteEvent,{isLoading}] = useDeleteEventMutation()
    const onHandleDeleteEvent = async ()=>{
        try{
          const response = await DeleteEvent({
            id:id
          }).unwrap()
          toast.success("Event Deleted!")
        }catch(error:any){
          const errorMessage = error?.data?.message || 'Something went wrong. Please try again.'
          toast.error(errorMessage)
        }
    }
    return (
        <AlertDialog open={Open} onOpenChange={setOpen}>
            <AlertDialogTrigger className='w-full flex gap-2  text-[13px] p-1 m-1 rounded-lg hover:bg-accent'>
                <Trash2 className='text-[#475467] w-4 h-4' />
                Delete
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Are you sure, you want to delete ?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete this event
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => setOpen(false)}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={onHandleDeleteEvent} disabled={isLoading}>
                        {
                            isLoading ? "Deleting...":"Continue"
                        }
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteEventPopover