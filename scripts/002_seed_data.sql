-- Footy App Seed Data
-- Version 1.0.0

-- ============================================
-- BADGES
-- ============================================

INSERT INTO badges (name, description, icon, category, requirement_type, requirement_value) VALUES
  ('First Goal', 'Score your first goal', 'Target', 'Goals', 'goals_scored', 1),
  ('Hat Trick Hero', 'Score a hat trick in a single game', 'Flame', 'Goals', 'goals_in_game', 3),
  ('Prolific Scorer', 'Score 50 goals total', 'Flame', 'Goals', 'goals_scored', 50),
  ('Golden Boot', 'Score 100 goals total', 'Trophy', 'Goals', 'goals_scored', 100),
  ('Clean Sheet', 'Keep a clean sheet as goalkeeper', 'Shield', 'Goals', 'clean_sheets', 1),
  ('Wall of Steel', 'Keep 10 clean sheets', 'Shield', 'Goals', 'clean_sheets', 10),
  ('Playmaker', 'Get 25 assists', 'Zap', 'Goals', 'assists', 25),
  ('First Game', 'Play your first game', 'Star', 'Games', 'games_played', 1),
  ('Regular', 'Play 10 games', 'Star', 'Games', 'games_played', 10),
  ('Veteran', 'Play 50 games', 'Medal', 'Games', 'games_played', 50),
  ('Legend', 'Play 100 games', 'Crown', 'Games', 'games_played', 100),
  ('Social Butterfly', 'Join 5 different groups', 'Users', 'Social', 'groups_joined', 5),
  ('Team Player', 'Play with 50 different players', 'Users', 'Social', 'unique_teammates', 50),
  ('MVP', 'Win MVP award', 'Star', 'Special', 'mvp_awards', 1),
  ('MVP Machine', 'Win 10 MVP awards', 'Star', 'Special', 'mvp_awards', 10),
  ('Hot Streak', 'Win 5 games in a row', 'Flame', 'Streak', 'win_streak', 5),
  ('Speed Demon', 'Achieve 90+ pace rating', 'Zap', 'Special', 'stat_pace', 90)
ON CONFLICT DO NOTHING;

-- ============================================
-- VENUES
-- ============================================

INSERT INTO venues (name, address, city, postcode, latitude, longitude, image_url, facilities, pitch_types, rating) VALUES
  (
    'Powerleague Shoreditch',
    '123 Old Street',
    'London',
    'EC1V 9NR',
    51.5255,
    -0.0855,
    'https://images.unsplash.com/photo-1529900748604-07564a03e7a6?w=800&h=400&fit=crop',
    ARRAY['Changing Rooms', 'Parking', 'Floodlights', 'Water Available'],
    ARRAY['5-a-side', '7-a-side'],
    4.8
  ),
  (
    'Goals London',
    '45 Commercial Road',
    'London',
    'E1 1LA',
    51.5135,
    -0.0675,
    'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=800&h=400&fit=crop',
    ARRAY['Changing Rooms', 'Parking', 'Floodlights', 'Cafe', 'Bar'],
    ARRAY['5-a-side', '7-a-side', '11-a-side'],
    4.6
  ),
  (
    'The Cage Hackney',
    '78 Mare Street',
    'London',
    'E8 3QE',
    51.5455,
    -0.0555,
    'https://images.unsplash.com/photo-1459865264687-595d652de67e?w=800&h=400&fit=crop',
    ARRAY['Changing Rooms', 'Floodlights'],
    ARRAY['5-a-side'],
    4.5
  ),
  (
    'Victoria Park Pitch',
    'Victoria Park',
    'London',
    'E9 7BT',
    51.5365,
    -0.0385,
    'https://images.unsplash.com/photo-1551958219-acbc608c6377?w=800&h=400&fit=crop',
    ARRAY['Open Air', 'Free Parking'],
    ARRAY['11-a-side'],
    4.3
  ),
  (
    'Hackney Marshes',
    'Hackney Marshes',
    'London',
    'E9 5PF',
    51.5505,
    -0.0255,
    'https://images.unsplash.com/photo-1518604666860-9ed391f76460?w=800&h=400&fit=crop',
    ARRAY['Open Air', 'Multiple Pitches', 'Free'],
    ARRAY['11-a-side'],
    4.4
  ),
  (
    'Wembley Powerleague',
    'Empire Way',
    'London',
    'HA9 0WS',
    51.5560,
    -0.2795,
    'https://images.unsplash.com/photo-1522778119026-d647f0596c20?w=800&h=400&fit=crop',
    ARRAY['Changing Rooms', 'Parking', 'Floodlights', 'Pro Pitches', 'Cafe'],
    ARRAY['5-a-side', '7-a-side'],
    4.9
  )
ON CONFLICT DO NOTHING;
