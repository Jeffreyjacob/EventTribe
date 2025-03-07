import { AddressResponse } from "@/lib/type";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";




export const locationSlice = createApi({
    reducerPath:"locationApi",
    baseQuery:fetchBaseQuery({baseUrl:'https://api.geoapify.com/v1/geocode'}),
    endpoints:(builder)=>({
       getAddressSugestion: builder.query<AddressResponse,{text:string}>({
          query:({text})=>({
             url: '/autocomplete',
             params:{text,format:'json',apiKey:process.env.NEXT_PUBLIC_GEOAPIFY_API_KEY}
          })
       })
    })
})


export const {
    useGetAddressSugestionQuery
} = locationSlice