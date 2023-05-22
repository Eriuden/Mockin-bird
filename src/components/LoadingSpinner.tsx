import React from 'react'
import { VscRefresh } from 'react-icons/vsc'

type Props = {
    big?: boolean 
}

export const LoadingSpinner = ({big = false} : Props) => {
    const sizeClasses = big ? "w-16 h-16" : "w-10 h-10"

  return (
    <div>
        <VscRefresh className={`animate-spin ${sizeClasses}`}/>
    </div>
  )
}
