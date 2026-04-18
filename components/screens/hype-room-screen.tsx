"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, Send, Smile, Users, Flame, Zap, Trophy, Heart, ThumbsUp, Target, TrendingUp, ChevronDown, Star, Crown, Lock, Unlock, Settings, Check, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface HypeRoomScreenProps {
  onBack: () => void
  gameId?: number
}

const gameInfo = {
  venue: "Powerleague Shoreditch",
  time: "Today · 7:00 PM",
  type: "5-a-side",
}

// Available formations for 5-a-side
const formations = [
  { id: "1-2-2", label: "1-2-2", positions: [
    { x: 50, y: 90, label: "GK" },
    { x: 25, y: 60, label: "DEF" },
    { x: 75, y: 60, label: "DEF" },
    { x: 25, y: 30, label: "FWD" },
    { x: 75, y: 30, label: "FWD" },
  ]},
  { id: "2-1-2", label: "2-1-2", positions: [
    { x: 50, y: 90, label: "GK" },
    { x: 30, y: 65, label: "DEF" },
    { x: 70, y: 65, label: "DEF" },
    { x: 50, y: 45, label: "MID" },
    { x: 30, y: 25, label: "FWD" },
    { x: 70, y: 25, label: "FWD" },
  ]},
  { id: "1-1-2-1", label: "1-1-2-1", positions: [
    { x: 50, y: 90, label: "GK" },
    { x: 50, y: 70, label: "DEF" },
    { x: 30, y: 45, label: "MID" },
    { x: 70, y: 45, label: "MID" },
    { x: 50, y: 20, label: "FWD" },
  ]},
  { id: "2-2", label: "2-2 (No GK)", positions: [
    { x: 30, y: 75, label: "DEF" },
    { x: 70, y: 75, label: "DEF" },
    { x: 30, y: 35, label: "FWD" },
    { x: 70, y: 35, label: "FWD" },
  ]},
]

interface Player {
  id: number
  name: string
  avatar: string
  position: string
  rating: number
  isYou?: boolean
  isEmpty?: boolean
  isCaptain?: boolean
  canBeCaptain?: boolean
}

const initialTeamA: Player[] = [
  { id: 1, name: "Marcus", avatar: "https://i.pravatar.cc/100?img=1", position: "GK", rating: 87, isCaptain: true },
  { id: 2, name: "Sarah", avatar: "https://i.pravatar.cc/100?img=5", position: "DEF", rating: 82, canBeCaptain: true },
  { id: 3, name: "James", avatar: "https://i.pravatar.cc/100?img=3", position: "MID", rating: 79 },
  { id: 4, name: "Emma", avatar: "https://i.pravatar.cc/100?img=9", position: "FWD", rating: 85 },
  { id: 5, name: "You", avatar: "https://i.pravatar.cc/100?img=8", position: "MID", rating: 84, isYou: true },
]

const initialTeamB: Player[] = [
  { id: 6, name: "David", avatar: "https://i.pravatar.cc/100?img=11", position: "GK", rating: 84, isCaptain: true },
  { id: 7, name: "Lisa", avatar: "https://i.pravatar.cc/100?img=23", position: "DEF", rating: 78 },
  { id: 8, name: "Alex", avatar: "https://i.pravatar.cc/100?img=15", position: "MID", rating: 81 },
  { id: 9, name: "TBD", avatar: "", position: "MID", rating: 0, isEmpty: true },
  { id: 10, name: "TBD", avatar: "", position: "FWD", rating: 0, isEmpty: true },
]

const initialMessages = [
  { id: 1, user: "Marcus", avatar: "https://i.pravatar.cc/100?img=1", text: "Let's gooo! Ready to smash it tonight", time: "2h ago", type: "chat" as const, isCaptain: true },
  { id: 2, user: "Sarah", avatar: "https://i.pravatar.cc/100?img=5", text: "Defence is locked in", time: "1h ago", type: "chat" as const },
  { id: 3, user: "James", avatar: "https://i.pravatar.cc/100?img=3", text: "Anyone need a lift?", time: "45m ago", type: "chat" as const },
  { id: 4, user: "System", avatar: "", text: "Marcus predicted: Team A 3 - 2 Team B", time: "30m ago", type: "prediction" as const },
  { id: 5, user: "Emma", avatar: "https://i.pravatar.cc/100?img=9", text: "I'm bringing water for everyone", time: "30m ago", type: "chat" as const },
  { id: 6, user: "System", avatar: "", text: "Sarah predicted: Team A 2 - 1 Team B", time: "15m ago", type: "prediction" as const },
  { id: 7, user: "Alex", avatar: "https://i.pravatar.cc/100?img=15", text: "Team B will surprise you all! Easy win incoming", time: "10m ago", type: "chat" as const },
]

