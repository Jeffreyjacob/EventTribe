import React, { useState } from 'react'
import StripeProvider from './StripeProvider'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import { useAddCardMutation } from '@/redux/features/userApislice';
import { toast } from 'sonner';

interface AddCardProps {
    refetch: ()=>void
}

const AddCard:React.FC<AddCardProps> = ({
    refetch
}) => {
    const [open,setOpen] = useState(false)
    const stripe = useStripe()
    const elements = useElements()
    const [AddCard,{isLoading}] = useAddCardMutation()

    const onHandleAddCard = async ()=>{ 
        if (!stripe || !elements) return toast("Stripe is not loaded yet.");
        try{
            const {token,error} = await stripe.createToken(elements.getElement(CardElement)!)
           const response = await AddCard({
            token:token?.id || ""
           }).unwrap()
           toast.success("Card added")
           refetch()
           setOpen(false)
        }catch(error:any){
           console.log(error)
           const errorMessage = error?.data?.error ||  "Something went wrong!!"
           toast.error(errorMessage)
        }
    }
    return (
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                   <Button className=' bg-backgroundYellow hover:bg-backgroundYellow/80'>
                     Add Card
                   </Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Enter Card informations</DialogTitle>
                    </DialogHeader>
                    <div className='w-full flex flex-col gap-y-5'>
                    <CardElement className="border p-2 rounded" />
                    <Button onClick={onHandleAddCard}
                     disabled={isLoading}
                     className='w-full bg-backgroundYellow hover:bg-backgroundYellow/80'>
                       {
                        isLoading ? "Adding...":"Add Card"
                       }
                    </Button>
                    </div>
                </DialogContent>
            </Dialog>
    )
}

export default AddCard