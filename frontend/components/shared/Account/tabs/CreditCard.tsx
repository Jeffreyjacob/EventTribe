import { Separator } from '@/components/ui/separator'
import React from 'react'
import AddCard from '../AddCard'
import StripeProvider from '../StripeProvider'
import { useDeleteCardMutation, useGetCardListQuery, useSetDefaultCardMutation } from '@/redux/features/userApislice'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { DeleteIcon, Trash2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'
import { Checkbox } from '@/components/ui/checkbox'

const CreditCard = () => {
    const { data, isLoading,refetch} = useGetCardListQuery()
    const [deleteCard] = useDeleteCardMutation()
    const [setDefault] = useSetDefaultCardMutation()

    const onHandleSetDefault = async (id:number)=>{
        try{
          const response = await setDefault({
            id:id 
          }).unwrap()
          refetch()
        }catch(error:any){
            console.log(error)
           const errorMessage = error?.data?.error ||  "Something went wrong!!"
           toast.error(errorMessage) 
        }
    }

    const onHandleDeleteCard = async (id:number)=>{
        try{
           const response = await deleteCard({
            id:id
           }).unwrap()
           toast.success("Card Removed!")
           refetch()
        }catch(error:any){
            console.log(error)
            const errorMessage = error?.data?.error ||  "Something went wrong!!"
            toast.error(errorMessage)
        }
    }
    console.log(data)

    return (
        <div className='mb-10'>
            <h6 className='text-[17px ] md:text-[20px] font-bold text-[#2D2C3C] pt-10 pb-3'>
                Card Informations
            </h6>
            <Separator />
            <div className='pt-5'>
                <StripeProvider>
                    <AddCard refetch={refetch} />
                </StripeProvider>
                <div className='pt-5 flex flex-col gap-y-4'>
                    {data?.map((card, index) => (
                        <Card key={index}
                            className={cn('w-full md:w-[70%] lg:w-[70%] flex flex-col py-3 hover:scale-105 duration-300 transition-all',{
                                "border-[2px] border-backgroundNavyBlue scale-105": card.is_default
                            })}>
                            <div className='w-full flex gap-x-3 px-4 text-[11px] sm:text-[13px] font-light text-[#5A5A5A]'>
                                <span className='w-[30%]'>
                                    Card Number
                                </span>
                                <span className='w-[20%] text-center'>
                                    Exp-month
                                </span>
                                <span className='w-[20%] text-center'>
                                    Exp-year
                                </span>
                                <span className='w-[15%] text-center'>
                                    default
                                </span>
                                <span className='w-[15%]'/>
                            </div>
                            <Separator />
                            <div className='w-full flex gap-x-3 px-4 py-3 text-[12px] sm:text-[14px] '>
                                <span className='flex gap-x-3 w-[30%]'>
                                    <span>
                                        {card.brand}
                                    </span>
                                    <span className='font-semibold'>
                                        *****{card.last4}
                                    </span>
                                </span>
                                <span className='w-[20%] font-semibold text-center'>
                                    {card.exp_month}
                                </span>
                                <span className='w-[20%] font-semibold text-center'>
                                    {card.exp_year}
                                </span>
                                <span className='w-[15%] flex justify-center items-center text-center'>
                                  <Checkbox
                                     checked={card.is_default}
                                     onCheckedChange={()=>onHandleSetDefault(card.id)}
                                    />
                                </span>
                                <span className='w-[15%] flex justify-end'>
                                    <Trash2 className='w-4 h-4 sm:w-5 sm:h-5 cursor-pointer hover:scale-110 text-red-600 ' onClick={()=>onHandleDeleteCard(card.id)} />
                                </span>
                            </div>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CreditCard