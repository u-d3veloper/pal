import React from 'react'
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ProvidersUIProps {
    handleGoogleSignIn: () => void;
}

export default function ProvidersUI({ handleGoogleSignIn }: ProvidersUIProps) {
    return (
        <div className='rounded-xl border border-gray-200 p-4 w-96 '>
            <div className='my-4 text-center'>
                <h4 className='text-xl font-bold'>Hey, who goes there ? 🧐</h4>
                <p className='text-gray-500'>Sign in with one of these providers to continue</p>
            </div>
            <ul>
                <li>
                    <Button variant='outline' className='w-full flex items-center gap-2' onClick={handleGoogleSignIn}>
                        <Image
                            src="/google_asset.svg"
                            alt="Google"
                            width={20}
                            height={20}
                        />
                        Continue with Google
                    </Button>
                </li>
            </ul>
        </div>

    )
}
