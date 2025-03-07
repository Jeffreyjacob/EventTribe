import { EventType } from "@/lib/type"
import {createSlice,PayloadAction} from "@reduxjs/toolkit"



const initialState:{event:EventType | null} = {
      event:null
}


const checkoutSlice = createSlice({
    name:"checkout",
    initialState,
    reducers:{
        setEvent:(state,action:PayloadAction<{event:EventType}>)=>{
           state.event = action.payload.event
        },
        removeEvent:(state)=>{
            state.event = null
        }
    }
})

export const {setEvent,removeEvent} = checkoutSlice.actions
export default checkoutSlice.reducer;