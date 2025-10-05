import { useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useQueryClient } from '@tanstack/react-query';
import { useOffline } from '@/contexts/OfflineContext';

export function useRealtimeSync() {
  const queryClient = useQueryClient();
  const { isOnline, isRegistered } = useOffline();

  useEffect(() => {
    if (!isOnline || !isRegistered) return;

    console.log('🔄 Setting up realtime subscriptions...');

    // Subscribe to recipes changes
    const recipesSubscription = supabase
      .channel('recipes_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'recipes'
        },
        (payload) => {
          console.log('📖 Recipe changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['recipes'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        }
      )
      .subscribe();

    // Subscribe to educational content changes
    const educationalSubscription = supabase
      .channel('educational_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'educational_content'
        },
        (payload) => {
          console.log('📚 Educational content changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['educational-content'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        }
      )
      .subscribe();

    // Subscribe to expenses changes
    const expensesSubscription = supabase
      .channel('expenses_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'expenses'
        },
        (payload) => {
          console.log('💰 Expense changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['expenses'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
          queryClient.invalidateQueries({ queryKey: ['expense-analytics'] });
        }
      )
      .subscribe();

    // Subscribe to tasks changes
    const tasksSubscription = supabase
      .channel('tasks_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'tasks'
        },
        (payload) => {
          console.log('✅ Task changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['tasks'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        }
      )
      .subscribe();

    // Subscribe to meal plans changes
    const mealPlansSubscription = supabase
      .channel('meal_plans_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meal_plans'
        },
        (payload) => {
          console.log('📅 Meal plan changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['meal-plans'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        }
      )
      .subscribe();

    // Subscribe to shopping lists changes
    const shoppingListsSubscription = supabase
      .channel('shopping_lists_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'shopping_lists'
        },
        (payload) => {
          console.log('🛒 Shopping list changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['shopping-lists'] });
        }
      )
      .subscribe();

    // Subscribe to user profiles changes (for current user)
    const userProfilesSubscription = supabase
      .channel('user_profiles_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_profiles'
        },
        (payload) => {
          console.log('👤 User profile changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['user-profile'] });
        }
      )
      .subscribe();

    // Subscribe to children changes
    const childrenSubscription = supabase
      .channel('children_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'children'
        },
        (payload) => {
          console.log('👶 Children changed:', payload);
          queryClient.invalidateQueries({ queryKey: ['children'] });
          queryClient.invalidateQueries({ queryKey: ['dashboard-stats'] });
        }
      )
      .subscribe();

    return () => {
      console.log('🔌 Cleaning up realtime subscriptions...');
      supabase.removeChannel(recipesSubscription);
      supabase.removeChannel(educationalSubscription);
      supabase.removeChannel(expensesSubscription);
      supabase.removeChannel(tasksSubscription);
      supabase.removeChannel(mealPlansSubscription);
      supabase.removeChannel(shoppingListsSubscription);
      supabase.removeChannel(userProfilesSubscription);
      supabase.removeChannel(childrenSubscription);
    };
  }, [queryClient, isOnline, isRegistered]);

  return null;
}
