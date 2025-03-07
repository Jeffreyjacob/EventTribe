import { formSchemaEventType } from "@/app/(root)/organizerDashboard/create/page";
import { EventParamsType } from "@/components/shared/Dashboard/tabs/EventTab";
import { CreateEventInputType, EventType, UpdateEventInputType } from "@/lib/type";
import { apiSlice } from "@/services/apiservices";

interface GetAllEventResponse {
    count: number,
    next: string | null,
    previous: string | null,
    results: EventType[]
}

interface searchParamsType {
    page: number
    eventType: string,
    location: string,
    category: string,
    date: string,
    page_size: number
}

export const eventApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        allevents: builder.query<GetAllEventResponse, { page?: number }>({
            query: ({ page }) => ({
                url: `/event?page=${page}`,
                method: "GET"
            }),
            providesTags: (result: any, error: any) => [
                { type: 'events' }
            ],
            keepUnusedDataFor: 0
        }),
        addFavoriteEvent: builder.mutation({
            query: ({ id }) => ({
                url: `/event/favorite/${id}/`,
                method: "POST",
            }),
            onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
                try {
                    await queryFulfilled
                    dispatch(
                        eventApiSlice.util.invalidateTags([
                            { type: 'events' }
                        ])
                    )
                } catch (error) {
                    console.error('Error during addFavorite mutation', error);
                }
            }
        }),
        interestedEvent: builder.query<GetAllEventResponse, { page?: number }>({
            query: ({ page }) => ({
                url: `/event/interest?page=${page}`,
                method: "GET"
            }),
            providesTags: (result: any, error: any) => [
                { type: 'interestedEvent' }
            ],
            keepUnusedDataFor: 0
        }),
        eventDetails: builder.query<EventType, { id: string }>({
            query: ({ id }) => ({
                url: `/event/${id}/`,
                method: "GET"
            })
        }),
        relatedevents: builder.query<EventType[], { id: string }>({
            query: ({ id }) => ({
                url: `/event/relatedEvents/${id}`,
                method: "GET"
            }),
            providesTags: (result: any, error: any, { id }) => [
                { type: "RelatedEvents" }
            ]
        }),
        searchEvents: builder.query<GetAllEventResponse, searchParamsType>({
            query: ({ page, location, eventType, date, category, page_size }) => ({
                url: "/event/search",
                method: "GET",
                params: { page, location, eventType, date, category, page_size }
            }),
            providesTags: (result, error, { page, location, eventType, date, category }) => [
                {
                    type: 'SearchEvents', location, category, eventType, page, date
                }
            ],
            keepUnusedDataFor: 0,
        }),
        organizerEvent: builder.query<GetAllEventResponse, EventParamsType>({
            query: ({ title, page, page_size }) => ({
                url: "/event/organizer",
                method: "GET",
                params: { title, page, page_size }
            }),
            providesTags: (result, error, { title, page, page_size }) => [
                {
                    type: "OrganizerEvents"
                }
            ],
            keepUnusedDataFor: 0,
        }),
        createEvents: builder.mutation<void, CreateEventInputType>({
            query: ({ title, description, startDate, endDate, category, location, eventType, imageFile, capacity, price }) => {
                const formData = new FormData()
                formData.append("title", title)
                formData.append("description", description),
                    formData.append("start_date", startDate)
                formData.append("end_date", endDate)
                formData.append("category", category)
                formData.append("location", location)
                formData.append("eventType", eventType)
                formData.append("capacity", capacity)
                formData.append("price", price)
                if (imageFile) {
                    formData.append("uploaded_image", imageFile)
                }

                return {
                    url: "/event/create/",
                    method: "POST",
                    body: formData
                }
            },
            onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
                await queryFulfilled
                dispatch(
                    eventApiSlice.util.invalidateTags([
                        { type: "OrganizerEvents" },
                        { type: "events" },
                        { type: "interestedEvent" },
                        { type: "SearchEvents" },
                        { type: "RelatedEvents" }
                    ])
                )
            }
        }),
        updateEvent: builder.mutation<void, UpdateEventInputType>({
            query: ({ title, description, startDate, endDate, category, location, eventType, imageFile, capacity, price, id }) => {
                const formData = new FormData()
                formData.append("title", title)
                formData.append("description", description),
                    formData.append("start_date", startDate)
                formData.append("end_date", endDate)
                formData.append("category", category)
                formData.append("location", location)
                formData.append("eventType", eventType)
                formData.append("capacity", capacity)
                formData.append("price", price)
                if (imageFile) {
                    formData.append("uploaded_image", imageFile)
                }

                return {
                    url: `event/update/${id}/`,
                    method: "PUT",
                    body: formData
                }
            },
            onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
                await queryFulfilled
                dispatch(
                    eventApiSlice.util.invalidateTags([
                        { type: "OrganizerEvents" },
                        { type: "events" },
                        { type: "interestedEvent" },
                        { type: "SearchEvents" },
                        { type: "RelatedEvents" }
                    ])
                )
            }
        }),
        deleteEvent: builder.mutation<void, { id: string }>({
            query: ({ id }) => ({
                url: `/event/delete/${id}/`,
                method: "DELETE"
            }),
            onQueryStarted: async (args, { dispatch, queryFulfilled }) => {
                await queryFulfilled
                dispatch(
                    eventApiSlice.util.invalidateTags([
                        { type: "OrganizerEvents" },
                        { type: "events" },
                        { type: "interestedEvent" },
                        { type: "SearchEvents" },
                        { type: "RelatedEvents" }
                    ])
                )
            }
        })
    })
})


export const {
    useAlleventsQuery,
    useAddFavoriteEventMutation,
    useInterestedEventQuery,
    useEventDetailsQuery,
    useRelatedeventsQuery,
    useSearchEventsQuery,
    useCreateEventsMutation,
    useOrganizerEventQuery,
    useUpdateEventMutation,
    useDeleteEventMutation
} = eventApiSlice