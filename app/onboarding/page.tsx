"use client"

import { OnboardingScreen } from "@/components/screens/onboarding-screen"
import { useRouter } from "next/navigation"

export default function OnboardingPage() {
  const router = useRouter()

  const handleComplete = () => {
    // In a real app, save onboarding state to cookies/localStorage
    router.push("/")
  }

  return <OnboardingScreen onComplete={handleComplete} />
}
