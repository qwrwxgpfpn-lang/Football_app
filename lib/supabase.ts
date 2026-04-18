import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Profile {
  id: string
  username: string
  full_name: string
  avatar_url: string | null
  avatar_config: AvatarConfig
  position: 'GK' | 'DEF' | 'MID' | 'FWD' | 'ANY'
  preferred_foot: 'Left' | 'Right' | 'Both'
  skill_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Pro'
  overall_rating: number
  xp: number
  level: string
  bio: string | null
  location: string | null
  created_at: string
  updated_at: string
}

export interface AvatarConfig {
  skinTone?: string
  hairStyle?: string
  hairColor?: string
  eyeColor?: string
  facialHair?: string
  accessories?: string
  expression?: string
  background?: string
}

export interface PlayerStats {
  id: string
  profile_id: string
  pace: number
  shooting: number
  passing: number
  dribbling: number
  defending: number
  physical: number
  games_played: number
  goals: number
  assists: number
  clean_sheets: number
  mvp_awards: number
  win_rate: number
  avg_rating: number
  updated_at: string
}

export interface Venue {
  id: string
  name: string
  address: string
  city: string
  postcode: string | null
  latitude: number | null
  longitude: number | null
  image_url: string | null
  facilities: string[]
  pitch_types: string[]
  rating: number
  is_active: boolean
  created_at: string
}

export interface Game {
  id: string
  venue_id: string | null
  organizer_id: string | null
  title: string | null
  description: string | null
  game_type: '5-a-side' | '7-a-side' | '11-a-side'
  skill_level: 'Beginner' | 'Intermediate' | 'Advanced' | 'All levels'
  date: string
  start_time: string
  end_time: string
  price_per_person: number
  booking_fee: number
  total_slots: number
  filled_slots: number
  status: 'upcoming' | 'in_progress' | 'completed' | 'cancelled'
  is_public: boolean
  created_at: string
  updated_at: string
  venue?: Venue
  organizer?: Profile
}

export interface GameParticipant {
  id: string
  game_id: string
  profile_id: string
  team: 'A' | 'B' | 'Unassigned'
  position: 'GK' | 'DEF' | 'MID' | 'FWD' | 'ANY' | null
  status: 'confirmed' | 'pending' | 'cancelled'
  payment_status: 'paid' | 'pending' | 'refunded'
  stripe_payment_intent_id: string | null
  amount_paid: number | null
  joined_at: string
  profile?: Profile
}

export interface GameMessage {
  id: string
  game_id: string
  profile_id: string | null
  message: string
  message_type: 'chat' | 'prediction' | 'system'
  created_at: string
  profile?: Profile
}

export interface GamePrediction {
  id: string
  game_id: string
  profile_id: string
  team_a_score: number
  team_b_score: number
  first_scorer_id: string | null
  mvp_prediction_id: string | null
  created_at: string
  profile?: Profile
}

export interface Payment {
  id: string
  profile_id: string | null
  game_id: string | null
  stripe_payment_intent_id: string | null
  stripe_customer_id: string | null
  amount: number
  booking_fee: number
  currency: string
  status: 'pending' | 'succeeded' | 'failed' | 'refunded'
  created_at: string
  updated_at: string
}
