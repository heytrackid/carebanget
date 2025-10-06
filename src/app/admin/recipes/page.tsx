'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Plus, Edit, Trash2, Save, Eye, Search, Filter, MoreHorizontal, Clock } from 'lucide-react';
import { ReactNode } from 'react';
import { Recipe } from '@/types';
import Link from 'next/link';
import { BulkActions, BulkAction, useBulkSelection } from '@/components/ui/bulk-actions';
import { mockRecipes } from '@/data/mockData';

// Reusable Admin Layout (extracted to avoid duplication)
function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Parenting Meal Planner
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/admin">
              <Button variant="outline" size="sm">
                ← Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <nav className="p-6">
            <div className="space-y-2">
              <Link href="/admin">
                <Button variant="ghost" className="w-full justify-start">
                  📊 Dashboard
                </Button>
              </Link>
              <Link href="/admin/recipes">
                <Button variant="default" className="w-full justify-start">
                  🍳 Manage Recipes
                </Button>
              </Link>
              <Link href="/admin/articles">
                <Button variant="ghost" className="w-full justify-start">
                  📝 Manage Articles
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="ghost" className="w-full justify-start">
                  👥 Users
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="ghost" className="w-full justify-start">
                  📈 Analytics
                </Button>
              </Link>
            </div>
          </nav>
        </aside>

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// Recipe Form Component
function RecipeForm({ recipe, onSave, onCancel }: { recipe?: Recipe; onSave: (recipe: Recipe) => void; onCancel: () => void }) {
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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

  const updateIngredient = (index: number, field: string, value: any) => {
    const updatedIngredients = [...formData.ingredients];
    updatedIngredients[index] = { ...updatedIngredients[index], [field]: value };
    setFormData({ ...formData, ingredients: updatedIngredients });
  };

  const removeIngredient = (index: number) => {
    setFormData({
      ...formData,
      ingredients: formData.ingredients.filter((_: any, i: number) => i !== index)
    });
  };

  const addInstruction = () => {
    setFormData({
      ...formData,
      instructions: [...formData.instructions, '']
    });
  };

  const updateInstruction = (index: number, value: string) => {
    const updatedInstructions = [...formData.instructions];
    updatedInstructions[index] = value;
    setFormData({ ...formData, instructions: updatedInstructions });
  };

  const removeInstruction = (index: number) => {
    setFormData({
      ...formData,
      instructions: formData.instructions.filter((_: any, i: number) => i !== index)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Nama Resep</label>
          <Input
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            placeholder="Masukkan nama resep..."
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Kesulitan</label>
          <Select value={formData.difficulty as 'easy' | 'medium' | 'hard'} onValueChange={(value) => setFormData({...formData, difficulty: value as 'easy' | 'medium' | 'hard'})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Mudah</SelectItem>
              <SelectItem value="medium">Sedang</SelectItem>
              <SelectItem value="hard">Sulit</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Deskripsi</label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({...formData, description: e.target.value})}
          placeholder="Deskripsi singkat resep..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Prep Time (menit)</label>
          <Input
            type="number"
            value={formData.prepTime}
            onChange={(e) => setFormData({...formData, prepTime: parseInt(e.target.value) || 0})}
            min="0"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Cook Time (menit)</label>
          <Input
            type="number"
            value={formData.cookTime}
            onChange={(e) => setFormData({...formData, cookTime: parseInt(e.target.value) || 0})}
            min="0"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Servings</label>
          <Input
            type="number"
            value={formData.servings}
            onChange={(e) => setFormData({...formData, servings: parseInt(e.target.value) || 1})}
            min="1"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Usia Anak (bulan)</label>
          <div className="flex gap-2">
            <Input
              type="number"
              value={formData.ageMin}
              onChange={(e) => setFormData({...formData, ageMin: parseInt(e.target.value) || 0})}
              placeholder="Min"
              min="0"
              max="144"
            />
            <Input
              type="number"
              value={formData.ageMax}
              onChange={(e) => setFormData({...formData, ageMax: parseInt(e.target.value) || 144})}
              placeholder="Max"
              min="0"
              max="144"
            />
          </div>
        </div>
      </div>

      {/* Ingredients */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <label className="text-sm font-medium">Bahan-bahan</label>
          <Button type="button" variant="outline" size="sm" onClick={addIngredient}>
            <Plus className="h-4 w-4 mr-2" />
            Tambah Bahan
          </Button>
        </div>
        <div className="space-y-2">
          {formData.ingredients.map((ingredient, index) => (
            <div key={ingredient.id} className="flex gap-2 items-end">
              <Input
                value={ingredient.name}
                onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                placeholder="Nama bahan"
                className="flex-1"
              />
              <Input
                type="number"
                value={ingredient.amount}
                onChange={(e) => updateIngredient(index, 'amount', parseFloat(e.target.value) || 0)}
                placeholder="Jumlah"
                className="w-24"
              />
              <Input
                value={ingredient.unit}
                onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                placeholder="Satuan"
                className="w-20"
              />
              <Select
                value={ingredient.category}
                onValueChange={(value) => updateIngredient(index, 'category', value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="protein">Protein</SelectItem>
                  <SelectItem value="vegetables">Sayuran</SelectItem>
                  <SelectItem value="fruits">Buah</SelectItem>
                  <SelectItem value="grains">Biji-bijian</SelectItem>
                  <SelectItem value="dairy">Susu</SelectItem>
                  <SelectItem value="others">Lainnya</SelectItem>
                </SelectContent>
              </Select>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeIngredient(index)}
                disabled={formData.ingredients.length === 1}
              >
                <Trash2 className="h-4 w-4" />
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
            <Plus className="h-4 w-4 mr-2" />
            Tambah Langkah
          </Button>
        </div>
        <div className="space-y-2">
          {formData.instructions.map((instruction, index) => (
            <div key={index} className="flex gap-2 items-start">
              <span className="text-sm font-medium mt-2 w-6">{index + 1}.</span>
              <Input
                value={instruction}
                onChange={(e) => updateInstruction(index, e.target.value)}
                placeholder={`Langkah ${index + 1}`}
                className="flex-1"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => removeInstruction(index)}
                disabled={formData.instructions.length === 1}
                className="mt-1"
              >
                <Trash2 className="h-4 w-4" />
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
          <Save className="mr-2 h-4 w-4" />
          {recipe ? 'Update Resep' : 'Simpan Resep'}
        </Button>
      </div>
    </form>
  );
}

export default function AdminRecipesPage() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');

  // Bulk selection using the reusable hook
  const {
    selectedItems,
    setSelectedItems,
    toggleItem,
    toggleAll,
    clearSelection,
    isSelected,
    selectedCount
  } = useBulkSelection<Recipe>(filteredRecipes)

  // Load recipes
  useEffect(() => {
    setRecipes(mockRecipes);
  }, []);

  // Filter recipes
  useEffect(() => {
    let filtered = recipes;

    if (searchTerm) {
      filtered = filtered.filter(recipe =>
        recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        recipe.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedDifficulty !== 'all') {
      filtered = filtered.filter(recipe => recipe.difficulty === selectedDifficulty);
    }

    setFilteredRecipes(filtered);
  }, [recipes, searchTerm, selectedDifficulty]);

  const handleSaveRecipe = (recipeData: Recipe) => {
    if (isEditing && selectedRecipe) {
      // Update existing
      setRecipes(prev => prev.map(r => r.id === selectedRecipe.id ? recipeData : r));
    } else {
      // Add new
      setRecipes(prev => [...prev, recipeData]);
    }
    setIsDialogOpen(false);
    setSelectedRecipe(null);
    setIsEditing(false);
  };

  const handleEditRecipe = (recipe: Recipe) => {
    setSelectedRecipe(recipe);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteRecipe = (recipeId: string) => {
    if (confirm('Yakin ingin menghapus resep ini?')) {
      setRecipes(prev => prev.filter(r => r.id !== recipeId));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Yakin ingin menghapus ${selectedItems.length} resep?`)) {
      setRecipes(prev => prev.filter(r => !selectedItems.some(selected => selected.id === r.id)));
      clearSelection();
    }
  };

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
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Manage Recipes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Recipes</h1>
            <p className="text-gray-600 mt-1">Kelola semua resep masakan anak</p>
          </div>
          <Link href="/admin/recipes/new">
            <Button onClick={() => { setIsEditing(false); setSelectedRecipe(null); }}>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Resep
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{recipes.length}</div>
              <p className="text-sm text-gray-600">Total Resep</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {recipes.filter(r => r.difficulty === 'easy').length}
              </div>
              <p className="text-sm text-gray-600">Resep Mudah</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {recipes.filter(r => r.difficulty === 'medium').length}
              </div>
              <p className="text-sm text-gray-600">Resep Sedang</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-red-600">
                {recipes.filter(r => r.difficulty === 'hard').length}
              </div>
              <p className="text-sm text-gray-600">Resep Sulit</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari resep..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Kesulitan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kesulitan</SelectItem>
                  <SelectItem value="easy">Mudah</SelectItem>
                  <SelectItem value="medium">Sedang</SelectItem>
                  <SelectItem value="hard">Sulit</SelectItem>
                </SelectContent>
              </Select>
              {selectedItems.length > 0 && (
                <Button variant="destructive" onClick={handleBulkDelete}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete ({selectedItems.length})
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recipes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Resep ({filteredRecipes.length})</CardTitle>
            <CardDescription>
              Klik checkbox untuk bulk actions, klik nama resep untuk preview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.length === filteredRecipes.length && filteredRecipes.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedItems(filteredRecipes);
                        } else {
                          setSelectedItems([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Nama Resep</TableHead>
                  <TableHead>Kesulitan</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Usia</TableHead>
                  <TableHead>Servings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRecipes.map((recipe) => (
                  <TableRow key={recipe.id}>
                    <TableCell>
                      <Checkbox
                        checked={isSelected(recipe)}
                        onCheckedChange={() => toggleItem(recipe)}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{recipe.name}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {recipe.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getDifficultyColor(recipe.difficulty)}>
                        {getDifficultyText(recipe.difficulty)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {recipe.prepTime + recipe.cookTime} min
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">
                      {recipe.ageMin}-{recipe.ageMax} bln
                    </TableCell>
                    <TableCell className="text-sm">
                      {recipe.servings} porsi
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/recipes/${recipe.id}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditRecipe(recipe)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteRecipe(recipe.id)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredRecipes.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">🍳</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tidak ada resep ditemukan
                </h3>
                <p className="text-gray-500 mb-4">
                  Coba ubah filter pencarian atau buat resep baru
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Resep Pertama
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
