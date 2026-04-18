"use client"

import { useState, useMemo, useCallback } from "react"
import { MapPin, List, Map, Users, Clock, ChevronRight, Sliders, CalendarDays, ChevronLeft, Navigation, Loader2 } from "lucide-react"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api"

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
    address: "123 Old Street, London EC1V 9NR",
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
    address: "45 Commercial Road, London E1 1LN",
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
    address: "78 Mare Street, London E8 4RT",
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
    address: "Victoria Park, Grove Road, London E9 7DE",
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
    address: "Hackney Marshes, Homerton Road, London E9 5PF",
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
    address: "Empire Way, Wembley, London HA9 0WS",
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

// Default center (London)
const defaultCenter = {
  lat: 51.5255,
  lng: -0.0755,
}

// Map container style
const containerStyle = {
  width: '100%',
  height: '100%',
}

// Dark theme map styles
const mapStyles = [
  { elementType: "geometry", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1a1a2e" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
  {
    featureType: "administrative.locality",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "poi.park",
    elementType: "geometry",
    stylers: [{ color: "#263c3f" }],
  },
  {
    featureType: "poi.park",
    elementType: "labels.text.fill",
    stylers: [{ color: "#6b9a76" }],
  },
  {
    featureType: "road",
    elementType: "geometry",
    stylers: [{ color: "#2d2d44" }],
  },
  {
    featureType: "road",
    elementType: "geometry.stroke",
    stylers: [{ color: "#212a37" }],
  },
  {
    featureType: "road",
    elementType: "labels.text.fill",
    stylers: [{ color: "#9ca5b3" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry",
    stylers: [{ color: "#3d3d5c" }],
  },
  {
    featureType: "road.highway",
    elementType: "geometry.stroke",
    stylers: [{ color: "#1f2835" }],
  },
  {
    featureType: "road.highway",
    elementType: "labels.text.fill",
    stylers: [{ color: "#f3d19c" }],
  },
  {
    featureType: "transit",
    elementType: "geometry",
    stylers: [{ color: "#2f3948" }],
  },
  {
    featureType: "transit.station",
    elementType: "labels.text.fill",
    stylers: [{ color: "#d59563" }],
  },
  {
    featureType: "water",
    elementType: "geometry",
    stylers: [{ color: "#17263c" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.fill",
    stylers: [{ color: "#515c6d" }],
  },
  {
    featureType: "water",
    elementType: "labels.text.stroke",
    stylers: [{ color: "#17263c" }],
  },
]

export function DiscoverScreen({ onNavigate }: DiscoverScreenProps) {
  const [viewMode, setViewMode] = useState<"list" | "map" | "calendar">("list")
  const [activeFilter, setActiveFilter] = useState("all")
  const [activeSkill, setActiveSkill] = useState("all")
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [mapHoveredGame, setMapHoveredGame] = useState<number | null>(null)
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLocating, setIsLocating] = useState(false)
  const [map, setMap] = useState<google.maps.Map | null>(null)

  const calendarDays = useMemo(() => generateCalendarDays(), [])

  // Load Google Maps
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
  })

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map)
  }, [])

  const onUnmount = useCallback(() => {
    setMap(null)
  }, [])

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

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser")
      return
    }
    
    setIsLocating(true)
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        }
        setUserLocation(newLocation)
        if (map) {
          map.panTo(newLocation)
          map.setZoom(14)
        }
        setIsLocating(false)
      },
      (error) => {
        console.error("Error getting location:", error)
        setIsLocating(false)
        // Default to London center
        setUserLocation(defaultCenter)
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    )
  }

  // Fallback map when Google Maps API key is not available
  const FallbackMap = () => (
    <div className="absolute inset-0 flex items-center justify-center">
      <div className="relative w-full h-full bg-gradient-to-b from-green-900/30 to-green-800/20 overflow-hidden">
        {/* Map Background with Streets */}
        <div className="absolute inset-0">
          {Array.from({ length: 8 }).map((_, i) => (
            <div 
              key={`h-${i}`} 
              className="absolute left-0 right-0 h-px bg-border/30" 
              style={{ top: `${12 + i * 12}%` }}
            />
          ))}
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

        {/* Game Markers */}
        {filteredGames.map((game, index) => {
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
                <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 p-3 bg-card rounded-xl shadow-xl border border-border animate-in fade-in zoom-in-95 duration-200">
                  <p className="font-semibold text-sm truncate">{game.venue}</p>
                  <p className="text-xs text-muted-foreground truncate">{game.address}</p>
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
  )

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
          {/* Google Maps View */}
          {isLoaded && process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={userLocation || defaultCenter}
              zoom={13}
              onLoad={onLoad}
              onUnmount={onUnmount}
              options={{
                styles: mapStyles,
                disableDefaultUI: true,
                zoomControl: true,
                zoomControlOptions: {
                  position: google.maps.ControlPosition.RIGHT_CENTER,
                },
              }}
            >
              {/* User Location Marker */}
              {userLocation && (
                <Marker
                  position={userLocation}
                  icon={{
                    path: google.maps.SymbolPath.CIRCLE,
                    scale: 10,
                    fillColor: "#3b82f6",
                    fillOpacity: 1,
                    strokeColor: "#ffffff",
                    strokeWeight: 3,
                  }}
                  title="Your Location"
                />
              )}

              {/* Game Markers */}
              {filteredGames.map((game) => (
                <Marker
                  key={game.id}
                  position={{ lat: game.lat, lng: game.lng }}
                  onClick={() => setSelectedMarker(game.id)}
                  icon={{
                    url: `data:image/svg+xml,${encodeURIComponent(`
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 56">
                        <path d="M24 0C10.7 0 0 10.7 0 24c0 18 24 32 24 32s24-14 24-32C48 10.7 37.3 0 24 0z" fill="#22c55e"/>
                        <text x="24" y="28" font-family="Arial" font-size="14" font-weight="bold" fill="white" text-anchor="middle">£${game.price}</text>
                      </svg>
                    `)}`,
                    scaledSize: new google.maps.Size(48, 56),
                    anchor: new google.maps.Point(24, 56),
                  }}
                />
              ))}

              {/* Info Window for selected marker */}
              {selectedMarker && (() => {
                const game = filteredGames.find(g => g.id === selectedMarker)
                if (!game) return null
                return (
                  <InfoWindow
                    position={{ lat: game.lat, lng: game.lng }}
                    onCloseClick={() => setSelectedMarker(null)}
                  >
                    <div className="p-2 min-w-[200px]">
                      <p className="font-bold text-gray-900">{game.venue}</p>
                      <p className="text-xs text-gray-600 mt-1">{game.address}</p>
                      <p className="text-xs text-gray-500 mt-1">{game.time} · {game.type}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs text-gray-500">
                          {game.playersJoined}/{game.totalSlots} players
                        </span>
                        <span className="text-sm font-bold text-green-600">£{game.price}</span>
                      </div>
                      <button
                        onClick={() => onNavigate("gameDetail", { gameId: game.id })}
                        className="w-full mt-2 py-1.5 bg-green-500 text-white text-xs font-medium rounded-lg"
                      >
                        View Details
                      </button>
                    </div>
                  </InfoWindow>
                )
              })()}
            </GoogleMap>
          ) : loadError ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-muted-foreground">Error loading maps</p>
            </div>
          ) : (
            // Fallback map when API key is not available
            <FallbackMap />
          )}

          {/* Bottom Game Cards Carousel */}
          <div className="absolute bottom-4 left-0 right-0 px-4">
            <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-2">
              {filteredGames.map((game) => (
                <Card 
                  key={game.id}
                  className={cn(
                    "flex-shrink-0 w-72 p-4 bg-card/95 backdrop-blur border-none cursor-pointer transition-all",
                    (mapHoveredGame === game.id || selectedMarker === game.id) && "ring-2 ring-primary"
                  )}
                  onClick={() => onNavigate("gameDetail", { gameId: game.id })}
                  onMouseEnter={() => {
                    setMapHoveredGame(game.id)
                    if (map) {
                      map.panTo({ lat: game.lat, lng: game.lng })
                    }
                  }}
                  onMouseLeave={() => setMapHoveredGame(null)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                        {game.type}
                      </span>
                      <p className="font-semibold mt-2 truncate">{game.venue}</p>
                      <p className="text-xs text-muted-foreground truncate flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3" />
                        {game.address}
                      </p>
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
            <button 
              onClick={handleGetLocation}
              disabled={isLocating}
              className="p-3 bg-card rounded-xl shadow-lg hover:bg-card/80 transition-colors"
            >
              {isLocating ? (
                <Loader2 className="w-5 h-5 text-primary animate-spin" />
              ) : (
                <Navigation className="w-5 h-5 text-primary" />
              )}
            </button>
            <button className="p-3 bg-card rounded-xl shadow-lg">
              <MapPin className="w-5 h-5 text-primary" />
            </button>
          </div>

          {/* Current Location Indicator */}
          {userLocation && (
            <div className="absolute top-4 left-4 bg-card/95 backdrop-blur rounded-xl px-4 py-2 shadow-lg">
              <p className="text-xs text-muted-foreground">Your location</p>
              <p className="text-sm font-medium flex items-center gap-1">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                Near {filteredGames.length} games
              </p>
            </div>
          )}
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
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary font-medium">
                        {game.type}
                      </span>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">
                        {game.skillLevel}
                      </span>
                    </div>
                    <p className="font-semibold truncate">{game.venue}</p>
                    <p className="text-xs text-muted-foreground flex items-center gap-1 mt-1">
                      <MapPin className="w-3 h-3" />
                      {game.address}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-primary">£{game.price}</p>
                    <p className="text-xs text-muted-foreground">{game.distance}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {game.date} · {game.time}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {game.playersJoined}/{game.totalSlots}
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    <span className="text-xs font-medium">{game.totalSlots - game.playersJoined} spots left</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Slots Visual */}
                <div className="mt-3 flex gap-0.5">
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
