import { Card } from '@/components/ui/card'
import { OrganizerType } from '@/lib/type'
import React from 'react'

interface OrganizerCardProps {
    data:OrganizerType,
    followbtn:(id:string)=>void
}

const OrganizerCard:React.FC<OrganizerCardProps> = ({
    data,
    followbtn
}) => {
  return (
    <Card className='w-[200px] h-[250px]'>
       
    </Card>
  )
}

export default OrganizerCard