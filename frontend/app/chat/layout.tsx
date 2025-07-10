import { cookies } from "next/headers"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { ModeToggle } from "@/components/toggle-theme"
import { Separator } from "@radix-ui/react-separator"
import UserAvatarDropdown from "@/components/user-avatar-dropdown"

export default async function Layout({ children }: { children: React.ReactNode }) {
    const cookieStore = await cookies()
    const defaultOpen = cookieStore.get("sidebar_state")?.value === "true"

    // Récupérer la session utilisateur
    const session = await getServerSession(authOptions)

    // Fonction pour générer les initiales à partir du nom
    const getInitials = (name: string | null | undefined): string => {
        if (!name) return "U"
        return name
            .split(" ")
            .map(n => n[0])
            .join("")
            .toUpperCase()
            .slice(0, 2)
    }

    return (
        <SidebarProvider defaultOpen={defaultOpen}>
            <AppSidebar />
            <main className="flex-1 flex flex-col">
                <div className="w-full flex items-center justify-between p-3 gap-4">
                    <div className="flex items-center gap-2">
                        <SidebarTrigger />
                        <Separator orientation="vertical" />
                        <p>Pal chat</p>
                    </div>
                    <div className="flex items-center gap-2">
                        <UserAvatarDropdown
                            user={session?.user || null}
                            initials={getInitials(session?.user?.name)}
                        />
                        <ModeToggle />
                    </div>

                </div>
                {children}
            </main>
        </SidebarProvider>
    )
}