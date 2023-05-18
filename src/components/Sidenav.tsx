import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { VscAccount, VscHome, VscSignIn, VscSignOut } from "react-icons/vsc";
import { IconHoverEffect } from "./IconHoverEffect";

export function SideNav(){
    const session = useSession()
    const user = session.data?.user
    return <nav className="sticky-top-0">
        <ul className="flex flex-col items-start gap-2 whitespace-nowrape">
            <li>
                <Link href="/">
                    <IconHoverEffect>
                        <span className="flex items-center gap-4">
                            <VscHome className="h-8 w-8" />
                            <span className="hidden text-lg md:inline">
                                Home
                            </span>
                        </span>     
                    </IconHoverEffect>
                </Link>
            </li>
            
            {user != null && (
                <li>
                    <Link href={`/profile/${user.id}`}>
                        <IconHoverEffect>
                            <span className="flex items-center gap-4">
                                <VscAccount className="h-8 w-8" />
                                <span className="hidden text-lg md:inline">
                                    Profil
                                </span>
                            </span>
                        </IconHoverEffect>
                    </Link>
                </li>
            )}
            {user == null ? (
                    
                <li>
                    <button onClick={()=> void signIn}>
                        <IconHoverEffect>
                            <span className="flex items-center fill-green-700 gap-4">
                                <VscSignIn className="h-8 w-8" />
                                <span className="hidden text-lg fill-green-700 md:inline">
                                    Connexion
                                </span>
                            </span>
                        </IconHoverEffect>
                    </button>
                </li>

            ) : (
                <li>
                    <button onClick={()=> void signOut}>
                        <IconHoverEffect>
                            <span className="flex items-center fill-red-700 gap-4">
                                <VscSignOut className="h-8 w-8" />
                                <span className="hidden text-lg fill-red-700 md:inline">
                                    Connexion
                                </span>
                            </span>
                        </IconHoverEffect>
                    </button>
                </li>
            )}          
            
        </ul>
    </nav>
}