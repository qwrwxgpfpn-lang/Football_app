"use client"

import { useState } from "react"
import { ChevronRight, MapPin, Users, Trophy, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

interface OnboardingScreenProps {
  onComplete: () => void
}

const slides = [
  {
    icon: MapPin,
    title: "Find Games Near You",
    description: "Discover football games happening in your area and book your spot instantly",
    color: "text-blue-500",
    bgColor: "bg-blue-500/20",
  },
  {
    icon: Users,
    title: "Play With Friends",
    description: "Create groups, organize matches, and build your football community",
    color: "text-green-500",
    bgColor: "bg-green-500/20",
  },
  {
    icon: Trophy,
    title: "Track Your Stats",
    description: "Build your player profile with FIFA-style cards, ratings, and achievements",
    color: "text-yellow-500",
    bgColor: "bg-yellow-500/20",
  },
]

const positions = ["GK", "DEF", "MID", "FWD"]
const skillLevels = ["Beginner", "Intermediate", "Advanced", "Pro"]

export function OnboardingScreen({ onComplete }: OnboardingScreenProps) {
  const [step, setStep] = useState<"intro" | "slides" | "signup" | "profile">("intro")
  const [currentSlide, setCurrentSlide] = useState(0)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [position, setPosition] = useState("")
  const [skillLevel, setSkillLevel] = useState("")

  const handleNextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(prev => prev + 1)
    } else {
      setStep("signup")
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {step === "intro" && (
        <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
          {/* Logo / Brand */}
          <div className="mb-8">
            <div className="w-24 h-24 bg-primary rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-lg shadow-primary/25">
              <Zap className="w-12 h-12 text-primary-foreground" />
            </div>
            <h1 className="text-4xl font-black tracking-tight">
              Footy<span className="text-primary">App</span>
            </h1>
            <p className="text-muted-foreground mt-2">Find. Book. Play.</p>
          </div>

          <div className="w-full max-w-xs space-y-4 mt-auto">
            <Button
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl"
              onClick={() => setStep("slides")}
            >
              Get Started
            </Button>
            <button
              className="text-muted-foreground text-sm hover:text-foreground transition-colors"
              onClick={onComplete}
            >
              Already have an account? Sign in
            </button>
          </div>
        </div>
      )}

      {step === "slides" && (
        <div className="flex-1 flex flex-col">
          {/* Skip Button */}
          <div className="p-4 flex justify-end">
            <button
              onClick={() => setStep("signup")}
              className="text-muted-foreground text-sm hover:text-foreground"
            >
              Skip
            </button>
          </div>

          {/* Slide Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <div className={cn(
              "w-24 h-24 rounded-full flex items-center justify-center mb-8",
              slides[currentSlide].bgColor
            )}>
              {(() => {
                const Icon = slides[currentSlide].icon
                return <Icon className={cn("w-12 h-12", slides[currentSlide].color)} />
              })()}
            </div>

            <h2 className="text-2xl font-bold mb-4">{slides[currentSlide].title}</h2>
            <p className="text-muted-foreground max-w-xs">
              {slides[currentSlide].description}
            </p>
          </div>

          {/* Pagination & Next */}
          <div className="p-8 space-y-6">
            {/* Dots */}
            <div className="flex items-center justify-center gap-2">
              {slides.map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    i === currentSlide ? "w-8 bg-primary" : "w-2 bg-secondary"
                  )}
                />
              ))}
            </div>

            <Button
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl"
              onClick={handleNextSlide}
            >
              {currentSlide === slides.length - 1 ? "Get Started" : "Next"}
              <ChevronRight className="w-5 h-5 ml-1" />
            </Button>
          </div>
        </div>
      )}

      {step === "signup" && (
        <div className="flex-1 flex flex-col p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Create Account</h1>
            <p className="text-muted-foreground">Join thousands of players</p>
          </div>

          <div className="space-y-4 flex-1">
            <div>
              <label className="text-sm font-medium mb-2 block">Name</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="h-12 bg-secondary border-none rounded-xl"
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="h-12 bg-secondary border-none rounded-xl"
              />
            </div>

            <div className="pt-4">
              <Button
                variant="outline"
                className="w-full h-12 rounded-xl border-border"
              >
                <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5 mr-2" />
                Continue with Google
              </Button>
            </div>
          </div>

          <div className="space-y-4 mt-auto pt-8">
            <Button
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl"
              onClick={() => setStep("profile")}
              disabled={!name || !email}
            >
              Continue
            </Button>
          </div>
        </div>
      )}

      {step === "profile" && (
        <div className="flex-1 flex flex-col p-6">
          <div className="mb-8">
            <h1 className="text-2xl font-bold mb-2">Build Your Profile</h1>
            <p className="text-muted-foreground">Tell us about your playing style</p>
          </div>

          <div className="space-y-6 flex-1">
            {/* Position */}
            <div>
              <label className="text-sm font-medium mb-3 block">Preferred Position</label>
              <div className="grid grid-cols-4 gap-2">
                {positions.map((pos) => (
                  <button
                    key={pos}
                    onClick={() => setPosition(pos)}
                    className={cn(
                      "py-3 rounded-xl text-sm font-medium transition-all",
                      position === pos
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    )}
                  >
                    {pos}
                  </button>
                ))}
              </div>
            </div>

            {/* Skill Level */}
            <div>
              <label className="text-sm font-medium mb-3 block">Skill Level</label>
              <div className="grid grid-cols-2 gap-2">
                {skillLevels.map((level) => (
                  <button
                    key={level}
                    onClick={() => setSkillLevel(level)}
                    className={cn(
                      "py-3 rounded-xl text-sm font-medium transition-all",
                      skillLevel === level
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                    )}
                  >
                    {level}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-auto pt-8">
            <Button
              className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl"
              onClick={onComplete}
              disabled={!position || !skillLevel}
            >
              Start Playing
            </Button>
            <button
              onClick={onComplete}
              className="w-full text-muted-foreground text-sm hover:text-foreground"
            >
              Skip for now
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
