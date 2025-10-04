'use client';

import React, { useState, useMemo, useEffect } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { Search, Clock, Users, ChefHat } from 'lucide-react';
import { mockRecipes } from '@/data/mockData';
import { Recipe, MealType } from '@/types';

interface RecipeTableRowProps {
  recipe: Recipe;
  getDifficultyColor: (difficulty: string) => string;
  getDifficultyText: (difficulty: string) => string;
}

const RecipeTableRow = React.memo<RecipeTableRowProps>(({ recipe, getDifficultyColor, getDifficultyText }) => {
  return (
    <TableRow className="hover:bg-gray-50">
      <TableCell>
        <div className="space-y-1">
          <Link
            href={`/recipes/${recipe.id}`}
            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
          >
            {recipe.name}
          </Link>
          <p className="text-sm text-gray-500 line-clamp-2">
            {recipe.description}
          </p>
        </div>
      </TableCell>
      <TableCell>
        <Badge className={getDifficultyColor(recipe.difficulty)}>
          <ChefHat className="h-3 w-3 mr-1" />
          {getDifficultyText(recipe.difficulty)}
        </Badge>
      </TableCell>
      <TableCell className="text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          {recipe.prepTime + recipe.cookTime} min
        </div>
      </TableCell>
      <TableCell className="text-sm text-gray-600">
        <div className="flex items-center gap-1">
          <Users className="h-3 w-3" />
          {recipe.servings} porsi
        </div>
      </TableCell>
      <TableCell className="text-sm text-gray-600">
        {recipe.ageMin}-{recipe.ageMax} bulan
      </TableCell>
      <TableCell className="text-sm text-gray-600">
        {recipe.nutrition.calories} kcal
      </TableCell>
      <TableCell>
        <Link href={`/recipes/${recipe.id}`}>
          <Button variant="outline" size="sm">
            Lihat Detail
          </Button>
        </Link>
      </TableCell>
    </TableRow>
  );
});

RecipeTableRow.displayName = 'RecipeTableRow';

