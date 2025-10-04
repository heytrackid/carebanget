'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { NutritionChart } from '@/components/nutrition/NutritionChart';
import { Clock, Users, ChefHat, Heart, Share2, Bookmark, ArrowLeft, Plus } from 'lucide-react';
import { mockRecipes } from '@/data/mockData';

export default function RecipeDetailPage() {
  const params = useParams();
  const recipeId = params.id as string;
  
  // Find recipe by ID (in real app, this would be an API call)
  const recipe = mockRecipes.find(r => r.id === recipeId) || mockRecipes[0];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyText = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'Mudah';
      case 'medium': return 'Sedang';
      case 'hard': return 'Sulit';
      default: return difficulty;
    }
  };

  return (
    <Sidebar>
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/dashboard">Dashboard</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/recipes">Resep</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{recipe.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Button */}
        <div className="mb-6">
          <Link href="/recipes">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Resep
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recipe Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <Badge className={getDifficultyColor(recipe.difficulty)}>
                        {getDifficultyText(recipe.difficulty)}
                      </Badge>
                      <Badge variant="outline">
                        {recipe.ageMin}-{recipe.ageMax} bulan
                      </Badge>
                    </div>
                    <CardTitle className="text-3xl mb-3">{recipe.name}</CardTitle>
                    <CardDescription className="text-lg">
                      {recipe.description}
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="font-medium text-gray-900">Prep Time</div>
                    <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      <Clock className="h-4 w-4" />
                      {recipe.prepTime} min
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">Cook Time</div>
                    <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      <ChefHat className="h-4 w-4" />
                      {recipe.cookTime} min
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">Porsi</div>
                    <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      <Users className="h-4 w-4" />
                      {recipe.servings}
                    </div>
                  </div>
                  <div className="text-center">
                    <div className="font-medium text-gray-900">Kalori</div>
                    <div className="text-sm text-gray-600 flex items-center justify-center gap-1">
                      <Heart className="h-4 w-4" />
                      {recipe.nutrition.calories} kcal
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Ingredients */}
            <Card>
              <CardHeader>
                <CardTitle>Bahan-bahan</CardTitle>
                <CardDescription>
                  Semua bahan yang dibutuhkan untuk {recipe.servings} porsi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {recipe.ingredients.map((ingredient, index) => (
                    <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                      <span className="font-medium">{ingredient.name}</span>
                      <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded">
                        {ingredient.amount} {ingredient.unit}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Instructions */}
            <Card>
              <CardHeader>
                <CardTitle>Cara Membuat</CardTitle>
                <CardDescription>
                  Ikuti langkah-langkah berikut untuk hasil terbaik
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recipe.instructions.map((instruction, index) => (
                    <div key={index} className="flex gap-4">
                      <div className="flex-shrink-0 w-8 h-8 bg-pink-500 text-white text-sm rounded-full flex items-center justify-center font-medium">
                        {index + 1}
                      </div>
                      <div className="flex-1 pt-1">
                        <p className="text-gray-700 leading-relaxed">{instruction}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tags */}
            <Card>
              <CardHeader>
                <CardTitle>Tags & Kategori</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {recipe.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Nutrition Chart */}
            <NutritionChart 
              nutrition={recipe.nutrition}
              title="Informasi Nutrisi"
              showDetails={false}
            />

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full bg-pink-500 hover:bg-pink-600">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah ke Meal Plan
                </Button>
                <Button variant="outline" className="w-full">
                  <Heart className="mr-2 h-4 w-4" />
                  Simpan ke Favorit
                </Button>
                <Button variant="outline" className="w-full">
                  <Share2 className="mr-2 h-4 w-4" />
                  Bagikan Resep
                </Button>
              </CardContent>
            </Card>

            {/* Recipe Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Tips Memasak</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Pastikan semua bahan sudah disiapkan sebelum mulai memasak</li>
                  <li>• Sesuaikan tekstur makanan dengan kemampuan mengunyah anak</li>
                  <li>• Jangan tambahkan garam atau gula untuk anak di bawah 1 tahun</li>
                  <li>• Selalu cicipi suhu makanan sebelum disajikan</li>
                </ul>
              </CardContent>
            </Card>

            {/* Related Recipes */}
            <Card>
              <CardHeader>
                <CardTitle>Resep Serupa</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {mockRecipes.filter(r => r.id !== recipe.id).slice(0, 3).map((relatedRecipe) => (
                    <Link key={relatedRecipe.id} href={`/recipes/${relatedRecipe.id}`}>
                      <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                        <div className="font-medium text-sm">{relatedRecipe.name}</div>
                        <div className="text-xs text-gray-500 mt-1">
                          {relatedRecipe.prepTime + relatedRecipe.cookTime} min • {relatedRecipe.servings} porsi
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
