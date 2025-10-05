import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryKeys } from '@/lib/react-query';

export function useExpenses(filters?: {
  startDate?: string;
  endDate?: string;
  category?: string;
}) {
  return useQuery({
    queryKey: ['expenses', filters],
    queryFn: async () => {
      let query = supabase
        .from('expenses')
        .select('*')
        .order('date', { ascending: false });

      // Apply filters
      if (filters?.startDate) {
        query = query.gte('date', filters.startDate);
      }
      if (filters?.endDate) {
        query = query.lte('date', filters.endDate);
      }
      if (filters?.category) {
        query = query.eq('category', filters.category);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes - expenses change moderately
  });
}

export function useExpenseAnalytics() {
  return useQuery({
    queryKey: queryKeys.expenseAnalytics,
    queryFn: async () => {
      // Get expense data for charts
      const { data: expenses, error } = await supabase
        .from('expenses')
        .select('amount, category, date')
        .order('date', { ascending: false })
        .limit(100); // Limit for performance

      if (error) throw error;

      // Calculate analytics
      const totalExpenses = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0);
      
      // Group by category
      const categoryTotals = expenses.reduce((acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + Number(expense.amount);
        return acc;
      }, {} as Record<string, number>);

      // Group by month
      const monthlyData = expenses.reduce((acc, expense) => {
        const month = new Date(expense.date).toLocaleDateString('id-ID', { 
          month: 'short', 
          year: 'numeric' 
        });
        acc[month] = (acc[month] || 0) + Number(expense.amount);
        return acc;
      }, {} as Record<string, number>);

      return {
        totalExpenses,
        categoryBreakdown: Object.entries(categoryTotals).map(([category, amount]) => ({
          category,
          amount,
          percentage: (amount / totalExpenses) * 100,
        })),
        monthlyTrend: Object.entries(monthlyData).map(([month, amount]) => ({
          month,
          amount,
        })).reverse(), // Most recent first
        expenseCount: expenses.length,
      };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - analytics don't need to be super fresh
  });
}

export function useCreateExpense() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (expense: any) => {
      const { data, error } = await supabase
        .from('expenses')
        .insert(expense)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: queryKeys.expenses });
      queryClient.invalidateQueries({ queryKey: queryKeys.expenseAnalytics });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
    // Optimistic update
    onMutate: async (newExpense) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: queryKeys.expenses });

      // Snapshot previous value
      const previousExpenses = queryClient.getQueryData(queryKeys.expenses);

      // Optimistically update
      queryClient.setQueryData(queryKeys.expenses, (old: any) => [
        newExpense,
        ...(old || [])
      ]);

      return { previousExpenses };
    },
    onError: (err, newExpense, context) => {
      // Rollback on error
      if (context?.previousExpenses) {
        queryClient.setQueryData(queryKeys.expenses, context.previousExpenses);
      }
    },
  });
}

export function useExpenseCategories() {
  return useQuery({
    queryKey: queryKeys.expenseCategories,
    queryFn: async () => {
      const { data, error } = await supabase
        .from('expenses')
        .select('category')
        .not('category', 'is', null);

      if (error) throw error;

      // Get unique categories
      const categories = [...new Set(data.map(item => item.category))];
      return categories.sort();
    },
    staleTime: 30 * 60 * 1000, // 30 minutes - categories change rarely
  });
}
