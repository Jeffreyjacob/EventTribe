import { Eye, EyeOff } from 'lucide-react'
import React from 'react'

interface PasswordVisibleButtonProps {
    value:boolean,
    Click:()=>void,
    className:string
}

const PasswordVisibleButton:React.FC<PasswordVisibleButtonProps> = ({
    value,
    Click,
    className
}) => {
  return (
    <div className={className}>
      {
        value == true ? (<EyeOff className='text-[#A4A4A4] w-[25px] h-[22px]' onClick={Click}/>):(
        <Eye className='text-[#A4A4A4] w-[25px] h-[25px]' onClick={Click}/>)
      }
    </div>
  )
}

export default PasswordVisibleButton