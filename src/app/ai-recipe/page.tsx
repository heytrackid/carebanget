'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { NutritionChart } from '@/components/nutrition/NutritionChart';
import { Sparkles, ChefHat, Clock, Users, Lightbulb, X, Plus } from 'lucide-react';
import { mockRecipes, dietaryPreferences } from '@/data/mockData';
import { Recipe, MealType, DietaryPreference } from '@/types';

export default function AIRecipePage() {
  const [ingredients, setIngredients] = useState<string[]>(['']);
  const [childAge, setChildAge] = useState<number>(12);
  const [mealType, setMealType] = useState<MealType>('lunch');
  const [selectedPreferences, setSelectedPreferences] = useState<DietaryPreference[]>([]);
  const [allergies, setAllergies] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<Recipe | null>(null);
  const [alternatives, setAlternatives] = useState<Recipe[]>([]);
  const [aiTips, setAiTips] = useState<string[]>([]);

  const addIngredientField = () => {
    setIngredients([...ingredients, '']);
  };

  const removeIngredientField = (index: number) => {
    const updated = ingredients.filter((_, i) => i !== index);
    setIngredients(updated.length > 0 ? updated : ['']);
  };

  const updateIngredient = (index: number, value: string) => {
    const updated = [...ingredients];
    updated[index] = value;
    setIngredients(updated);
  };

  const handlePreferenceToggle = (preference: DietaryPreference) => {
    setSelectedPreferences(prev => {
      const exists = prev.find(p => p.type === preference.type);
      if (exists) {
        return prev.filter(p => p.type !== preference.type);
      } else {
        return [...prev, preference];
      }
    });
  };

  const generateRecipe = async () => {
    const validIngredients = ingredients.filter((ing: string) => ing.trim() !== '');

    if (validIngredients.length === 0) {
      alert('Mohon masukan minimal satu bahan');
      return;
    }

    setIsGenerating(true);

    // Simulate AI API call
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Mock AI-generated recipe based on ingredients
    const baseRecipe = mockRecipes[0]; // Use as template
    const aiRecipe: Recipe = {
      ...baseRecipe,
      id: 'ai-' + Date.now(),
      name: `Resep AI: ${validIngredients.slice(0, 2).join(' & ')}`,
      description: `Resep sehat yang dibuat khusus dari bahan ${validIngredients.join(', ')} untuk anak ${childAge} bulan`,
      ingredients: validIngredients.map((ing, index) => ({
        id: `ai-ing-${index}`,
        name: ing,
        amount: Math.floor(Math.random() * 100) + 50,
        unit: ['gram', 'ml', 'buah', 'sdm', 'sdt'][Math.floor(Math.random() * 5)],
        category: ['protein', 'vegetables', 'fruits', 'grains', 'others'][Math.floor(Math.random() * 5)] as any,
      })),
      mealType: [mealType],
      ageMin: Math.max(6, childAge - 6),
      ageMax: childAge + 12,
      tags: ['ai-generated', 'custom', ...validIngredients.slice(0, 2)],
    };

    setGeneratedRecipe(aiRecipe);

    // Generate alternatives
    const alternativeRecipes = mockRecipes
      .filter(recipe => recipe.ageMin <= childAge && recipe.ageMax >= childAge)
      .slice(0, 3);
    setAlternatives(alternativeRecipes);

    // Generate AI tips
    const tips = [
      `Untuk anak ${childAge} bulan, pastikan tekstur makanan sesuai kemampuan mengunyah`,
      `Bahan ${validIngredients[0]} kaya akan nutrisi yang baik untuk perkembangan anak`,
      'Selalu cuci tangan dan bahan makanan sebelum memasak',
      'Sajikan dalam porsi kecil dan biarkan anak mengeksplorasi makanan',
    ];
    setAiTips(tips);

    setIsGenerating(false);
  };

  const saveRecipe = () => {
    if (generatedRecipe) {
      // In real app, would save to database
      alert('Resep berhasil disimpan ke koleksi Anda!');
    }
  };

  return (
    <Sidebar>
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <Sparkles className="h-8 w-8 text-pink-500" />
            AI Recipe Generator
          </h1>
          <p className="text-lg text-gray-600">
            Masukkan bahan yang tersedia, biarkan AI membuat resep sehat untuk si kecil
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Input Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  Input Bahan & Preferensi
                </CardTitle>
                <CardDescription>
                  Masukkan bahan yang tersedia dan preferensi anak
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Ingredients */}
                <div className="space-y-3">
                  <Label>Bahan yang Tersedia</Label>
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2">
                      <Input
                        value={ingredient}
                        onChange={(e) => updateIngredient(index, e.target.value)}
                        placeholder={`Bahan ${index + 1} (contoh: wortel, ayam, beras)`}
                        className="flex-1"
                      />
                      {ingredients.length > 1 && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeIngredientField(index)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addIngredientField}
                    className="w-full"
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Bahan
                  </Button>
                </div>

                {/* Child Age */}
                <div className="space-y-2">
                  <Label htmlFor="child-age">Usia Anak (bulan)</Label>
                  <Input
                    id="child-age"
                    type="number"
                    value={childAge}
                    onChange={(e) => setChildAge(Number(e.target.value))}
                    min="6"
                    max="144"
                  />
                </div>

                {/* Meal Type */}
                <div className="space-y-2">
                  <Label>Jenis Makanan</Label>
                  <Select value={mealType} onValueChange={(value) => setMealType(value as MealType)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="breakfast">Sarapan</SelectItem>
                      <SelectItem value="lunch">Makan Siang</SelectItem>
                      <SelectItem value="dinner">Makan Malam</SelectItem>
                      <SelectItem value="snack">Snack</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Dietary Preferences */}
                <div className="space-y-2">
                  <Label>Preferensi Diet</Label>
                  <div className="flex flex-wrap gap-2">
                    {dietaryPreferences.map((preference) => (
                      <Badge
                        key={preference.type}
                        variant={selectedPreferences.find(p => p.type === preference.type) ? "default" : "outline"}
                        className="cursor-pointer"
                        onClick={() => handlePreferenceToggle(preference)}
                      >
                        {preference.label}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* Allergies */}
                <div className="space-y-2">
                  <Label htmlFor="allergies">Alergi (pisahkan dengan koma)</Label>
                  <Input
                    id="allergies"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    placeholder="contoh: kacang, telur, susu"
                  />
                </div>

                {/* Generate Button */}
                <Button 
                  onClick={generateRecipe}
                  disabled={isGenerating}
                  className="w-full bg-pink-500 hover:bg-pink-600"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Generating Recipe...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Generate Resep AI
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {!generatedRecipe ? (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <Sparkles className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Siap Membuat Resep AI?
                  </h3>
                  <p className="text-gray-500">
                    Masukkan bahan yang tersedia dan klik &ldquo;Generate Resep AI&rdquo; untuk memulai
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Generated Recipe */}
                <Card>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-2xl">{generatedRecipe.name}</CardTitle>
                        <CardDescription className="mt-2">
                          {generatedRecipe.description}
                        </CardDescription>
                      </div>
                      <Badge className="bg-pink-100 text-pink-800">
                        <Sparkles className="mr-1 h-3 w-3" />
                        AI Generated
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                      <div className="text-center">
                        <div className="font-medium text-gray-900">Prep Time</div>
                        <div className="text-sm text-gray-600">{generatedRecipe.prepTime} min</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900">Cook Time</div>
                        <div className="text-sm text-gray-600">{generatedRecipe.cookTime} min</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900">Porsi</div>
                        <div className="text-sm text-gray-600">{generatedRecipe.servings}</div>
                      </div>
                      <div className="text-center">
                        <div className="font-medium text-gray-900">Usia</div>
                        <div className="text-sm text-gray-600">{generatedRecipe.ageMin}-{generatedRecipe.ageMax} bulan</div>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Ingredients */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Bahan-bahan</h3>
                        <ul className="space-y-2">
                          {generatedRecipe.ingredients.map((ingredient, index) => (
                            <li key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                              <span>{ingredient.name}</span>
                              <span className="text-sm text-gray-600 font-medium">
                                {ingredient.amount} {ingredient.unit}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Instructions */}
                      <div>
                        <h3 className="text-lg font-semibold mb-3">Cara Membuat</h3>
                        <ol className="space-y-3">
                          {generatedRecipe.instructions.map((instruction, index) => (
                            <li key={index} className="flex gap-3">
                              <span className="flex-shrink-0 w-6 h-6 bg-pink-500 text-white text-sm rounded-full flex items-center justify-center">
                                {index + 1}
                              </span>
                              <span className="text-gray-700">{instruction}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      <Button onClick={saveRecipe} className="bg-pink-500 hover:bg-pink-600">
                        Simpan Resep
                      </Button>
                      <Button variant="outline">
                        Bagikan
                      </Button>
                      <Button variant="outline">
                        Tambah ke Meal Plan
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Nutrition Chart */}
                <NutritionChart 
                  nutrition={generatedRecipe.nutrition}
                  title="Analisis Nutrisi AI"
                />

                {/* AI Tips */}
                {aiTips.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Lightbulb className="h-5 w-5 text-yellow-500" />
                        Tips dari AI
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {aiTips.map((tip, index) => (
                          <li key={index} className="flex gap-3 p-3 bg-yellow-50 rounded-lg">
                            <Lightbulb className="h-4 w-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-700">{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {/* Alternative Recipes */}
                {alternatives.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Resep Alternatif</CardTitle>
                      <CardDescription>
                        Resep lain yang mungkin Anda suka berdasarkan usia anak
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {alternatives.map((recipe) => (
                          <Card key={recipe.id} className="cursor-pointer">
                            <CardHeader className="pb-2">
                              <CardTitle className="text-base">{recipe.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {recipe.prepTime + recipe.cookTime} min
                                </span>
                                <span className="flex items-center gap-1">
                                  <Users className="h-3 w-3" />
                                  {recipe.servings} porsi
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 line-clamp-2">
                                {recipe.description}
                              </p>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