export default function RecipesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedMealType, setSelectedMealType] = useState('all');
  const [selectedAgeRange, setSelectedAgeRange] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

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

  // Optimized filtering with useMemo
  const filteredRecipes = useMemo(() => {
    let filtered = mockRecipes;

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

    if (selectedMealType !== 'all') {
      filtered = filtered.filter(recipe => recipe.mealType.includes(selectedMealType as MealType));
    }

    if (selectedAgeRange !== 'all') {
      const [minAge, maxAge] = selectedAgeRange.split('-').map(Number);
      filtered = filtered.filter(recipe =>
        recipe.ageMin <= maxAge && recipe.ageMax >= minAge
      );
    }

    return filtered;
  }, [searchTerm, selectedDifficulty, selectedMealType, selectedAgeRange]);

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedDifficulty, selectedMealType, selectedAgeRange]);

  // Optimized pagination with useMemo
  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredRecipes.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = filteredRecipes.slice(startIndex, endIndex);

    return {
      totalPages,
      startIndex,
      endIndex,
      currentItems
    };
  }, [filteredRecipes, currentPage, itemsPerPage]);

  // Generate pagination items
  const getPaginationItems = useMemo(() => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(paginationData.totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      items.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className={`px-3 py-2 text-sm rounded-md ${
            currentPage === 1
              ? 'bg-pink-500 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        items.push(
          <span key="start-ellipsis" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
    }

    // Add visible page numbers
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-2 text-sm rounded-md ${
            currentPage === i
              ? 'bg-pink-500 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    // Add last page and ellipsis if needed
    if (endPage < paginationData.totalPages) {
      if (endPage < paginationData.totalPages - 1) {
        items.push(
          <span key="end-ellipsis" className="px-2 text-gray-500">
            ...
          </span>
        );
      }
      items.push(
        <button
          key={paginationData.totalPages}
          onClick={() => setCurrentPage(paginationData.totalPages)}
          className={`px-3 py-2 text-sm rounded-md ${
            currentPage === paginationData.totalPages
              ? 'bg-pink-500 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {paginationData.totalPages}
        </button>
      );
    }

    return items;
  }, [paginationData.totalPages, currentPage, setCurrentPage]);

  return (
    <Sidebar>
      <div className="max-w-7xl mx-auto py-6 px-4">
        {/* Breadcrumb */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Dashboard</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Recipes</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Resep Masakan Anak</h1>
          <p className="text-gray-600 mt-2">Koleksi resep sehat dan lezat untuk buah hati</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{mockRecipes.length}</div>
              <p className="text-sm text-gray-600">Total Resep</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {mockRecipes.filter(r => r.difficulty === 'easy').length}
              </div>
              <p className="text-sm text-gray-600">Resep Mudah</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {mockRecipes.filter(r => r.difficulty === 'medium').length}
              </div>
              <p className="text-sm text-gray-600">Resep Sedang</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-purple-600">
                {filteredRecipes.length}
              </div>
              <p className="text-sm text-gray-600">Hasil Filter</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filter Resep</CardTitle>
            <CardDescription>Cari dan filter resep berdasarkan preferensi Anda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Cari Resep</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Nama resep, bahan, atau deskripsi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Tingkat Kesulitan</label>
                <Select value={selectedDifficulty} onValueChange={setSelectedDifficulty}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Tingkat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tingkat</SelectItem>
                    <SelectItem value="easy">Mudah</SelectItem>
                    <SelectItem value="medium">Sedang</SelectItem>
                    <SelectItem value="hard">Sulit</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Jenis Makanan</label>
                <Select value={selectedMealType} onValueChange={setSelectedMealType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Jenis" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Jenis</SelectItem>
                    <SelectItem value="breakfast">Sarapan</SelectItem>
                    <SelectItem value="lunch">Makan Siang</SelectItem>
                    <SelectItem value="dinner">Makan Malam</SelectItem>
                    <SelectItem value="snack">Snack</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Usia Anak</label>
                <Select value={selectedAgeRange} onValueChange={setSelectedAgeRange}>
                  <SelectTrigger>
                    <SelectValue placeholder="Semua Usia" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Usia</SelectItem>
                    <SelectItem value="6-12">6-12 bulan</SelectItem>
                    <SelectItem value="12-24">1-2 tahun</SelectItem>
                    <SelectItem value="24-60">2-5 tahun</SelectItem>
                    <SelectItem value="60-144">5+ tahun</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Menampilkan {paginationData.startIndex + 1}-{Math.min(paginationData.endIndex, filteredRecipes.length)} dari {filteredRecipes.length} resep
            </p>
            <Link href="/recipes/new">
              <Button variant="outline" size="sm">
                <ChefHat className="mr-2 h-4 w-4" />
                Tambah Resep Baru
              </Button>
            </Link>
          </div>
        </div>

        {/* Recipes Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Resep ({filteredRecipes.length})</CardTitle>
            <CardDescription>
              Klik nama resep untuk melihat detail lengkap
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nama Resep</TableHead>
                  <TableHead>Kesulitan</TableHead>
                  <TableHead>Waktu</TableHead>
                  <TableHead>Porsi</TableHead>
                  <TableHead>Usia Anak</TableHead>
                  <TableHead>Kalori</TableHead>
                  <TableHead className="w-24">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginationData.currentItems.map((recipe: Recipe) => (
                  <RecipeTableRow
                    key={recipe.id}
                    recipe={recipe}
                    getDifficultyColor={getDifficultyColor}
                    getDifficultyText={getDifficultyText}
                  />
                ))}
              </TableBody>
            </Table>

            {/* Pagination */}
            {paginationData.totalPages > 1 && (
              <div className="flex justify-center items-center mt-6 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>

                <div className="flex items-center gap-1">
                  {getPaginationItems}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(paginationData.totalPages, currentPage + 1))}
                  disabled={currentPage === paginationData.totalPages}
                >
                  Next
                </Button>
              </div>
            )}

            {filteredRecipes.length === 0 && (
              <div className="text-center py-12">
                <ChefHat className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tidak ada resep ditemukan
                </h3>
                <p className="text-gray-500">
                  Coba ubah filter pencarian atau kata kunci Anda
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Sidebar>
  );
}
