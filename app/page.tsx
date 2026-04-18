"use client"

import { useState, useEffect } from "react"
import { MobileShell } from "@/components/mobile-shell"
import { OnboardingScreen } from "@/components/screens/onboarding-screen"
import { HomeScreen } from "@/components/screens/home-screen"
import { DiscoverScreen } from "@/components/screens/discover-screen"
import { GameDetailScreen } from "@/components/screens/game-detail-screen"
import { ProfileScreen } from "@/components/screens/profile-screen"
import { StatsScreen } from "@/components/screens/stats-screen"
import { GroupsScreen } from "@/components/screens/groups-screen"
import { HypeRoomScreen } from "@/components/screens/hype-room-screen"
import { PostGameScreen } from "@/components/screens/post-game-screen"

type Screen = 
  | "onboarding" 
  | "home" 
  | "discover" 
  | "groups" 
  | "stats" 
  | "profile" 
  | "gameDetail" 
  | "hypeRoom" 
  | "postGame"

interface NavigationState {
  screen: Screen
  data?: Record<string, unknown>
}

export default function FootyApp() {
  const [isOnboarded, setIsOnboarded] = useState(false)
  const [currentTab, setCurrentTab] = useState("home")
  const [navigationStack, setNavigationStack] = useState<NavigationState[]>([{ screen: "home" }])
  const [isLoading, setIsLoading] = useState(true)

  // Check onboarding status
  useEffect(() => {
    // For demo purposes, show onboarding on first visit
    // In a real app, you'd check localStorage or a user session
    const timer = setTimeout(() => {
      setIsLoading(false)
      // Set to false to show onboarding, true to skip directly to main app
      setIsOnboarded(false)
    }, 800)
    return () => clearTimeout(timer)
  }, [])

  const currentScreen = navigationStack[navigationStack.length - 1]

  const navigateTo = (screen: Screen, data?: Record<string, unknown>) => {
    setNavigationStack(prev => [...prev, { screen, data }])
  }

  const goBack = () => {
    if (navigationStack.length > 1) {
      setNavigationStack(prev => prev.slice(0, -1))
    }
  }

  const handleTabChange = (tab: string) => {
    setCurrentTab(tab)
    // Reset navigation stack when changing tabs
    setNavigationStack([{ screen: tab as Screen }])
  }

  const handleOnboardingComplete = () => {
    setIsOnboarded(true)
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-20 h-20 bg-primary rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-primary/30 animate-bounce">
            <svg viewBox="0 0 24 24" className="w-10 h-10 text-primary-foreground" fill="currentColor">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-black tracking-tight mb-2">
            Footy<span className="text-primary">App</span>
          </h1>
          <p className="text-muted-foreground text-sm">Find. Book. Play.</p>
        </div>
      </div>
    )
  }

  // Show onboarding if not completed
  if (!isOnboarded) {
    return <OnboardingScreen onComplete={handleOnboardingComplete} />
  }

  // Render current screen
  const renderScreen = () => {
    switch (currentScreen.screen) {
      case "home":
        return <HomeScreen onNavigate={navigateTo} />
      case "discover":
        return <DiscoverScreen onNavigate={navigateTo} />
      case "groups":
        return <GroupsScreen onNavigate={navigateTo} />
      case "stats":
        return <StatsScreen onNavigate={navigateTo} />
      case "profile":
        return <ProfileScreen onNavigate={navigateTo} />
      case "gameDetail":
        return (
          <GameDetailScreen
            onBack={goBack}
            onNavigate={navigateTo}
            gameId={currentScreen.data?.gameId as number}
          />
        )
      case "hypeRoom":
        return (
          <HypeRoomScreen
            onBack={goBack}
            gameId={currentScreen.data?.gameId as number}
          />
        )
      case "postGame":
        return (
          <PostGameScreen
            onBack={goBack}
            onComplete={() => handleTabChange("home")}
          />
        )
      default:
        return <HomeScreen onNavigate={navigateTo} />
    }
  }

  // For detail screens, render without shell
  const detailScreens: Screen[] = ["gameDetail", "hypeRoom", "postGame"]
  if (detailScreens.includes(currentScreen.screen)) {
    return (
      <div className="min-h-screen max-w-md mx-auto bg-background">
        {renderScreen()}
      </div>
    )
  }

  return (
    <MobileShell activeTab={currentTab} onTabChange={handleTabChange}>
      {renderScreen()}
    </MobileShell>
  )
}
