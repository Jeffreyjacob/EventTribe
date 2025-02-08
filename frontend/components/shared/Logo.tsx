import React from 'react'
import ticketlogo from '@/assets/ticket.png'
import Image from 'next/image'

interface Logoprops {
    className: string
}

const Logo: React.FC<Logoprops> = ({
    className
}) => {
    return (
        <div className={className}>
            <Image src={ticketlogo} className='w-[30px] h-[30px]' alt='log' />
            <h5>
                Eventify
            </h5>
        </div>
    )
}

export default Logo