"use client"
import Step1 from '@/components/shared/Event/Steps/Step1'
import Step2 from '@/components/shared/Event/Steps/Step2'
import Step3 from '@/components/shared/Event/Steps/Step3'
import Step4 from '@/components/shared/Event/Steps/Step4'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { z } from 'zod'
import { useForm, UseFormStateReturn } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form } from '@/components/ui/form'
import ProtectedRoutes from '../../ProtectedRoutes'
import { toast } from 'sonner'
import { useCreateEventsMutation } from '@/redux/features/eventApislice'
import { format } from 'date-fns'

const formSchema = z.object({
  title: z.string().min(2, { message: "Pleae enter a title" }),
  category: z.string().min(2, { message: "Please select a category" }),
  location: z.string().min(2, { message: "Please enter a location" }),
  description: z.string().min(2, { message: "Please enter a description" }),
  startDate: z.date(),
  endDate: z.date(),
  price: z.string(),
  eventType: z.string().min(2, { message: "Please select an event type" }),
  capacity: z.string(),
  imageFile: z.instanceof(File).nullable()
})

export type formSchemaEventType = z.infer<typeof formSchema>

const Page = () => {
  const [steps, setSteps] = useState(1)
  const total_step = 4
  const [CreateEvent,{isLoading}] = useCreateEventsMutation()
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      capacity: "",
      eventType: "",
      price: "",
      startDate:new Date(),
      endDate:new Date(),
      location: "",
      imageFile: null
    }
  })

  const formValues = form.watch()

  const isStep1Valid = formValues.title && formValues.category
    && formValues.description && formValues.startDate
    && formValues.endDate && formValues.location

  const isStep2Valid = formValues.imageFile
  const isStep3Valid = formValues.eventType && formValues.capacity

  async function onSubmit(values: z.infer<typeof formSchema>, event?: React.BaseSyntheticEvent) {
    event?.preventDefault();
    console.log("Submitting form...", values);
    try{
      const response = await CreateEvent({
        title: values.title,
        description:values.title,
        startDate:values.endDate.toISOString(),
        endDate:values.endDate.toISOString(),
        category:values.category,
        location:values.location,
        eventType:values.eventType,
        capacity:values.capacity,
        price:values.price,
        imageFile:values.imageFile
      }).unwrap()
      toast.success("event created!")
      router.push("/organizerDashboard")
    }catch(error:any){
      const errorMessage = error?.data?.message || 'Something went wrong. Please try again.'
      toast.error(errorMessage)
    }
  }

  return (
    <ProtectedRoutes>
      <div className='w-full max-w-6xl mx-auto max-xl:px-7'>
        <div className='w-full pt-8'>
          <h6 className='text-[25px] text-[#2D2C3C] font-bold'>
            Create Event
          </h6>

          <div className='w-full flex flex-col min-h-[100vh]'>

            {/**Progress bar */}
            <div className='py-5 min-h-[15vh]'>
              progress bar
            </div>

            <motion.div
              key={steps}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            >
              {/**step procedure */}
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}
                  className=''>
                  <div className='w-full pt-8 min-h-[70vh]'>
                    {steps === 1 && <Step1 form={form} />}
                    {steps === 2 && <Step2 form={form} />}
                    {steps === 3 && <Step3 form={form} />}
                    {steps === 4 && <Step4 form={form} />}
                  </div>

                  {/**Next and previous button */}
                  <div className='w-full flex justify-end min-h-[15vh] gap-x-4 mt-7'>
                    {
                      steps !== 1 && <Button
                        className='bg-backgroundNavyBlue hover:bg-backgroundNavyBlue/80'
                        type='button'
                        onClick={() => setSteps(steps - 1)}>
                        Previous
                      </Button>
                    }
                    {
                      steps === 4 ? (
                        <Button type="submit" disabled={isLoading}
                        className='bg-backgroundNavyBlue hover:bg-backgroundNavyBlue/80'>
                          {
                            isLoading ? "Creating...":"Continue"
                          }
                        </Button>
                      ) : (
                        <Button
                          type="button"
                          onClick={(event) => {
                            setSteps(steps + 1)
                          }}
                          className='bg-backgroundNavyBlue hover:bg-backgroundNavyBlue/80'
                          disabled={
                            (steps === 1 && !isStep1Valid) ||
                            (steps === 2 && !isStep2Valid) ||
                            (steps === 3 && !isStep3Valid)
                          }>
                          Next
                        </Button>
                      )
                    }
                  </div>
                </form>
              </Form>
            </motion.div>
          </div>

        </div>
      </div>
    </ProtectedRoutes>
  )
}

export default Page