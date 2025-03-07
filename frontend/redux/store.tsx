"use client"

import { Provider, TypedUseSelectorHook, useDispatch, useSelector } from "react-redux"
import { PersistGate } from 'redux-persist/integration/react';
import { combineReducers, configureStore, createSlice } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import dynamic from 'next/dynamic';
import userReducer from './features/userSlice';
import React from "react";
import { apiSlice } from "@/services/apiservices";
import { locationSlice } from "@/services/apilocationservice";
import checkoutReducer from "./features/checkoutSlice"


const rootReducer = combineReducers({
    [apiSlice.reducerPath]:apiSlice.reducer,
    [locationSlice.reducerPath]:locationSlice.reducer,
    user: userReducer,
    checkout:checkoutReducer,
})


const persistConfig = {
    key: 'root',
    storage,
    version:1
}

const persistedReducer = persistReducer(persistConfig, rootReducer);


export const store = configureStore({
        reducer: persistedReducer,
        middleware: (getDefaultMiddleware) =>
            getDefaultMiddleware({ serializableCheck: false }).concat(apiSlice.middleware)
        .concat(locationSlice.middleware),
})



export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch = () => useDispatch<AppDispatch>()
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

const ClientOnly = dynamic(
    () => Promise.resolve(({ children }: { children: React.ReactNode }) => <>
        {children}
    </>),
    { ssr: false }
)

export const persistor = persistStore(store)

export default function StoreProvider({ children }: { children: React.ReactNode }) {
    return (
        <Provider store={store}>
            <ClientOnly>
                <PersistGate loading={null} persistor={persistor}>
                    {children}
                </PersistGate>
            </ClientOnly>
        </Provider>
    )
}