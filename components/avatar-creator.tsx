"use client"

import { useState } from "react"
import { X, ChevronLeft, ChevronRight, Check, Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

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

interface AvatarCreatorProps {
  isOpen: boolean
  onClose: () => void
  onSave: (config: AvatarConfig) => void
  initialConfig?: Partial<AvatarConfig>
}

const skinTones = [
  { id: "light", color: "#FFE0BD", label: "Light" },
  { id: "fair", color: "#FFCD94", label: "Fair" },
  { id: "medium", color: "#EAB892", label: "Medium" },
  { id: "olive", color: "#C68642", label: "Olive" },
  { id: "tan", color: "#A57B5A", label: "Tan" },
  { id: "brown", color: "#8D5524", label: "Brown" },
  { id: "dark", color: "#5C3D2E", label: "Dark" },
]

const hairStyles = [
  { id: "short", label: "Short", icon: "✂️" },
  { id: "medium", label: "Medium", icon: "💇" },
  { id: "long", label: "Long", icon: "💇‍♀️" },
  { id: "curly", label: "Curly", icon: "〰️" },
  { id: "afro", label: "Afro", icon: "🌀" },
  { id: "bald", label: "Bald", icon: "🥚" },
  { id: "buzz", label: "Buzz Cut", icon: "⚡" },
  { id: "mohawk", label: "Mohawk", icon: "🦔" },
]

const hairColors = [
  { id: "black", color: "#090806", label: "Black" },
  { id: "brown", color: "#6A4E42", label: "Brown" },
  { id: "blonde", color: "#F4D03F", label: "Blonde" },
  { id: "red", color: "#B55239", label: "Red" },
  { id: "gray", color: "#9E9E9E", label: "Gray" },
  { id: "blue", color: "#2196F3", label: "Blue" },
  { id: "pink", color: "#E91E63", label: "Pink" },
  { id: "green", color: "#4CAF50", label: "Green" },
]

const eyeColors = [
  { id: "brown", color: "#6B4423", label: "Brown" },
  { id: "blue", color: "#4F93CE", label: "Blue" },
  { id: "green", color: "#56A040", label: "Green" },
  { id: "hazel", color: "#A0782C", label: "Hazel" },
  { id: "gray", color: "#8B8B8B", label: "Gray" },
]

const facialHairs = [
  { id: "none", label: "None", icon: "😊" },
  { id: "stubble", label: "Stubble", icon: "🧔‍♂️" },
  { id: "beard", label: "Beard", icon: "🧔" },
  { id: "goatee", label: "Goatee", icon: "🐐" },
  { id: "mustache", label: "Mustache", icon: "🥸" },
]

const accessories = [
  { id: "none", label: "None", icon: "❌" },
  { id: "glasses", label: "Glasses", icon: "👓" },
  { id: "sunglasses", label: "Sunglasses", icon: "🕶️" },
  { id: "headband", label: "Headband", icon: "🎽" },
  { id: "cap", label: "Cap", icon: "🧢" },
  { id: "beanie", label: "Beanie", icon: "🎿" },
]

const expressions = [
  { id: "neutral", label: "Neutral", emoji: "😐" },
  { id: "happy", label: "Happy", emoji: "😊" },
  { id: "confident", label: "Confident", emoji: "😎" },
  { id: "determined", label: "Determined", emoji: "😤" },
  { id: "chill", label: "Chill", emoji: "😌" },
  { id: "excited", label: "Excited", emoji: "🤩" },
]

const backgrounds = [
  { id: "green", color: "#4ade80", label: "Green" },
  { id: "blue", color: "#3b82f6", label: "Blue" },
  { id: "purple", color: "#a855f7", label: "Purple" },
  { id: "orange", color: "#f97316", label: "Orange" },
  { id: "red", color: "#ef4444", label: "Red" },
  { id: "gold", color: "#eab308", label: "Gold" },
  { id: "gradient1", color: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", label: "Gradient" },
  { id: "gradient2", color: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", label: "Sunset" },
]

const categories = [
  { id: "skin", label: "Skin" },
  { id: "hair", label: "Hair" },
  { id: "hairColor", label: "Hair Color" },
  { id: "eyes", label: "Eyes" },
  { id: "facial", label: "Facial Hair" },
  { id: "accessories", label: "Accessories" },
  { id: "expression", label: "Expression" },
  { id: "background", label: "Background" },
]

const defaultConfig: AvatarConfig = {
  skinTone: "medium",
  hairStyle: "short",
  hairColor: "brown",
  eyeColor: "brown",
  facialHair: "none",
  accessories: "none",
  expression: "happy",
  background: "green",
}

export function AvatarCreator({ isOpen, onClose, onSave, initialConfig }: AvatarCreatorProps) {
  const [config, setConfig] = useState<AvatarConfig>({ ...defaultConfig, ...initialConfig })
  const [activeCategory, setActiveCategory] = useState(0)

  const handleRandomize = () => {
    setConfig({
      skinTone: skinTones[Math.floor(Math.random() * skinTones.length)].id,
      hairStyle: hairStyles[Math.floor(Math.random() * hairStyles.length)].id,
      hairColor: hairColors[Math.floor(Math.random() * hairColors.length)].id,
      eyeColor: eyeColors[Math.floor(Math.random() * eyeColors.length)].id,
      facialHair: facialHairs[Math.floor(Math.random() * facialHairs.length)].id,
      accessories: accessories[Math.floor(Math.random() * accessories.length)].id,
      expression: expressions[Math.floor(Math.random() * expressions.length)].id,
      background: backgrounds[Math.floor(Math.random() * backgrounds.length)].id,
    })
  }

  const getSkinColor = () => skinTones.find(s => s.id === config.skinTone)?.color || skinTones[2].color
  const getHairColor = () => hairColors.find(h => h.id === config.hairColor)?.color || hairColors[1].color
  const getEyeColor = () => eyeColors.find(e => e.id === config.eyeColor)?.color || eyeColors[0].color
  const getBackground = () => backgrounds.find(b => b.id === config.background)?.color || backgrounds[0].color
  const getExpression = () => expressions.find(e => e.id === config.expression)?.emoji || "😊"

  const renderCategoryOptions = () => {
    const category = categories[activeCategory].id

    switch (category) {
      case "skin":
        return (
          <div className="grid grid-cols-7 gap-2">
            {skinTones.map((tone) => (
              <button
                key={tone.id}
                onClick={() => setConfig({ ...config, skinTone: tone.id })}
                className={cn(
                  "w-10 h-10 rounded-full transition-all",
                  config.skinTone === tone.id && "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                )}
                style={{ backgroundColor: tone.color }}
                title={tone.label}
              />
            ))}
          </div>
        )

      case "hair":
        return (
          <div className="grid grid-cols-4 gap-2">
            {hairStyles.map((style) => (
              <button
                key={style.id}
                onClick={() => setConfig({ ...config, hairStyle: style.id })}
                className={cn(
                  "p-3 rounded-xl bg-secondary text-center transition-all",
                  config.hairStyle === style.id && "ring-2 ring-primary bg-primary/20"
                )}
              >
                <span className="text-2xl block mb-1">{style.icon}</span>
                <span className="text-xs">{style.label}</span>
              </button>
            ))}
          </div>
        )

      case "hairColor":
        return (
          <div className="grid grid-cols-8 gap-2">
            {hairColors.map((color) => (
              <button
                key={color.id}
                onClick={() => setConfig({ ...config, hairColor: color.id })}
                className={cn(
                  "w-10 h-10 rounded-full transition-all",
                  config.hairColor === color.id && "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                )}
                style={{ backgroundColor: color.color }}
                title={color.label}
              />
            ))}
          </div>
        )

      case "eyes":
        return (
          <div className="grid grid-cols-5 gap-2">
            {eyeColors.map((color) => (
              <button
                key={color.id}
                onClick={() => setConfig({ ...config, eyeColor: color.id })}
                className={cn(
                  "w-12 h-12 rounded-full transition-all flex items-center justify-center",
                  config.eyeColor === color.id && "ring-2 ring-primary ring-offset-2 ring-offset-background scale-110"
                )}
                style={{ backgroundColor: color.color }}
              >
                <div className="w-4 h-4 bg-black rounded-full" />
              </button>
            ))}
          </div>
        )

      case "facial":
        return (
          <div className="grid grid-cols-5 gap-2">
            {facialHairs.map((facial) => (
              <button
                key={facial.id}
                onClick={() => setConfig({ ...config, facialHair: facial.id })}
                className={cn(
                  "p-3 rounded-xl bg-secondary text-center transition-all",
                  config.facialHair === facial.id && "ring-2 ring-primary bg-primary/20"
                )}
              >
                <span className="text-2xl">{facial.icon}</span>
              </button>
            ))}
          </div>
        )

      case "accessories":
        return (
          <div className="grid grid-cols-3 gap-2">
            {accessories.map((acc) => (
              <button
                key={acc.id}
                onClick={() => setConfig({ ...config, accessories: acc.id })}
                className={cn(
                  "p-3 rounded-xl bg-secondary text-center transition-all",
                  config.accessories === acc.id && "ring-2 ring-primary bg-primary/20"
                )}
              >
                <span className="text-2xl block mb-1">{acc.icon}</span>
                <span className="text-xs">{acc.label}</span>
              </button>
            ))}
          </div>
        )

      case "expression":
        return (
          <div className="grid grid-cols-3 gap-2">
            {expressions.map((exp) => (
              <button
                key={exp.id}
                onClick={() => setConfig({ ...config, expression: exp.id })}
                className={cn(
                  "p-3 rounded-xl bg-secondary text-center transition-all",
                  config.expression === exp.id && "ring-2 ring-primary bg-primary/20"
                )}
              >
                <span className="text-3xl block mb-1">{exp.emoji}</span>
                <span className="text-xs">{exp.label}</span>
              </button>
            ))}
          </div>
        )

      case "background":
        return (
          <div className="grid grid-cols-4 gap-2">
            {backgrounds.map((bg) => (
              <button
                key={bg.id}
                onClick={() => setConfig({ ...config, background: bg.id })}
                className={cn(
                  "w-full aspect-square rounded-xl transition-all",
                  config.background === bg.id && "ring-2 ring-primary ring-offset-2 ring-offset-background scale-105"
                )}
                style={{ background: bg.color }}
              />
            ))}
          </div>
        )

      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <Card className="relative w-full max-w-md mx-4 bg-card border-none rounded-3xl overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold">Create Your Avatar</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Avatar Preview */}
        <div className="p-6 flex justify-center">
          <div 
            className="relative w-32 h-32 rounded-full overflow-hidden shadow-xl"
            style={{ background: getBackground() }}
          >
            {/* Face */}
            <div 
              className="absolute inset-4 rounded-full"
              style={{ backgroundColor: getSkinColor() }}
            >
              {/* Eyes */}
              <div className="absolute top-[35%] left-[25%] w-4 h-4 rounded-full bg-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getEyeColor() }} />
              </div>
              <div className="absolute top-[35%] right-[25%] w-4 h-4 rounded-full bg-white flex items-center justify-center">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: getEyeColor() }} />
              </div>
              
              {/* Hair indicator */}
              {config.hairStyle !== "bald" && (
                <div 
                  className="absolute -top-2 left-1/2 -translate-x-1/2 w-20 h-8 rounded-t-full"
                  style={{ backgroundColor: getHairColor() }}
                />
              )}

              {/* Expression */}
              <div className="absolute bottom-[25%] left-1/2 -translate-x-1/2 text-2xl">
                {config.expression === "happy" && "◡"}
                {config.expression === "confident" && "◡"}
                {config.expression === "neutral" && "—"}
                {config.expression === "determined" && "⌓"}
                {config.expression === "chill" && "◡"}
                {config.expression === "excited" && "○"}
              </div>
            </div>

            {/* Accessories overlay */}
            {config.accessories === "glasses" && (
              <div className="absolute top-[38%] left-1/2 -translate-x-1/2 text-xl">👓</div>
            )}
            {config.accessories === "sunglasses" && (
              <div className="absolute top-[38%] left-1/2 -translate-x-1/2 text-xl">🕶️</div>
            )}
            {config.accessories === "cap" && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 text-3xl -rotate-12">🧢</div>
            )}

            {/* Expression emoji overlay */}
            <div className="absolute bottom-2 right-2 text-2xl">{getExpression()}</div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="px-4 flex items-center gap-2">
          <button
            onClick={() => setActiveCategory(Math.max(0, activeCategory - 1))}
            disabled={activeCategory === 0}
            className="p-2 rounded-full bg-secondary disabled:opacity-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <div className="flex-1 text-center">
            <span className="text-sm text-muted-foreground">
              {activeCategory + 1} / {categories.length}
            </span>
            <p className="font-semibold">{categories[activeCategory].label}</p>
          </div>
          <button
            onClick={() => setActiveCategory(Math.min(categories.length - 1, activeCategory + 1))}
            disabled={activeCategory === categories.length - 1}
            className="p-2 rounded-full bg-secondary disabled:opacity-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        {/* Options */}
        <div className="p-4 min-h-[140px]">
          {renderCategoryOptions()}
        </div>

        {/* Actions */}
        <div className="p-4 flex gap-3 border-t border-border">
          <Button
            variant="outline"
            onClick={handleRandomize}
            className="flex-1 rounded-xl"
          >
            <Shuffle className="w-4 h-4 mr-2" />
            Randomize
          </Button>
          <Button
            onClick={() => onSave(config)}
            className="flex-1 rounded-xl bg-primary"
          >
            <Check className="w-4 h-4 mr-2" />
            Save Avatar
          </Button>
        </div>
      </Card>
    </div>
  )
}
