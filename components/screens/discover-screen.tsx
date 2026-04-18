"use client"

import { useState, useMemo } from "react"
import { MapPin, List, Map, Users, Clock, ChevronRight, Sliders, CalendarDays, ChevronLeft } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface DiscoverScreenProps {
  onNavigate: (screen: string, data?: Record<string, unknown>) => void
}

const filters = [
  { id: "all", label: "All" },
  { id: "today", label: "Today" },
  { id: "tomorrow", label: "Tomorrow" },
  { id: "weekend", label: "Weekend" },
]

const skillFilters = [
  { id: "all", label: "All Levels" },
  { id: "beginner", label: "Beginner" },
  { id: "intermediate", label: "Intermediate" },
  { id: "advanced", label: "Advanced" },
]

const games = [
  {
    id: 1,
    venue: "Powerleague Shoreditch",
    address: "123 Old Street, London EC1V",
    date: "Today",
    dateObj: new Date(),
    time: "7:00 PM",
    playersJoined: 8,
    totalSlots: 10,
    distance: "0.5 mi",
    price: 8,
    type: "5-a-side",
    skillLevel: "Intermediate",
    lat: 51.5255,
    lng: -0.0855,
  },
  {
    id: 2,
    venue: "Goals London",
    address: "45 Commercial Road, London E1",
    date: "Today",
    dateObj: new Date(),
    time: "8:30 PM",
    playersJoined: 12,
    totalSlots: 14,
    distance: "1.2 mi",
    price: 10,
    type: "7-a-side",
    skillLevel: "All levels",
    lat: 51.5135,
    lng: -0.0675,
  },
  {
    id: 3,
    venue: "The Cage Hackney",
    address: "78 Mare Street, London E8",
    date: "Tomorrow",
    dateObj: new Date(Date.now() + 86400000),
    time: "6:00 PM",
    playersJoined: 6,
    totalSlots: 10,
    distance: "0.8 mi",
    price: 7,
    type: "5-a-side",
    skillLevel: "Beginner",
    lat: 51.5455,
    lng: -0.0555,
  },
  {
    id: 4,
    venue: "Victoria Park Pitch",
    address: "Victoria Park, London E9",
    date: "Tomorrow",
    dateObj: new Date(Date.now() + 86400000),
    time: "5:00 PM",
    playersJoined: 18,
    totalSlots: 22,
    distance: "1.5 mi",
    price: 5,
    type: "11-a-side",
    skillLevel: "Advanced",
    lat: 51.5365,
    lng: -0.0385,
  },
  {
    id: 5,
    venue: "Hackney Marshes",
    address: "Hackney Marshes, London E9",
    date: "Saturday",
    dateObj: new Date(Date.now() + 172800000),
    time: "10:00 AM",
    playersJoined: 16,
    totalSlots: 22,
    distance: "2.0 mi",
    price: 6,
    type: "11-a-side",
    skillLevel: "Intermediate",
    lat: 51.5505,
    lng: -0.0255,
  },
  {
    id: 6,
    venue: "Wembley Powerleague",
    address: "Empire Way, London HA9",
    date: "Sunday",
    dateObj: new Date(Date.now() + 259200000),
    time: "2:00 PM",
    playersJoined: 4,
    totalSlots: 10,
    distance: "4.2 mi",
    price: 12,
    type: "5-a-side",
    skillLevel: "Advanced",
    lat: 51.5560,
    lng: -0.2795,
  },
]

// Generate calendar days
const generateCalendarDays = () => {
  const days = []
  const today = new Date()
  for (let i = 0; i < 14; i++) {
    const date = new Date(today)
    date.setDate(today.getDate() + i)
    days.push({
      date,
      dayName: date.toLocaleDateString('en-US', { weekday: 'short' }),
      dayNum: date.getDate(),
      month: date.toLocaleDateString('en-US', { month: 'short' }),
      isToday: i === 0,
      hasGames: games.some(g => {
        const gameDate = new Date(g.dateObj)
        return gameDate.toDateString() === date.toDateString()
      }),
    })
  }
  return days
}

