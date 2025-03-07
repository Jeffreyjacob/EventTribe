"use client"
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { ArrowRight, Minus, Plus } from 'lucide-react'
import React, { useState } from 'react'
import {motion} from "framer-motion"
import { useAppSelector } from '@/redux/store'

const page = () => {
    const [quantity,setQuantity] = useState<number>(1)
    const {event} = useAppSelector((state)=>state.checkout)
    const handleCheckout = async ()=>{
       try{

       }catch(error:any){
         
       }
    }
    return (
        <div className='w-full h-screen flex flex-col justify-between'>
            <div>
                <div className='w-full shadow-lg'>
                    <h6 className='text-[18px] font-semibold text-[#2D2C3C] w-full max-w-6xl mx-auto max-lg:px-7 py-5 '>
                        Select Ticket
                    </h6>
                </div>

                {/**increase quantity */}
                <div className='w-full max-w-6xl mx-auto max-lg:px-7 mt-10'>
                  <div className='w-full flex text-[#2D2C3C] font-semibold text-[13px] mb-4'>
                       <span className='w-[80%]'>
                         Ticket Types
                       </span>
                       <span className='w-[20%] text-center'>
                        Quantity
                       </span>
                  </div>
                  <div className='p-5 border-l-8  shadow-lg  rounded-none border-[#287921] flex'>
                       <div className='w-[70%] md:w-[80%] text-[#2D2C3C] flex flex-col gap-y-2 '>
                           <h6 className='text-[15px] font-semibold'>
                             Standard Ticket
                           </h6>
                           <span className='text-[13px] font-light'>
                             ${event?.price}
                           </span>
                       </div>
                       <div className='w-[30%] md:w-[20%] flex justify-evenly items-center text-[#2D2C3C] '>
                            <motion.button
                             whileTap={{ scale: 0.8 }} // Shrinks when clicked
                             animate={{ scale: 1 }} // Returns to normal
                             className='p-1 rounded-full border cursor-pointer'
                             onClick={()=>setQuantity(quantity -1)}
                             disabled={quantity == 1}
                             transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            >
                              <Minus className='w-6 h-6'/>
                            </motion.button>
                            <span className='text-[16px] font-semibold'>
                                {quantity}
                            </span>
                            <motion.button
                             whileTap={{ scale: 0.8 }} // Shrinks when clicked
                             animate={{ scale: 1 }} // Returns to normal
                             className='p-1 rounded-full border cursor-pointer'
                             onClick={()=>setQuantity(quantity + 1)}
                             transition={{ type: "spring", stiffness: 300, damping: 15 }}
                            >
                              <Plus className='w-6 h-6'/>
                            </motion.button>
                       </div>
                  </div>

                </div>
            </div>

            {/**checkout and price */}
            <Card className='w-full p-5 shadow-lg rounded-none pb-16'>
                <div className='w-full max-w-2xl mx-auto max-lg:px-7'>
                    <div className='w-full  flex justify-center items-center text-[17px] gap-x-7 pb-5'>
                        <p className='flex text-center gap-x-1'>
                            <span className='font-semibold'>
                                Qty:
                            </span>
                            <span>
                                {quantity}
                            </span>
                        </p>
                        <p className='flex text-center gap-x-1'>
                            <span className='font-semibold'>
                              Total:
                            </span>
                            <span className='font-semibold text-[#287921]'>
                            ${((parseInt(event?.price || "")) * quantity).toFixed(2)}
                            </span>
                        </p>
                    </div>
                    <Button className='w-full h-11 bg-backgroundNavyBlue text-white text-[18px] font-semibold hover:bg-backgroundNavyBlue/80' onClick={handleCheckout}>
                        Proceed
                        <ArrowRight className='w-4 h-4'/>
                    </Button>
                </div>
            </Card>

        </div>
    )
}

export default page