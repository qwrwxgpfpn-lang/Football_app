"use client"

import { GameDetailScreen } from "@/components/screens/game-detail-screen"
import { useRouter, useParams } from "next/navigation"

export default function GameDetailPage() {
  const router = useRouter()
  const params = useParams()
  const gameId = parseInt(params.id as string) || 1

  const handleNavigate = (screen: string, data?: Record<string, unknown>) => {
    if (screen === "hypeRoom") router.push(`/game/${data?.gameId || gameId}/hype`)
  }

  const handleBack = () => {
    router.back()
  }

  return (
    <GameDetailScreen
      gameId={gameId}
      onBack={handleBack}
      onNavigate={handleNavigate}
    />
  )
}
