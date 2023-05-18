import Image from 'next/image'
import React from 'react'
import { VscAccount } from 'react-icons/vsc'
type ProfileImgProps = {
    src?: string | null
    className?: string
}

//Alors là faire très gaffe à bien select le Image de Next, sinon TS devient fou !

export const ProfileImage = ({src, className = ""}:
// si c'était != null alors src de Image bugerait, car on demanderait ensuite à avoir une src alors que c'est null
// une vraie division par 0 dans l'idée !
  ProfileImgProps) => {
  return <div className={`relative h-12 w-12 overflow-hidden rounded-full ${className}`}>
            {src == null ? (
                <VscAccount className='h-full w-full'/>
            ) : ( 
                <Image src={src} alt="profile image" quality={100} fill />)
            }    
        </div>
}
