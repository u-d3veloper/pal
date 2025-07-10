"use client"

import React from 'react'
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

export default function Welcome() {
    const router = useRouter()

    const handleRedirect = () => {
        router.push('/chat')
    }

    return (
        <main className="flex min-h-screen w-full flex-col justify-center items-center ">
            <div className="w-200 p-8">
                <h1 className="text-4xl font-bold">Welcome, I'm Pal 👋</h1>
                <p className="mt-4 text-lg">
                    Let's discuss something your are interested in! Start feeding me with some sources from internet to help me answer.
                </p>
                <p className="mt-4 text-sm italic text-gray-500 mb-4">
                    Pal is designed to follow a RAG structure and to be an opensource project for Bordeaux University Students and others interested in AI and RAG.
                    It is built with Next.js, TypeScript, and Python, leveraging the power of vector databases for efficient retrieval. You can find more information on the
                    <a href="https://github.com/u-d3veloper/pal" className="text-blue-500"> github</a> repository.
                </p>
                <Button variant="default" className="" onClick={handleRedirect}>
                    Get started 👉🏼
                </Button>
            </div>
        </main>
    )
}
