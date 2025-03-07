"use client"
import AccountPage from '@/components/shared/Account/tabs/AccountPage'
import CreditCard from '@/components/shared/Account/tabs/CreditCard'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import React from 'react'

const page = () => {
  return (
      <Tabs defaultValue="account" className="w-full max-w-6xl mx-auto max-xl:px-7 pt-10">
        <TabsList>
          <TabsTrigger value="account">Account</TabsTrigger>
          <TabsTrigger value="creditcard">Card Informations</TabsTrigger>
        </TabsList>
        <TabsContent value="account">
          <AccountPage/>
        </TabsContent>
        <TabsContent value="creditcard">
          <CreditCard/>
        </TabsContent>
      </Tabs>
  )
}

export default page