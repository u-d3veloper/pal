import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import React from 'react'
import { Globe, Plus, SendHorizontal, FilePlus } from 'lucide-react'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
    DropdownMenuLabel,
    DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu'
export default function page() {
    return (
        <div
            className='p-4 flex h-full justify-center items-center flex-col'
        >
            <h1 className='text-2xl font-bold mb-6'>Start asking Pal 💬</h1>
            <div className="flex w-200 items-center gap-2 flex-col border border-gray-100 rounded-3xl p-3">
                <Input
                    type="email"
                    placeholder="Show me my recent Notion page about AI..."
                    className='rounded-2xl py-5 focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:shadow-none w-full border-none shadow-none'
                />
                <div className='flex w-full justify-between items-center gap-2 p-2'>
                    <DropdownMenu>
                        <DropdownMenuTrigger>
                            <Plus className='text-muted-foreground cursor-pointer hover:text-foreground transition-all duration-200' />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start" className='w-64 rounded-2xl'>
                            <DropdownMenuItem className='rounded-xl'>
                                <Globe className='mr-2 h-4 w-4' />
                                Ajouter une source web
                            </DropdownMenuItem>
                            <DropdownMenuItem className='rounded-xl'>
                                <FilePlus className='mr-2 h-4 w-4' />
                                Importer un document
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                    <SendHorizontal className='text-muted-foreground cursor-pointer hover:text-foreground transition-all duration-200' />
                </div>
            </div>
        </div>
    )
}
