"use client"

import { useState } from "react"
import { ArrowLeft, Star, Upload, Camera, Check, Trophy, Target, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface PostGameScreenProps {
  onBack: () => void
  onComplete: () => void
}

const gameResult = {
  venue: "Powerleague Shoreditch",
  date: "Today",
  teamAScore: 4,
  teamBScore: 3,
  yourTeam: "A",
  mvp: null,
}

const players = [
  { id: 1, name: "Marcus Williams", avatar: "https://i.pravatar.cc/100?img=1", team: "A", goals: 2, assists: 1 },
  { id: 2, name: "Sarah Kim", avatar: "https://i.pravatar.cc/100?img=5", team: "A", goals: 1, assists: 0 },
  { id: 3, name: "James Lee", avatar: "https://i.pravatar.cc/100?img=3", team: "A", goals: 0, assists: 2 },
  { id: 4, name: "Emma Thompson", avatar: "https://i.pravatar.cc/100?img=9", team: "A", goals: 1, assists: 0 },
  { id: 5, name: "David Rodriguez", avatar: "https://i.pravatar.cc/100?img=11", team: "B", goals: 2, assists: 0 },
  { id: 6, name: "Lisa Martinez", avatar: "https://i.pravatar.cc/100?img=23", team: "B", goals: 0, assists: 1 },
  { id: 7, name: "Alex Patel", avatar: "https://i.pravatar.cc/100?img=15", team: "B", goals: 1, assists: 1 },
]

const statCategories = [
  { id: "mvp", label: "MVP", icon: Trophy, description: "Best overall player" },
  { id: "goals", label: "Golden Boot", icon: Target, description: "Top scorer" },
  { id: "performance", label: "Best Performance", icon: Zap, description: "Outstanding effort" },
]

export function PostGameScreen({ onBack, onComplete }: PostGameScreenProps) {
  const [ratings, setRatings] = useState<Record<number, number>>({})
  const [selectedMVP, setSelectedMVP] = useState<number | null>(null)
  const [confirmedStats, setConfirmedStats] = useState(false)
  const [currentStep, setCurrentStep] = useState<"rate" | "awards" | "upload">("rate")

  const handleRating = (playerId: number, rating: number) => {
    setRatings(prev => ({ ...prev, [playerId]: rating }))
  }

  const allRated = players.filter(p => p.id !== 8).every(p => ratings[p.id])
  const isWinner = gameResult.yourTeam === "A" && gameResult.teamAScore > gameResult.teamBScore

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center gap-4 border-b border-border">
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-semibold">Post-Game Review</h1>
          <p className="text-sm text-muted-foreground">{gameResult.venue}</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {/* Game Result */}
        <div className="p-6 bg-gradient-to-b from-secondary/50 to-transparent">
          <Card className={cn(
            "p-6 border-none text-center",
            isWinner ? "bg-gradient-to-br from-primary/20 to-primary/5" : "bg-card"
          )}>
            {isWinner && (
              <div className="flex items-center justify-center gap-2 text-primary mb-2">
                <Trophy className="w-5 h-5" />
                <span className="font-semibold">Victory!</span>
              </div>
            )}
            <div className="flex items-center justify-center gap-6">
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">TEAM A</p>
                <p className={cn(
                  "text-5xl font-black",
                  gameResult.yourTeam === "A" ? "text-primary" : "text-foreground"
                )}>
                  {gameResult.teamAScore}
                </p>
              </div>
              <div className="text-2xl text-muted-foreground font-light">-</div>
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-1">TEAM B</p>
                <p className={cn(
                  "text-5xl font-black",
                  gameResult.yourTeam === "B" ? "text-primary" : "text-foreground"
                )}>
                  {gameResult.teamBScore}
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Steps Indicator */}
        <div className="px-4 mb-6">
          <div className="flex items-center justify-center gap-2">
            {["rate", "awards", "upload"].map((step, i) => (
              <div key={step} className="flex items-center gap-2">
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                  currentStep === step 
                    ? "bg-primary text-primary-foreground" 
                    : ["rate", "awards", "upload"].indexOf(currentStep) > i
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary text-muted-foreground"
                )}>
                  {["rate", "awards", "upload"].indexOf(currentStep) > i ? (
                    <Check className="w-4 h-4" />
                  ) : (
                    i + 1
                  )}
                </div>
                {i < 2 && <div className="w-8 h-0.5 bg-border" />}
              </div>
            ))}
          </div>
        </div>

        <div className="px-4 pb-24 space-y-6">
          {currentStep === "rate" && (
            <>
              <section>
                <h2 className="font-semibold mb-1">Rate Your Teammates</h2>
                <p className="text-sm text-muted-foreground mb-4">How did each player perform?</p>
                
                <div className="space-y-3">
                  {players.map((player) => (
                    <Card key={player.id} className="p-4 bg-card border-none">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={player.avatar} />
                          <AvatarFallback>{player.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{player.name}</p>
                          <p className="text-xs text-muted-foreground">
                            Team {player.team} · {player.goals}G {player.assists}A
                          </p>
                        </div>
                      </div>
                      
                      {/* Star Rating */}
                      <div className="flex items-center justify-center gap-1 mt-3">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <button
                            key={star}
                            onClick={() => handleRating(player.id, star)}
                            className="p-1"
                          >
                            <Star 
                              className={cn(
                                "w-7 h-7 transition-colors",
                                (ratings[player.id] || 0) >= star 
                                  ? "fill-yellow-500 text-yellow-500" 
                                  : "text-muted-foreground/30"
                              )} 
                            />
                          </button>
                        ))}
                      </div>
                    </Card>
                  ))}
                </div>
              </section>
            </>
          )}

          {currentStep === "awards" && (
            <section>
              <h2 className="font-semibold mb-1">Vote for MVP</h2>
              <p className="text-sm text-muted-foreground mb-4">Who deserves the star of the match?</p>
              
              <div className="space-y-2">
                {players.map((player) => (
                  <Card
                    key={player.id}
                    className={cn(
                      "p-4 border-2 transition-all cursor-pointer",
                      selectedMVP === player.id 
                        ? "border-primary bg-primary/10" 
                        : "border-transparent bg-card hover:bg-card/80"
                    )}
                    onClick={() => setSelectedMVP(player.id)}
                  >
                    <div className="flex items-center gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={player.avatar} />
                        <AvatarFallback>{player.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-medium">{player.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {player.goals}G {player.assists}A · Rating: {ratings[player.id] || "-"}
                        </p>
                      </div>
                      {selectedMVP === player.id && (
                        <div className="bg-primary text-primary-foreground p-2 rounded-full">
                          <Trophy className="w-4 h-4" />
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {currentStep === "upload" && (
            <section className="space-y-6">
              <div>
                <h2 className="font-semibold mb-1">Upload Highlights</h2>
                <p className="text-sm text-muted-foreground mb-4">Share your best moments from the game</p>
                
                <Card className="p-8 bg-secondary/50 border-2 border-dashed border-border text-center">
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-secondary rounded-full">
                      <Upload className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">Drag & drop or tap to upload</p>
                      <p className="text-sm text-muted-foreground">Videos and photos</p>
                    </div>
                    <Button variant="outline" className="mt-2">
                      <Camera className="w-4 h-4 mr-2" />
                      Choose Files
                    </Button>
                  </div>
                </Card>
              </div>

              {/* Confirm Stats */}
              <Card className="p-4 bg-card border-none">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Confirm Your Stats</p>
                    <p className="text-sm text-muted-foreground">Goals: 1 · Assists: 0</p>
                  </div>
                  <Button
                    variant={confirmedStats ? "default" : "outline"}
                    size="sm"
                    onClick={() => setConfirmedStats(true)}
                    className={confirmedStats ? "bg-primary" : ""}
                  >
                    {confirmedStats ? (
                      <>
                        <Check className="w-4 h-4 mr-1" />
                        Confirmed
                      </>
                    ) : (
                      "Confirm"
                    )}
                  </Button>
                </div>
              </Card>
            </section>
          )}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-background via-background to-transparent pt-8">
        <div className="max-w-md mx-auto">
          {currentStep === "rate" && (
            <Button
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl"
              onClick={() => setCurrentStep("awards")}
              disabled={!allRated}
            >
              Continue to Awards
            </Button>
          )}
          {currentStep === "awards" && (
            <Button
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl"
              onClick={() => setCurrentStep("upload")}
              disabled={!selectedMVP}
            >
              Continue
            </Button>
          )}
          {currentStep === "upload" && (
            <Button
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl"
              onClick={onComplete}
            >
              Complete Review
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
