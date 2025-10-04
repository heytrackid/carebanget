'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, Users } from 'lucide-react';

interface Ingredient {
  id: string;
  name: string;
  amount: number;
  unit: string;
  category: string;
}

interface Recipe {
  id: string;
  name: string;
  ingredients: Ingredient[];
  servings: number;
  instructions: string[];
  nutrition: {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
    fiber: number;
    sugar: number;
  };
}

interface RecipeScalerProps {
  recipe: Recipe;
  onScaledRecipeChange?: (scaledRecipe: Recipe) => void;
}

export function RecipeScaler({ recipe, onScaledRecipeChange }: RecipeScalerProps) {
  const [targetServings, setTargetServings] = useState(recipe.servings);

  // Calculate scaling factor
  const scaleFactor = targetServings / recipe.servings;

  // Scale ingredients
  const scaledIngredients = recipe.ingredients.map(ingredient => ({
    ...ingredient,
    amount: Math.round((ingredient.amount * scaleFactor) * 100) / 100 // Round to 2 decimal places
  }));

  // Scale nutrition
  const scaledNutrition = {
    calories: Math.round(recipe.nutrition.calories * scaleFactor),
    protein: Math.round((recipe.nutrition.protein * scaleFactor) * 100) / 100,
    carbs: Math.round((recipe.nutrition.carbs * scaleFactor) * 100) / 100,
    fat: Math.round((recipe.nutrition.fat * scaleFactor) * 100) / 100,
    fiber: Math.round((recipe.nutrition.fiber * scaleFactor) * 100) / 100,
    sugar: Math.round((recipe.nutrition.sugar * scaleFactor) * 100) / 100,
  };

  // Create scaled recipe
  const scaledRecipe: Recipe = {
    ...recipe,
    servings: targetServings,
    ingredients: scaledIngredients,
    nutrition: scaledNutrition,
  };

  // Notify parent component of changes
  React.useEffect(() => {
    if (onScaledRecipeChange) {
      onScaledRecipeChange(scaledRecipe);
    }
  }, [scaledRecipe, onScaledRecipeChange]);

  const adjustServings = (delta: number) => {
    const newServings = Math.max(1, Math.min(20, targetServings + delta));
    setTargetServings(newServings);
  };

  const handleServingsChange = (value: string) => {
    const numValue = parseInt(value);
    if (!isNaN(numValue) && numValue >= 1 && numValue <= 20) {
      setTargetServings(numValue);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="h-5 w-5" />
          Sesuaikan Porsi
        </CardTitle>
        <CardDescription>
          Ubah jumlah porsi resep sesuai kebutuhan keluarga Anda
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Servings Control */}
        <div className="flex items-center justify-center gap-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustServings(-1)}
            disabled={targetServings <= 1}
          >
            <Minus className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <Label htmlFor="servings" className="text-sm font-medium">
              Porsi:
            </Label>
            <Input
              id="servings"
              type="number"
              min="1"
              max="20"
              value={targetServings}
              onChange={(e) => handleServingsChange(e.target.value)}
              className="w-20 text-center"
            />
          </div>

          <Button
            variant="outline"
            size="sm"
            onClick={() => adjustServings(1)}
            disabled={targetServings >= 20}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Scale Factor Indicator */}
        <div className="text-center">
          <Badge variant="secondary" className="text-sm">
            {scaleFactor === 1 ? 'Porsi Original' :
             scaleFactor > 1 ? `Diperbesar ${scaleFactor.toFixed(1)}x` :
             `Diperkecil ${(1/scaleFactor).toFixed(1)}x`}
          </Badge>
        </div>

        {/* Scaled Ingredients Preview */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Bahan-bahan ({targetServings} porsi):</h4>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {scaledIngredients.map((ingredient) => (
              <div key={ingredient.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                <span className="text-sm font-medium">{ingredient.name}</span>
                <span className="text-sm text-gray-600">
                  {ingredient.amount} {ingredient.unit}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Scaled Nutrition Preview */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Informasi Nutrisi (per porsi):</h4>
          <div className="grid grid-cols-2 gap-3">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-lg font-bold text-blue-600">{scaledNutrition.calories}</div>
              <div className="text-xs text-gray-600">Kalori</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-lg font-bold text-green-600">{scaledNutrition.protein}g</div>
              <div className="text-xs text-gray-600">Protein</div>
            </div>
            <div className="text-center p-3 bg-yellow-50 rounded-lg">
              <div className="text-lg font-bold text-yellow-600">{scaledNutrition.carbs}g</div>
              <div className="text-xs text-gray-600">Karbohidrat</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-lg font-bold text-purple-600">{scaledNutrition.fat}g</div>
              <div className="text-xs text-gray-600">Lemak</div>
            </div>
          </div>
        </div>

        {/* Total Nutrition */}
        <div className="pt-4 border-t">
          <h4 className="font-medium text-gray-900 mb-3">Total Nutrisi ({targetServings} porsi):</h4>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
            <div className="text-center">
              <div className="font-bold">{scaledNutrition.calories * targetServings} kcal</div>
              <div className="text-gray-600">Total Kalori</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{(scaledNutrition.protein * targetServings).toFixed(1)}g</div>
              <div className="text-gray-600">Total Protein</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{(scaledNutrition.carbs * targetServings).toFixed(1)}g</div>
              <div className="text-gray-600">Total Karbo</div>
            </div>
            <div className="text-center">
              <div className="font-bold">{(scaledNutrition.fat * targetServings).toFixed(1)}g</div>
              <div className="text-gray-600">Total Lemak</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
