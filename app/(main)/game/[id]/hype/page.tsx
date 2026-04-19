"use client"

import { HypeRoomScreen } from "@/components/screens/hype-room-screen"
import { useRouter, useParams } from "next/navigation"

export default function HypeRoomPage() {
  const router = useRouter()
  const params = useParams()
  const gameId = parseInt(params.id as string) || 1

  const handleBack = () => {
    router.back()
  }

  return (
    <HypeRoomScreen
      gameId={gameId}
      onBack={handleBack}
    />
  )
}
