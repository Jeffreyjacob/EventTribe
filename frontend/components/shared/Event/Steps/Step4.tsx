import { formSchemaEventType } from '@/app/(root)/organizerDashboard/create/page'
import { Card } from '@/components/ui/card'
import { CalendarDays, Clock2, MapPin } from 'lucide-react'
import Image from 'next/image'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import Mapcontainer from '../../map/Mapcontainer'
import { format, getMonth } from 'date-fns'
import { useAppSelector } from '@/redux/store'
import HostCard from '../../organizer/HostCard'

interface Step4props {
  form: UseFormReturn<formSchemaEventType>
}

const Step4: React.FC<Step4props> = ({
  form
}) => {
  const isDifferentMonth = (startDate: string, endDate: string) => {
      const start_date = new Date(startDate)
      const end_date = new Date(endDate)
  
      return getMonth(start_date) != getMonth(end_date)
    }
    const {userInfo} = useAppSelector((state)=>state.user)
  return (
    <div className='w-full'>
      <p className='text-[#2D2C3C]'>
        Nearly there! Check everything’s correct.
      </p>
      <Card className='w-full h-full p-3 mt-7 flex flex-col gap-y-5'>
      <Image src={form.getValues('imageFile') ? URL.createObjectURL(form.getValues('imageFile') as Blob) : ""}
              alt='event image'
              objectFit="fill"
              width={800}
              height={400}
              className="rounded-md shadow-xl shadow-gray-400 w-full h-[250px] md:h-[400px]"
            />

            <div className='w-full'>
              <h6 className='text-[17px] md:text-[28px] font-bold w-[80%]'>
                {form.getValues('title')}
              </h6>
              
            </div>

            {/**Date and ticket */}
            <div className='w-full flex justify-around items-start gap-x-4'>
              <div className='w-[50%] md:w-[80%] flex flex-col gap-y-2 md:gap-y-3 '>
                <h6 className='text-[16px] md:text-[19px]  text-[#2D2C3C] font-bold'>
                  Date and Time
                </h6>
                <p className='text-[12px] md:text-[14px] text-[#2D2C3C] flex gap-x-1'>
                  <CalendarDays className='w-5 h-5' />
                  {
                    isDifferentMonth(form.getValues('startDate').toString() || "", form.getValues('endDate').toString() || "") ? (
                      <>
                        <span>
                          {form.getValues("startDate") ? format(new Date(form.getValues('startDate')), "d MMM yyyy") : ""}
                        </span>
                        -
                        <span>
                          {form.getValues('endDate') ? format(new Date(form.getValues('endDate')), "d MMM yyyy") : ""}
                        </span>
                      </>
                    ) : (
                      <span>
                        {form.getValues('startDate') ? format(new Date(form.getValues('startDate')), "d MMM yyyy") : ""}
                      </span>
                    )
                  }
                </p>
                <p className='flex gap-x-1  md:gap-x-2 text-[12px]  md:text-[14px]'>
                  <Clock2 className='w-4 h-4 md:w-5 md:h-5 ' />
                  <span>
                    {form.getValues('startDate') ? format(form.getValues('startDate'), "hh:mm a") : ""}
                  </span>
                  -
                  <span>
                    {form.getValues('endDate') ? format(form.getValues('startDate'), "hh:mm a") : ""}
                  </span>
                </p>
              </div>
              <div className='w-[50%] md:w-[20%] flex flex-col'>
                <h6 className='text-[14px] md:text-[16px] font-semibold  text-[#2B293D] pb-1'>
                  Ticket Information
                </h6>
                <p className='text-[12px] md:text-[13px] text-start font-semibold text-[#2B293D]'>
                  <span>
                    standard Ticket
                  </span> :
                  <span>
                    {form.getValues('eventType') == "Free" ? "Free" : `$ ${form.getValues('price')} each`}
                  </span>
                </p>
              </div>
            </div>

            {/**location */}
            <div className='w-full flex flex-col gap-y-2'>
              <h6 className='text-[16px] md:text-[19px]  text-[#2D2C3C] font-bold'>
                Location
              </h6>
              <div className='text-[14px] text-[#2D2C3C] w-full  md:w-[50%] gap-y-4'>
                <div className='w-full flex  gap-x-2  mb-5'>
                  <MapPin className='w-5 h-5' />
                  <span className='w-300px]'>
                    {form.getValues('location')}
                  </span>
                </div>
                {
                  form.getValues('location') !== "online" && <Mapcontainer address={form.getValues('location') || ""} />
                }
              </div>
            </div>

            {/*organizer details */}
            <div>
              <h6 className='text-[16px] md:text-[19px] text-[#2D2C3C] font-bold '>
                Host By
              </h6>
              <HostCard id={userInfo?.id|| 0} />
            </div>

            {/**Event description */}

            <div>
              <h6 className='text-[16px] md:text-[19px] text-[#2D2C3C] font-bold '>
                Event Description
              </h6>
              <p className='text-[#5A5A5A] text-[13px]  mt-5 leading-6'>
                {form.getValues('description')}
              </p>
            </div>
      </Card>
    </div>
  )
}

export default Step4