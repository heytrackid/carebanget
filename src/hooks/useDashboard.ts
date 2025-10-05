import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryKeys } from '@/lib/react-query';

export function useDashboardStats() {
  return useQuery({
    queryKey: queryKeys.dashboardStats,
    queryFn: async () => {
      // Parallel queries for better performance
      const [recipes, expenses, tasks, children] = await Promise.all([
        supabase.from('recipes').select('id', { count: 'exact', head: true }),
        supabase.from('expenses').select('amount', { count: 'exact' }),
        supabase.from('tasks').select('id', { count: 'exact', head: true }),
        supabase.from('children').select('id', { count: 'exact', head: true }),
      ]);

      // Calculate totals
      const totalExpenses = expenses.data?.reduce((sum, expense) => sum + Number(expense.amount), 0) || 0;
      
      return {
        totalRecipes: recipes.count || 0,
        totalExpenses,
        totalTasks: tasks.count || 0,
        totalChildren: children.count || 0,
        // Mock data for now - replace with real calculations
        weeklyNutrition: 85,
        recipesLearned: 12,
        shoppingItems: 8,
        articlesRead: 5,
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutes - dashboard data changes frequently
  });
}

export function useRecentActivities() {
  return useQuery({
    queryKey: ['dashboard', 'recent-activities'],
    queryFn: async () => {
      // Get recent activities from different tables
      const [recentRecipes, recentExpenses, recentTasks] = await Promise.all([
        supabase
          .from('recipes')
          .select('name, created_at')
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('expenses')
          .select('description, amount, created_at')
          .order('created_at', { ascending: false })
          .limit(3),
        supabase
          .from('tasks')
          .select('title, created_at')
          .order('created_at', { ascending: false })
          .limit(3),
      ]);

      // Combine and format activities
      const activities = [
        ...recentRecipes.data?.map(recipe => ({
          type: 'recipe',
          action: 'Menambah resep',
          item: recipe.name,
          time: new Date(recipe.created_at).toLocaleDateString('id-ID'),
        })) || [],
        ...recentExpenses.data?.map(expense => ({
          type: 'expense',
          action: 'Menambah pengeluaran',
          item: `${expense.description} (${expense.amount})`,
          time: new Date(expense.created_at).toLocaleDateString('id-ID'),
        })) || [],
        ...recentTasks.data?.map(task => ({
          type: 'task',
          action: 'Membuat task',
          item: task.title,
          time: new Date(task.created_at).toLocaleDateString('id-ID'),
        })) || [],
      ];

      return activities
        .sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())
        .slice(0, 5);
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
