import { OrganizerDetailType, OrganizerType, UserType } from "@/lib/type";
import { apiSlice } from "@/services/apiservices";
import { eventApiSlice } from "./eventApislice";

interface ResetPasswordInput {
    password: string,
    confirmPassword: string,
    uidb64: string,
    token: string
}

interface UpdateProfileInput {
    gender: string,
    phone_number: string,
    address: string,
    updated_image: File | null,
    interest: string[],
    dob: string
}

interface LoginResponse {
    email:string,
    full_name:string,
    access_token:string
    refresh_token:string
    is_verified:boolean,
    id:number,
    role:string
}

interface OrganizerListRespoonse {
    count:number,
    next: string | null,
    previous:string | null,
    results: OrganizerType[]
}

const authApiSlice = apiSlice.injectEndpoints({
    endpoints: builder => ({
        signup: builder.mutation<{email:string,role:string,full_name:string}, { email: string, password: string, full_name: string, role: string }>({
            query: ({ email, password, full_name, role }) => ({
                url: '/user/register/',
                method: 'POST',
                body: { email, password, full_name, role }
            })
        }),
        verifyEmail: builder.mutation<{message:string}, { code: string }>({
            query: ({ code }) => ({
                url: '/user/emailVerification/',
                method: 'POST',
                body: { code }
            })
        }),
        login: builder.mutation<LoginResponse, { email: string, password: string }>({
            query: ({ email, password }) => ({
                url: '/user/login/',
                method: 'POST',
                body: { email, password }
            })
        }),
        resendEmail: builder.mutation<{message:string}, { email: string }>({
            query: ({ email }) => ({
                url: '/user/resendEmailVerification/',
                method: 'POST',
                body: { email }
            })
        }),
        sendPasswordResetEmail: builder.mutation<{message:string}, { email: string }>({
            query: ({ email }) => ({
                url: '/user/forgetpassword/',
                method: 'POST',
                body: { email }
            })
        }),
        setNewPassword: builder.mutation<{message:string}, ResetPasswordInput>({
            query: ({ password, confirmPassword, uidb64, token }) => ({
                url: '/user/setpassword/',
                method: 'PATCH',
                body: { password, confirmPassword, uidb64, token }
            })
        }),
        logout: builder.mutation<void, { refresh: string }>({
            query: ({ refresh }) => ({
                url: '/user/logout/',
                method: 'POST',
                body: { refresh }
            })
        }),
        getUser: builder.query<UserType, void>({
            query: () => ({
                url: '/user/profile/',
                method: "GET"
            }),
            providesTags:(result:any,error:any)=>[
                {type:'UserProfileInfo'}
            ],
            keepUnusedDataFor: 0
        }),
        updateInterest: builder.mutation<{message:string,data:string[]},{interest:string[]}>({
           query: ({interest})=>({
               url:"/user/updateInterest/",
               method:"PATCH",
               body:{interest}
           }),
           onQueryStarted:async(args,{dispatch,queryFulfilled})=>{
               try{
                 await queryFulfilled
                 dispatch(
                    eventApiSlice.util.invalidateTags([
                        {type:'interestedEvent'}
                    ])
                 )
                 dispatch(
                    authApiSlice.util.invalidateTags([
                        {type:"UserProfileInfo"}
                    ])
                 )
               }catch(error){
                console.error('Error during addInterest mutation', error);
               }
           }
        }),
        updateUser: builder.mutation<void, UpdateProfileInput>({
            query: ({ gender, phone_number, interest, dob, updated_image }) => {
                const formData = new FormData()
                formData.append('gender',gender)
                formData.append('phone_number',phone_number),
                interest.forEach((interest)=>{
                    formData.append('interest',interest)
                })
                formData.append('dob',dob)
                if(updated_image){
                    formData.append("updated_image",updated_image)
                }
                return {
                    url: '/user/profile/update/',
                    method: 'PUT',
                    body:formData
                }
            }
        }),
        getOrganizerlist: builder.query<OrganizerListRespoonse,void>({
            query:()=>({
                url:'/user/organizer/',
                method:"GET"
            }),
            providesTags:(result:any,error:any)=>[
                {type:'OrganizerList'}
            ],
            keepUnusedDataFor: 0
        }),
        followOrganizer: builder.mutation<{message:string},{id:number | undefined}>({
              query:({id})=>({
                 url:`/user/follow/${id}/`,
                 method:"POST"
              }),
              onQueryStarted:async (args,{dispatch,queryFulfilled})=>{
                try{
                  await queryFulfilled
                  dispatch(
                     authApiSlice.util.invalidateTags([
                        {type:'OrganizerList'},
                        {type:'OrganizerDetail'}
                     ])
                  )
                }catch(error){
                    console.error('Error during addFavorite mutation', error);
                }
              }
        }),
        OrganizerDetail: builder.query<OrganizerDetailType,{id:number}>({
            query: ({id})=>({
                url:`/user/organizer/${id}/`,
                method:"GET"
            }),
            providesTags:(result:any,error:any)=>[
                {type:'OrganizerDetail'}
            ],
            keepUnusedDataFor: 0
        })
    })
})

export const {
   useSignupMutation,
   useLoginMutation,
   useVerifyEmailMutation,
   useResendEmailMutation,
   useSetNewPasswordMutation,
   useSendPasswordResetEmailMutation,
   useLogoutMutation,
   useGetUserQuery,
   useUpdateUserMutation,
   useUpdateInterestMutation,
   useGetOrganizerlistQuery,
   useFollowOrganizerMutation,
   useOrganizerDetailQuery
} = authApiSlice