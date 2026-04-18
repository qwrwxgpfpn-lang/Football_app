-- Footy App Database Schema
-- Version 1.0.0

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- USERS & PROFILES
-- ============================================

-- User profiles (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  full_name TEXT NOT NULL,
  avatar_url TEXT,
  avatar_config JSONB DEFAULT '{}', -- Stores customizable avatar/emoji configuration
  position TEXT CHECK (position IN ('GK', 'DEF', 'MID', 'FWD', 'ANY')) DEFAULT 'ANY',
  preferred_foot TEXT CHECK (preferred_foot IN ('Left', 'Right', 'Both')) DEFAULT 'Right',
  skill_level TEXT CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced', 'Pro')) DEFAULT 'Intermediate',
  overall_rating INTEGER DEFAULT 50 CHECK (overall_rating >= 0 AND overall_rating <= 99),
  xp INTEGER DEFAULT 0,
  level TEXT DEFAULT 'Rookie',
  bio TEXT,
  location TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player stats (FIFA-style attributes)
CREATE TABLE IF NOT EXISTS player_stats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  pace INTEGER DEFAULT 50 CHECK (pace >= 0 AND pace <= 99),
  shooting INTEGER DEFAULT 50 CHECK (shooting >= 0 AND shooting <= 99),
  passing INTEGER DEFAULT 50 CHECK (passing >= 0 AND passing <= 99),
  dribbling INTEGER DEFAULT 50 CHECK (dribbling >= 0 AND dribbling <= 99),
  defending INTEGER DEFAULT 50 CHECK (defending >= 0 AND defending <= 99),
  physical INTEGER DEFAULT 50 CHECK (physical >= 0 AND physical <= 99),
  games_played INTEGER DEFAULT 0,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  clean_sheets INTEGER DEFAULT 0,
  mvp_awards INTEGER DEFAULT 0,
  win_rate DECIMAL(5,2) DEFAULT 0,
  avg_rating DECIMAL(3,1) DEFAULT 5.0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User badges/achievements
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT NOT NULL,
  category TEXT CHECK (category IN ('Goals', 'Games', 'Social', 'Special', 'Streak')) DEFAULT 'Special',
  requirement_type TEXT NOT NULL, -- e.g., 'goals_scored', 'games_played'
  requirement_value INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS user_badges (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  badge_id UUID REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(profile_id, badge_id)
);

-- ============================================
-- VENUES
-- ============================================

CREATE TABLE IF NOT EXISTS venues (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  postcode TEXT,
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  image_url TEXT,
  facilities TEXT[] DEFAULT '{}', -- ['Changing Rooms', 'Parking', 'Floodlights']
  pitch_types TEXT[] DEFAULT '{}', -- ['5-a-side', '7-a-side', '11-a-side']
  rating DECIMAL(2,1) DEFAULT 4.0,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- GAMES
-- ============================================

CREATE TABLE IF NOT EXISTS games (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  venue_id UUID REFERENCES venues(id) ON DELETE SET NULL,
  organizer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  title TEXT,
  description TEXT,
  game_type TEXT CHECK (game_type IN ('5-a-side', '7-a-side', '11-a-side')) NOT NULL,
  skill_level TEXT CHECK (skill_level IN ('Beginner', 'Intermediate', 'Advanced', 'All levels')) DEFAULT 'All levels',
  date DATE NOT NULL,
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  price_per_person DECIMAL(6,2) NOT NULL,
  booking_fee DECIMAL(6,2) DEFAULT 0.50,
  total_slots INTEGER NOT NULL,
  filled_slots INTEGER DEFAULT 0,
  status TEXT CHECK (status IN ('upcoming', 'in_progress', 'completed', 'cancelled')) DEFAULT 'upcoming',
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game participants (bookings)
CREATE TABLE IF NOT EXISTS game_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  team TEXT CHECK (team IN ('A', 'B', 'Unassigned')) DEFAULT 'Unassigned',
  position TEXT CHECK (position IN ('GK', 'DEF', 'MID', 'FWD', 'ANY')),
  status TEXT CHECK (status IN ('confirmed', 'pending', 'cancelled')) DEFAULT 'pending',
  payment_status TEXT CHECK (payment_status IN ('paid', 'pending', 'refunded')) DEFAULT 'pending',
  stripe_payment_intent_id TEXT,
  amount_paid DECIMAL(6,2),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, profile_id)
);

-- ============================================
-- HYPE ROOM (Pre-Game Chat & Predictions)
-- ============================================

CREATE TABLE IF NOT EXISTS game_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  message_type TEXT CHECK (message_type IN ('chat', 'prediction', 'system')) DEFAULT 'chat',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Game predictions
CREATE TABLE IF NOT EXISTS game_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  team_a_score INTEGER NOT NULL CHECK (team_a_score >= 0),
  team_b_score INTEGER NOT NULL CHECK (team_b_score >= 0),
  first_scorer_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  mvp_prediction_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, profile_id)
);

