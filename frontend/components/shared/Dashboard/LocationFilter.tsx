import React, { ChangeEvent, useEffect, useRef, useState } from 'react'
import { Input } from '../../ui/input'
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from '../../ui/command'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useGetAddressSugestionQuery } from '@/services/apilocationservice'

interface LocationFilterProps {
    value: string,
    onChange: (value: string) => void
}

const LocationFilter: React.FC<LocationFilterProps> = ({
    value,
    onChange
}) => {
    const containerRef = useRef<HTMLDivElement>(null)
    const [isCommandVisible, setIsCommandVisible] = useState(false)
    const {data,isLoading} = useGetAddressSugestionQuery({text:value})
    const HandleSearchChange = (e: ChangeEvent<HTMLInputElement>) => {
        onChange(e.target.value)
        if (!isCommandVisible) setIsCommandVisible(true)

    }
    const handleSelect = (selectValue:string)=>{
      onChange(selectValue)
      setIsCommandVisible(false)
    }

    const handleClickOutside = (e:MouseEvent)=>{
      if(containerRef.current && !containerRef.current.contains(e.target as Node)){
        setIsCommandVisible(false) 
      }
    }

    useEffect(()=>{
     document.addEventListener("mousedown",handleClickOutside)
     return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    },[])

    return (
        <div ref={containerRef} className='relative w-full'>
            <Input
                type='text'
                placeholder='Search address'
                value={value}
                onFocus={() => setIsCommandVisible(true)}
                onChange={HandleSearchChange}
                className='w-full'
            />
            {
                isCommandVisible && (
                    <div className='absolute z-10 w-full bg-white border rounded-md shadow-md mt-2'>
                        <Command>
                            <CommandList>
                                <CommandEmpty>No Address Found.</CommandEmpty>
                                <CommandGroup>
                                    {data?.results.map((address, index) => (
                                        <CommandItem
                                            key={index}
                                            value={address.formatted}
                                            onSelect={() => handleSelect(address.formatted)}
                                        >
                                            <Check
                                                className={cn(
                                                    "mr-2 h-4 w-4",
                                                    value === address.formatted ? "opacity-100" : "opacity-0"
                                                )}
                                            />
                                            {address.formatted}
                                        </CommandItem>
                                    ))}
                                </CommandGroup>
                            </CommandList>
                        </Command>
                    </div>
                )
            }
        </div>
    )
}

export default LocationFilter