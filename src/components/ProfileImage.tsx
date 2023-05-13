import Image from 'next/image'
import React from 'react'
type ProfileImgProps = {
    src?: string | null
    className?: string
}

//Alors là faire très gaffe à bien select le Image de Next, sinon TS devient fou !

export const ProfileImage = ({src, className = ""}:
  ProfileImgProps) => {
  return <div className={`relative h-12 w-12 overflow-hidden rounded-full ${className}`}>
            {src == null ? null : <Image src={src} alt="profile image" quality={100} fill />
            }    
        </div>
}
