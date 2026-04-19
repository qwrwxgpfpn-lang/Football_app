"use client"

import { Bell, Mail, MapPin, PenSquare, ShieldCheck, Star, User } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { getDemoProfile } from "@/lib/demo-session"

interface ProfileScreenProps {
  onNavigate: (screen: string, data?: Record<string, unknown>) => void
}

const achievements = [
  "Playmaker of the Week",
  "5-match unbeaten streak",
  "Top rated midfielder",
]

export function ProfileScreen({ onNavigate }: ProfileScreenProps) {
  const profile = getDemoProfile()

  return (
    <div className="min-h-screen p-4 pb-24 space-y-6">
      <Card className="p-5 border-none bg-card">
        <div className="flex items-start gap-4">
          <Avatar className="h-20 w-20 border-2 border-primary">
            <AvatarImage src="https://i.pravatar.cc/200?img=8" />
            <AvatarFallback>{profile.name.slice(0, 2).toUpperCase()}</AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h1 className="text-2xl font-bold">{profile.name}</h1>
                <p className="text-sm text-muted-foreground mt-1">{profile.email}</p>
              </div>
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-semibold">
                {profile.position}
              </div>
            </div>

            <div className="flex flex-wrap gap-2 mt-4">
              <div className="px-3 py-1 rounded-full bg-secondary text-sm text-secondary-foreground">
                {profile.skillLevel}
              </div>
              <div className="px-3 py-1 rounded-full bg-secondary text-sm text-secondary-foreground flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                London
              </div>
            </div>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-3 gap-3">
        <Card className="p-4 border-none bg-card text-center">
          <p className="text-2xl font-bold text-primary">87</p>
          <p className="text-xs text-muted-foreground mt-1">Overall</p>
        </Card>
        <Card className="p-4 border-none bg-card text-center">
          <p className="text-2xl font-bold">14</p>
          <p className="text-xs text-muted-foreground mt-1">Matches</p>
        </Card>
        <Card className="p-4 border-none bg-card text-center">
          <p className="text-2xl font-bold">4.9</p>
          <p className="text-xs text-muted-foreground mt-1">Reputation</p>
        </Card>
      </div>

      <section className="space-y-3">
        <h2 className="font-semibold flex items-center gap-2">
          <Star className="w-5 h-5 text-primary" />
          Highlights
        </h2>
        <Card className="p-4 border-none bg-card space-y-3">
          {achievements.map((achievement) => (
            <div key={achievement} className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-xl bg-primary/10 flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm">{achievement}</span>
            </div>
          ))}
        </Card>
      </section>

      <section className="space-y-3">
        <h2 className="font-semibold">Account</h2>
        <Card className="p-2 border-none bg-card">
          <button className="w-full flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-secondary/60 transition-colors">
            <User className="w-4 h-4 text-primary" />
            <span className="text-sm">Edit profile</span>
          </button>
          <button className="w-full flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-secondary/60 transition-colors">
            <Bell className="w-4 h-4 text-primary" />
            <span className="text-sm">Notifications</span>
          </button>
          <button className="w-full flex items-center gap-3 rounded-xl px-3 py-3 hover:bg-secondary/60 transition-colors">
            <Mail className="w-4 h-4 text-primary" />
            <span className="text-sm">Contact preferences</span>
          </button>
        </Card>
      </section>

      <Button className="w-full h-12 rounded-2xl" onClick={() => onNavigate("home")}>
        <PenSquare className="w-4 h-4 mr-2" />
        Update Demo Profile
      </Button>
    </div>
  )
}
