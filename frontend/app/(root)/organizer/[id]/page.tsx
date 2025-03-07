"use client"
import { useParams } from 'next/navigation'
import React from 'react'
import ProtectedRoutes from '../../ProtectedRoutes'
import CoverImage from "@/assets/danny-howe-bn-D2bCvpik-unsplash.jpg"
import { Card } from '@/components/ui/card'
import { useFollowOrganizerMutation, useOrganizerDetailQuery } from '@/redux/features/userApislice'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import PlaceholderImage from "@/assets/Profile_avatar_placeholder_large.png"
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import { useAppSelector } from '@/redux/store'
import { toast } from 'sonner'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import Event from '@/components/shared/Event/Event'
import { useAddFavoriteEventMutation } from '@/redux/features/eventApislice'


const page = () => {
  const { id } = useParams()
  const { data, isLoading, refetch } = useOrganizerDetailQuery({
    id: parseInt(id as string)
  })
  const { userInfo } = useAppSelector((state) => state.user)
  const [AddFollow] = useFollowOrganizerMutation()
  const [AddFavorite] = useAddFavoriteEventMutation()

  const handleFollow = async () => {
    try {
      const response = await AddFollow({
        id: data?.organizer.user.id
      }).unwrap()
      toast.success(response.message)
      refetch()
    } catch (error: any) {
      const errorMessage = error?.data?.message || 'Something went wrong. Please try again.';
    }
  }

  const handleFavorite = async (id:string)=>{
    try{
      const response = await AddFavorite({
        id:id
      }).unwrap()
      toast.success(response.message)
      refetch()
    }catch(error:any){
      const errorMessage = error?.data?.message || 'Something went wrong. Please try again.';
    }
  }

  return (
    <ProtectedRoutes>
      <div className='w-full mb-10'>

        {/** Large screen */}
        <div className='hidden md:block '>
          <div className='w-full h-[400px] relative flex flex-col justify-center items-center'
            style={{
              backgroundImage: `url(${CoverImage.src})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}>
            <div className=' absolute inset-0 bg-white/10 backdrop-blur-sm pointer-events-none' />
            <Card className='w-[70%] h-[400px] z-10 -mb-32'>
              {
                isLoading ? (
                  <div className='w-full h-full flex flex-col justify-center items-center gap-y-4'>
                    <Skeleton className='w-[120px] h-[120px] rounded-full' />
                    <Skeleton className='w-[200px] h-[30px]' />
                    <div className='flex gap-x-4 pt-3'>
                      <Skeleton className='w-[120px] h-[60px]' />
                      <Skeleton className='w-[120px] h-[60px]' />
                    </div>
                    <Skeleton className='w-[250px] h-[30px]' />
                  </div>
                ) : <div className='w-full h-full flex flex-col justify-center items-center'>
                  <Avatar className='w-[120px] h-[120px] cursor-pointer'>
                    <AvatarImage src={PlaceholderImage.src} alt="@shadcn" />
                    <AvatarFallback className='text-[24px] font-bold uppercase text-[#2B293D]'>
                      {data?.organizer.user.full_name[0]}
                    </AvatarFallback>
                  </Avatar>
                  <h6 className='text-[25px] pt-5 font-bold text-[#2D2C3C]'>
                    {data?.organizer.user.full_name}
                  </h6>
                  <div className='flex gap-x-4 pt-3'>
                    <Button className='w-[110px] h-[50px] bg-backgroundNavyBlue hover:bg-backgroundNavyBlue/90' onClick={handleFollow}>
                      {
                        data?.organizer.followers.includes(userInfo?.id || 0) ? "Following" : "Follow"
                      }
                    </Button>
                    <Button variant={"outline"} className='w-[110px] h-[50px]'>
                      Contact
                    </Button>
                  </div>
                  <div className='flex gap-x-4 pt-4'>
                    <div className='flex flex-col gap-y-1'>
                      <span className='text-[#2B293D] text-[18px] font-bold text-center'>
                        {data?.organizer.followers.length}
                      </span>
                      <span className='text-[16px] text-[#5A5A5A] text-center'>
                        Followers
                      </span>
                    </div>
                    <Separator orientation="vertical" />
                    <div className='flex flex-col gap-y-1'>
                      <span className='text-[#2B293D] text-[18px] font-bold text-center'>
                        {data?.events.length}
                      </span>
                      <span className='text-[16px] text-[#5A5A5A] text-center'>
                        Total events
                      </span>
                    </div>
                  </div>
                </div>
              }
            </Card>
          </div>
        </div>


        {/**small and medium screen  */}
        <div className='w-full flex flex-col md:hidden justify-center items-center'>
          <div className='w-full h-[150px] relative flex flex-col justify-center items-center'
            style={{
              backgroundImage: `url(${CoverImage.src})`,
              backgroundPosition: "center",
              backgroundSize: "cover",
            }}>
            <div className=' absolute inset-0  bg-white/10 backdrop-blur-sm pointer-events-none' />
            <Avatar className='w-[120px] h-[120px] cursor-pointer -mb-36'>
              <AvatarImage src={PlaceholderImage.src} alt="@shadcn" />
              <AvatarFallback className='text-[24px] font-bold uppercase text-[#2B293D]'>
                {data?.organizer.user.full_name[0]}
              </AvatarFallback>
            </Avatar>
          </div>

          {
            isLoading ? (
              <>
                <Skeleton className='w-[200px] h-[30px] mt-16' />
                <Skeleton className='w-[250px] h-[30px] mt-5' />
                <Skeleton className='w-[70%] h-[40px] mt-5' />
              </>
            ) : (
              <>
                <h6 className='text-[25px] pt-16 font-bold text-[#2D2C3C] text-center '>
                  {data?.organizer.user.full_name}
                </h6>

                <div className='flex gap-x-4 pt-4'>
                  <div className='flex flex-col gap-y-1'>
                    <span className='text-[#2B293D] text-[18px] font-bold text-center'>
                      {data?.organizer.followers.length}
                    </span>
                    <span className='text-[16px] text-[#5A5A5A] text-center'>
                      Followers
                    </span>
                  </div>
                  <Separator orientation="vertical" />
                  <div className='flex flex-col gap-y-1'>
                    <span className='text-[#2B293D] text-[18px] font-bold text-center'>
                      {data?.events.length}
                    </span>
                    <span className='text-[16px] text-[#5A5A5A] text-center'>
                      Total events
                    </span>
                  </div>
                </div>

                <Button className='w-[70%] h-[40px] mt-5 bg-backgroundNavyBlue hover:bg-backgroundNavyBlue/80' onClick={handleFollow}>
                  {
                    data?.organizer.followers.includes(userInfo?.id || 0) ? "Following" : "Follow"
                  }
                </Button>
              </>
            )
          }

        </div>

        {/**organizer events */}
        <div className='w-full max-w-6xl mx-auto max-xl:px-7 pt-10 md:pt-32'>
          <Tabs defaultValue="events">
            <TabsList>
              <TabsTrigger value="events">Events</TabsTrigger>
            </TabsList>
            <TabsContent value="events">
              <div className='w-full grid md:grid-cols-2 lg:grid-cols-3 gap-y-8 mt-8 duration-300 transition-all justify-center items-start '>
                  {
                    isLoading ? (
                      <>
                        {
                           [1, 2, 3].map((index) => (
                            <Skeleton key={index}
                              className="w-[330px] h-[290px] rounded-xl" />
                          ))
                        }
                      </>
                    ):(
                      <>
                        {
                          data?.events.length === 0 ? (
                           <div className='w-full flex justify-center items-center'>
                             <p className='text-[14px] text-[#5A5A5A]'>
                               Organizer have no event
                             </p>
                           </div>
                          ):(
                            <>
                             {data?.events.map((event,index)=>(
                               <Event data={event} key={index} onClick={handleFavorite}/>
                             ))}
                            </>
                          )
                        }
                      </>
                    )
                  }
              </div>
            </TabsContent>
          </Tabs>
        </div>


      </div >
    </ProtectedRoutes >
  )
}

export default page