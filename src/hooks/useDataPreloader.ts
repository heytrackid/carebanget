import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/lib/react-query';
import { supabase } from '@/lib/supabase';

export interface DataPreloadConfig {
  dashboard?: boolean;
  recipes?: boolean;
  expenses?: boolean;
  userProfile?: boolean;
  children?: boolean;
}

export function useDataPreloader() {
  const queryClient = useQueryClient();

  const preloadData = async (config: DataPreloadConfig = {}) => {
    const preloadPromises: Promise<any>[] = [];

    // Preload user profile
    if (config.userProfile) {
      preloadPromises.push(
        queryClient.prefetchQuery({
          queryKey: queryKeys.userProfile,
          queryFn: async () => {
            const { data, error } = await supabase.auth.getUser();
            if (error) throw error;
            return data.user;
          },
          staleTime: 5 * 60 * 1000,
        })
      );
    }

    // Preload dashboard stats
    if (config.dashboard) {
      preloadPromises.push(
        queryClient.prefetchQuery({
          queryKey: queryKeys.dashboardStats,
          queryFn: async () => {
            const [recipes, expenses, tasks, children] = await Promise.all([
              supabase.from('recipes').select('id', { count: 'exact', head: true }),
              supabase.from('expenses').select('amount', { count: 'exact' }),
              supabase.from('tasks').select('id', { count: 'exact', head: true }),
              supabase.from('children').select('id', { count: 'exact', head: true }),
            ]);

            const totalExpenses = expenses.data?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;

            return {
              totalRecipes: recipes.count || 0,
              totalExpenses,
              totalTasks: tasks.count || 0,
              totalChildren: children.count || 0,
              weeklyNutrition: 85,
              recipesLearned: 12,
              shoppingItems: 8,
              articlesRead: 5,
            };
          },
          staleTime: 2 * 60 * 1000,
        })
      );
    }

    // Preload recipes (first 10)
    if (config.recipes) {
      preloadPromises.push(
        queryClient.prefetchQuery({
          queryKey: ['recipes', { limit: 10 }],
          queryFn: async () => {
            const { data, error } = await supabase
              .from('recipes')
              .select(`
                id,
                name,
                description,
                image_url,
                prep_time,
                cook_time,
                servings,
                age_min,
                age_max,
                difficulty,
                rating,
                review_count,
                created_at
              `)
              .order('created_at', { ascending: false })
              .limit(10);

            if (error) throw error;
            return data;
          },
          staleTime: 10 * 60 * 1000,
        })
      );
    }

    // Preload children data
    if (config.children) {
      preloadPromises.push(
        queryClient.prefetchQuery({
          queryKey: queryKeys.children,
          queryFn: async () => {
            const { data, error } = await supabase
              .from('children')
              .select('*')
              .order('birth_date', { ascending: false });

            if (error) throw error;
            return data;
          },
          staleTime: 15 * 60 * 1000,
        })
      );
    }

    // Preload recent expenses (last 30 days)
    if (config.expenses) {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      preloadPromises.push(
        queryClient.prefetchQuery({
          queryKey: ['expenses', { recent: true }],
          queryFn: async () => {
            const { data, error } = await supabase
              .from('expenses')
              .select('*')
              .gte('date', thirtyDaysAgo.toISOString().split('T')[0])
              .order('date', { ascending: false })
              .limit(20);

            if (error) throw error;
            return data;
          },
          staleTime: 5 * 60 * 1000,
        })
      );
    }

    try {
      await Promise.all(preloadPromises);
      console.log('✅ Data preloading completed');
    } catch (error) {
      console.warn('⚠️ Some data preloading failed:', error);
      // Don't throw error, just warn
    }
  };

  const preloadCriticalData = () => preloadData({
    userProfile: true,
    dashboard: true,
    children: true,
  });

  const preloadPageData = (page: 'dashboard' | 'recipes' | 'expenses') => {
    switch (page) {
      case 'dashboard':
        return preloadData({ dashboard: true, children: true });
      case 'recipes':
        return preloadData({ recipes: true });
      case 'expenses':
        return preloadData({ expenses: true });
      default:
        return Promise.resolve();
    }
  };

  return {
    preloadData,
    preloadCriticalData,
    preloadPageData,
  };
}
