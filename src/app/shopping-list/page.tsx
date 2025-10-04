'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ShoppingCart, Plus, Download, Share2, Trash2, Check } from 'lucide-react';
import { mockRecipes } from '@/data/mockData';
import { Ingredient, ShoppingItem } from '@/types';

export default function ShoppingListPage() {
  const [shoppingItems, setShoppingItems] = useState<ShoppingItem[]>([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemAmount, setNewItemAmount] = useState('');
  const [newItemUnit, setNewItemUnit] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('others');

  // Generate shopping list from recipes (mock implementation)
  const generateFromMealPlan = () => {
    const allIngredients: { [key: string]: ShoppingItem } = {};

    // Combine ingredients from multiple recipes
    mockRecipes.slice(0, 3).forEach(recipe => {
      recipe.ingredients.forEach(ingredient => {
        const key = ingredient.name.toLowerCase();
        if (allIngredients[key]) {
          allIngredients[key].totalAmount += ingredient.amount;
        } else {
          allIngredients[key] = {
            ingredient,
            totalAmount: ingredient.amount,
            unit: ingredient.unit,
            category: ingredient.category,
            isChecked: false,
          };
        }
      });
    });

    setShoppingItems(Object.values(allIngredients));
  };

  const addCustomItem = () => {
    if (!newItemName.trim() || !newItemAmount.trim()) return;

    const newItem: ShoppingItem = {
      ingredient: {
        id: Date.now().toString(),
        name: newItemName,
        amount: parseFloat(newItemAmount),
        unit: newItemUnit || 'pcs',
        category: selectedCategory as any,
      },
      totalAmount: parseFloat(newItemAmount),
      unit: newItemUnit || 'pcs',
      category: selectedCategory as any,
      isChecked: false,
    };

    setShoppingItems([...shoppingItems, newItem]);
    setNewItemName('');
    setNewItemAmount('');
    setNewItemUnit('');
  };

  const toggleItem = (index: number) => {
    const updated = [...shoppingItems];
    updated[index].isChecked = !updated[index].isChecked;
    setShoppingItems(updated);
  };

  const removeItem = (index: number) => {
    const updated = shoppingItems.filter((_, i) => i !== index);
    setShoppingItems(updated);
  };

  const clearCheckedItems = () => {
    const updated = shoppingItems.filter(item => !item.isChecked);
    setShoppingItems(updated);
  };

  const exportToPDF = () => {
    // Mock implementation - in real app, would generate PDF
    alert('Fitur export PDF akan segera tersedia!');
  };

  const shareToWhatsApp = () => {
    const message = `*Shopping List - Meal Planner*\n\n${shoppingItems
      .map(item => `${item.isChecked ? '✅' : '⭕'} ${item.ingredient.name} - ${item.totalAmount} ${item.unit}`)
      .join('\n')}`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/?text=${encodedMessage}`, '_blank');
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      protein: '🥩',
      vegetables: '🥕',
      fruits: '🍎',
      grains: '🌾',
      dairy: '🥛',
      spices: '🧂',
      oils: '🫒',
      others: '📦',
    };
    return icons[category] || '📦';
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      protein: 'bg-red-100 text-red-800',
      vegetables: 'bg-green-100 text-green-800',
      fruits: 'bg-yellow-100 text-yellow-800',
      grains: 'bg-amber-100 text-amber-800',
      dairy: 'bg-blue-100 text-blue-800',
      spices: 'bg-purple-100 text-purple-800',
      oils: 'bg-orange-100 text-orange-800',
      others: 'bg-gray-100 text-gray-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const groupedItems = shoppingItems.reduce((groups, item) => {
    const category = item.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(item);
    return groups;
  }, {} as { [key: string]: ShoppingItem[] });

  const checkedCount = shoppingItems.filter(item => item.isChecked).length;
  const totalCount = shoppingItems.length;

  return (
    <Sidebar>
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Shopping List</h1>
          <p className="text-lg text-gray-600">
            Kelola daftar belanja Anda berdasarkan meal plan atau tambahkan item custom
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Controls Panel */}
          <div className="lg:col-span-1">
            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShoppingCart className="h-5 w-5" />
                  Generate Shopping List
                </CardTitle>
                <CardDescription>
                  Buat daftar belanja otomatis dari meal plan Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={generateFromMealPlan}
                  className="w-full bg-pink-500 hover:bg-pink-600"
                >
                  Generate dari Meal Plan
                </Button>
              </CardContent>
            </Card>

            <Card className="mb-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Tambah Item Manual
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Input
                    placeholder="Nama bahan"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <Input
                    placeholder="Jumlah"
                    type="number"
                    value={newItemAmount}
                    onChange={(e) => setNewItemAmount(e.target.value)}
                  />
                  <Input
                    placeholder="Satuan"
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                  />
                </div>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="protein">Protein</SelectItem>
                    <SelectItem value="vegetables">Sayuran</SelectItem>
                    <SelectItem value="fruits">Buah-buahan</SelectItem>
                    <SelectItem value="grains">Biji-bijian</SelectItem>
                    <SelectItem value="dairy">Dairy</SelectItem>
                    <SelectItem value="spices">Bumbu</SelectItem>
                    <SelectItem value="oils">Minyak</SelectItem>
                    <SelectItem value="others">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={addCustomItem} className="w-full">
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Item
                </Button>
              </CardContent>
            </Card>

            {totalCount > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Share2 className="h-5 w-5" />
                    Export & Share
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button onClick={exportToPDF} variant="outline" className="w-full">
                    <Download className="mr-2 h-4 w-4" />
                    Export PDF
                  </Button>
                  <Button onClick={shareToWhatsApp} variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share ke WhatsApp
                  </Button>
                  {checkedCount > 0 && (
                    <Button onClick={clearCheckedItems} variant="destructive" className="w-full">
                      <Trash2 className="mr-2 h-4 w-4" />
                      Hapus Item Selesai ({checkedCount})
                    </Button>
                  )}
                </CardContent>
              </Card>
            )}
          </div>

          {/* Shopping List */}
          <div className="lg:col-span-2">
            {totalCount === 0 ? (
              <Card className="h-96 flex items-center justify-center">
                <div className="text-center">
                  <ShoppingCart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    Shopping List Kosong
                  </h3>
                  <p className="text-gray-500">
                    Generate dari meal plan atau tambahkan item manual untuk memulai
                  </p>
                </div>
              </Card>
            ) : (
              <div className="space-y-6">
                {/* Progress */}
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">Progress Belanja</span>
                      <span className="text-sm text-gray-500">
                        {checkedCount} dari {totalCount} item
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-pink-500 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${totalCount > 0 ? (checkedCount / totalCount) * 100 : 0}%` }}
                      ></div>
                    </div>
                  </CardContent>
                </Card>

                {/* Shopping Items by Category */}
                {Object.entries(groupedItems).map(([category, items]) => (
                  <Card key={category}>
                    <CardHeader className="pb-3">
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-2xl">{getCategoryIcon(category)}</span>
                        <span className="capitalize">
                          {category === 'vegetables' ? 'Sayuran' :
                           category === 'fruits' ? 'Buah-buahan' :
                           category === 'grains' ? 'Biji-bijian' :
                           category === 'protein' ? 'Protein' :
                           category === 'dairy' ? 'Dairy' :
                           category === 'spices' ? 'Bumbu' :
                           category === 'oils' ? 'Minyak' :
                           'Lainnya'}
                        </span>
                        <Badge className={getCategoryColor(category)}>
                          {items.length} item
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {items.map((item, index) => {
                          const globalIndex = shoppingItems.findIndex(si => si === item);
                          return (
                            <div 
                              key={globalIndex}
                              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                                item.isChecked 
                                  ? 'bg-green-50 border-green-200 opacity-75' 
                                  : 'bg-white border-gray-200 hover:border-gray-300'
                              }`}
                            >
                              <div className="flex items-center space-x-3">
                                <Checkbox
                                  checked={item.isChecked}
                                  onCheckedChange={() => toggleItem(globalIndex)}
                                />
                                <div className={item.isChecked ? 'line-through text-gray-500' : ''}>
                                  <div className="font-medium">{item.ingredient.name}</div>
                                  <div className="text-sm text-gray-500">
                                    {item.totalAmount} {item.unit}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                {item.isChecked && (
                                  <Check className="h-4 w-4 text-green-500" />
                                )}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => removeItem(globalIndex)}
                                  className="text-red-500 hover:text-red-700"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
