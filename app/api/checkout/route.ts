import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-12-18.acacia',
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { gameId, gameTitle, venue, date, time, pricePerPerson, bookingFee, playerName, playerEmail } = body

    // Calculate total in pence (Stripe uses smallest currency unit)
    const gamePricePence = Math.round(pricePerPerson * 100)
    const bookingFeePence = Math.round(bookingFee * 100)
    const totalPence = gamePricePence + bookingFeePence

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: `Game Booking: ${gameTitle || 'Football Game'}`,
              description: `${venue} - ${date} at ${time}`,
              images: ['https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=400&h=200&fit=crop'],
            },
            unit_amount: gamePricePence,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: 'gbp',
            product_data: {
              name: 'Booking Fee',
              description: 'Platform booking fee',
            },
            unit_amount: bookingFeePence,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?payment=success&gameId=${gameId}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}?payment=cancelled&gameId=${gameId}`,
      customer_email: playerEmail,
      metadata: {
        gameId,
        playerName,
        pricePerPerson: pricePerPerson.toString(),
        bookingFee: bookingFee.toString(),
      },
    })

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    })
  } catch (error) {
    console.error('Stripe checkout error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}
