"use client"

import { useSession } from "next-auth/react"

import App from "./app"
import Auth from "./auth"

export default function Home() {
  const { data: session } = useSession()
  return session ? <App /> : <Auth />
}