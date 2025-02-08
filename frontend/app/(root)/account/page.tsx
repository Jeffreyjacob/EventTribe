import React from 'react'
import ProtectedRoutes from '../ProtectedRoutes'

const Page = () => {
  return (
    <ProtectedRoutes>
      <div>
        page
      </div>
    </ProtectedRoutes>
  )
}

export default Page