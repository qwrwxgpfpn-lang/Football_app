"use client"

import { useState } from "react"
import { Settings, ChevronRight, Trophy, Target, Flame, Shield, Zap, Star, Medal, Pencil } from "lucide-react"
import { Card } from "@/components/ui/card"
import { AvatarCreator } from "@/components/avatar-creator"

interface ProfileScreenProps {
  onNavigate: (screen: string, data?: Record<string, unknown>) => void
}

interface AvatarConfig {
  skinTone: string
  hairStyle: string
  hairColor: string
  eyeColor: string
  facialHair: string
  accessories: string
  expression: string
  background: string
}

const skinTones: Record<string, string> = {
  light: "#FFE0BD",
  fair: "#FFCD94",
  medium: "#EAB892",
  olive: "#C68642",
  tan: "#A57B5A",
  brown: "#8D5524",
  dark: "#5C3D2E",
}

const hairColors: Record<string, string> = {
  black: "#090806",
  brown: "#6A4E42",
  blonde: "#F4D03F",
  red: "#B55239",
  gray: "#9E9E9E",
  blue: "#2196F3",
  pink: "#E91E63",
  green: "#4CAF50",
}

const eyeColors: Record<string, string> = {
  brown: "#6B4423",
  blue: "#4F93CE",
  green: "#56A040",
  hazel: "#A0782C",
  gray: "#8B8B8B",
}

const backgrounds: Record<string, string> = {
  green: "#4ade80",
  blue: "#3b82f6",
  purple: "#a855f7",
  orange: "#f97316",
  red: "#ef4444",
  gold: "#eab308",
  gradient1: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
  gradient2: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
}

const expressions: Record<string, string> = {
  neutral: "😐",
  happy: "😊",
  confident: "😎",
  determined: "😤",
  chill: "😌",
  excited: "🤩",
}

const playerData = {
  name: "Jordan Davis",
  username: "@jordand",
  overall: 84,
  position: "CM",
  preferredFoot: "Right",
  level: "Pro",
  xp: 2450,
  xpToNext: 3000,
  stats: {
    pace: 78,
    shooting: 82,
    passing: 86,
    dribbling: 80,
    defending: 72,
    physical: 75,
  },
  achievements: [
    { id: 1, name: "First Goal", icon: Target, earned: true },
    { id: 2, name: "Hat Trick", icon: Flame, earned: true },
    { id: 3, name: "Clean Sheet", icon: Shield, earned: true },
    { id: 4, name: "MVP", icon: Star, earned: false },
    { id: 5, name: "10 Wins", icon: Trophy, earned: true },
    { id: 6, name: "Speed Demon", icon: Zap, earned: false },
  ],
  recentForm: ["W", "W", "L", "W", "D"],
  seasonStats: {
    gamesPlayed: 24,
    goals: 18,
    assists: 12,
    winRate: 67,
    avgRating: 7.8,
    cleanSheets: 4,
  },
}

const defaultAvatarConfig: AvatarConfig = {
  skinTone: "medium",
  hairStyle: "short",
  hairColor: "brown",
  eyeColor: "brown",
  facialHair: "none",
  accessories: "none",
  expression: "confident",
  background: "gold",
}

