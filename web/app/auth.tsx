import React, { useState } from 'react'
import ProvidersUI from "@/components/auth-ui/providers-ui"
import SplitText from "@/components/ui/split-text";
import { signIn } from "next-auth/react";

export default function Auth() {
    const [animationKey, setAnimationKey] = useState(0);

    // Provider sign-in handlers
    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/' })
    }

    // Function to restart animation after completion
    const handleAnimationComplete = () => {
        setTimeout(() => {
            setAnimationKey(prev => prev + 1); // Force re-render to restart animation
        }, 1500); // 1.5 second delay before restarting
    }

    return (
        // page coupée en deux rectangles exactement égaux avec sur la partie de gauche un texte de bienvenue en mode typing, et à droite le providers UI 
        <div className="flex h-screen bg-background">
            <div className="w-3/5 flex items-center justify-center relative border-r border-border bg-neutral-100 dark:bg-neutral-900">
                <div className="flex items-center justify-center w-full h-full">
                    <SplitText
                        key={animationKey}
                        text="Meet Pal 👋"
                        className="text-6xl font-bold text-foreground"
                        delay={200}
                        duration={0.8}
                        ease="power3.out"
                        splitType="chars"
                        from={{ opacity: 0, y: 80, rotateX: 90 }}
                        to={{ opacity: 1, y: 0, rotateX: 0 }}
                        threshold={0.1}
                        rootMargin="-50px"
                        textAlign="center"
                        onLetterAnimationComplete={handleAnimationComplete}
                    />
                </div>
            </div>
            <div className="w-2/5 flex items-center justify-center bg-white dark:bg-background/80 dark:backdrop-blur-sm">
                <ProvidersUI
                    handleGoogleSignIn={handleGoogleSignIn}
                />
            </div>
        </div>
    )
}
