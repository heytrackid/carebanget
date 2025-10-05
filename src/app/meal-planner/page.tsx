'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, Users, ChefHat, Sparkles } from 'lucide-react';
import { mockRecipes, dietaryPreferences } from '@/data/mockData';
import { DietaryPreference, MealPlan, DailyMeal } from '@/types';

export default function MealPlannerPage() {
  const [childAge, setChildAge] = useState<number>(12);
  const [planDuration, setPlanDuration] = useState<number>(7);
  const [selectedPreferences, setSelectedPreferences] = useState<DietaryPreference[]>([]);
  const [allergies, setAllergies] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<MealPlan | null>(null);

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

  const generateMealPlan = async () => {
    setIsGenerating(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Filter recipes based on age
    const suitableRecipes = mockRecipes.filter(recipe =>
      recipe.ageMin <= childAge && recipe.ageMax >= childAge
    );

    // Generate mock meal plan
    const meals: DailyMeal[] = [];
    for (let i = 0; i < planDuration; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      meals.push({
        date,
        breakfast: suitableRecipes[Math.floor(Math.random() * suitableRecipes.length)],
        lunch: suitableRecipes[Math.floor(Math.random() * suitableRecipes.length)],
        dinner: suitableRecipes[Math.floor(Math.random() * suitableRecipes.length)],
        snacks: [suitableRecipes[Math.floor(Math.random() * suitableRecipes.length)]],
      });
    }

    const mealPlan: MealPlan = {
      id: Date.now().toString(),
      childId: 'child-1', // mock child ID
      startDate: new Date(),
      endDate: new Date(Date.now() + planDuration * 24 * 60 * 60 * 1000),
      meals,
      totalNutrition: {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
        fiber: 0,
        sugar: 0,
        sodium: 0
      },
      shoppingList: []
    };
    setGeneratedPlan(mealPlan);
    setIsGenerating(false);
  };
  return (
    <Sidebar>
      <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Rencana Makan</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Buat jadwal makan harian/mingguan yang terpersonalisasi untuk anak Anda
            </p>
          </div>
        </div>

        {/* Explanatory Card */}
        <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <Calendar className="h-6 w-6 text-blue-600 mt-0.5" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-1">
                  Apa itu Rencana Makan?
                </h3>
                <p className="text-sm text-blue-800">
                  Fitur ini akan membuat <strong>jadwal makan lengkap</strong> untuk anak Anda berdasarkan usia, 
                  preferensi diet, dan alergi. Sistem akan otomatis memilih resep yang sesuai dan membuat 
                  jadwal harian yang terstruktur.
                </p>
                <div className="mt-2 text-xs text-blue-700">
                  💡 <strong>Tidak punya ide resep?</strong> Lihat <em>Koleksi Resep</em> untuk opsi lainnya
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Configuration Panel */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ChefHat className="h-5 w-5" />
                  Pengaturan Meal Plan
                </CardTitle>
                <CardDescription>
                  Atur preferensi untuk mendapatkan meal plan yang sesuai
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Child Age */}
                <div className="space-y-2">
                  <Label htmlFor="child-age">Usia Anak (bulan)</Label>
                  <Input
                    id="child-age"
                    type="number"
                    value={childAge}
                    onChange={(e) => setChildAge(Number(e.target.value))}
                    min="0"
                    max="144"
                  />
                  <p className="text-sm text-gray-500">
                    {childAge < 6 ? 'ASI Eksklusif' : 
                     childAge < 12 ? 'MPASI' : 
                     childAge < 24 ? 'Makanan Keluarga' : 'Anak Balita'}
                  </p>
                </div>

                {/* Plan Duration */}
                <div className="space-y-2">
                  <Label>Durasi Meal Plan</Label>
                  <Select value={planDuration.toString()} onValueChange={(value) => setPlanDuration(Number(value))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Hari</SelectItem>
                      <SelectItem value="7">7 Hari</SelectItem>
                      <SelectItem value="30">30 Hari</SelectItem>
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
                  onClick={generateMealPlan}
                  disabled={isGenerating}
                  className="w-full bg-pink-500 hover:bg-pink-600"
                >
                  {isGenerating ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Calendar className="mr-2 h-4 w-4" />
                      Generate Meal Plan
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Results Panel */}
          <div className="lg:col-span-2">
            {!generatedPlan ? (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Belum Ada Meal Plan
                  </h3>
                  <p className="text-gray-500">
                    Atur preferensi di sebelah kiri dan klik "Generate Meal Plan" untuk memulai
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Meal Plan {planDuration} Hari
                  </h2>
                  <Button variant="outline">
                    <Calendar className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                </div>

                <Tabs defaultValue="0" className="w-full">
                  <TabsList className="grid w-full grid-cols-7 overflow-x-auto">
                    {generatedPlan.meals.map((meal: DailyMeal, index: number) => (
                      <TabsTrigger key={index} value={index.toString()}>
                        Hari {index + 1}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {generatedPlan.meals.map((meal: DailyMeal, index: number) => (
                    <TabsContent key={index} value={index.toString()}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Breakfast */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                              Sarapan
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <h4 className="font-medium mb-2">{meal.breakfast?.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {(meal.breakfast?.prepTime || 0) + (meal.breakfast?.cookTime || 0)} min
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {meal.breakfast?.servings} porsi
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{meal.breakfast?.description}</p>
                          </CardContent>
                        </Card>

                        {/* Lunch */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                              Makan Siang
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <h4 className="font-medium mb-2">{meal.lunch?.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {meal.lunch?.prepTime + meal.lunch?.cookTime} min
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {meal.lunch?.servings} porsi
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{meal.lunch?.description}</p>
                          </CardContent>
                        </Card>

                        {/* Dinner */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                              Makan Malam
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            <h4 className="font-medium mb-2">{meal.dinner?.name}</h4>
                            <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {meal.dinner?.prepTime + meal.dinner?.cookTime} min
                              </span>
                              <span className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                {meal.dinner?.servings} porsi
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{meal.dinner?.description}</p>
                          </CardContent>
                        </Card>

                        {/* Snacks */}
                        <Card>
                          <CardHeader className="pb-3">
                            <CardTitle className="text-lg flex items-center gap-2">
                              <div className="w-3 h-3 bg-purple-400 rounded-full"></div>
                              Snack
                            </CardTitle>
                          </CardHeader>
                          <CardContent>
                            {meal.snacks.map((snack: any, snackIndex: number) => (
                              <div key={snackIndex}>
                                <h4 className="font-medium mb-2">{snack.name}</h4>
                                <div className="flex items-center gap-4 text-sm text-gray-500 mb-2">
                                  <span className="flex items-center gap-1">
                                    <Clock className="h-3 w-3" />
                                    {snack.prepTime + snack.cookTime} min
                                  </span>
                                  <span className="flex items-center gap-1">
                                    <Users className="h-3 w-3" />
                                    {snack.servings} porsi
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600">{snack.description}</p>
                              </div>
                            ))}
                          </CardContent>
                        </Card>
                      </div>
                    </TabsContent>
                  ))}
                </Tabs>
              </div>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
