export interface Child {
  id: string;
  name: string;
  birthDate: Date;
  age: number; // in months
  weight?: number; // in kg
  allergies: string[];
  preferences: DietaryPreference[];
}

export interface DietaryPreference {
  type: 'halal' | 'vegetarian' | 'vegan' | 'no-dairy' | 'no-gluten' | 'no-nuts';
  label: string;
}

export interface Recipe {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  prepTime: number; // in minutes
  cookTime: number; // in minutes
  servings: number;
  ageMin: number; // minimum age in months
  ageMax: number; // maximum age in months
  mealType: MealType[];
  ingredients: Ingredient[];
  instructions: string[];
  nutrition: NutritionInfo;
  tags: string[];
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: IngredientCategory;
}

export interface NutritionInfo {
  calories: number;
  protein: number; // in grams
  carbs: number; // in grams
  fat: number; // in grams
  fiber: number; // in grams
  sugar: number; // in grams
  sodium: number; // in mg
}

export interface MealPlan {
  id: string;
  childId: string;
  startDate: Date;
  endDate: Date;
  meals: DailyMeal[];
  totalNutrition: NutritionInfo;
  shoppingList: ShoppingItem[];
}

export interface DailyMeal {
  date: Date;
  breakfast?: Recipe;
  lunch?: Recipe;
  dinner?: Recipe;
  snacks: Recipe[];
}

export interface ShoppingItem {
  ingredient: Ingredient;
  totalAmount: number;
  unit: string;
  category: IngredientCategory;
  isChecked?: boolean;
}

export interface EducationalContent {
  id: string;
  title: string;
  content: string;
  category: string;
  ageRange: {
    min: number;
    max: number;
  };
  tags: string[];
  readTime: number;
  status?: 'draft' | 'published' | 'archived';
  createdAt: Date;
  updatedAt: Date;
}

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type IngredientCategory =
  | 'protein'
  | 'vegetables'
  | 'fruits'
  | 'grains'
  | 'dairy'
  | 'spices'
  | 'oils'
  | 'others';

export type ContentCategory = 
  | 'mpasi' 
  | 'nutrition' 
  | 'picky-eater' 
  | 'meal-prep' 
  | 'development' 
  | 'safety' 
  | 'recipes';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  children: Child[];
  preferences: {
    mealPlanDuration: 3 | 7 | 30; // days
    preferredMealTypes: MealType[];
    dietaryRestrictions: DietaryPreference[];
  };
}

export interface AIRecipeRequest {
  ingredients: string[];
  childAge: number; // in months
  mealType: MealType;
  dietaryPreferences: DietaryPreference[];
  allergies: string[];
}

export interface AIRecipeResponse {
  recipe: Recipe;
  alternatives: Recipe[];
  tips: string[];
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  category: TaskCategory;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate?: Date;
  childId?: string; // Optional: task related to specific child
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  estimatedTime?: number; // in minutes
  recurrence?: TaskRecurrence;
}

export interface TaskRecurrence {
  type: 'daily' | 'weekly' | 'monthly';
  interval: number; // every X days/weeks/months
  endDate?: Date;
}

export type TaskCategory = 
  | 'meal-prep' 
  | 'shopping' 
  | 'health' 
  | 'development' 
  | 'household' 
  | 'education' 
  | 'appointment' 
  | 'personal' 
  | 'other';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export type TaskStatus = 'todo' | 'in-progress' | 'completed' | 'cancelled';

export interface Expense {
  id: string;
  childId?: string; // Optional: expense for specific child
  category: ExpenseCategory;
  subcategory?: string;
  amount: number;
  currency: string;
  description: string;
  date: Date;
  paymentMethod: PaymentMethod;
  tags: string[];
  receipt?: string; // URL to receipt image
  isRecurring?: boolean;
  recurrence?: ExpenseRecurrence;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExpenseRecurrence {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: Date;
}

export type ExpenseCategory = 
  | 'food' // Makanan & minuman
  | 'groceries' // Belanja bulanan
  | 'health' // Kesehatan & obat-obatan
  | 'education' // Pendidikan & les
  | 'clothing' // Pakaian & perlengkapan
  | 'toys' // Mainan & hiburan
  | 'childcare' // Penitipan anak
  | 'transportation' // Transportasi
  | 'utilities' // Listrik, air, dll
  | 'other'; // Lain-lain

export type PaymentMethod = 
  | 'cash' 
  | 'debit' 
  | 'credit' 
  | 'e-wallet' 
  | 'bank-transfer' 
  | 'other';

export interface ExpenseSummary {
  totalExpense: number;
  byCategory: Record<ExpenseCategory, number>;
  byChild: Record<string, number>;
  byMonth: Record<string, number>;
  averageDaily: number;
  averageMonthly: number;
}

export interface Budget {
  id: string;
  childId?: string;
  category: ExpenseCategory;
  amount: number;
  period: 'daily' | 'weekly' | 'monthly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  alertThreshold?: number; // percentage (e.g., 80 = alert at 80%)
  isActive: boolean;
}
