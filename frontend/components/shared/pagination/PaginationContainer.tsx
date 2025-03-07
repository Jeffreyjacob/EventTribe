import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from '@/components/ui/pagination'
import React from 'react'

interface PaginationContainerProps {
   currentPage:number,
   onPageChange:(page:number)=> void
   total_page:number
}

const PaginationContainer:React.FC<PaginationContainerProps> = ({
   currentPage,
   onPageChange,
   total_page
}) => {
    const pageNumber = [...Array(total_page).keys()].map((i) => i + 1)
    return (
        <Pagination>
            <PaginationContent>
                <PaginationItem>
                    {
                        currentPage !== 1 &&  <PaginationPrevious 
                        href="#"
                        onClick={()=>onPageChange( currentPage - 1)} />
                    }
                </PaginationItem>
                <PaginationItem>
                    {
                        pageNumber.map((page,index)=>(
                            <PaginationLink href="#"
                             key={index}
                             isActive = {currentPage === page}
                             onClick={()=>onPageChange(page)}
                            >
                              {page}
                            </PaginationLink>
                        ))
                    }
                </PaginationItem>
                {total_page > 5 &&
                    <PaginationItem>
                        <PaginationEllipsis />
                    </PaginationItem>
                }
                <PaginationItem>
                    {
                        currentPage !== total_page &&  <PaginationNext 
                        href="#" 
                        onClick={()=>onPageChange(currentPage + 1)}/>
                    }
                </PaginationItem>
            </PaginationContent>
        </Pagination>

    )
}

export default PaginationContainer