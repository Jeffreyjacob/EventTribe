import { formSchemaEventType } from '@/app/(root)/organizerDashboard/create/page'
import { Card } from '@/components/ui/card'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { cn } from '@/lib/utils'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import { Icon } from '@iconify/react'
import Image from 'next/image'
import IconImage from "@/assets/free 1.png"
import { Input } from '@/components/ui/input'

interface Step3Props {
  form: UseFormReturn<formSchemaEventType>
}

const Step3: React.FC<Step3Props> = ({
  form
}) => {
  const eventTypeData = [
    { name: "Paid", value: "Paid" },
    { name: "Free", value: "Free" }
  ]
  return (
    <div className='flex flex-col gap-y-6'>

      {/**event type */}
      <div className='flex flex-col gap-y-3 w-full '>
        <h6 className='text-[20px] text-[#2D2C3C] capitalize font-medium'>
          What type of event are you running?
        </h6>
        <FormField
          control={form.control}
          name="eventType"
          render={({ field }) => (
            <FormItem>
              <FormControl className='w-full pt-5'>
                <div className='w-full md:w-[70%] flex gap-x-5'>
                  {
                    eventTypeData.map((event, index) => (
                      <Card key={event.value}
                        className={cn('w-[50%] h-[150px]', {
                          " border-[2px] border-backgroundNavyBlue": field.value === event.value
                        })}
                        onClick={() => field.onChange(event.value)}>
                        {
                          event.value === "Paid" && <div className='w-full h-full flex flex-col justify-center items-center gap-y-1'>
                            <Icon icon="ion:ticket-outline" height={60} width={60} 
                              color={cn('#5A5A5A',{
                                "#2B293D": field.value === event.name
                              })}/>
                            <h6 className={cn('text-[13px] md:text-[16px] text-[#5A5A5A] font-semibold', {
                              "text-[#2B293D]": field.value === event.name
                            })}>
                              Ticketed Event
                            </h6>
                            <p className={cn('text-[12px] md:text-[14px] w-[70%] md:w-fit  text-[#5A5A5A]', {
                              "text-[#2B293D]": field.value === event.name
                            })}>
                                 My event requires ticket for entry
                            </p>
                          </div>
                        }
                        {
                          event.value === "Free" && <div className='w-full h-full flex flex-col justify-center items-center gap-y-1'>
                            <Image src={IconImage} alt='icon' width={60} height={60} />
                            <h6 className={cn('text-[13px] md:text-[16px] text-[#5A5A5A] font-semibold', {
                              "text-[#2B293D]": field.value === event.name
                            })}>
                              Free Event
                            </h6>
                            <p className={cn('text-[12px] md:text-[14px] w-[70%]  lg:w-fit text-[#5A5A5A] text-center',  {
                              "text-[#2B293D]": field.value === event.name
                            })}>
                                 I'm running a free event
                            </p>
                          </div>
                        }
                      </Card>
                    ))
                  }
                </div>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/**event price */}
      <div className='flex flex-col gap-y-3 w-full '>
        <h6 className='text-[20px] text-[#2D2C3C] capitalize font-medium'>
          What ticket are you selling ?
        </h6>
        <FormField
        control={form.control}
        name="price"
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-[13px] sm:text-[14px] capitalize text-[#2D2C3C]'>Ticket Price</FormLabel>
            <FormControl>
              <Input {...field} placeholder='enter price' 
              className='w-[250px]' disabled={form.getValues('eventType') === "Free"}
              value={form.getValues('eventType') === "Free" ? 0:field.value}/>
            </FormControl>
          </FormItem>
        )}
      />
      </div>

       {/**event capacity */}
       <div className='flex flex-col gap-y-3 w-full '>
        <h6 className='text-[20px] text-[#2D2C3C] capitalize font-medium'>
          Capacity
        </h6>
        <FormField
        control={form.control}
        name="capacity"
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-[13px] sm:text-[14px] capitalize text-[#2D2C3C]'>Number of people you want attending your event</FormLabel>
            <FormControl>
              <Input  value={field.value} onChange={field.onChange}
               placeholder='enter capacity' 
              className='w-[250px]'/>
            </FormControl>
          </FormItem>
        )}
      />
      </div>

    </div>
  )
}

export default Step3