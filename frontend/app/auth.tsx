import React from 'react'
import ProvidersUI from "@/components/auth-ui/providers-ui"
import ASCIIText from "@/components/ui/ascii-text"
import { signIn } from "next-auth/react";

export default function Auth() {

    // Provider sign-in handlers
    const handleGoogleSignIn = () => {
        signIn('google', { callbackUrl: '/' })
    }

    return (
        // page coupée en deux rectangles exactement égaux avec sur la partie de gauche un texte de bienvenue en mode typing, et à droite le providers UI 
        <div className="flex h-screen">
            <div className="w-1/2 flex items-center justify-center relative border-r">
                <div className="w-full h-full">
                    <ASCIIText
                        text='Welcome'
                        enableWaves={true}
                        asciiFontSize={4}
                        textFontSize={78}
                        planeBaseHeight={4}
                    />
                </div>
            </div>
            <div className="w-1/2 flex items-center justify-center bg-white">
                <ProvidersUI
                    handleGoogleSignIn={handleGoogleSignIn}
                />
            </div>
        </div>
    )
}
