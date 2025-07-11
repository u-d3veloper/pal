"use client"

import { Calendar, Home, Inbox, Search, Settings, LifeBuoy, CircleQuestionMark, Handshake, Route, Book, MessageSquareText } from "lucide-react"

import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarHeader,
    SidebarFooter,
    useSidebar
} from "@/components/ui/sidebar"

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { User2 } from "lucide-react"
import { ChevronUp, ChevronDown } from "lucide-react"

export function AppSidebar() {
    const {
        open
    } = useSidebar()
    return (
        <Sidebar collapsible="icon">
            <SidebarHeader className="">
                <SidebarMenu>
                    <SidebarMenuItem className="flex items-center justify-between pt-1">
                        <SidebarMenuButton asChild className="w-fit">
                            <a href="#" className="flex items-center">
                                <Home className="" />
                            </a>
                        </SidebarMenuButton>
                        {
                            open && (<SidebarMenuButton asChild className="w-fit ">
                                <a href="#" className="flex items-center">
                                    <Settings className="" />
                                </a>
                            </SidebarMenuButton>)
                        }
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Application</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <a href="/chat">
                                        <MessageSquareText />
                                        Chat
                                    </a>
                                </SidebarMenuButton>
                            </SidebarMenuItem>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <SidebarMenuButton>
                                    <LifeBuoy className="mr-2" />
                                    Support
                                    <ChevronUp className="ml-auto" />
                                </SidebarMenuButton>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent
                                side="top"
                                style={{ width: 'var(--radix-popper-anchor-width)' }}
                                className="rounded-xl"
                            >
                                <DropdownMenuItem>
                                    <Handshake className="mr-2" />
                                    <span>About us</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Route className="mr-2" />
                                    <span>Get started with Pal</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem>
                                    <Book className="mr-2" />
                                    <span>Documentation</span>
                                </DropdownMenuItem>
                            </DropdownMenuContent>
                        </DropdownMenu>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarFooter>
        </Sidebar>
    )
}