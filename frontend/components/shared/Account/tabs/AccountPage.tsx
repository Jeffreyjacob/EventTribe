"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { useGetUserQuery, useUpdateUserMutation } from "@/redux/features/userApislice"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { Camera, Plus } from "lucide-react"
import Link from "next/link"
import { ChangeEvent, useEffect, useRef, useState } from "react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"
import SelectButton from "../../SelectButton"
import CalenderContainer from "../../calender/CalenderContainer"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"


const formSchema = z.object({
  full_name: z.string().optional(),
  email: z.string().optional(),
  role: z.string().optional(),
  gender: z.string().optional(),
  dob: z.date().optional(),
  address: z.string().optional(),
  phone_number: z.string().optional()
})

const AccountPage = () => {
  const {data,isLoading,refetch} = useGetUserQuery()
  const [DefaultValue,setDefaultValue] = useState<z.infer<typeof formSchema>>({
     full_name: data?.user.full_name ? data.user.full_name : "",
     email: data?.user.email ? data.user.email : "",
     role: data?.user.role ? data.user.role : "",
     gender: data?.gender ? data.gender : "",
     dob: data?.dob ? new Date(data.dob) : new Date(),
     address: data?.address ? data.address : "",
     phone_number: data?.phone_number ? data.phone_number : ""
  })
  const imageRef = useRef<HTMLInputElement>(null)
  const [UpdateUser,{isLoading:Updating}] = useUpdateUserMutation() 

  useEffect(()=>{
     if(data?.image){
        const convertImage = async ()=>{
           await fetch(data.image || "").then(
              async(response)=>{
                 const blob = await response.blob()
                 const fileName = data.image.split('/').pop() || 'edit-user'
                 const file  = new File([blob],fileName,{type: blob.type})
                 setImageFile(file)
              }
           )
        }
        convertImage()
     }
  },[data?.image])

  useEffect(()=>{
     if(data){
       setDefaultValue({
         full_name: data.user.full_name,
         email: data.user.email,
         role: data.user.role,
         gender: data.gender,
         address:data.address,
         phone_number:data.phone_number,
         dob: new Date(data.dob)
       })
     }
  },[data])
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: DefaultValue
  })
  const [imageFile, setImageFile] = useState<File | null>(null)
  

  async function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values)
    try{
      const response = await UpdateUser({
        gender: values.gender || "",
        dob: format(values.dob || '', "yyyy-MM-dd"),
        address:values.address || "",
        updated_image:imageFile,
        phone_number: values.phone_number || "",
        interest:data?.interest || []
      }).unwrap()
      toast.success("Profile updated!")
      refetch()
    }catch(err:any){
      console.log(err)
      const errorMessage = err?.data?.detail || 'Something went wrong. Please try again.';
      toast.error(errorMessage)
    }
  }

  const GenderData = [
    { name: "Male", value: "Male" },
    { name: "Female", value: "Female" },
  ]

  const handleFileInput = (e: ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files
      if(!files || files.length == 0){
        toast.error("No file selected")
        return ;
      }
      const file = files[0]
      const validImageType = ["image/gif", "image/jpeg", "image/png", "image/jpg"]
      if(validImageType.includes(file.type)){
         setImageFile(file)
      }else{
         toast.error("You can only upload an image")
      }
  }

  const triggerInput = () => {
    if (imageRef.current) {
      imageRef.current.click()
    }
  }

  return (
      <div className=''>
        <h6 className='text-[17px ] md:text-[20px] font-bold text-[#2D2C3C] pt-10 pb-3'>
          Account Information
        </h6>
        <Separator />


        <div className='w-full pt-7'>

          {/**image icon */}
          <div className='relative w-fit'>
            <Avatar className='w-[200px] h-[200px]'>
              {
                imageFile && <AvatarImage src={URL.createObjectURL(imageFile)}/>
              }
              <AvatarFallback className=' capitalize text-[25px] font-bold' >
                {data?.user.full_name[0]}
              </AvatarFallback>
            </Avatar>
            <input type='file' ref={imageRef}
              onChange={handleFileInput} hidden />
            <div className=' rounded-full border-[2px]  w-fit p-2 border-black cursor-pointer absolute bottom-3 right-3 bg-white'
              onClick={triggerInput}>
              <Camera className='w-5 h-5' />
            </div>
          </div>

          <div className='w-full md:w-[50%]  py-10'>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">


                {/**profile informations */}
                <div className='flex flex-col gap-y-4'>
                  <h6 className='text-[#2D2C3C] text-[16px] font-semibold'>
                    Profile Informations
                  </h6>
                  <FormField
                    control={form.control}
                    name="full_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full name</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter full name" {...field} disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter  your Email" {...field} disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Role</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter Role" {...field} disabled />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
               
                <Link className='text-[16px] text-[#2D2C3C] font-semibold flex gap-x-1 items-center hover:border-b-[2px] w-fit border-[#2D2C3C] ' href={"/Select_Interest"}>
                 Update Interest
                 <Plus className='w-5 h-5'/>
                </Link>
               
                <div className='flex flex-col gap-y-4'>
                  <h6 className='text-[16px] text-[#2D2C3C] font-semibold'>Other user informations</h6>

                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <FormControl>
                          <SelectButton className=''
                            data={GenderData}
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder='select gender'
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dob"
                    render={({ field }) => (
                      <FormItem >
                        <FormLabel>Date of birth</FormLabel>
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
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Address</FormLabel>
                        <FormControl>
                          <Textarea value={field.value}
                            onChange={field.onChange} placeholder='Enter your Address' />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="phone_number"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone number</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your phone number.." {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <Button type="submit" className='bg-[#2B293D]' disabled={Updating}>
                  {
                    Updating ? "Updating":"Save My Profile"
                  }
                </Button>
              </form>
            </Form>
          </div>

        </div>
      </div>
  )
}

export default AccountPage