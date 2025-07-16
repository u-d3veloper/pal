import React from 'react'
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction
} from '@/components/ui/alert-dialog'

export default function SignOutDialog({
    handleSignOut,
    open,
    onOpenChange
}: {
    handleSignOut: () => void
    open?: boolean
    onOpenChange?: (open: boolean) => void
}) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Leaving so soon? 😮</AlertDialogTitle>
                    <AlertDialogDescription>
                        <span className='italic'>
                            You will be redirected to the login page and will need to sign in again to access your account.
                        </span>
                        <br /><br />
                        <span className='text-md text-black block'>
                            Hope to see you back 👋
                        </span>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSignOut} className="bg-red-600 hover:bg-red-700">
                        Sign Out
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}
