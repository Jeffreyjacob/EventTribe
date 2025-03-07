import { apiSlice } from "@/services/apiservices";

interface CreateCheckoutSessionInput {
 quantity:number,
 event:number
}

const bookingApiSlice = apiSlice.injectEndpoints({
     endpoints: builder =>({
        createCheckoutSession: builder.mutation<{url:string},CreateCheckoutSessionInput>({
           query:({quantity,event})=>({
             url:"/booking/checkout-session/",
             method:"POST",
             body:{quantity,event}
           })
        })
     })
})

export const {
    useCreateCheckoutSessionMutation
} = bookingApiSlice