"use client"
import React from 'react'
import {motion} from 'framer-motion'

const AuthLayout = ({children}:{children:React.ReactNode}) => {
  return (
    <motion.div
    initial={{opacity:0}}
    animate={{opacity:1}}
    exit={{opacity:0}}
    transition={{duration:1.3}}
    >
        {children}
    </motion.div>
  )
}

export default AuthLayout