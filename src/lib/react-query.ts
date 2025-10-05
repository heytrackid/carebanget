import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes - data considered fresh
      gcTime: 10 * 60 * 1000, // 10 minutes - cache garbage collection
      refetchOnWindowFocus: false, // Don't refetch on window focus (annoying)
      refetchOnReconnect: 'always', // Always refetch on reconnect
      retry: (failureCount, error: any) => {
        // Don't retry on authentication errors
        if (error?.status === 401 || error?.status === 403) {
          return false;
        }
        // Don't retry on 4xx client errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Retry network errors up to 2 times
        return failureCount < 2;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      // Enable background refetching for better UX
      refetchOnMount: 'always',
    },
    mutations: {
      retry: false, // Don't retry mutations
      // Optimistic updates will be handled per mutation
    },
  },
});

// Query keys for consistent caching
export const queryKeys = {
  // Dashboard
  dashboard: ['dashboard'] as const,
  dashboardStats: ['dashboard', 'stats'] as const,
  
  // Recipes
  recipes: ['recipes'] as const,
  recipe: (id: string) => ['recipes', id] as const,
  recipeSearch: (query: string) => ['recipes', 'search', query] as const,
  
  // Meal Plans
  mealPlans: ['meal-plans'] as const,
  mealPlan: (id: string) => ['meal-plans', id] as const,
  
  // Shopping Lists
  shoppingLists: ['shopping-lists'] as const,
  shoppingList: (id: string) => ['shopping-lists', id] as const,
  
  // Expenses
  expenses: ['expenses'] as const,
  expenseAnalytics: ['expenses', 'analytics'] as const,
  expenseCategories: ['expenses', 'categories'] as const,
  
  // Tasks
  tasks: ['tasks'] as const,
  taskStats: ['tasks', 'stats'] as const,
  
  // Education
  educationalContent: ['educational-content'] as const,
  educationalArticle: (id: string) => ['educational-content', id] as const,
  
  // Children
  children: ['children'] as const,
  child: (id: string) => ['children', id] as const,
  
  // User
  userProfile: ['user', 'profile'] as const,
  userAnalytics: ['user', 'analytics'] as const,
} as const;
