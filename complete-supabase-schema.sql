-- ===========================================
-- COMPLETE SUPABASE DATABASE SCHEMA
-- Parenting Meal Planner Application
-- ===========================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ===========================================
-- 1. USERS & AUTHENTICATION
-- ===========================================

-- User profiles table (extends Supabase auth.users)
CREATE TABLE IF NOT EXISTS user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  email TEXT NOT NULL,
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User preferences
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  meal_plan_duration INTEGER DEFAULT 7 CHECK (meal_plan_duration IN (3, 7, 30)),
  preferred_meal_types TEXT[] DEFAULT ARRAY['breakfast', 'lunch', 'dinner', 'snack'],
  dietary_restrictions JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- ===========================================
-- 2. CHILDREN MANAGEMENT
-- ===========================================

CREATE TABLE IF NOT EXISTS children (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  birth_date DATE NOT NULL,
  age_months INTEGER DEFAULT 0, -- Will be calculated by application
  weight_kg DECIMAL(5,2),
  allergies TEXT[] DEFAULT '{}',
  dietary_preferences JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- 3. EDUCATIONAL CONTENT
-- ===========================================

CREATE TABLE IF NOT EXISTS educational_content (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  category TEXT NOT NULL,
  age_range JSONB NOT NULL DEFAULT '{"min": 0, "max": 144}',
  tags TEXT[] DEFAULT '{}',
  read_time INTEGER DEFAULT 5,
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  author_id UUID REFERENCES user_profiles(id) ON DELETE SET NULL,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Content interactions (likes, bookmarks)
CREATE TABLE IF NOT EXISTS content_interactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  content_id UUID REFERENCES educational_content(id) ON DELETE CASCADE,
  interaction_type TEXT NOT NULL CHECK (interaction_type IN ('like', 'bookmark', 'share')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, content_id, interaction_type)
);

-- ===========================================
-- 4. RECIPES & INGREDIENTS
-- ===========================================

CREATE TABLE IF NOT EXISTS recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  prep_time INTEGER NOT NULL, -- in minutes
  cook_time INTEGER NOT NULL, -- in minutes
  servings INTEGER NOT NULL DEFAULT 1,
  age_min INTEGER NOT NULL DEFAULT 6, -- minimum age in months
  age_max INTEGER NOT NULL DEFAULT 144, -- maximum age in months
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

-- Ingredients table
CREATE TABLE IF NOT EXISTS ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('protein', 'vegetables', 'fruits', 'grains', 'dairy', 'spices', 'oils', 'others')),
  unit TEXT DEFAULT 'gram',
  is_common BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Recipe ingredients (junction table)
CREATE TABLE IF NOT EXISTS recipe_ingredients (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  amount DECIMAL(8,2) NOT NULL,
  unit TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(recipe_id, ingredient_id)
);

-- ===========================================
-- 5. MEAL PLANNING
-- ===========================================

