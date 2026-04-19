"use client"

import { Home, Search, Users, User, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname, useRouter } from "next/navigation"

const tabs = [
  { id: "home", icon: Home, label: "Home", path: "/" },
  { id: "discover", icon: Search, label: "Discover", path: "/discover" },
  { id: "groups", icon: Users, label: "Groups", path: "/groups" },
  { id: "stats", icon: BarChart3, label: "Stats", path: "/stats" },
  { id: "profile", icon: User, label: "Profile", path: "/profile" },
]

interface MobileShellProps {
  children: React.ReactNode
}

export function MobileShell({ children }: MobileShellProps) {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background border-x border-border/10">
      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pb-24">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-50">
        <div className="max-w-md mx-auto flex items-center justify-around py-3 px-4">
          {tabs.map((tab) => {
            const Icon = tab.icon
            const isActive = pathname === tab.path
            return (
              <button
                key={tab.id}
                onClick={() => router.push(tab.path)}
                className={cn(
                  "flex flex-col items-center gap-1.5 py-1 px-3 rounded-xl transition-all duration-200",
                  isActive 
                    ? "text-primary bg-primary/5" 
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className={cn("w-6 h-6", isActive && "scale-110")} />
                <span className="text-[10px] font-semibold">{tab.label}</span>
              </button>
            )
          })}
        </div>
      </nav>
    </div>
  )
}