-- Message reactions
CREATE TABLE IF NOT EXISTS message_reactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  message_id UUID REFERENCES game_messages(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  reaction TEXT NOT NULL, -- 'fire', 'thumbsup', 'heart', 'trophy', 'zap'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(message_id, profile_id, reaction)
);

-- ============================================
-- POST-GAME
-- ============================================

CREATE TABLE IF NOT EXISTS game_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE UNIQUE,
  team_a_score INTEGER NOT NULL DEFAULT 0,
  team_b_score INTEGER NOT NULL DEFAULT 0,
  mvp_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  highlights_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Player ratings (post-game)
CREATE TABLE IF NOT EXISTS player_ratings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id UUID REFERENCES games(id) ON DELETE CASCADE,
  rater_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rated_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 10),
  goals_scored INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(game_id, rater_id, rated_id)
);

-- ============================================
-- GROUPS
-- ============================================

CREATE TABLE IF NOT EXISTS groups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  is_private BOOLEAN DEFAULT false,
  created_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS group_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('admin', 'member')) DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(group_id, profile_id)
);

CREATE TABLE IF NOT EXISTS group_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  group_id UUID REFERENCES groups(id) ON DELETE CASCADE,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- PAYMENTS
-- ============================================

CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  game_id UUID REFERENCES games(id) ON DELETE SET NULL,
  stripe_payment_intent_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  amount DECIMAL(10,2) NOT NULL,
  booking_fee DECIMAL(6,2) DEFAULT 0.50,
  currency TEXT DEFAULT 'gbp',
  status TEXT CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded')) DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_games_date ON games(date);
