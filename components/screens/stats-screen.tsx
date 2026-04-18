"use client"

import { TrendingUp, TrendingDown, Activity, Target, Clock, Footprints } from "lucide-react"
import { Card } from "@/components/ui/card"
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, AreaChart, Area } from "recharts"

interface StatsScreenProps {
  onNavigate: (screen: string, data?: Record<string, unknown>) => void
}

const performanceData = [
  { month: "Jan", rating: 7.2, goals: 2 },
  { month: "Feb", rating: 7.5, goals: 3 },
  { month: "Mar", rating: 7.8, goals: 2 },
  { month: "Apr", rating: 7.4, goals: 4 },
  { month: "May", rating: 8.1, goals: 3 },
  { month: "Jun", rating: 8.3, goals: 4 },
]

const distanceData = [
  { game: "1", distance: 5.2 },
  { game: "2", distance: 4.8 },
  { game: "3", distance: 5.5 },
  { game: "4", distance: 5.1 },
  { game: "5", distance: 5.8 },
  { game: "6", distance: 5.3 },
  { game: "7", distance: 5.9 },
  { game: "8", distance: 5.6 },
]

const statCards = [
  {
    label: "Avg. Rating",
    value: "7.8",
    change: "+0.3",
    trend: "up",
    icon: Activity,
    color: "text-primary",
    bgColor: "bg-primary/20",
  },
  {
    label: "Goals/Game",
    value: "0.75",
    change: "+0.12",
    trend: "up",
    icon: Target,
    color: "text-green-500",
    bgColor: "bg-green-500/20",
  },
  {
    label: "Avg. Distance",
    value: "5.4km",
    change: "-0.2km",
    trend: "down",
    icon: Footprints,
    color: "text-blue-500",
    bgColor: "bg-blue-500/20",
  },
  {
    label: "Play Time",
    value: "52min",
    change: "+3min",
    trend: "up",
    icon: Clock,
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/20",
  },
]

const seasonComparison = [
  { stat: "Games Played", thisYear: 24, lastYear: 18 },
  { stat: "Goals", thisYear: 18, lastYear: 12 },
  { stat: "Assists", thisYear: 12, lastYear: 8 },
  { stat: "Win Rate", thisYear: 67, lastYear: 55 },
]

export function StatsScreen({ onNavigate }: StatsScreenProps) {
  return (
    <div className="min-h-screen pb-24">
      {/* Header */}
      <div className="p-4">
        <h1 className="text-2xl font-bold">Your Stats</h1>
        <p className="text-muted-foreground text-sm">Track your performance</p>
      </div>

      <div className="px-4 space-y-6">
        {/* Quick Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          {statCards.map((stat) => {
            const Icon = stat.icon
            const isUp = stat.trend === "up"
            return (
              <Card key={stat.label} className="p-4 bg-card border-none">
                <div className="flex items-start justify-between mb-2">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`w-4 h-4 ${stat.color}`} />
                  </div>
                  <div className={`flex items-center gap-0.5 text-xs ${isUp ? "text-green-500" : "text-red-500"}`}>
                    {isUp ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                    {stat.change}
                  </div>
                </div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </Card>
            )
          })}
        </div>

        {/* Performance Chart */}
        <Card className="p-4 bg-card border-none">
          <h3 className="font-semibold mb-1">Performance Trend</h3>
          <p className="text-xs text-muted-foreground mb-4">Average rating over time</p>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={performanceData}>
                <defs>
                  <linearGradient id="colorRating" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="oklch(0.72 0.19 145)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="oklch(0.72 0.19 145)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="month" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'oklch(0.65 0 0)', fontSize: 11 }}
                />
                <YAxis 
                  domain={[6, 10]} 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'oklch(0.65 0 0)', fontSize: 11 }}
                />
                <Area
                  type="monotone"
                  dataKey="rating"
                  stroke="oklch(0.72 0.19 145)"
                  strokeWidth={2}
                  fill="url(#colorRating)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Distance Chart */}
        <Card className="p-4 bg-card border-none">
          <h3 className="font-semibold mb-1">Distance Covered</h3>
          <p className="text-xs text-muted-foreground mb-4">Last 8 games (km)</p>
          <div className="h-36">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={distanceData}>
                <XAxis 
                  dataKey="game" 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'oklch(0.65 0 0)', fontSize: 11 }}
                />
                <YAxis 
                  domain={[4, 7]} 
                  axisLine={false} 
                  tickLine={false}
                  tick={{ fill: 'oklch(0.65 0 0)', fontSize: 11 }}
                />
                <Line
                  type="monotone"
                  dataKey="distance"
                  stroke="oklch(0.65 0.18 250)"
                  strokeWidth={2}
                  dot={{ fill: 'oklch(0.65 0.18 250)', strokeWidth: 0, r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Season Comparison */}
        <section>
          <h3 className="font-semibold mb-3">Season Comparison</h3>
          <div className="space-y-3">
            {seasonComparison.map((item) => {
              const improvement = item.thisYear > item.lastYear
              const percentage = item.lastYear > 0 
                ? Math.round(((item.thisYear - item.lastYear) / item.lastYear) * 100)
                : 0
              return (
                <Card key={item.stat} className="p-4 bg-card border-none">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-muted-foreground">{item.stat}</span>
                    <span className={`text-xs ${improvement ? "text-green-500" : "text-red-500"}`}>
                      {improvement ? "+" : ""}{percentage}%
                    </span>
                  </div>
                  <div className="flex items-end gap-3">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>This Season</span>
                        <span className="font-semibold text-foreground">{item.thisYear}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${(item.thisYear / Math.max(item.thisYear, item.lastYear)) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-xs text-muted-foreground mb-1">
                        <span>Last Season</span>
                        <span className="font-semibold text-foreground">{item.lastYear}</span>
                      </div>
                      <div className="h-2 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-muted-foreground/50 rounded-full"
                          style={{ width: `${(item.lastYear / Math.max(item.thisYear, item.lastYear)) * 100}%` }}
                        />
                      </div>
                    </div>
                  </div>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Achievements Summary */}
        <Card className="p-4 bg-card border-none">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold">Personal Bests</h3>
              <p className="text-xs text-muted-foreground">Your record stats</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 mt-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-primary">4</p>
              <p className="text-[10px] text-muted-foreground">Most Goals</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">9.2</p>
              <p className="text-[10px] text-muted-foreground">Best Rating</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-foreground">7.1km</p>
              <p className="text-[10px] text-muted-foreground">Most Distance</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
