import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { queryKeys } from '@/lib/react-query';

export function useRecipes(filters?: {
  category?: string;
  ageMin?: number;
  ageMax?: number;
  difficulty?: string;
}) {
  return useQuery({
    queryKey: ['recipes', filters],
    queryFn: async () => {
      let query = supabase
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
          meal_types,
          difficulty,
          tags,
          nutrition_info,
          instructions,
          author_id,
          is_verified,
          rating,
          review_count,
          created_at,
          user_profiles!recipes_author_id_fkey (
            full_name
          )
        `)
        .order('created_at', { ascending: false });

      // Apply filters
      if (filters?.category) {
        query = query.contains('tags', [filters.category]);
      }
      if (filters?.ageMin !== undefined) {
        query = query.gte('age_min', filters.ageMin);
      }
      if (filters?.ageMax !== undefined) {
        query = query.lte('age_max', filters.ageMax);
      }
      if (filters?.difficulty) {
        query = query.eq('difficulty', filters.difficulty);
      }

      const { data, error } = await query;

      if (error) throw error;
      return data;
    },
    staleTime: 10 * 60 * 1000, // 10 minutes - recipes don't change often
  });
}

export function useRecipe(id: string) {
  return useQuery({
    queryKey: queryKeys.recipe(id),
    queryFn: async () => {
      const { data, error } = await supabase
        .from('recipes')
        .select(`
          *,
          recipe_ingredients (
            quantity,
            unit,
            notes,
            ingredients (
              id,
              name,
              category,
              unit
            )
          ),
          user_profiles!recipes_author_id_fkey (
            full_name,
            avatar_url
          )
        `)
        .eq('id', id)
        .single();

      if (error) throw error;
      return data;
    },
    staleTime: 15 * 60 * 1000, // 15 minutes - individual recipes cache longer
    enabled: !!id,
  });
}

export function useCreateRecipe() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (recipe: any) => {
      const { data, error } = await supabase
        .from('recipes')
        .insert(recipe)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      // Invalidate and refetch recipes
      queryClient.invalidateQueries({ queryKey: queryKeys.recipes });
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboardStats });
    },
  });
}

export function useRecipeSearch(query: string) {
  return useQuery({
    queryKey: queryKeys.recipeSearch(query),
    queryFn: async () => {
      if (!query.trim()) return [];

      const { data, error } = await supabase
        .from('recipes')
        .select('id, name, description, tags, difficulty')
        .or(`name.ilike.%${query}%,description.ilike.%${query}%`)
        .limit(10);

      if (error) throw error;
      return data;
    },
    staleTime: 2 * 60 * 1000, // 2 minutes for search results
    enabled: query.length > 2, // Only search when query is meaningful
  });
}
