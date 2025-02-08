import { EventType } from "@/lib/type";
import { apiSlice } from "@/services/apiservices";

interface GetAllEventResponse{
    count:number,
    next:string|null,
    previous:string|null,
    results:EventType[]
}

export const eventApiSlice = apiSlice.injectEndpoints({
    endpoints: builder =>({
        allevents:builder.query<GetAllEventResponse,{page?:number}>({
            query:({page})=>({
                url:`/event?page=${page}`,
                method:"GET"
            }),
            providesTags:(result:any,error:any)=>[
                {type:'events'}
            ],
            keepUnusedDataFor: 0
        }),
        addFavoriteEvent: builder.mutation({
            query:({id})=>({
                url:`/event/favorite/${id}/`,
                method:"POST",
            }),
            onQueryStarted :async(args,{dispatch,queryFulfilled})=>{
               try{
                await queryFulfilled
                dispatch(
                  eventApiSlice.util.invalidateTags([
                      {type:'events'}
                  ])
                )
               }catch(error){
                console.error('Error during addFavorite mutation', error);
               }
            }
        }),
        interestedEvent: builder.query<GetAllEventResponse,{page?:number}>({
            query:({page})=>({
                url:`/event/interest?page=${page}`,
                method:"GET"
            }),
            providesTags:(result:any,error:any)=>[
                {type:'interestedEvent'}
            ],
            keepUnusedDataFor: 0
        })
    })
})


export const {
   useAlleventsQuery,
   useAddFavoriteEventMutation,
   useInterestedEventQuery
} = eventApiSlice