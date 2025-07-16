import React from 'react';
import { Button } from '@/components/ui/button';
import Image from 'next/image';

interface ProvidersUIProps {
    handleGoogleSignIn: () => void;
}

export default function ProvidersUI({ handleGoogleSignIn }: ProvidersUIProps) {
    return (
        <div className='rounded-2xl border border-border bg-card/50 backdrop-blur-sm p-8 w-96 shadow-lg'>
            <div className='mb-6 text-center'>
                <h4 className='text-2xl font-bold text-card-foreground mb-2'>Hey, who goes there ? 🧐</h4>
                <p className='text-muted-foreground text-sm'>Sign in with one of these providers to continue</p>
            </div>
            <div className="space-y-4">
                <Button
                    variant='outline'
                    className='bg-white w-full flex items-center justify-center gap-3 h-12 text-card-foreground border-border hover:bg-accent/10 hover:border-accent transition-all duration-200'
                    onClick={handleGoogleSignIn}
                >
                    <Image
                        src="/google_asset.svg"
                        alt="Google"
                        width={20}
                        height={20}
                    />
                    Continue with Google
                </Button>
            </div>
        </div>
    );
}
