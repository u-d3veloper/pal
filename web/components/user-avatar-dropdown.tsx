"use client"

import { useState } from "react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import SignOutDialog from "@/components/auth-ui/signout-dialog"
import { User, LogOut, FilePlus, LibraryBig } from "lucide-react"

interface UserAvatarDropdownProps {
    user: {
        name?: string | null
        image?: string | null
        email?: string | null
    } | null
    initials: string
}

export default function UserAvatarDropdown({ user, initials }: UserAvatarDropdownProps) {
    const [showSignOutDialog, setShowSignOutDialog] = useState(false)
    const router = useRouter()

    const handleSignOut = () => {
        signOut({ callbackUrl: "/" })
    }

    const handleViewProfile = () => {
        router.push("/profile")
    }

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer hover:ring-2 hover:ring-gray-300 transition-all">
                        <AvatarImage
                            src={user?.image || undefined}
                            alt={user?.name || "User avatar"}
                        />
                        <AvatarFallback>
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 rounded-xl">
                    <DropdownMenuItem onClick={handleViewProfile} className="cursor-pointer">
                        <User className="mr-2 h-4 w-4" />
                        <span>View Profile</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => router.push("/chat/sources")}
                        className="cursor-pointer"
                    >
                        <FilePlus className="mr-2 h-4 w-4" />
                        <span>Add a document source</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                        onClick={() => router.push("/chat/library")}
                        className="cursor-pointer"
                    >
                        <LibraryBig className="mr-2 h-4 w-4" />
                        <span>My library</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={() => setShowSignOutDialog(true)}
                        className="cursor-pointer"
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        <span>Sign Out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {showSignOutDialog && (
                <SignOutDialog
                    handleSignOut={handleSignOut}
                    open={showSignOutDialog}
                    onOpenChange={setShowSignOutDialog}
                />
            )}
        </>
    )
}
