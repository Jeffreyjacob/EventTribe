"use client"
import React from 'react'
import { Elements } from "@stripe/react-stripe-js";
import { stripePromise } from '@/lib/utils';

const StripeProvider = ({children}:{children:React.ReactNode}) => {
  return (
    <Elements stripe={stripePromise}>
       {children}
    </Elements>
  )
}

export default StripeProvider