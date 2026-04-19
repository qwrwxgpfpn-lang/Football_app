"use client"

import { HomeScreen } from "@/components/screens/home-screen"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function Home() {
  const router = useRouter()
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
    // Simple check for onboarding - in a real app use cookies or a proper auth state
    const hasSeenOnboarding = localStorage.getItem("onboarded")
    if (!hasSeenOnboarding) {
      router.push("/onboarding")
    }
  }, [router])

  const handleNavigate = (screen: string, data?: Record<string, unknown>) => {
    if (screen === "discover") router.push("/discover")
    else if (screen === "groups") router.push("/groups")
    else if (screen === "stats") router.push("/stats")
    else if (screen === "profile") router.push("/profile")
    else if (screen === "gameDetail") router.push(`/game/${data?.gameId || 1}`)
    else if (screen === "hypeRoom") router.push(`/game/${data?.gameId || 1}/hype`)
  }

  if (!isMounted) return null

  return (
    <div className="min-h-screen bg-background">
      <HomeScreen onNavigate={handleNavigate} />
    </div>
  )
}
