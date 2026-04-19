"use client"

import { DiscoverScreen } from "@/components/screens/discover-screen"
import { useRouter } from "next/navigation"

export default function DiscoverPage() {
  const router = useRouter()

  const handleNavigate = (screen: string, data?: Record<string, unknown>) => {
    if (screen === "gameDetail") router.push(`/game/${data?.gameId || 1}`)
    else if (screen === "home") router.push("/")
  }

  return <DiscoverScreen onNavigate={handleNavigate} />
}
