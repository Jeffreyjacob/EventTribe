import { formSchemaEventType } from '@/app/(root)/organizerDashboard/create/page'
import { FormControl, FormDescription, FormField, FormItem, FormLabel } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import React from 'react'
import { UseFormReturn } from 'react-hook-form'

interface Step2Props {
  form: UseFormReturn<formSchemaEventType>
}

const Step2: React.FC<Step2Props> = ({
  form
}) => {
  return (
    <div className='flex flex-col gap-y-3 w-full md:w-[60%]'>
      <h6 className='text-[20px] text-[#2D2C3C] capitalize font-medium'>
        Upload Image
      </h6>
      <FormField
        control={form.control}
        name="imageFile"
        render={({ field }) => (
          <FormItem>
            <FormLabel className='text-[13px] sm:text-[14px] capitalize text-[#2D2C3C]'>image*</FormLabel>
            <FormControl>
              <Input type='file'
              accept='image/*'
              onChange={(e)=>{
                const file = e.target.files?.[0] || null
                field.onChange(file)

              }} />
            </FormControl>
            <FormDescription>
                {field.value && <Image src={URL.createObjectURL(field.value)}
                  alt="event_image"
                  width={300} height={200}
                  className='rounded-lg pt-4'
                />}
            </FormDescription>
          </FormItem>
        )}
      />
      <p className='text-[12px] text-[#5A5A5A]'>
        Feature Image must be at least 1170 pixels wide by 504 pixels high.Valid file formats: JPG, GIF, PNG.
      </p>
    </div>
  )
}

export default Step2