CREATE INDEX IF NOT EXISTS idx_games_status ON games(status);
CREATE INDEX IF NOT EXISTS idx_games_venue ON games(venue_id);
CREATE INDEX IF NOT EXISTS idx_game_participants_game ON game_participants(game_id);
CREATE INDEX IF NOT EXISTS idx_game_participants_profile ON game_participants(profile_id);
CREATE INDEX IF NOT EXISTS idx_game_messages_game ON game_messages(game_id);
CREATE INDEX IF NOT EXISTS idx_game_predictions_game ON game_predictions(game_id);
CREATE INDEX IF NOT EXISTS idx_player_ratings_game ON player_ratings(game_id);
CREATE INDEX IF NOT EXISTS idx_group_members_group ON group_members(group_id);
CREATE INDEX IF NOT EXISTS idx_payments_profile ON payments(profile_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_stats ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE venues ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_results ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_ratings ENABLE ROW LEVEL SECURITY;
ALTER TABLE groups ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE group_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Profiles: Users can read all profiles, but only update their own
CREATE POLICY "Profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Player stats: Same as profiles
CREATE POLICY "Player stats are viewable by everyone" ON player_stats FOR SELECT USING (true);
CREATE POLICY "Users can update own stats" ON player_stats FOR UPDATE USING (auth.uid() = profile_id);
CREATE POLICY "Users can insert own stats" ON player_stats FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Badges: Viewable by everyone
CREATE POLICY "Badges are viewable by everyone" ON badges FOR SELECT USING (true);
CREATE POLICY "User badges are viewable by everyone" ON user_badges FOR SELECT USING (true);

-- Venues: Viewable by everyone
CREATE POLICY "Venues are viewable by everyone" ON venues FOR SELECT USING (true);

-- Games: Viewable by everyone, organizers can update their own
CREATE POLICY "Games are viewable by everyone" ON games FOR SELECT USING (true);
CREATE POLICY "Organizers can update their games" ON games FOR UPDATE USING (auth.uid() = organizer_id);
CREATE POLICY "Authenticated users can create games" ON games FOR INSERT WITH CHECK (auth.uid() = organizer_id);

-- Game participants: Viewable by game participants
CREATE POLICY "Game participants viewable by participants" ON game_participants FOR SELECT USING (true);
CREATE POLICY "Users can join games" ON game_participants FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own participation" ON game_participants FOR UPDATE USING (auth.uid() = profile_id);

-- Game messages: Viewable by game participants
CREATE POLICY "Game messages viewable by everyone" ON game_messages FOR SELECT USING (true);
CREATE POLICY "Authenticated users can send messages" ON game_messages FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Predictions: Users can create their own
CREATE POLICY "Predictions viewable by everyone" ON game_predictions FOR SELECT USING (true);
CREATE POLICY "Users can create own predictions" ON game_predictions FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can update own predictions" ON game_predictions FOR UPDATE USING (auth.uid() = profile_id);

-- Reactions: Users can manage their own
CREATE POLICY "Reactions viewable by everyone" ON message_reactions FOR SELECT USING (true);
CREATE POLICY "Users can create reactions" ON message_reactions FOR INSERT WITH CHECK (auth.uid() = profile_id);
CREATE POLICY "Users can delete own reactions" ON message_reactions FOR DELETE USING (auth.uid() = profile_id);

-- Game results: Viewable by everyone
CREATE POLICY "Game results viewable by everyone" ON game_results FOR SELECT USING (true);

-- Player ratings: Viewable by participants
CREATE POLICY "Player ratings viewable by everyone" ON player_ratings FOR SELECT USING (true);
CREATE POLICY "Users can rate others" ON player_ratings FOR INSERT WITH CHECK (auth.uid() = rater_id);

-- Groups: Viewable based on privacy
CREATE POLICY "Public groups viewable by everyone" ON groups FOR SELECT USING (is_private = false OR id IN (SELECT group_id FROM group_members WHERE profile_id = auth.uid()));
CREATE POLICY "Authenticated users can create groups" ON groups FOR INSERT WITH CHECK (auth.uid() = created_by);

-- Group members: Viewable by members
CREATE POLICY "Group members viewable by members" ON group_members FOR SELECT USING (true);
CREATE POLICY "Users can join public groups" ON group_members FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Group messages: Viewable by members
CREATE POLICY "Group messages viewable by members" ON group_messages FOR SELECT USING (group_id IN (SELECT group_id FROM group_members WHERE profile_id = auth.uid()));
CREATE POLICY "Members can send messages" ON group_messages FOR INSERT WITH CHECK (auth.uid() = profile_id AND group_id IN (SELECT group_id FROM group_members WHERE profile_id = auth.uid()));

-- Payments: Users can only see their own
CREATE POLICY "Users can view own payments" ON payments FOR SELECT USING (auth.uid() = profile_id);

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_games_updated_at
  BEFORE UPDATE ON games
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Function to update filled_slots when participant joins
CREATE OR REPLACE FUNCTION update_filled_slots()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' AND NEW.status = 'confirmed' THEN
    UPDATE games SET filled_slots = filled_slots + 1 WHERE id = NEW.game_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status != 'confirmed' AND NEW.status = 'confirmed' THEN
    UPDATE games SET filled_slots = filled_slots + 1 WHERE id = NEW.game_id;
  ELSIF TG_OP = 'UPDATE' AND OLD.status = 'confirmed' AND NEW.status != 'confirmed' THEN
    UPDATE games SET filled_slots = filled_slots - 1 WHERE id = NEW.game_id;
  ELSIF TG_OP = 'DELETE' AND OLD.status = 'confirmed' THEN
    UPDATE games SET filled_slots = filled_slots - 1 WHERE id = OLD.game_id;
  END IF;
  RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_filled_slots
  AFTER INSERT OR UPDATE OR DELETE ON game_participants
  FOR EACH ROW EXECUTE FUNCTION update_filled_slots();

-- Auto-create player_stats when profile is created
CREATE OR REPLACE FUNCTION create_player_stats()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO player_stats (profile_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_create_player_stats
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_player_stats();
