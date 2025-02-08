"use client"
import { useAppSelector } from '@/redux/store'
import { Loader2 } from 'lucide-react'
import { usePathname, useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated} = useAppSelector((state) => state.user)
    const [isLoading,setLoading] = useState(true)
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (isLoading) {
            if (!isAuthenticated) {
                // Redirect if not authenticated
                router.push(`/login?redirect=${pathname}`)
            } else {
                // If authenticated, stop loading
                setLoading(false)
            }
        }

    }, [isAuthenticated, isLoading, router])
    return (
        <>
            {
                isLoading ? (<div className='w-full min-h-screen flex justify-center items-center'>
                    <Loader2 className='w-4 h-4' />
                </div>) : (
                    <>
                        {children}
                    </>
                )

            }
        </>
    )
}

export default ProtectedRoutes