import {createApi,fetchBaseQuery} from "@reduxjs/toolkit/query/react";
import type {
    BaseQueryFn,
    FetchArgs,
    FetchBaseQueryError
} from '@reduxjs/toolkit/query'
import {Mutex} from 'async-mutex'
import { setAccessToken,logout } from "@/redux/features/userSlice";
import { RootState } from "@/redux/store";


interface RefreshTokenResponse {
    access:string
}

const mutex = new Mutex();
const baseQuery = fetchBaseQuery({
    baseUrl:`${process.env.NEXT_PUBLIC_HOST}/api/v1/`,
    credentials:"include",
    prepareHeaders:(headers,{getState,endpoint})=>{
        const state = getState() as RootState;
        const token = state.user.accessToken

        if(token && endpoint !== "login" && endpoint !== "signup" 
            && endpoint !== "verifyEmail" && endpoint !== "resendEmail" && endpoint !== "eventDetails"
            && endpoint !== "sendPasswordResetEmail" && endpoint !== "setNewPassword"  ){
            headers.set('Authorization', `Bearer ${token}`);
        }
     return headers
    }
});


const baseQueryWithReauth:BaseQueryFn<
string | FetchArgs,
unknown,
FetchBaseQueryError
> = async (args,api,extraOptions) =>{
   
    const state = api.getState() as RootState;;
    const refresh_token = state.user.refreshToken
     await mutex.waitForUnlock();
     let results = await baseQuery(args,api,extraOptions)

     if(results.error && results.error.status == 401){
        if(!mutex.isLocked()){
            const release = await mutex.acquire();
            try{
                const refreshResult = await baseQuery({
                    url:'/user/token/refresh/',
                    method: 'POST',
                    body: {refresh:refresh_token}
                },
                api,extraOptions)

                if(refreshResult.data){
                    const data = refreshResult.data as RefreshTokenResponse
                    console.log(data)
                    api.dispatch(setAccessToken({
                        accessToken:data.access
                    }))
                    results = await baseQuery(args,api,extraOptions)
                }else{
                    console.log("refresh failed");
                    api.dispatch(logout())
                }
            }finally{
                release()
            }
        }else{
            await mutex.waitForUnlock();
            results = await baseQuery(args,api,extraOptions)
        }
     }
     return results
}


export const apiSlice = createApi({
    reducerPath:'api',
    baseQuery:baseQueryWithReauth,
    tagTypes:['events','interestedEvent','UserProfileInfo','OrganizerList','OrganizerDetail'],
    endpoints:builder => ({})
})