function CustomAvatar({ config, size = "large" }: { config: AvatarConfig; size?: "small" | "large" }) {
  const sizeClasses = size === "large" ? "w-32 h-32" : "w-16 h-16"
  const innerSize = size === "large" ? "inset-4" : "inset-2"
  
  return (
    <div 
      className={`relative ${sizeClasses} rounded-full overflow-hidden shadow-xl`}
      style={{ background: backgrounds[config.background] || backgrounds.gold }}
    >
      {/* Face */}
      <div 
        className={`absolute ${innerSize} rounded-full`}
        style={{ backgroundColor: skinTones[config.skinTone] || skinTones.medium }}
      >
        {/* Eyes */}
        <div className="absolute top-[35%] left-[25%] w-[20%] h-[20%] rounded-full bg-white flex items-center justify-center">
          <div 
            className="w-1/2 h-1/2 rounded-full" 
            style={{ backgroundColor: eyeColors[config.eyeColor] || eyeColors.brown }} 
          />
        </div>
        <div className="absolute top-[35%] right-[25%] w-[20%] h-[20%] rounded-full bg-white flex items-center justify-center">
          <div 
            className="w-1/2 h-1/2 rounded-full" 
            style={{ backgroundColor: eyeColors[config.eyeColor] || eyeColors.brown }} 
          />
        </div>
        
        {/* Hair indicator */}
        {config.hairStyle !== "bald" && (
          <div 
            className="absolute -top-2 left-1/2 -translate-x-1/2 w-[80%] h-[30%] rounded-t-full"
            style={{ backgroundColor: hairColors[config.hairColor] || hairColors.brown }}
          />
        )}
      </div>

      {/* Expression emoji overlay */}
      <div className={`absolute bottom-1 right-1 ${size === "large" ? "text-2xl" : "text-sm"}`}>
        {expressions[config.expression] || "😊"}
      </div>
    </div>
  )
}

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const [showAvatarCreator, setShowAvatarCreator] = useState(false)
  const [avatarConfig, setAvatarConfig] = useState<AvatarConfig>(defaultAvatarConfig)

  const handleSaveAvatar = (config: AvatarConfig) => {
    setAvatarConfig(config)
    setShowAvatarCreator(false)
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Profile</h1>
        <button className="p-2 bg-secondary rounded-full">
          <Settings className="w-5 h-5" />
        </button>
      </div>

      <div className="px-4 space-y-6 pb-24">
        {/* FIFA-Style Player Card with Custom Avatar */}
        <div className="relative">
          <Card className="overflow-hidden border-none bg-gradient-to-br from-yellow-600/90 via-yellow-500/80 to-yellow-400/70 p-0">
            {/* Card Pattern Overlay */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute inset-0" style={{
                backgroundImage: `repeating-linear-gradient(
                  45deg,
                  transparent,
                  transparent 10px,
                  rgba(0,0,0,0.1) 10px,
                  rgba(0,0,0,0.1) 20px
                )`
              }} />
            </div>

            <div className="relative p-5">
              {/* Top Row */}
              <div className="flex items-start gap-4">
                {/* Overall & Position */}
                <div className="flex flex-col items-center">
                  <span className="text-5xl font-black text-black">{playerData.overall}</span>
                  <span className="text-xl font-bold text-black/80">{playerData.position}</span>
                  <div className="mt-2 flex gap-0.5">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star} 
                        className={`w-3 h-3 ${star <= 4 ? 'fill-black text-black' : 'text-black/30'}`} 
                      />
                    ))}
                  </div>
                </div>

                {/* Custom Avatar with Edit Button */}
                <div className="flex-1 flex justify-center">
                  <div className="relative group">
                    <CustomAvatar config={avatarConfig} size="large" />
                    <button
                      onClick={() => setShowAvatarCreator(true)}
                      className="absolute -bottom-1 -right-1 p-2 bg-black/80 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black"
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Level Badge */}
                <div className="flex flex-col items-center">
                  <div className="bg-black/20 backdrop-blur px-3 py-1 rounded-full">
                    <span className="text-xs font-bold text-black">{playerData.level}</span>
                  </div>
                  <Medal className="w-8 h-8 text-black mt-2" />
                </div>
              </div>

              {/* Player Name */}
              <div className="text-center mt-3 pb-3 border-b border-black/20">
                <h2 className="text-xl font-black text-black uppercase tracking-wide">{playerData.name}</h2>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {Object.entries(playerData.stats).map(([stat, value]) => (
                  <div key={stat} className="text-center">
                    <div className="text-2xl font-black text-black">{value}</div>
                    <div className="text-[10px] font-bold text-black/70 uppercase">{stat}</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Card Glow Effect */}
          <div className="absolute -inset-2 bg-yellow-500/20 blur-xl -z-10 rounded-3xl" />
        </div>

        {/* Customize Avatar Button */}
        <Card 
          className="p-4 bg-primary/10 border-primary/30 cursor-pointer hover:bg-primary/20 transition-colors"
          onClick={() => setShowAvatarCreator(true)}
        >
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/20 rounded-xl">
              <Pencil className="w-5 h-5 text-primary" />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Customize Your Avatar</p>
              <p className="text-sm text-muted-foreground">Create your unique player character</p>
            </div>
            <ChevronRight className="w-5 h-5 text-primary" />
          </div>
        </Card>

        {/* XP Progress */}
        <Card className="p-4 bg-card border-none">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Level Progress</span>
            <span className="text-sm text-primary font-semibold">{playerData.xp} / {playerData.xpToNext} XP</span>
          </div>
          <div className="h-2 bg-secondary rounded-full overflow-hidden">
            <div 
              className="h-full bg-primary rounded-full transition-all"
              style={{ width: `${(playerData.xp / playerData.xpToNext) * 100}%` }}
            />
          </div>
        </Card>

        {/* Season Stats */}
        <section>
          <h2 className="font-semibold mb-3">This Season</h2>
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 bg-card border-none text-center">
              <p className="text-3xl font-bold text-primary">{playerData.seasonStats.gamesPlayed}</p>
              <p className="text-xs text-muted-foreground mt-1">Games</p>
            </Card>
            <Card className="p-4 bg-card border-none text-center">
              <p className="text-3xl font-bold text-foreground">{playerData.seasonStats.goals}</p>
              <p className="text-xs text-muted-foreground mt-1">Goals</p>
            </Card>
            <Card className="p-4 bg-card border-none text-center">
              <p className="text-3xl font-bold text-foreground">{playerData.seasonStats.assists}</p>
              <p className="text-xs text-muted-foreground mt-1">Assists</p>
            </Card>
            <Card className="p-4 bg-card border-none text-center">
              <p className="text-3xl font-bold text-foreground">{playerData.seasonStats.winRate}%</p>
              <p className="text-xs text-muted-foreground mt-1">Win Rate</p>
            </Card>
            <Card className="p-4 bg-card border-none text-center">
              <p className="text-3xl font-bold text-foreground">{playerData.seasonStats.avgRating}</p>
              <p className="text-xs text-muted-foreground mt-1">Avg Rating</p>
            </Card>
            <Card className="p-4 bg-card border-none text-center">
              <p className="text-3xl font-bold text-foreground">{playerData.seasonStats.cleanSheets}</p>
              <p className="text-xs text-muted-foreground mt-1">Clean Sheets</p>
            </Card>
          </div>
        </section>

        {/* Recent Form */}
        <section>
          <h2 className="font-semibold mb-3">Recent Form</h2>
          <div className="flex gap-2">
            {playerData.recentForm.map((result, i) => (
              <div
                key={i}
                className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold text-sm ${
                  result === "W" 
                    ? "bg-green-500/20 text-green-500" 
                    : result === "L" 
                    ? "bg-red-500/20 text-red-500" 
                    : "bg-yellow-500/20 text-yellow-500"
                }`}
              >
                {result}
              </div>
            ))}
          </div>
        </section>

        {/* Badges */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Badges</h2>
            <button className="text-primary text-sm flex items-center gap-1">
              View all <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          <div className="grid grid-cols-6 gap-2">
            {playerData.achievements.map((badge) => {
              const Icon = badge.icon
              return (
                <div
                  key={badge.id}
                  className={`aspect-square rounded-xl flex items-center justify-center ${
                    badge.earned 
                      ? "bg-primary/20" 
                      : "bg-secondary opacity-40"
                  }`}
                >
                  <Icon className={`w-6 h-6 ${badge.earned ? "text-primary" : "text-muted-foreground"}`} />
                </div>
              )
            })}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="space-y-2">
          <Card 
            className="p-4 bg-card border-none flex items-center justify-between cursor-pointer hover:bg-card/80 transition-colors"
            onClick={() => onNavigate("stats")}
          >
            <span className="font-medium">View Detailed Stats</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Card>
          <Card className="p-4 bg-card border-none flex items-center justify-between cursor-pointer hover:bg-card/80 transition-colors">
            <span className="font-medium">Edit Position & Info</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Card>
          <Card className="p-4 bg-card border-none flex items-center justify-between cursor-pointer hover:bg-card/80 transition-colors">
            <span className="font-medium">Privacy Settings</span>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </Card>
        </section>
      </div>

      {/* Avatar Creator Modal */}
      <AvatarCreator
        isOpen={showAvatarCreator}
        onClose={() => setShowAvatarCreator(false)}
        onSave={handleSaveAvatar}
        initialConfig={avatarConfig}
      />
    </div>
  )
}
