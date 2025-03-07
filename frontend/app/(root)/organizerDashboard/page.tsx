import BookedEventTab from '@/components/shared/Dashboard/tabs/BookedEventTab'
import EventTab from '@/components/shared/Dashboard/tabs/EventTab'
import VerifyTicketTab from '@/components/shared/Dashboard/tabs/VerifyTicketTab'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

const Page = () => {
    return (
        <div className='w-full max-w-6xl mx-auto max-xl:px-7'>
            <Tabs defaultValue="events" className="pt-10">
                <TabsList>
                    <TabsTrigger value="events">My Event</TabsTrigger>
                    <TabsTrigger value="booked events">Booked Event</TabsTrigger>
                    <TabsTrigger value='verify'>Verify Ticket</TabsTrigger>
                </TabsList>
                <TabsContent value="events">
                    <EventTab/>
                </TabsContent>
                <TabsContent value="booked events">
                    <BookedEventTab/>
                </TabsContent>
                <TabsContent value="verify">
                    <VerifyTicketTab/>
                </TabsContent>
            </Tabs>

        </div>
    )
}

export default Page