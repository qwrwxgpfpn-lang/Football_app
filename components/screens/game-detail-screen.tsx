"use client"

import { useState } from "react"
import { ArrowLeft, MapPin, Clock, Users, MessageCircle, Share2, Heart, Calendar, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"
import { PaymentModal } from "@/components/payment-modal"

interface GameDetailScreenProps {
  onBack: () => void
  onNavigate: (screen: string, data?: Record<string, unknown>) => void
  gameId?: number
}

const gameData = {
  id: 1,
  venue: "Powerleague Shoreditch",
  address: "123 Old Street, London EC1V 9NR",
  date: "Today, March 15",
  time: "7:00 PM - 8:00 PM",
  price: 8,
  bookingFee: 0.50,
  type: "5-a-side",
  skillLevel: "Intermediate",
  description: "Join us for an exciting 5-a-side match! All skill levels welcome. Bibs and balls provided.",
  facilities: ["Changing Rooms", "Parking", "Floodlights", "Water Available"],
  image: "https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&h=400&fit=crop",
  organizer: {
    name: "Marcus Williams",
    avatar: "https://i.pravatar.cc/100?img=1",
    gamesHosted: 47,
    rating: 4.8,
  },
  teams: {
    teamA: [
      { id: 1, name: "Marcus W.", avatar: "https://i.pravatar.cc/100?img=1", position: "GK", rating: 87 },
      { id: 2, name: "Sarah K.", avatar: "https://i.pravatar.cc/100?img=5", position: "DEF", rating: 82 },
      { id: 3, name: "James L.", avatar: "https://i.pravatar.cc/100?img=3", position: "MID", rating: 79 },
      { id: 4, name: "Emma T.", avatar: "https://i.pravatar.cc/100?img=9", position: "FWD", rating: 85 },
    ],
    teamB: [
      { id: 5, name: "David R.", avatar: "https://i.pravatar.cc/100?img=11", position: "GK", rating: 84 },
      { id: 6, name: "Lisa M.", avatar: "https://i.pravatar.cc/100?img=23", position: "DEF", rating: 78 },
      { id: 7, name: "Alex P.", avatar: "https://i.pravatar.cc/100?img=15", position: "MID", rating: 81 },
    ],
    openSlots: 3,
    totalSlots: 10,
  },
  recentMessages: [
    { id: 1, user: "Marcus", message: "Looking forward to tonight!", time: "2h ago" },
    { id: 2, user: "Sarah", message: "Who else is bringing water?", time: "1h ago" },
  ],
}

export function GameDetailScreen({ onBack, onNavigate }: GameDetailScreenProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  
  const { teams } = gameData
  const filledSlots = teams.teamA.length + teams.teamB.length
  const totalPrice = gameData.price + gameData.bookingFee

  const handleBookingSuccess = () => {
    // Navigate to hype room after successful booking
    onNavigate("hypeRoom", { gameId: gameData.id })
  }
  
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Image */}
      <div className="relative h-56">
        <img 
          src={gameData.image} 
          alt={gameData.venue}
          className="w-full h-full object-cover"
          crossOrigin="anonymous"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
        
        {/* Top Actions */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <button 
            onClick={onBack}
            className="p-2 bg-card/80 backdrop-blur rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex gap-2">
            <button 
              onClick={() => setIsLiked(!isLiked)}
              className={cn(
                "p-2 backdrop-blur rounded-full transition-colors",
                isLiked ? "bg-red-500 text-white" : "bg-card/80"
              )}
            >
              <Heart className={cn("w-5 h-5", isLiked && "fill-current")} />
            </button>
            <button className="p-2 bg-card/80 backdrop-blur rounded-full">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Game Type Badge */}
        <div className="absolute bottom-4 left-4">
          <span className="px-3 py-1.5 bg-primary text-primary-foreground text-sm font-semibold rounded-full">
            {gameData.type}
          </span>
        </div>
      </div>

      <div className="p-4 space-y-5 -mt-4">
        {/* Main Info */}
        <div>
          <h1 className="text-2xl font-bold mb-2">{gameData.venue}</h1>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              {gameData.address}
            </span>
          </div>
          <div className="flex items-center gap-4 mt-3 text-sm">
            <span className="flex items-center gap-1 text-foreground">
              <Calendar className="w-4 h-4 text-primary" />
              {gameData.date}
            </span>
            <span className="flex items-center gap-1 text-foreground">
              <Clock className="w-4 h-4 text-primary" />
              {gameData.time}
            </span>
          </div>
        </div>

        {/* Price & Slots */}
        <Card className="p-4 bg-secondary/50 border-none">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-baseline gap-1">
                <p className="text-3xl font-bold text-primary">£{gameData.price}</p>
                <span className="text-sm text-muted-foreground">+ £{gameData.bookingFee.toFixed(2)} fee</span>
              </div>
              <p className="text-sm text-muted-foreground">per person</p>
            </div>
            <div className="text-right">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <span className="text-xl font-bold">{filledSlots}</span>
                <span className="text-muted-foreground">/ {teams.totalSlots}</span>
              </div>
              <p className="text-sm text-primary font-medium">{teams.openSlots} spots left!</p>
            </div>
          </div>
          
          {/* Slots Visual */}
          <div className="mt-4 flex gap-1">
            {Array.from({ length: teams.totalSlots }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-2 flex-1 rounded-full transition-all",
                  i < filledSlots ? "bg-primary" : "bg-card"
                )}
              />
            ))}
          </div>
        </Card>

        {/* Organizer */}
        <Card className="p-4 bg-card border-none">
          <p className="text-xs text-muted-foreground mb-3">ORGANIZED BY</p>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-12 w-12 border-2 border-primary">
                <AvatarImage src={gameData.organizer.avatar} />
                <AvatarFallback>{gameData.organizer.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-semibold">{gameData.organizer.name}</p>
                <p className="text-sm text-muted-foreground">{gameData.organizer.gamesHosted} games hosted</p>
              </div>
            </div>
            <div className="flex items-center gap-1 bg-secondary px-2 py-1 rounded-lg">
              <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
              <span className="font-semibold">{gameData.organizer.rating}</span>
            </div>
          </div>
        </Card>

        {/* Teams Preview */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Teams</h2>
            <button 
              className="text-primary text-sm"
              onClick={() => onNavigate("hypeRoom", { gameId: gameData.id })}
            >
              View Lineup
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {/* Team A */}
            <Card className="p-3 bg-card border-none">
              <p className="text-xs text-muted-foreground mb-2">TEAM A</p>
              <div className="flex flex-wrap gap-1">
                {teams.teamA.map((player) => (
                  <Avatar key={player.id} className="h-10 w-10 border border-border">
                    <AvatarImage src={player.avatar} />
                    <AvatarFallback>{player.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
                <div className="h-10 w-10 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                  <span className="text-xs text-muted-foreground">+1</span>
                </div>
              </div>
            </Card>
            
            {/* Team B */}
            <Card className="p-3 bg-card border-none">
              <p className="text-xs text-muted-foreground mb-2">TEAM B</p>
              <div className="flex flex-wrap gap-1">
                {teams.teamB.map((player) => (
                  <Avatar key={player.id} className="h-10 w-10 border border-border">
                    <AvatarImage src={player.avatar} />
                    <AvatarFallback>{player.name[0]}</AvatarFallback>
                  </Avatar>
                ))}
                {Array.from({ length: 2 }).map((_, i) => (
                  <div key={i} className="h-10 w-10 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                    <span className="text-xs text-muted-foreground">?</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </section>

        {/* Chat Preview */}
        <Card 
          className="p-4 bg-card border-none cursor-pointer"
          onClick={() => onNavigate("hypeRoom", { gameId: gameData.id })}
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-5 h-5 text-primary" />
              <span className="font-semibold">Game Chat</span>
            </div>
            <span className="text-xs bg-primary text-primary-foreground px-2 py-0.5 rounded-full">2 new</span>
          </div>
          <div className="space-y-2">
            {gameData.recentMessages.map((msg) => (
              <div key={msg.id} className="flex items-start gap-2">
                <p className="text-sm">
                  <span className="font-medium text-primary">{msg.user}:</span>{" "}
                  <span className="text-muted-foreground">{msg.message}</span>
                </p>
              </div>
            ))}
          </div>
        </Card>

        {/* Description */}
        <section>
          <h2 className="font-semibold mb-2">About This Game</h2>
          <p className="text-sm text-muted-foreground leading-relaxed">{gameData.description}</p>
          
          <div className="flex flex-wrap gap-2 mt-3">
            <span className="px-3 py-1 bg-secondary text-sm rounded-full text-muted-foreground">
              {gameData.skillLevel}
            </span>
            {gameData.facilities.map((facility) => (
              <span key={facility} className="px-3 py-1 bg-secondary text-sm rounded-full text-muted-foreground">
                {facility}
              </span>
            ))}
          </div>
        </section>

        {/* Spacer for bottom button */}
        <div className="h-24" />
      </div>

      {/* Fixed Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-8">
        <div className="max-w-md mx-auto">
          <Button 
            onClick={() => setShowPaymentModal(true)}
            className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg shadow-primary/25"
          >
            Book Now · £{totalPrice.toFixed(2)}
          </Button>
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        gameData={{
          id: gameData.id,
          venue: gameData.venue,
          address: gameData.address,
          date: gameData.date,
          time: gameData.time,
          price: gameData.price,
          bookingFee: gameData.bookingFee,
          type: gameData.type,
        }}
        onSuccess={handleBookingSuccess}
      />
    </div>
  )
}
