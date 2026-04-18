"use client"

import { useState } from "react"
import { X, CreditCard, Shield, Clock, MapPin, Check, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { loadStripe } from "@stripe/stripe-js"

interface PaymentModalProps {
  isOpen: boolean
  onClose: () => void
  gameData: {
    id: string | number
    venue: string
    address: string
    date: string
    time: string
    price: number
    bookingFee?: number
    type: string
  }
  onSuccess?: () => void
}

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export function PaymentModal({ isOpen, onClose, gameData, onSuccess }: PaymentModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState<"summary" | "processing" | "success">("summary")

  const bookingFee = gameData.bookingFee ?? 0.50
  const totalPrice = gameData.price + bookingFee

  const handlePayment = async () => {
    setIsLoading(true)
    setStep("processing")

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          gameId: gameData.id,
          gameTitle: `${gameData.type} at ${gameData.venue}`,
          venue: gameData.venue,
          date: gameData.date,
          time: gameData.time,
          pricePerPerson: gameData.price,
          bookingFee: bookingFee,
          playerName: "Player", // In real app, get from user context
          playerEmail: "player@example.com", // In real app, get from user context
        }),
      })

      const data = await response.json()

      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url
      } else if (data.sessionId) {
        const stripe = await stripePromise
        if (stripe) {
          const { error } = await stripe.redirectToCheckout({
            sessionId: data.sessionId,
          })
          if (error) {
            console.error("Stripe redirect error:", error)
            setStep("summary")
          }
        }
      }
    } catch (error) {
      console.error("Payment error:", error)
      setStep("summary")
    } finally {
      setIsLoading(false)
    }
  }

  // Demo mode - simulate payment success
  const handleDemoPayment = () => {
    setIsLoading(true)
    setStep("processing")
    
    setTimeout(() => {
      setStep("success")
      setIsLoading(false)
      setTimeout(() => {
        onSuccess?.()
        onClose()
      }, 2000)
    }, 2000)
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <Card className="relative w-full max-w-md mx-4 mb-4 sm:mb-0 bg-card border-none rounded-3xl overflow-hidden animate-in slide-in-from-bottom duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-bold">
            {step === "success" ? "Booking Confirmed!" : "Complete Booking"}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-full hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {step === "summary" && (
          <>
            {/* Game Summary */}
            <div className="p-4 space-y-4">
              <div className="bg-secondary/50 rounded-2xl p-4 space-y-3">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-primary/20 rounded-xl">
                    <MapPin className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{gameData.venue}</p>
                    <p className="text-sm text-muted-foreground">{gameData.address}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/20 rounded-xl">
                    <Clock className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{gameData.date}</p>
                    <p className="text-sm text-muted-foreground">{gameData.time}</p>
                  </div>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm text-muted-foreground">PRICE BREAKDOWN</h3>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-foreground">Game fee ({gameData.type})</span>
                    <span className="font-medium">£{gameData.price.toFixed(2)}</span>
                  </div>
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Booking fee</span>
                    <span>£{bookingFee.toFixed(2)}</span>
                  </div>
                  <div className="h-px bg-border my-2" />
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-lg">Total</span>
                    <span className="font-bold text-lg text-primary">£{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Security Note */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground bg-secondary/30 rounded-xl p-3">
                <Shield className="w-4 h-4 text-primary" />
                <span>Secure payment powered by Stripe. Your card details are encrypted.</span>
              </div>
            </div>

            {/* Actions */}
            <div className="p-4 space-y-3 border-t border-border">
              <Button 
                onClick={handleDemoPayment}
                disabled={isLoading}
                className="w-full h-14 text-lg font-semibold bg-primary hover:bg-primary/90 rounded-2xl"
              >
                <CreditCard className="w-5 h-5 mr-2" />
                Pay £{totalPrice.toFixed(2)}
              </Button>
              <p className="text-center text-xs text-muted-foreground">
                By booking, you agree to our terms and cancellation policy
              </p>
            </div>
          </>
        )}

        {step === "processing" && (
          <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Processing Payment</h3>
            <p className="text-sm text-muted-foreground text-center">
              Please wait while we secure your spot...
            </p>
          </div>
        )}

        {step === "success" && (
          <div className="p-8 flex flex-col items-center justify-center min-h-[300px]">
            <div className="w-20 h-20 bg-primary rounded-full flex items-center justify-center mb-4 animate-in zoom-in duration-300">
              <Check className="w-10 h-10 text-primary-foreground" />
            </div>
            <h3 className="text-xl font-bold mb-2">You&apos;re In!</h3>
            <p className="text-sm text-muted-foreground text-center mb-4">
              Your spot at {gameData.venue} is confirmed.
            </p>
            <div className="bg-secondary/50 rounded-xl p-4 text-center w-full">
              <p className="text-sm text-muted-foreground">Game starts</p>
              <p className="font-bold text-lg">{gameData.date} at {gameData.time}</p>
            </div>
          </div>
        )}
      </Card>
    </div>
  )
}
