"use client"

import { Calendar, MapPin, Users, ChevronRight, Plus, Clock, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface HomeScreenProps {
  onNavigate: (screen: string, data?: Record<string, unknown>) => void
}

const upcomingGames = [
  {
    id: 1,
    venue: "Powerleague Shoreditch",
    date: "Today",
    time: "7:00 PM",
    playersJoined: 8,
    totalSlots: 10,
    distance: "0.5 mi",
    type: "5-a-side",
    image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&h=200&fit=crop"
  },
  {
    id: 2,
    venue: "Goals London",
    date: "Tomorrow",
    time: "6:30 PM",
    playersJoined: 12,
    totalSlots: 14,
    distance: "1.2 mi",
    type: "7-a-side",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=400&h=200&fit=crop"
  },
]

const nearbyGames = [
  {
    id: 3,
    venue: "The Cage",
    time: "8:00 PM",
    slotsLeft: 3,
    distance: "0.3 mi",
    skillLevel: "Intermediate",
  },
  {
    id: 4,
    venue: "Hackney Marshes",
    time: "5:00 PM",
    slotsLeft: 5,
    distance: "0.8 mi",
    skillLevel: "All levels",
  },
  {
    id: 5,
    venue: "Victoria Park",
    time: "6:00 PM",
    slotsLeft: 2,
    distance: "1.0 mi",
    skillLevel: "Advanced",
  },
]

const recentPlayers = [
  { id: 1, name: "Marcus", avatar: "https://i.pravatar.cc/100?img=1", rating: 87 },
  { id: 2, name: "Sarah", avatar: "https://i.pravatar.cc/100?img=5", rating: 82 },
  { id: 3, name: "James", avatar: "https://i.pravatar.cc/100?img=3", rating: 79 },
  { id: 4, name: "Emma", avatar: "https://i.pravatar.cc/100?img=9", rating: 85 },
]

export function HomeScreen({ onNavigate }: HomeScreenProps) {
  return (
    <div className="p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-muted-foreground text-sm">Good evening</p>
          <h1 className="text-2xl font-bold text-foreground">Ready to play?</h1>
        </div>
        <Avatar className="h-12 w-12 border-2 border-primary">
          <AvatarImage src="https://i.pravatar.cc/100?img=8" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="p-3 bg-secondary/50 border-none">
          <p className="text-2xl font-bold text-primary">12</p>
          <p className="text-xs text-muted-foreground">Games Played</p>
        </Card>
        <Card className="p-3 bg-secondary/50 border-none">
          <p className="text-2xl font-bold text-foreground">8</p>
          <p className="text-xs text-muted-foreground">Goals Scored</p>
        </Card>
        <Card className="p-3 bg-secondary/50 border-none">
          <p className="text-2xl font-bold text-foreground">67%</p>
          <p className="text-xs text-muted-foreground">Win Rate</p>
        </Card>
      </div>

      {/* Book a Game CTA */}
      <Button 
        className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg shadow-primary/25"
        onClick={() => onNavigate("discover")}
      >
        <Plus className="w-5 h-5 mr-2" />
        Book a Game
      </Button>

      {/* Upcoming Games */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Your Upcoming Games</h2>
          <button className="text-primary text-sm flex items-center gap-1">
            View all <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="space-y-3">
          {upcomingGames.map((game) => (
            <Card 
              key={game.id}
              className="overflow-hidden border-none bg-card cursor-pointer hover:bg-card/80 transition-colors"
              onClick={() => onNavigate("gameDetail", { gameId: game.id })}
            >
              <div className="relative h-28">
                <img 
                  src={game.image} 
                  alt={game.venue}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3">
                  <p className="text-white font-semibold">{game.venue}</p>
                  <p className="text-white/70 text-sm">{game.type}</p>
                </div>
                <div className="absolute top-3 right-3 bg-primary/90 text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                  {game.date}
                </div>
              </div>
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {game.time}
                  </span>
                  <span className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" />
                    {game.distance}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-sm">
                  <Users className="w-4 h-4 text-primary" />
                  <span className="text-foreground font-medium">{game.playersJoined}</span>
                  <span className="text-muted-foreground">/{game.totalSlots}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Nearby Games */}
      <section>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            Games Near You
          </h2>
          <button 
            className="text-primary text-sm flex items-center gap-1"
            onClick={() => onNavigate("discover")}
          >
            See map <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
          {nearbyGames.map((game) => (
            <Card 
              key={game.id}
              className="flex-shrink-0 w-44 p-4 bg-secondary/50 border-none cursor-pointer hover:bg-secondary/70 transition-colors"
              onClick={() => onNavigate("gameDetail", { gameId: game.id })}
            >
              <p className="font-semibold text-sm mb-1 truncate">{game.venue}</p>
              <p className="text-primary text-lg font-bold">{game.time}</p>
              <div className="mt-3 space-y-1">
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <MapPin className="w-3 h-3" /> {game.distance}
                </p>
                <p className="text-xs text-muted-foreground">
                  {game.slotsLeft} slots left
                </p>
              </div>
              <div className="mt-2 px-2 py-1 bg-card rounded-full text-[10px] text-center text-muted-foreground">
                {game.skillLevel}
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* Recent Players */}
      <section>
        <h2 className="text-lg font-semibold mb-4">Play Again With</h2>
        <div className="flex gap-4 overflow-x-auto hide-scrollbar pb-2">
          {recentPlayers.map((player) => (
            <div key={player.id} className="flex flex-col items-center gap-2 flex-shrink-0">
              <div className="relative">
                <Avatar className="h-16 w-16 border-2 border-secondary">
                  <AvatarImage src={player.avatar} />
                  <AvatarFallback>{player.name[0]}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {player.rating}
                </div>
              </div>
              <p className="text-xs text-muted-foreground">{player.name}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  )
}
