-- Safe migration script - handles existing tables
-- Run this in Supabase SQL Editor

-- 1. Create missing tables only
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS children (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE,
  gender TEXT CHECK (gender IN ('male', 'female')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  prep_time INTEGER NOT NULL DEFAULT 15,
  cook_time INTEGER NOT NULL DEFAULT 30,
  servings INTEGER NOT NULL DEFAULT 1,
  age_min INTEGER NOT NULL DEFAULT 6,
  age_max INTEGER NOT NULL DEFAULT 144,
  meal_types TEXT[] DEFAULT ARRAY['lunch', 'dinner'],
  difficulty TEXT DEFAULT 'easy' CHECK (difficulty IN ('easy', 'medium', 'hard')),
  tags TEXT[] DEFAULT '{}',
  nutrition_info JSONB,
  instructions TEXT[] DEFAULT '{}',
  author_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  rating DECIMAL(3,2) DEFAULT 0.00,
  review_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Add missing columns to existing tables (if needed)
DO $$
BEGIN
  -- Add author_id to educational_content if not exists
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                 WHERE table_name = 'educational_content' AND column_name = 'author_id') THEN
    ALTER TABLE educational_content ADD COLUMN author_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL;
  END IF;
  
  -- Add other missing columns as needed...
END $$;

-- 3. Create indexes
CREATE INDEX IF NOT EXISTS idx_recipes_author ON recipes(author_id);
CREATE INDEX IF NOT EXISTS idx_educational_content_author ON educational_content(author_id);

-- 4. Enable RLS
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;

-- 5. Create basic policies
CREATE POLICY IF NOT EXISTS "Public recipes are viewable by everyone" ON recipes
  FOR SELECT USING (true);
  
CREATE POLICY IF NOT EXISTS "Public educational content is viewable by everyone" ON educational_content
  FOR SELECT USING (true);