export function DiscoverScreen({ onNavigate }: DiscoverScreenProps) {
  const [viewMode, setViewMode] = useState<"list" | "map" | "calendar">("list")
  const [activeFilter, setActiveFilter] = useState("all")
  const [activeSkill, setActiveSkill] = useState("all")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [mapHoveredGame, setMapHoveredGame] = useState<number | null>(null)

  const calendarDays = useMemo(() => generateCalendarDays(), [])

  const filteredGames = useMemo(() => {
    let filtered = [...games]
    
    // Filter by date
    if (selectedDate) {
      filtered = filtered.filter(g => {
        const gameDate = new Date(g.dateObj)
        return gameDate.toDateString() === selectedDate.toDateString()
      })
    } else if (activeFilter !== "all") {
      if (activeFilter === "today") {
        filtered = filtered.filter(g => g.date === "Today")
      } else if (activeFilter === "tomorrow") {
        filtered = filtered.filter(g => g.date === "Tomorrow")
      } else if (activeFilter === "weekend") {
        filtered = filtered.filter(g => g.date === "Saturday" || g.date === "Sunday")
      }
    }
    
    // Filter by skill
    if (activeSkill !== "all") {
      filtered = filtered.filter(g => g.skillLevel.toLowerCase() === activeSkill || g.skillLevel === "All levels")
    }
    
    return filtered
  }, [activeFilter, activeSkill, selectedDate])

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Find Games</h1>
        </div>

        {/* View Mode Toggle - Map, List, Calendar */}
        <div className="flex items-center gap-2 bg-secondary rounded-xl p-1">
          <button
            onClick={() => setViewMode("list")}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2",
              viewMode === "list" ? "bg-card text-primary" : "text-muted-foreground"
            )}
          >
            <List className="w-4 h-4" />
            <span className="text-sm font-medium">List</span>
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2",
              viewMode === "map" ? "bg-card text-primary" : "text-muted-foreground"
            )}
          >
            <Map className="w-4 h-4" />
            <span className="text-sm font-medium">Map</span>
          </button>
          <button
            onClick={() => setViewMode("calendar")}
            className={cn(
              "flex-1 py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-2",
              viewMode === "calendar" ? "bg-card text-primary" : "text-muted-foreground"
            )}
          >
            <CalendarDays className="w-4 h-4" />
            <span className="text-sm font-medium">Calendar</span>
          </button>
        </div>

        {/* Date Filters - Only show on list view */}
        {viewMode === "list" && (
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => {
                  setActiveFilter(filter.id)
                  setSelectedDate(null)
                }}
                className={cn(
                  "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-colors",
                  activeFilter === filter.id && !selectedDate
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground"
                )}
              >
                {filter.label}
              </button>
            ))}
            <button className="px-4 py-2 rounded-full text-sm font-medium bg-secondary text-muted-foreground flex items-center gap-2">
              <Sliders className="w-4 h-4" />
              More
            </button>
          </div>
        )}

        {/* Skill Filters */}
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {skillFilters.map((filter) => (
            <button
              key={filter.id}
              onClick={() => setActiveSkill(filter.id)}
              className={cn(
                "px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border",
                activeSkill === filter.id
                  ? "border-primary text-primary bg-primary/10"
                  : "border-border text-muted-foreground"
              )}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {/* Calendar View */}
      {viewMode === "calendar" && (
        <div className="px-4 pb-4">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-4">
            <button className="p-2 rounded-full bg-secondary">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <h3 className="font-semibold">
              {calendarDays[0].month} {new Date().getFullYear()}
            </h3>
            <button className="p-2 rounded-full bg-secondary">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2 mb-4">
            {calendarDays.slice(0, 7).map((day, index) => (
              <button
                key={index}
                onClick={() => {
                  setSelectedDate(day.date)
                  setActiveFilter("all")
                }}
                className={cn(
                  "flex flex-col items-center py-3 rounded-xl transition-all",
                  selectedDate?.toDateString() === day.date.toDateString()
                    ? "bg-primary text-primary-foreground"
                    : day.isToday
                    ? "bg-primary/20 text-primary"
                    : "bg-secondary text-foreground"
                )}
              >
                <span className="text-[10px] uppercase opacity-70">{day.dayName}</span>
                <span className="text-lg font-bold">{day.dayNum}</span>
                {day.hasGames && (
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full mt-1",
                    selectedDate?.toDateString() === day.date.toDateString()
                      ? "bg-primary-foreground"
                      : "bg-primary"
                  )} />
                )}
              </button>
            ))}
          </div>

          {/* Second Week */}
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.slice(7, 14).map((day, index) => (
              <button
                key={index + 7}
                onClick={() => {
                  setSelectedDate(day.date)
                  setActiveFilter("all")
                }}
                className={cn(
                  "flex flex-col items-center py-3 rounded-xl transition-all",
                  selectedDate?.toDateString() === day.date.toDateString()
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-foreground"
                )}
              >
                <span className="text-[10px] uppercase opacity-70">{day.dayName}</span>
                <span className="text-lg font-bold">{day.dayNum}</span>
                {day.hasGames && (
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full mt-1",
                    selectedDate?.toDateString() === day.date.toDateString()
                      ? "bg-primary-foreground"
                      : "bg-primary"
                  )} />
                )}
              </button>
            ))}
          </div>

          {/* Selected Date Label */}
          {selectedDate && (
            <div className="mt-4 flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Games on {selectedDate.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </p>
              <button
                onClick={() => setSelectedDate(null)}
                className="text-sm text-primary"
              >
                Clear
              </button>
            </div>
          )}
        </div>
      )}

      {/* Content */}
      {viewMode === "map" ? (
        <div className="flex-1 relative bg-secondary/30">
          {/* Interactive Map View */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="relative w-full h-full bg-gradient-to-b from-green-900/30 to-green-800/20 overflow-hidden">
              {/* Map Background with Streets */}
              <div className="absolute inset-0">
                {/* Horizontal streets */}
                {Array.from({ length: 8 }).map((_, i) => (
                  <div 
                    key={`h-${i}`} 
                    className="absolute left-0 right-0 h-px bg-border/30" 
                    style={{ top: `${12 + i * 12}%` }}
                  />
                ))}
                {/* Vertical streets */}
                {Array.from({ length: 6 }).map((_, i) => (
                  <div 
                    key={`v-${i}`} 
                    className="absolute top-0 bottom-0 w-px bg-border/30" 
                    style={{ left: `${15 + i * 15}%` }}
                  />
                ))}
              </div>

              {/* Parks/Green areas */}
              <div className="absolute top-[20%] right-[10%] w-24 h-16 rounded-2xl bg-green-700/30 border border-green-600/20" />
              <div className="absolute bottom-[30%] left-[5%] w-20 h-20 rounded-full bg-green-700/30 border border-green-600/20" />

              {/* Game Markers with better positioning */}
              {filteredGames.map((game, index) => {
                // Distribute markers more naturally
                const positions = [
                  { x: 25, y: 20 },
                  { x: 70, y: 25 },
                  { x: 35, y: 45 },
                  { x: 60, y: 55 },
                  { x: 20, y: 70 },
                  { x: 75, y: 75 },
                ]
                const pos = positions[index % positions.length]
                
                return (
                  <button
                    key={game.id}
                    onClick={() => onNavigate("gameDetail", { gameId: game.id })}
                    onMouseEnter={() => setMapHoveredGame(game.id)}
                    onMouseLeave={() => setMapHoveredGame(null)}
                    className="absolute transform -translate-x-1/2 -translate-y-1/2 group z-10"
                    style={{
                      left: `${pos.x}%`,
                      top: `${pos.y}%`,
                    }}
                  >
                    <div className={cn(
                      "bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg transition-all",
                      mapHoveredGame === game.id ? "scale-125 shadow-xl shadow-primary/30" : "hover:scale-110"
                    )}>
                      £{game.price}
                    </div>
                    <div className="w-3 h-3 bg-primary rotate-45 absolute -bottom-1 left-1/2 -translate-x-1/2" />
                    
                    {/* Hover tooltip */}
                    {mapHoveredGame === game.id && (
                      <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-3 bg-card rounded-xl shadow-xl border border-border animate-in fade-in zoom-in-95 duration-200">
                        <p className="font-semibold text-sm truncate">{game.venue}</p>
                        <p className="text-xs text-muted-foreground">{game.time} · {game.type}</p>
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Users className="w-3 h-3" />
                            {game.playersJoined}/{game.totalSlots}
                          </span>
                          <span className="text-xs text-primary">{game.totalSlots - game.playersJoined} spots</span>
                        </div>
                      </div>
                    )}
                  </button>
                )
              })}

              {/* Current Location */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-5 h-5 bg-blue-500 rounded-full border-3 border-white shadow-lg z-20 relative" />
                <div className="w-16 h-16 bg-blue-500/20 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-ping" />
                <div className="w-24 h-24 bg-blue-500/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              </div>
            </div>
          </div>

          {/* Bottom Game Cards Carousel */}
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {filteredGames.map((game) => (
                <Card 
                  key={game.id}
                  className={cn(
                    "flex-shrink-0 w-72 p-4 bg-card/95 backdrop-blur border-none cursor-pointer transition-all",
                    mapHoveredGame === game.id && "ring-2 ring-primary"
                  )}
                  onClick={() => onNavigate("gameDetail", { gameId: game.id })}
                  onMouseEnter={() => setMapHoveredGame(game.id)}
                  onMouseLeave={() => setMapHoveredGame(null)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                        {game.type}
                      </span>
                      <p className="font-semibold mt-2 truncate">{game.venue}</p>
                      <p className="text-sm text-muted-foreground">{game.time} · {game.distance}</p>
                    </div>
                    <div className="text-right ml-3">
                      <p className="text-xl font-bold text-primary">£{game.price}</p>
                      <p className="text-xs text-muted-foreground">{game.totalSlots - game.playersJoined} spots</p>
                    </div>
                  </div>
                  {/* Slots Visual */}
                  <div className="mt-3 flex gap-0.5">
                    {Array.from({ length: game.totalSlots }).map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "h-1 flex-1 rounded-full",
                          i < game.playersJoined ? "bg-primary" : "bg-secondary"
                        )}
                      />
                    ))}
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Map Controls */}
          <div className="absolute top-4 right-4 flex flex-col gap-2">
            <button className="p-3 bg-card rounded-xl shadow-lg">
              <MapPin className="w-5 h-5 text-primary" />
            </button>
          </div>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
          {filteredGames.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CalendarDays className="w-12 h-12 text-muted-foreground mb-4" />
              <h3 className="font-semibold mb-2">No games found</h3>
              <p className="text-sm text-muted-foreground">
                Try adjusting your filters or check another date
              </p>
            </div>
          ) : (
            filteredGames.map((game) => (
              <Card
                key={game.id}
                className="p-4 bg-card border-none cursor-pointer hover:bg-card/80 transition-colors"
                onClick={() => onNavigate("gameDetail", { gameId: game.id })}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                        {game.type}
                      </span>
                      <span className="text-xs text-muted-foreground">{game.skillLevel}</span>
                    </div>
                    <h3 className="font-semibold text-foreground">{game.venue}</h3>
                    <p className="text-sm text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {game.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">£{game.price}</p>
                    <p className="text-xs text-muted-foreground">per person</p>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {game.date} · {game.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="w-4 h-4" />
                      {game.distance}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4 text-primary" />
                      <span className="text-sm font-medium">{game.playersJoined}/{game.totalSlots}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
                </div>

                {/* Slots Visual */}
                <div className="mt-3 flex gap-1">
                  {Array.from({ length: game.totalSlots }).map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "h-1.5 flex-1 rounded-full",
                        i < game.playersJoined ? "bg-primary" : "bg-secondary"
                      )}
                    />
                  ))}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  )
}
