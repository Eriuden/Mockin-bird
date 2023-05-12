import { useSession } from "next-auth/react";
import { signIn, signOut } from "next-auth/react";
import Link from "next/link";

export function SideNav(){
    const session = useSession()
    const user = session.data?.user
    return <nav className="sticky-top-0">
        <ul className="flex flex-col items-start gap-2 whitespace-nowrape">
            <li>
                <Link href="/">Home</Link>
            </li>
            
            {user != null && (
                <li>
                    <Link href={`/profile/${user.id}`}>Profil</Link>
                </li>
            )}
            {user == null ? (
                    
                <li>
                    <button onClick={()=> void signIn}>Connexion</button>
                </li>

            ) : (
                <li>
                    <button onClick={()=> void signOut}>Déconnexion</button>
                </li>
            )}          
            
        </ul>
    </nav>
}