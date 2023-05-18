import React, { ReactNode } from 'react'

type Props = {
    children: ReactNode
    red?: boolean
}

export const IconHoverEffect = ({children, red = false} : Props) => {
    const colorClasses = red ? "outline-red-400 hover:bg-red-200 group-hover"
     : "outline-gray-400 hover:bg-gray-200 group-hover"
  return (
    <div className= {`rounded-full p-2 transition-colors duration-200
     ${colorClasses}`}>{children}</div>
  )
}
