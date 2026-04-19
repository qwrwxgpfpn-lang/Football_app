"use client"

import { PostGameScreen } from "@/components/screens/post-game-screen"
import { useRouter } from "next/navigation"

export default function PostGamePage() {
  const router = useRouter()

  const handleBack = () => {
    router.back()
  }

  const handleComplete = () => {
    router.push("/")
  }

  return (
    <PostGameScreen
      onBack={handleBack}
      onComplete={handleComplete}
    />
  )
}
