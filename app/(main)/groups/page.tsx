"use client"

import { GroupsScreen } from "@/components/screens/groups-screen"
import { useRouter } from "next/navigation"

export default function GroupsPage() {
  const router = useRouter()

  const handleNavigate = (screen: string, data?: Record<string, unknown>) => {
    if (screen === "hypeRoom") router.push(`/game/${data?.gameId || 1}/hype`)
  }

  return <GroupsScreen onNavigate={handleNavigate} />
}
