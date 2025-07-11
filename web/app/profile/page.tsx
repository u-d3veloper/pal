import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
    const session = await getServerSession(authOptions)

    if (!session) {
        redirect("/auth")
    }

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
        <div className="container mx-auto p-6 max-w-2xl">
            <div className="bg-white rounded-lg shadow-sm border p-6">
                <h1 className="text-2xl font-bold mb-6">Profile</h1>

                <div className="flex items-center space-x-4 mb-6">
                    <Avatar className="w-20 h-20">
                        <AvatarImage
                            src={session.user?.image || undefined}
                            alt={session.user?.name || "User avatar"}
                        />
                        <AvatarFallback className="text-xl">
                            {getInitials(session.user?.name)}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <h2 className="text-xl font-semibold">
                            {session.user?.name || "User"}
                        </h2>
                        <p className="text-gray-600">
                            {session.user?.email}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Name
                        </label>
                        <div className="p-3 bg-gray-50 rounded-md">
                            {session.user?.name || "Not provided"}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                        </label>
                        <div className="p-3 bg-gray-50 rounded-md">
                            {session.user?.email || "Not provided"}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
