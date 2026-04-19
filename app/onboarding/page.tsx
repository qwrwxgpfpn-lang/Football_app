"use client"

import { OnboardingScreen } from "@/components/screens/onboarding-screen"
import { useRouter } from "next/navigation"
import { seedDemoSession } from "@/lib/demo-session"

export default function OnboardingPage() {
  const router = useRouter()

  const handleComplete = () => {
    seedDemoSession()
    router.replace("/")
  }

  return <OnboardingScreen onComplete={handleComplete} />
}
