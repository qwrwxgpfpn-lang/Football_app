"use client"

import { Activity, Award, BarChart3, Calendar, Goal, Shield, TrendingUp } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface StatsScreenProps {
  onNavigate: (screen: string, data?: Record<string, unknown>) => void
}

const statCards = [
  { label: "Matches Played", value: "28", icon: Calendar },
  { label: "Goals", value: "19", icon: Goal },
  { label: "Assists", value: "11", icon: TrendingUp },
  { label: "Clean Sheets", value: "6", icon: Shield },
]

const performance = [
  { label: "Win Rate", value: "68%" },
  { label: "Pass Accuracy", value: "84%" },
  { label: "Shots on Target", value: "61%" },
  { label: "Average Rating", value: "8.2" },
]

const recentGames = [
  { id: 1, opponent: "Hackney Rangers", result: "W 5-3", rating: "8.8", impact: "2 goals, 1 assist" },
  { id: 2, opponent: "Powerleague XI", result: "D 2-2", rating: "7.9", impact: "1 goal" },
  { id: 3, opponent: "Shoreditch Select", result: "W 4-1", rating: "8.5", impact: "Controlled midfield" },
]

export function StatsScreen({ onNavigate }: StatsScreenProps) {
  return (
    <div className="min-h-screen p-4 pb-24 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-muted-foreground">Your season overview</p>
          <h1 className="text-2xl font-bold">Stats</h1>
        </div>
        <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
          <BarChart3 className="w-6 h-6 text-primary" />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {statCards.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.label} className="p-4 border-none bg-card">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                  <p className="text-2xl font-bold mt-2">{stat.value}</p>
                </div>
                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Icon className="w-5 h-5 text-primary" />
                </div>
              </div>
            </Card>
          )
        })}
      </div>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Activity className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Performance Snapshot</h2>
        </div>
        <Card className="p-4 border-none bg-card space-y-4">
          {performance.map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{item.label}</span>
              <span className="font-semibold">{item.value}</span>
            </div>
          ))}
        </Card>
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-primary" />
          <h2 className="font-semibold">Recent Matches</h2>
        </div>
        <div className="space-y-3">
          {recentGames.map((game) => (
            <Card key={game.id} className="p-4 border-none bg-card">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-semibold">{game.opponent}</p>
                  <p className="text-sm text-muted-foreground mt-1">{game.impact}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-primary">{game.result}</p>
                  <p className="text-sm text-muted-foreground mt-1">Rating {game.rating}</p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      <Button className="w-full h-12 rounded-2xl" onClick={() => onNavigate("discover")}>
        Find Another Match
      </Button>
    </div>
  )
}