CREATE TABLE IF NOT EXISTS meal_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  child_id UUID REFERENCES children(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Weekly Meal Plan',
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  is_active BOOLEAN DEFAULT TRUE,
  total_nutrition JSONB,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Daily meals within meal plans
CREATE TABLE IF NOT EXISTS daily_meals (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  breakfast_recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  lunch_recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  dinner_recipe_id UUID REFERENCES recipes(id) ON DELETE SET NULL,
  snack_recipe_ids UUID[] DEFAULT '{}', -- Array of recipe IDs
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(meal_plan_id, date)
);

-- ===========================================
-- 6. SHOPPING LISTS
-- ===========================================

CREATE TABLE IF NOT EXISTS shopping_lists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL DEFAULT 'Weekly Shopping List',
  meal_plan_id UUID REFERENCES meal_plans(id) ON DELETE SET NULL,
  is_completed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Shopping list items
CREATE TABLE IF NOT EXISTS shopping_list_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  shopping_list_id UUID REFERENCES shopping_lists(id) ON DELETE CASCADE,
  ingredient_id UUID REFERENCES ingredients(id) ON DELETE CASCADE,
  total_amount DECIMAL(8,2) NOT NULL,
  unit TEXT NOT NULL,
  is_checked BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- 7. EXPENSE TRACKING
-- ===========================================

CREATE TABLE IF NOT EXISTS expenses (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  child_id UUID REFERENCES children(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('food', 'groceries', 'health', 'education', 'clothing', 'toys', 'childcare', 'transportation', 'utilities', 'other')),
  subcategory TEXT,
  amount DECIMAL(12,2) NOT NULL,
  currency TEXT DEFAULT 'IDR',
  description TEXT NOT NULL,
  date DATE NOT NULL,
  payment_method TEXT NOT NULL CHECK (payment_method IN ('cash', 'debit', 'credit', 'e-wallet', 'bank-transfer', 'other')),
  tags TEXT[] DEFAULT '{}',
  receipt_url TEXT,
  is_recurring BOOLEAN DEFAULT FALSE,
  recurrence_info JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- 8. TASK MANAGEMENT
-- ===========================================

CREATE TABLE IF NOT EXISTS tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  child_id UUID REFERENCES children(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('meal-prep', 'shopping', 'health', 'development', 'household', 'education', 'appointment', 'personal', 'other')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo', 'in-progress', 'completed', 'cancelled')),
  due_date DATE,
  estimated_time INTEGER, -- in minutes
  tags TEXT[] DEFAULT '{}',
  recurrence_info JSONB,
  completed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- 9. BUDGET MANAGEMENT
-- ===========================================

CREATE TABLE IF NOT EXISTS budgets (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  child_id UUID REFERENCES children(id) ON DELETE SET NULL,
  category TEXT NOT NULL CHECK (category IN ('food', 'groceries', 'health', 'education', 'clothing', 'toys', 'childcare', 'transportation', 'utilities', 'other')),
  amount DECIMAL(12,2) NOT NULL,
  period TEXT NOT NULL CHECK (period IN ('daily', 'weekly', 'monthly', 'yearly')),
  start_date DATE NOT NULL,
  end_date DATE,
  alert_threshold DECIMAL(5,2) DEFAULT 80.00, -- percentage
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- 10. AI ASSISTANT & ANALYTICS
-- ===========================================

-- AI chat history
CREATE TABLE IF NOT EXISTS ai_chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  session_id TEXT NOT NULL,
  message TEXT NOT NULL,
  is_user BOOLEAN DEFAULT TRUE,
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User analytics
CREATE TABLE IF NOT EXISTS user_analytics (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES user_profiles(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  event_data JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ===========================================
-- INDEXES FOR PERFORMANCE
-- ===========================================

-- Educational content indexes
CREATE INDEX IF NOT EXISTS idx_educational_content_category ON educational_content(category);
CREATE INDEX IF NOT EXISTS idx_educational_content_status ON educational_content(status);
CREATE INDEX IF NOT EXISTS idx_educational_content_created_at ON educational_content(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_educational_content_author ON educational_content(author_id);
CREATE INDEX IF NOT EXISTS idx_educational_content_age_range ON educational_content USING GIN(age_range);

-- Recipe indexes
CREATE INDEX IF NOT EXISTS idx_recipes_age_range ON recipes(age_min, age_max);
CREATE INDEX IF NOT EXISTS idx_recipes_meal_types ON recipes USING GIN(meal_types);
CREATE INDEX IF NOT EXISTS idx_recipes_tags ON recipes USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_recipes_author ON recipes(author_id);

-- Expense indexes
CREATE INDEX IF NOT EXISTS idx_expenses_user ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_created_at ON expenses(created_at DESC);

-- Task indexes
CREATE INDEX IF NOT EXISTS idx_tasks_user ON tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_tasks_due_date ON tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_tasks_category ON tasks(category);

-- Meal plan indexes
CREATE INDEX IF NOT EXISTS idx_meal_plans_user ON meal_plans(user_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_child ON meal_plans(child_id);
CREATE INDEX IF NOT EXISTS idx_meal_plans_dates ON meal_plans(start_date, end_date);

-- ===========================================
-- ROW LEVEL SECURITY POLICIES
-- ===========================================

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE children ENABLE ROW LEVEL SECURITY;
ALTER TABLE educational_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_interactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE recipe_ingredients ENABLE ROW LEVEL SECURITY;
ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_meals ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_lists ENABLE ROW LEVEL SECURITY;
ALTER TABLE shopping_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_chat_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_analytics ENABLE ROW LEVEL SECURITY;

-- User profiles: Users can only access their own profile
CREATE POLICY "Users can view own profile" ON user_profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON user_profiles FOR UPDATE USING (auth.uid() = id);

-- User preferences: Users can only access their own preferences
CREATE POLICY "Users can manage own preferences" ON user_preferences FOR ALL USING (auth.uid() = user_id);

-- Children: Users can only access their own children's data
CREATE POLICY "Users can manage own children" ON children FOR ALL USING (auth.uid() = user_id);

-- Educational content: Public read for published content, authenticated users can manage
CREATE POLICY "Public can read published content" ON educational_content FOR SELECT USING (status = 'published');
CREATE POLICY "Authenticated can manage content" ON educational_content FOR ALL USING (auth.role() = 'authenticated');

-- Content interactions: Users can manage their own interactions
CREATE POLICY "Users can manage own interactions" ON content_interactions FOR ALL USING (auth.uid() = user_id);

-- Recipes: Public read, authenticated users can manage
CREATE POLICY "Public can read recipes" ON recipes FOR SELECT USING (true);
CREATE POLICY "Authenticated can manage recipes" ON recipes FOR ALL USING (auth.role() = 'authenticated');

-- Ingredients: Public read
CREATE POLICY "Public can read ingredients" ON ingredients FOR SELECT USING (true);

-- Recipe ingredients: Public read
CREATE POLICY "Public can read recipe ingredients" ON recipe_ingredients FOR SELECT USING (true);

-- Meal plans: Users can only access their own meal plans
CREATE POLICY "Users can manage own meal plans" ON meal_plans FOR ALL USING (auth.uid() = user_id);

-- Daily meals: Users can manage meals for their meal plans
CREATE POLICY "Users can manage meals for own plans" ON daily_meals FOR ALL USING (
  EXISTS (SELECT 1 FROM meal_plans WHERE id = meal_plan_id AND user_id = auth.uid())
);

-- Shopping lists: Users can only access their own shopping lists
CREATE POLICY "Users can manage own shopping lists" ON shopping_lists FOR ALL USING (auth.uid() = user_id);

-- Shopping list items: Users can manage items for their shopping lists
CREATE POLICY "Users can manage items for own lists" ON shopping_list_items FOR ALL USING (
  EXISTS (SELECT 1 FROM shopping_lists WHERE id = shopping_list_id AND user_id = auth.uid())
);

-- Expenses: Users can only access their own expenses
CREATE POLICY "Users can manage own expenses" ON expenses FOR ALL USING (auth.uid() = user_id);

-- Tasks: Users can only access their own tasks
CREATE POLICY "Users can manage own tasks" ON tasks FOR ALL USING (auth.uid() = user_id);

-- Budgets: Users can only access their own budgets
CREATE POLICY "Users can manage own budgets" ON budgets FOR ALL USING (auth.uid() = user_id);

-- AI chat history: Users can only access their own chat history
CREATE POLICY "Users can manage own chat history" ON ai_chat_history FOR ALL USING (auth.uid() = user_id);

-- User analytics: Users can only access their own analytics
CREATE POLICY "Users can manage own analytics" ON user_analytics FOR ALL USING (auth.uid() = user_id);

-- ===========================================
-- SAMPLE DATA INSERTION
-- ===========================================

-- Insert common ingredients
INSERT INTO ingredients (name, category, unit) VALUES
('Beras', 'grains', 'gram'),
('Ayam fillet', 'protein', 'gram'),
('Wortel', 'vegetables', 'gram'),
('Kentang', 'vegetables', 'gram'),
('Tomat', 'vegetables', 'buah'),
('Bawang putih', 'vegetables', 'siung'),
('Bawang merah', 'vegetables', 'buah'),
('Susu formula', 'dairy', 'gram'),
('Pisang', 'fruits', 'buah'),
('Apel', 'fruits', 'buah'),
('Telur', 'protein', 'butir'),
('Minyak goreng', 'oils', 'ml'),
('Garam', 'spices', 'gram'),
('Gula', 'spices', 'gram'),
('Santan', 'dairy', 'ml');

-- Insert sample educational content
INSERT INTO educational_content (title, content, category, age_range, tags, read_time, status) VALUES
('Panduan MPASI 6 Bulan', 'Panduan lengkap untuk memperkenalkan makanan padat pertama kali pada bayi 6 bulan...', 'mpasi', '{"min": 6, "max": 8}', ARRAY['mpasi', 'nutrisi', 'bayi'], 8, 'published'),
('Tips Mengatasi Picky Eater', 'Strategi praktis mengatasi anak yang susah makan...', 'picky-eater', '{"min": 12, "max": 60}', ARRAY['makan', 'picky-eater', 'tips'], 6, 'published'),
('Perkembangan Motorik Anak', 'Panduan perkembangan motorik anak dari 0-5 tahun...', 'development', '{"min": 0, "max": 60}', ARRAY['motorik', 'perkembangan', 'anak'], 10, 'published'),
('Nutrisi untuk Ibu Menyusui', 'Kebutuhan nutrisi penting selama masa menyusui...', 'nutrition', '{"min": 18, "max": 144}', ARRAY['menyusui', 'nutrisi', 'ibu'], 7, 'published'),
('Mengatasi Tantrum Anak', 'Cara efektif mengelola emosi dan tantrum anak...', 'behavior', '{"min": 12, "max": 48}', ARRAY['tantrum', 'emosi', 'pengasuhan'], 9, 'published');

-- Insert sample recipes
INSERT INTO recipes (name, description, prep_time, cook_time, servings, age_min, age_max, meal_types, difficulty, nutrition_info, instructions, tags) VALUES
('Bubur Ayam Wortel', 'Bubur ayam yang lembut dan bergizi untuk MPASI', 15, 30, 2, 6, 12, ARRAY['lunch', 'dinner'], 'easy',
'{"calories": 180, "protein": 12, "carbs": 25, "fat": 4, "fiber": 3, "sugar": 2, "sodium": 150}',
ARRAY['Cuci bersih ayam dan wortel', 'Rebus ayam hingga empuk', 'Parut wortel dan masak bersama ayam', 'Blender hingga halus', 'Sajikan hangat'],
ARRAY['mpasi', 'ayam', 'wortel', 'bergizi']);

-- Insert sample expenses
INSERT INTO expenses (category, amount, description, date, payment_method, tags) VALUES
('food', 150000, 'Belanja sayur dan buah mingguan', '2025-10-01', 'cash', ARRAY['groceries', 'healthy']),
('health', 500000, 'Vaksin anak', '2025-10-02', 'debit', ARRAY['medical', 'vaccination']),
('education', 300000, 'Buku cerita anak', '2025-10-03', 'e-wallet', ARRAY['books', 'learning']),
('clothing', 250000, 'Baju anak musim hujan', '2025-10-04', 'credit', ARRAY['clothing', 'seasonal']);

-- Insert sample tasks
INSERT INTO tasks (title, description, priority, status, due_date, category, estimated_time) VALUES
('Beli bahan MPASI', 'Beli wortel, kentang, dan ayam untuk MPASI', 'high', 'pending', '2025-10-06', 'shopping', 30),
('Jadwalkan vaksin', 'Hubungi dokter untuk jadwal vaksin berikutnya', 'medium', 'in_progress', '2025-10-08', 'health', 15),
('Baca artikel parenting', 'Baca artikel tentang perkembangan anak', 'low', 'completed', '2025-10-05', 'education', 20);

-- ===========================================
-- FUNCTIONS & TRIGGERS
-- ===========================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers to all tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON user_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON children FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_educational_content_updated_at BEFORE UPDATE ON educational_content FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON recipes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_meal_plans_updated_at BEFORE UPDATE ON meal_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_daily_meals_updated_at BEFORE UPDATE ON daily_meals FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shopping_lists_updated_at BEFORE UPDATE ON shopping_lists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_shopping_list_items_updated_at BEFORE UPDATE ON shopping_list_items FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON budgets FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, name, email)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'name', NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create user profile on auth signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ===========================================
-- VIEWS FOR COMMON QUERIES
-- ===========================================

-- View for expense summaries
CREATE OR REPLACE VIEW expense_summaries AS
SELECT
  user_id,
  DATE_TRUNC('month', date) as month,
  category,
  SUM(amount) as total_amount,
  COUNT(*) as transaction_count
FROM expenses
WHERE date >= DATE_TRUNC('month', CURRENT_DATE - INTERVAL '12 months')
GROUP BY user_id, DATE_TRUNC('month', date), category
ORDER BY month DESC, total_amount DESC;

-- View for meal plan with recipes
CREATE OR REPLACE VIEW meal_plan_details AS
SELECT
  mp.id as meal_plan_id,
  mp.title,
  mp.start_date,
  mp.end_date,
  dm.date,
  dm.breakfast_recipe_id,
  br.name as breakfast_name,
  dm.lunch_recipe_id,
  lr.name as lunch_name,
  dm.dinner_recipe_id,
  dr.name as dinner_name,
  dm.snack_recipe_ids
FROM meal_plans mp
LEFT JOIN daily_meals dm ON mp.id = dm.meal_plan_id
LEFT JOIN recipes br ON dm.breakfast_recipe_id = br.id
LEFT JOIN recipes lr ON dm.lunch_recipe_id = lr.id
LEFT JOIN recipes dr ON dm.dinner_recipe_id = dr.id
ORDER BY mp.start_date DESC, dm.date ASC;

-- ===========================================
-- COMPLETED: FULL DATABASE SCHEMA
-- ===========================================

-- This schema includes:
-- ✅ User management & authentication
-- ✅ Children profiles
-- ✅ Educational content system
-- ✅ Recipe & ingredient management
-- ✅ Meal planning system
-- ✅ Shopping list generation
-- ✅ Expense tracking
-- ✅ Task management
-- ✅ Budget management
-- ✅ AI assistant chat history
-- ✅ Analytics tracking
-- ✅ Row Level Security policies
-- ✅ Performance indexes
-- ✅ Automated triggers
-- ✅ Sample data
-- ✅ Useful views

-- Next steps:
-- 1. Run this SQL in Supabase SQL Editor
-- 2. Test connection: node scripts/test-supabase.mjs
-- 3. Start app: npm run dev
-- 4. Test full sync between admin and user interfaces
