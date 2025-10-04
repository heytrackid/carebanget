'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ArrowLeft } from 'lucide-react';
import { mockRecipes } from '@/data/mockData';
import { Recipe } from '@/types';
import Link from 'next/link';

// Recipe Form Component (same as in the list page)
function RecipeForm({ recipe, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: recipe?.name || '',
    description: recipe?.description || '',
    prepTime: recipe?.prepTime || 15,
    cookTime: recipe?.cookTime || 30,
    servings: recipe?.servings || 2,
    ageMin: recipe?.ageMin || 6,
    ageMax: recipe?.ageMax || 24,
    mealType: recipe?.mealType || ['breakfast'],
    difficulty: recipe?.difficulty || 'easy',
    ingredients: recipe?.ingredients || [{ id: '1', name: '', amount: 0, unit: '', category: 'protein' }],
    instructions: recipe?.instructions || [''],
    tags: recipe?.tags || [],
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    const recipeData = {
      ...formData,
      id: recipe?.id || Date.now().toString(),
      imageUrl: recipe?.imageUrl || '/images/default-recipe.jpg',
      nutrition: recipe?.nutrition || {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0,
      },
    };

    onSave(recipeData);
  };

  const addIngredient = () => {
    setFormData({
      ...formData,
      ingredients: [...formData.ingredients, { id: Date.now().toString(), name: '', amount: 0, unit: '', category: 'protein' }]
    });
  };

  const updateIngredient = (index, field, value) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const removeIngredient = (index) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_, i) => i !== index)
    });
  };

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, '']
    });
  };

  const updateInstruction = (index, value) => {
    const updatedInstructions = [...formData.instructions];
    updatedInstructions[index] = value;
    setFormData({ ...formData, instructions: updatedInstructions });
  };

  const removeInstruction = (index) => {
    setFormData({
      ...formData,
      instructions: formData.instructions.filter((_, i) => i !== index)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Resep</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Masukkan nama resep..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Kesulitan</label>
          <select
            value={formData.difficulty}
            onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="easy">Mudah</option>
            <option value="medium">Sedang</option>
            <option value="hard">Sulit</option>
          </select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Deskripsi</label>
        <input
          type="text"
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Deskripsi singkat resep..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Prep Time (menit)</label>
          <input
            type="number"
            value={formData.prepTime}
            onChange={(e) => setFormData({...formData, prepTime: parseInt(e.target.value) || 0})}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Cook Time (menit)</label>
          <input
            type="number"
            value={formData.cookTime}
            onChange={(e) => setFormData({...formData, cookTime: parseInt(e.target.value) || 0})}
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Servings</label>
          <input
            type="number"
            value={formData.servings}
            onChange={(e) => setFormData({...formData, servings: parseInt(e.target.value) || 1})}
            min="1"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Usia Anak (bulan)</label>
          <div className="flex gap-2">
            <input
              type="number"
              value={formData.ageMin}
              onChange={(e) => setFormData({...formData, ageMin: parseInt(e.target.value) || 0})}
              placeholder="Min"
              min="0"
              max="144"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="number"
              value={formData.ageMax}
              onChange={(e) => setFormData({...formData, ageMax: parseInt(e.target.value) || 144})}
              placeholder="Max"
              min="0"
              max="144"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Bahan-bahan</label>
          <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
            + Tambah Bahan
          </Button>
        </div>
        <div className="space-y-2">
          {formData.ingredients.map((ingredient, index) => (
            <div key={ingredient.id} className="flex gap-2 items-end">
              <input
                type="text"
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                placeholder="Nama bahan"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="number"
                value={ingredient.amount}
                onChange={(e) => updateIngredient(index, 'amount', parseFloat(e.target.value) || 0)}
                placeholder="Jumlah"
                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="text"
                value={ingredient.unit}
                onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                placeholder="Satuan"
                className="w-20 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <select
                value={ingredient.category}
                onChange={(e) => updateIngredient(index, 'category', e.target.value)}
                className="w-32 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="protein">Protein</option>
                <option value="vegetables">Sayuran</option>
                <option value="fruits">Buah</option>
                <option value="grains">Biji-bijian</option>
                <option value="dairy">Susu</option>
                <option value="others">Lainnya</option>
              </select>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeIngredient(index)}
                disabled={formData.ingredients.length === 1}
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Langkah-langkah</label>
          <Button type="button" variant="outline" size="sm" onClick={addInstruction}>
            + Tambah Langkah
          </Button>
        </div>
        <div className="space-y-2">
          {formData.instructions.map((instruction, index) => (
            <div key={index} className="flex gap-2 items-start">
              <span className="text-sm font-medium mt-2 w-6">{index + 1}.</span>
              <input
                type="text"
                value={instruction}
                onChange={(e) => updateInstruction(index, e.target.value)}
                placeholder={`Langkah ${index + 1}`}
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeInstruction(index)}
                disabled={formData.instructions.length === 1}
                className="mt-1"
              >
                ×
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">
          💾 {recipe ? 'Update Resep' : 'Simpan Resep'}
        </Button>
      </div>
    </form>
  );
}

export default function AdminRecipeEditPage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const recipeId = params.id as string;
  const isNewRecipe = recipeId === 'new';

  useEffect(() => {
    if (isNewRecipe) {
      setRecipe(null);
      setLoading(false);
    } else {
      // Load existing recipe
      const foundRecipe = mockRecipes.find(r => r.id === recipeId);
      if (foundRecipe) {
        setRecipe(foundRecipe);
      }
      setLoading(false);
    }
  }, [recipeId, isNewRecipe]);

  const handleSave = async (recipeData: Recipe) => {
    setSaving(true);

    try {
      // In real app, call API
      console.log('Saving recipe:', recipeData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect back to recipes list
      router.push('/admin/recipes');
    } catch (error) {
      console.error('Failed to save recipe:', error);
      alert('Failed to save recipe. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/recipes');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading recipe...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/admin/recipes">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Recipes
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isNewRecipe ? 'Tambah Resep Baru' : 'Edit Resep'}
              </h1>
              {!isNewRecipe && recipe && (
                <p className="text-gray-600 text-sm mt-1">{recipe.name}</p>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin/recipes">Recipes</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {isNewRecipe ? 'New Recipe' : 'Edit Recipe'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <RecipeForm
              recipe={recipe}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
