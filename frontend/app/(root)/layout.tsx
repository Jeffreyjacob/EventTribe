import Footer from '@/components/shared/Footer/Footer'
import Navbar from '@/components/shared/Navbar/Navbar'
import React from 'react'

const Layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='w-full h-full flex flex-col relative'>
        <Navbar/>
        <div className='w-full min-h-screen'>
        {children}
        </div>
        <Footer/>
    </div>
  )
}

export default Layout