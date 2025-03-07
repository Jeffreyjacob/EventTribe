import { formSchemaEventType } from '@/app/(root)/organizerDashboard/create/page'
import { FormControl, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'
import SelectButton from '../../SelectButton'
import { SearchCategoryData } from '@/lib/type'
import CalenderContainer from '../../calender/CalenderContainer'
import { Textarea } from '@/components/ui/textarea'
import LocationFilter from '../../Dashboard/LocationFilter'

interface stepProps {
  form: UseFormReturn<formSchemaEventType>
}

const Step1: React.FC<stepProps> = ({
  form
}) => {
  return (
    <div className='w-full flex flex-col gap-y-6'>

      {/**Event Details */}
      <div className='flex flex-col gap-y-3 w-full md:w-[60%]'>
        <h6 className='text-[20px] text-[#2D2C3C] capitalize font-medium'>
          Event Details
        </h6>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem className='flex flex-col sm:flex-row md:gap-x-3 justify-start sm:items-center'>
              <FormLabel className='text-[13px] sm:text-[14px] capitalize text-[#2D2C3C]'>title*</FormLabel>
              <FormControl>
                <Input placeholder="Enter your title" {...field} className='w-full placeholder:text-[#ACACAC] text-[12px]' />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem className='flex flex-col sm:flex-row md:gap-x-3 justify-start sm:items-center'>
              <FormLabel className='text-[13px] sm:text-[14px] capitalize text-[#2D2C3C]'>category*</FormLabel>
              <FormControl>
                <SelectButton placeholder='select category'
                  className='w-full'
                  data={SearchCategoryData}
                  value={field.value}
                  onChange={field.onChange} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/** date and time */}

      <div className='flex flex-col gap-y-3 w-full md:w-[60%]'>
        <h6 className='text-[20px] text-[#2D2C3C] capitalize font-medium'>
          Date & Time
        </h6>
        <FormField
          control={form.control}
          name="startDate"
          render={({ field }) => (
            <FormItem className='flex flex-col sm:flex-row md:gap-x-3 justify-start sm:items-center'>
              <FormLabel className='text-[13px] sm:text-[14px] capitalize text-[#2D2C3C]'>start Date*</FormLabel>
              <FormControl>
                <CalenderContainer
                  date={field.value || new Date()}
                  setDate={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="endDate"
          render={({ field }) => (
            <FormItem className='flex flex-col sm:flex-row md:gap-x-3 justify-start sm:items-center'>
              <FormLabel className='text-[13px] sm:text-[14px] capitalize text-[#2D2C3C]'>end Date*</FormLabel>
              <FormControl>
                <CalenderContainer
                  date={field.value || new Date()}
                  setDate={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/**location */}
      <div className='flex flex-col gap-y-3 w-full md:w-[60%]'>
        <h6 className='text-[20px] text-[#2D2C3C] capitalize font-medium'>
          Location
        </h6>
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => (
            <FormItem className='flex flex-col sm:flex-row  md:gap-x-3 justify-start sm:items-center '>
              <FormLabel className='text-[13px] sm:text-[14px] capitalize text-[#2D2C3C]'>
              Where will your event take place? *
              </FormLabel>
              <FormControl>
                <LocationFilter value={field.value} onChange={field.onChange}/>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

      {/**Description */}
      <div className='flex flex-col gap-y-3 w-full md:w-[60%]'>
        <h6 className='text-[20px] text-[#2D2C3C] capitalize font-medium'>
          Addition Informations 
        </h6>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem className='flex flex-col sm:flex-row md:gap-x-3 justify-start sm:items-center '>
              <FormLabel className='text-[13px] sm:text-[14px] capitalize text-[#2D2C3C]'>
              Event Description *
              </FormLabel>
              <FormControl>
                <Textarea placeholder='enter your description'
                value={field.value} onChange={field.onChange}/>
              </FormControl>
            </FormItem>
          )}
        />
      </div>

    </div>
  )
}

export default Step1