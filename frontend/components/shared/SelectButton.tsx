import React from 'react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

interface SelectButtonProps {
    placeholder:string,
    data:{
        name:string,
        value:string
    }[],
    className:string
    value:string,
    onChange:(value:string)=>void
}

const SelectButton:React.FC<SelectButtonProps> = ({
     placeholder,
     data,
     className,
     value,
     onChange
}) => {
    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger className={className}>
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
               {
                data.map((item,index)=>(
                    <SelectItem value={item.value} key={index}>
                      {item.name}
                    </SelectItem>
                ))
               }
            </SelectContent>
        </Select>
    )
}

export default SelectButton