const predictions = [
  { userId: 1, name: "Marcus", avatar: "https://i.pravatar.cc/100?img=1", teamAScore: 3, teamBScore: 2, mvp: "Emma", isCaptain: true },
  { userId: 2, name: "Sarah", avatar: "https://i.pravatar.cc/100?img=5", teamAScore: 2, teamBScore: 1, mvp: "James" },
  { userId: 3, name: "Alex", avatar: "https://i.pravatar.cc/100?img=15", teamAScore: 1, teamBScore: 4, mvp: "David" },
]

const quickReactions = [
  { id: 1, icon: Flame, label: "Fire", count: 5 },
  { id: 2, icon: ThumbsUp, label: "Like", count: 8 },
  { id: 3, icon: Heart, label: "Love", count: 3 },
  { id: 4, icon: Trophy, label: "Trophy", count: 2 },
  { id: 5, icon: Zap, label: "Hype", count: 12 },
]

const emojis = ["⚽", "🔥", "💪", "👏", "🎯", "⭐", "🏆", "💯", "🙌", "😤", "🤝", "👊"]

export function HypeRoomScreen({ onBack }: HypeRoomScreenProps) {
  const [activeTab, setActiveTab] = useState<"lineup" | "chat" | "predictions">("chat")
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState(initialMessages)
  const [showPredictionForm, setShowPredictionForm] = useState(false)
  const [myPrediction, setMyPrediction] = useState({ teamAScore: 0, teamBScore: 0, mvpId: 0 })
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const chatEndRef = useRef<HTMLDivElement>(null)
  
  // Captain and lineup state
  const [teamA, setTeamA] = useState(initialTeamA)
  const [teamB, setTeamB] = useState(initialTeamB)
  const [selectedFormation, setSelectedFormation] = useState(formations[0])
  const [isLineupLocked, setIsLineupLocked] = useState(false)
  const [showFormationPicker, setShowFormationPicker] = useState(false)
  const [showCaptainManager, setShowCaptainManager] = useState(false)
  const [activeTeam, setActiveTeam] = useState<"A" | "B">("A")
  const [draggedPlayer, setDraggedPlayer] = useState<Player | null>(null)
  
  // For demo, assume current user is captain
  const isCurrentUserCaptain = true
  
  const allPlayers = [...teamA, ...teamB.filter(p => !p.isEmpty)]

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!message.trim()) return
    
    const newMessage = {
      id: messages.length + 1,
      user: "You",
      avatar: "https://i.pravatar.cc/100?img=8",
      text: message,
      time: "Just now",
      type: "chat" as const,
    }
    
    setMessages([...messages, newMessage])
    setMessage("")
  }

  const handleSubmitPrediction = () => {
    const predictionMessage = {
      id: messages.length + 1,
      user: "System",
      avatar: "",
      text: `You predicted: Team A ${myPrediction.teamAScore} - ${myPrediction.teamBScore} Team B`,
      time: "Just now",
      type: "prediction" as const,
    }
    
    setMessages([...messages, predictionMessage])
    setShowPredictionForm(false)
    setMyPrediction({ teamAScore: 0, teamBScore: 0, mvpId: 0 })
  }

  const handleAddEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji)
    setShowEmojiPicker(false)
  }

  const handleLockLineup = () => {
    setIsLineupLocked(true)
    const systemMessage = {
      id: messages.length + 1,
      user: "System",
      avatar: "",
      text: `🔒 Team lineups have been locked by the captain! Formation: ${selectedFormation.label}`,
      time: "Just now",
      type: "system" as const,
    }
    setMessages([...messages, systemMessage])
  }

  const handleUnlockLineup = () => {
    setIsLineupLocked(false)
  }

  const handleToggleCaptain = (playerId: number, team: "A" | "B") => {
    if (team === "A") {
      setTeamA(prev => prev.map(p => ({
        ...p,
        canBeCaptain: p.id === playerId ? !p.canBeCaptain : p.canBeCaptain
      })))
    } else {
      setTeamB(prev => prev.map(p => ({
        ...p,
        canBeCaptain: p.id === playerId ? !p.canBeCaptain : p.canBeCaptain
      })))
    }
  }

  const handleMakeCaptain = (playerId: number, team: "A" | "B") => {
    if (team === "A") {
      setTeamA(prev => prev.map(p => ({
        ...p,
        isCaptain: p.id === playerId
      })))
    } else {
      setTeamB(prev => prev.map(p => ({
        ...p,
        isCaptain: p.id === playerId
      })))
    }
  }

  const handleSwapPlayers = (player1: Player, player2: Player) => {
    if (isLineupLocked) return
    
    const updateTeam = (team: Player[], p1: Player, p2: Player) => {
      return team.map(p => {
        if (p.id === p1.id) return { ...p2, position: p1.position }
        if (p.id === p2.id) return { ...p1, position: p2.position }
        return p
      })
    }
    
    // Check which teams the players belong to
    const p1InA = teamA.find(p => p.id === player1.id)
    const p2InA = teamA.find(p => p.id === player2.id)
    
    if (p1InA && p2InA) {
      setTeamA(updateTeam(teamA, player1, player2))
    } else if (!p1InA && !p2InA) {
      setTeamB(updateTeam(teamB, player1, player2))
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 flex items-center gap-4 border-b border-border bg-card/50 backdrop-blur sticky top-0 z-10">
        <button onClick={onBack} className="p-2 -ml-2">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1">
          <h1 className="font-semibold">{gameInfo.venue}</h1>
          <p className="text-sm text-muted-foreground">{gameInfo.time}</p>
        </div>
        <div className="flex items-center gap-2">
          {isLineupLocked && (
            <div className="flex items-center gap-1 bg-yellow-500/20 text-yellow-500 px-2 py-1 rounded-full">
              <Lock className="w-3 h-3" />
              <span className="text-xs font-medium">Locked</span>
            </div>
          )}
          <div className="flex items-center gap-1 bg-primary/20 text-primary px-3 py-1.5 rounded-full">
            <Users className="w-4 h-4" />
            <span className="text-sm font-medium">{allPlayers.length}/10</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-border bg-card/30">
        <button
          onClick={() => setActiveTab("chat")}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors relative flex items-center justify-center gap-2",
            activeTab === "chat" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Send className="w-4 h-4" />
          Chat
          {activeTab === "chat" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("predictions")}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors relative flex items-center justify-center gap-2",
            activeTab === "predictions" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Target className="w-4 h-4" />
          Predictions
          {activeTab === "predictions" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
        <button
          onClick={() => setActiveTab("lineup")}
          className={cn(
            "flex-1 py-3 text-sm font-medium transition-colors relative flex items-center justify-center gap-2",
            activeTab === "lineup" ? "text-primary" : "text-muted-foreground"
          )}
        >
          <Users className="w-4 h-4" />
          Lineup
          {activeTab === "lineup" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
          )}
        </button>
      </div>

      {/* Content */}
      {activeTab === "chat" && (
        <div className="flex-1 flex flex-col">
          {/* Chat Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-background to-card/30">
            {/* Welcome Banner */}
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-4 text-center mb-6">
              <Flame className="w-8 h-8 text-primary mx-auto mb-2" />
              <h3 className="font-bold text-lg">Pre-Game Hype Room</h3>
              <p className="text-sm text-muted-foreground">Chat with your teammates before kickoff!</p>
            </div>

            {messages.map((msg) => (
              <div key={msg.id} className={cn(
                "flex items-start gap-3",
                msg.type === "prediction" || msg.type === "system" ? "justify-center" : ""
              )}>
                {msg.type === "prediction" ? (
                  <div className="bg-gradient-to-r from-primary/20 to-yellow-500/20 rounded-xl px-4 py-2 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{msg.text}</span>
                  </div>
                ) : msg.type === "system" ? (
                  <div className="bg-secondary/50 rounded-xl px-4 py-2 flex items-center gap-2">
                    <span className="text-sm">{msg.text}</span>
                  </div>
                ) : (
                  <>
                    <div className="relative">
                      <Avatar className="h-10 w-10 border-2 border-border">
                        <AvatarImage src={msg.avatar} />
                        <AvatarFallback className="bg-secondary">{msg.user[0]}</AvatarFallback>
                      </Avatar>
                      {msg.isCaptain && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5">
                          <Crown className="w-3 h-3 text-black" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 max-w-[80%]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-semibold">{msg.user}</span>
                        {msg.isCaptain && (
                          <span className="text-[10px] bg-yellow-500/20 text-yellow-500 px-1.5 py-0.5 rounded font-medium">CAPTAIN</span>
                        )}
                        <span className="text-xs text-muted-foreground">{msg.time}</span>
                      </div>
                      <div className={cn(
                        "rounded-2xl px-4 py-2.5 inline-block",
                        msg.user === "You" 
                          ? "bg-primary text-primary-foreground rounded-br-sm" 
                          : "bg-card rounded-bl-sm"
                      )}>
                        <p className="text-sm">{msg.text}</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>

          {/* Quick Reactions */}
          <div className="px-4 py-2 border-t border-border bg-card/50">
            <div className="flex gap-2 overflow-x-auto hide-scrollbar">
              {quickReactions.map((reaction) => {
                const Icon = reaction.icon
                return (
                  <button
                    key={reaction.id}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full hover:bg-secondary/70 transition-colors shrink-0"
                  >
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-xs font-medium">{reaction.count}</span>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-border bg-card">
            {/* Emoji Picker */}
            {showEmojiPicker && (
              <div className="mb-3 p-3 bg-secondary rounded-xl">
                <div className="grid grid-cols-6 gap-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleAddEmoji(emoji)}
                      className="text-2xl p-2 hover:bg-card rounded-lg transition-colors"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setShowEmojiPicker(!showEmojiPicker)}
                className={cn(
                  "p-2.5 rounded-full transition-colors",
                  showEmojiPicker ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"
                )}
              >
                <Smile className="w-5 h-5" />
              </button>
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
                placeholder="Hype up your team..."
                className="flex-1 bg-secondary border-none rounded-full h-12 px-5"
              />
              <Button 
                size="icon" 
                onClick={handleSendMessage}
                disabled={!message.trim()}
                className="rounded-full bg-primary h-12 w-12 disabled:opacity-50"
              >
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      )}

      {activeTab === "predictions" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Make Prediction Card */}
          <Card className="p-4 bg-gradient-to-br from-primary/20 to-yellow-500/10 border-primary/30">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-primary rounded-xl">
                <Target className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <h3 className="font-bold">Make Your Prediction</h3>
                <p className="text-sm text-muted-foreground">Guess the final score and win bragging rights!</p>
              </div>
            </div>

            {!showPredictionForm ? (
              <Button 
                onClick={() => setShowPredictionForm(true)}
                className="w-full bg-primary hover:bg-primary/90 rounded-xl h-12"
              >
                <TrendingUp className="w-4 h-4 mr-2" />
                Predict Score
              </Button>
            ) : (
              <div className="space-y-4">
                {/* Score Picker */}
                <div className="flex items-center justify-center gap-4">
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">TEAM A</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setMyPrediction(p => ({ ...p, teamAScore: Math.max(0, p.teamAScore - 1) }))}
                        className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl font-bold"
                      >
                        -
                      </button>
                      <span className="text-4xl font-black w-12 text-center">{myPrediction.teamAScore}</span>
                      <button
                        onClick={() => setMyPrediction(p => ({ ...p, teamAScore: Math.min(10, p.teamAScore + 1) }))}
                        className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  
                  <span className="text-2xl font-bold text-muted-foreground">vs</span>
                  
                  <div className="text-center">
                    <p className="text-xs text-muted-foreground mb-2">TEAM B</p>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setMyPrediction(p => ({ ...p, teamBScore: Math.max(0, p.teamBScore - 1) }))}
                        className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl font-bold"
                      >
                        -
                      </button>
                      <span className="text-4xl font-black w-12 text-center">{myPrediction.teamBScore}</span>
                      <button
                        onClick={() => setMyPrediction(p => ({ ...p, teamBScore: Math.min(10, p.teamBScore + 1) }))}
                        className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center text-xl font-bold"
                      >
                        +
                      </button>
                    </div>
                  </div>
                </div>

                {/* MVP Picker */}
                <div>
                  <p className="text-xs text-muted-foreground mb-2 text-center">PREDICT MVP (Optional)</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {allPlayers.map((player) => (
                      <button
                        key={player.id}
                        onClick={() => setMyPrediction(p => ({ ...p, mvpId: player.id }))}
                        className={cn(
                          "flex items-center gap-2 px-3 py-1.5 rounded-full transition-colors",
                          myPrediction.mvpId === player.id
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-muted-foreground"
                        )}
                      >
                        <Avatar className="h-5 w-5">
                          <AvatarImage src={player.avatar} />
                          <AvatarFallback className="text-[10px]">{player.name[0]}</AvatarFallback>
                        </Avatar>
                        <span className="text-xs font-medium">{player.name}</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline"
                    onClick={() => setShowPredictionForm(false)}
                    className="flex-1 rounded-xl"
                  >
                    Cancel
                  </Button>
                  <Button 
                    onClick={handleSubmitPrediction}
                    className="flex-1 bg-primary rounded-xl"
                  >
                    Submit Prediction
                  </Button>
                </div>
              </div>
            )}
          </Card>

          {/* Other Predictions */}
          <section>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" />
              Player Predictions
            </h3>
            <div className="space-y-3">
              {predictions.map((pred, index) => (
                <Card key={pred.userId} className="p-4 bg-card border-none">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="h-12 w-12 border-2 border-border">
                        <AvatarImage src={pred.avatar} />
                        <AvatarFallback>{pred.name[0]}</AvatarFallback>
                      </Avatar>
                      {pred.isCaptain && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5">
                          <Crown className="w-3 h-3 text-black" />
                        </div>
                      )}
                      {index === 0 && !pred.isCaptain && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-1">
                          <Trophy className="w-3 h-3 text-black" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold">{pred.name}</p>
                      <p className="text-xs text-muted-foreground">MVP Pick: {pred.mvp}</p>
                    </div>
                    <div className="flex items-center gap-2 bg-secondary rounded-xl px-4 py-2">
                      <span className="text-xl font-black text-primary">{pred.teamAScore}</span>
                      <span className="text-muted-foreground">-</span>
                      <span className="text-xl font-black">{pred.teamBScore}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>

          {/* Prediction Stats */}
          <Card className="p-4 bg-card border-none">
            <h3 className="font-semibold mb-3">Prediction Stats</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-secondary/50 rounded-xl">
                <p className="text-2xl font-bold text-primary">67%</p>
                <p className="text-xs text-muted-foreground">predict Team A wins</p>
              </div>
              <div className="text-center p-3 bg-secondary/50 rounded-xl">
                <p className="text-2xl font-bold">33%</p>
                <p className="text-xs text-muted-foreground">predict Team B wins</p>
              </div>
            </div>
          </Card>
        </div>
      )}

      {activeTab === "lineup" && (
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {/* Captain Controls */}
          {isCurrentUserCaptain && (
            <Card className="p-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/30">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 bg-yellow-500 rounded-xl">
                  <Crown className="w-5 h-5 text-black" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold">Captain Controls</h3>
                  <p className="text-xs text-muted-foreground">You can set formations and lock the lineup</p>
                </div>
              </div>
              
              <div className="flex gap-2">
                {/* Formation Picker */}
                <div className="relative flex-1">
                  <button
                    onClick={() => setShowFormationPicker(!showFormationPicker)}
                    disabled={isLineupLocked}
                    className={cn(
                      "w-full flex items-center justify-between px-4 py-2.5 bg-card rounded-xl transition-colors",
                      isLineupLocked ? "opacity-50 cursor-not-allowed" : "hover:bg-card/80"
                    )}
                  >
                    <span className="font-medium">{selectedFormation.label}</span>
                    <ChevronDown className={cn("w-4 h-4 transition-transform", showFormationPicker && "rotate-180")} />
                  </button>
                  
                  {showFormationPicker && !isLineupLocked && (
                    <div className="absolute top-full mt-2 left-0 right-0 bg-card rounded-xl shadow-xl border border-border z-20 overflow-hidden">
                      {formations.map((formation) => (
                        <button
                          key={formation.id}
                          onClick={() => {
                            setSelectedFormation(formation)
                            setShowFormationPicker(false)
                          }}
                          className={cn(
                            "w-full px-4 py-3 text-left hover:bg-secondary transition-colors flex items-center justify-between",
                            selectedFormation.id === formation.id && "bg-primary/10 text-primary"
                          )}
                        >
                          <span className="font-medium">{formation.label}</span>
                          {selectedFormation.id === formation.id && <Check className="w-4 h-4" />}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Captain Manager */}
                <Button
                  variant="outline"
                  onClick={() => setShowCaptainManager(!showCaptainManager)}
                  className="px-3"
                >
                  <Settings className="w-4 h-4" />
                </Button>
                
                {/* Lock/Unlock Button */}
                {isLineupLocked ? (
                  <Button
                    onClick={handleUnlockLineup}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Unlock className="w-4 h-4" />
                    Unlock
                  </Button>
                ) : (
                  <Button
                    onClick={handleLockLineup}
                    className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-black"
                  >
                    <Lock className="w-4 h-4" />
                    Lock In
                  </Button>
                )}
              </div>
            </Card>
          )}

          {/* Captain Manager Modal */}
          {showCaptainManager && (
            <Card className="p-4 bg-card border-none">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Shield className="w-4 h-4 text-primary" />
                  Manage Captains
                </h3>
                <button onClick={() => setShowCaptainManager(false)} className="text-muted-foreground">
                  <ChevronDown className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-muted-foreground mb-4">Enable players to have captain privileges or transfer captain role.</p>
              
              <div className="space-y-2">
                {allPlayers.map((player) => {
                  const team = teamA.find(p => p.id === player.id) ? "A" : "B"
                  return (
                    <div key={player.id} className="flex items-center justify-between p-3 bg-secondary/50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-10 w-10 border-2 border-border">
                            <AvatarImage src={player.avatar} />
                            <AvatarFallback>{player.name[0]}</AvatarFallback>
                          </Avatar>
                          {player.isCaptain && (
                            <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5">
                              <Crown className="w-3 h-3 text-black" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{player.name}</p>
                          <p className="text-xs text-muted-foreground">Team {team}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {!player.isCaptain && (
                          <>
                            <button
                              onClick={() => handleToggleCaptain(player.id, team)}
                              className={cn(
                                "px-3 py-1.5 rounded-lg text-xs font-medium transition-colors",
                                player.canBeCaptain
                                  ? "bg-primary/20 text-primary"
                                  : "bg-secondary text-muted-foreground"
                              )}
                            >
                              {player.canBeCaptain ? "Can Captain" : "Enable"}
                            </button>
                            <button
                              onClick={() => handleMakeCaptain(player.id, team)}
                              className="px-3 py-1.5 rounded-lg text-xs font-medium bg-yellow-500/20 text-yellow-500 hover:bg-yellow-500/30 transition-colors"
                            >
                              Make Captain
                            </button>
                          </>
                        )}
                        {player.isCaptain && (
                          <span className="px-3 py-1.5 rounded-lg text-xs font-medium bg-yellow-500 text-black">
                            Captain
                          </span>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </Card>
          )}

          {/* Team Selector */}
          <div className="flex gap-2 bg-secondary rounded-xl p-1">
            <button
              onClick={() => setActiveTeam("A")}
              className={cn(
                "flex-1 py-2 rounded-lg transition-colors font-medium text-sm",
                activeTeam === "A" ? "bg-card text-primary" : "text-muted-foreground"
              )}
            >
              Team A
            </button>
            <button
              onClick={() => setActiveTeam("B")}
              className={cn(
                "flex-1 py-2 rounded-lg transition-colors font-medium text-sm",
                activeTeam === "B" ? "bg-card text-primary" : "text-muted-foreground"
              )}
            >
              Team B
            </button>
          </div>

          {/* Pitch View */}
          <Card className="bg-gradient-to-b from-green-800 to-green-700 border-none p-4 relative overflow-hidden">
            {/* Locked Overlay */}
            {isLineupLocked && (
              <div className="absolute inset-0 bg-black/20 z-10 flex items-center justify-center">
                <div className="bg-card/90 rounded-xl px-4 py-2 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-yellow-500" />
                  <span className="text-sm font-medium">Lineup Locked</span>
                </div>
              </div>
            )}
            
            {/* Pitch Markings */}
            <div className="absolute inset-4 border-2 border-white/30 rounded-lg" />
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-24 h-12 border-2 border-t-0 border-white/30 rounded-b-lg" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-24 h-12 border-2 border-b-0 border-white/30 rounded-t-lg" />
            <div className="absolute top-1/2 left-4 right-4 h-0.5 bg-white/30" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/30 rounded-full" />

            {/* Team Label */}
            <div className="relative h-56">
              <p className="text-xs text-white/70 font-medium text-center mb-2">
                TEAM {activeTeam} - {selectedFormation.label}
              </p>
              {(activeTeam === "A" ? teamA : teamB).map((player, index) => {
                const pos = selectedFormation.positions[index] || selectedFormation.positions[0]
                if (player.isEmpty) return null
                return (
                  <div
                    key={player.id}
                    className={cn(
                      "absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center gap-1 cursor-pointer transition-transform",
                      !isLineupLocked && "hover:scale-110"
                    )}
                    style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
                    draggable={!isLineupLocked}
                    onDragStart={() => setDraggedPlayer(player)}
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={() => {
                      if (draggedPlayer && draggedPlayer.id !== player.id) {
                        handleSwapPlayers(draggedPlayer, player)
                      }
                      setDraggedPlayer(null)
                    }}
                  >
                    <div className="relative">
                      <Avatar className={cn(
                        "h-10 w-10 border-2",
                        player.isYou ? "border-primary ring-2 ring-primary/50" : "border-white/50"
                      )}>
                        <AvatarImage src={player.avatar} />
                        <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                          {player.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      {player.isCaptain && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5">
                          <Crown className="w-3 h-3 text-black" />
                        </div>
                      )}
                    </div>
                    <span className="text-[10px] text-white font-medium bg-black/40 px-1.5 py-0.5 rounded">
                      {player.name}
                    </span>
                  </div>
                )
              })}
            </div>
          </Card>

          {/* Player List */}
          <section>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-muted-foreground font-medium">TEAM {activeTeam} ROSTER</p>
              {!isLineupLocked && (
                <p className="text-xs text-primary">Drag to swap positions</p>
              )}
            </div>
            <div className="grid grid-cols-5 gap-3">
              {(activeTeam === "A" ? teamA : teamB).map((player) => (
                <div 
                  key={player.id} 
                  className={cn(
                    "flex flex-col items-center gap-1 p-2 rounded-xl transition-colors",
                    !player.isEmpty && !isLineupLocked && "cursor-move hover:bg-secondary/50"
                  )}
                >
                  {player.isEmpty ? (
                    <div className="h-12 w-12 rounded-full border-2 border-dashed border-muted-foreground/30 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">?</span>
                    </div>
                  ) : (
                    <div className="relative">
                      <Avatar className="h-12 w-12 border-2 border-border">
                        <AvatarImage src={player.avatar} />
                        <AvatarFallback>{player.name[0]}</AvatarFallback>
                      </Avatar>
                      {player.isCaptain && (
                        <div className="absolute -top-1 -right-1 bg-yellow-500 rounded-full p-0.5">
                          <Crown className="w-3 h-3 text-black" />
                        </div>
                      )}
                    </div>
                  )}
                  <span className="text-xs text-muted-foreground truncate w-full text-center">{player.name}</span>
                  {!player.isEmpty && (
                    <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded">{player.rating}</span>
                  )}
                </div>
              ))}
            </div>
          </section>

          {/* Quick Reactions */}
          <section>
            <p className="text-xs text-muted-foreground font-medium mb-3">HYPE IT UP!</p>
            <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
              {quickReactions.map((reaction) => {
                const Icon = reaction.icon
                return (
                  <button
                    key={reaction.id}
                    className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-full hover:bg-secondary/70 transition-colors"
                  >
                    <Icon className="w-4 h-4 text-primary" />
                    <span className="text-sm font-medium">{reaction.count}</span>
                  </button>
                )
              })}
            </div>
          </section>
        </div>
      )}
    </div>
  )
}
