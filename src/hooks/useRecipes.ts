import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Recipe } from '@/types'

export function useRecipes() {
  const [recipes, setRecipes] = useState<Recipe[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRecipes() {
      try {
        const supabase = createClient()
        const { data, error } = await supabase
          .from('recipes')
          .select(`
            *,
            recipe_ingredients (*),
            recipe_instructions (*),
            recipe_nutrition (*),
            recipe_tags (*)
          `)
          .eq('is_active', true)
          .order('created_at', { ascending: false })

        if (error) throw error

        setRecipes(data || [])
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch recipes')
      } finally {
        setLoading(false)
      }
    }

    fetchRecipes()
  }, [])

  return { recipes, loading, error }
}
