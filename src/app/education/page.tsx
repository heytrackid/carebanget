'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import Link from 'next/link';
import { BookOpen, Search, Filter, Clock, Baby, Heart, AlertCircle, Eye, Grid3X3 } from 'lucide-react';
import { mockEducationalContent } from '@/data/mockData';
import { EducationalContent } from '@/types';

type ViewMode = 'table' | 'grid';

export default function EducationPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedAgeRange, setSelectedAgeRange] = useState('all');
  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Filter content
  const filteredContent = useMemo(() => {
    let filtered = mockEducationalContent;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(content =>
        content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
        content.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    // Category filter
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(content =>
        content.category === selectedCategory
      );
    }

    // Age range filter
    if (selectedAgeRange !== 'all') {
      const [minAge, maxAge] = selectedAgeRange.split('-').map(Number);
      filtered = filtered.filter(content =>
        content.ageRange.min <= maxAge && content.ageRange.max >= minAge
      );
    }

    return filtered;
  }, [searchQuery, selectedCategory, selectedAgeRange]);

  // Pagination logic
  const totalPages = Math.ceil(filteredContent.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredContent.slice(startIndex, endIndex);

  // Reset to page 1 when filters change
  const handleFilterChange = () => {
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    handleFilterChange();
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    handleFilterChange();
  };

  const handleAgeRangeChange = (value: string) => {
    setSelectedAgeRange(value);
    handleFilterChange();
  };

  const toggleViewMode = () => {
    setViewMode(viewMode === 'table' ? 'grid' : 'table');
    setCurrentPage(1); // Reset pagination when switching views
  };

  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      items.push(
        <button
          key={1}
          onClick={() => setCurrentPage(1)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === 1
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          1
        </button>
      );
      if (startPage > 2) {
        items.push(
          <span key="ellipsis-start" className="px-2 py-1">
            ...
          </span>
        );
      }
    }

    // Add visible pages
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <button
          key={i}
          onClick={() => setCurrentPage(i)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === i
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {i}
        </button>
      );
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        items.push(
          <span key="ellipsis-end" className="px-2 py-1">
            ...
          </span>
        );
      }
      items.push(
        <button
          key={totalPages}
          onClick={() => setCurrentPage(totalPages)}
          className={`px-3 py-1 mx-1 rounded ${
            currentPage === totalPages
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          {totalPages}
        </button>
      );
    }

    return items;
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'mpasi': return <Baby className="h-4 w-4" />;
      case 'nutrition': return <Heart className="h-4 w-4" />;
      case 'picky-eater': return <AlertCircle className="h-4 w-4" />;
      default: return <BookOpen className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'mpasi': return 'bg-blue-100 text-blue-800';
      case 'nutrition': return 'bg-green-100 text-green-800';
      case 'picky-eater': return 'bg-red-100 text-red-800';
      case 'meal-prep': return 'bg-purple-100 text-purple-800';
      case 'development': return 'bg-yellow-100 text-yellow-800';
      case 'safety': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    switch (category) {
      case 'mpasi': return 'MPASI';
      case 'nutrition': return 'Nutrisi';
      case 'picky-eater': return 'Picky Eater';
      case 'meal-prep': return 'Meal Prep';
      case 'development': return 'Perkembangan';
      case 'safety': return 'Keamanan';
      case 'recipes': return 'Resep';
      default: return category;
    }
  };

  const formatContent = (content: string) => {
    // Simple markdown-like formatting
    return content
      .split('\n')
      .map((line, index) => {
        if (line.startsWith('# ')) {
          return <h1 key={index} className="text-2xl font-bold mt-6 mb-4">{line.substring(2)}</h1>;
        } else if (line.startsWith('## ')) {
          return <h2 key={index} className="text-xl font-semibold mt-5 mb-3">{line.substring(3)}</h2>;
        } else if (line.startsWith('### ')) {
          return <h3 key={index} className="text-lg font-medium mt-4 mb-2">{line.substring(4)}</h3>;
        } else if (line.startsWith('- ')) {
          return <li key={index} className="ml-4 mb-1">{line.substring(2)}</li>;
        } else if (line.trim() === '') {
          return <br key={index} />;
        } else {
          return <p key={index} className="mb-3 leading-relaxed">{line}</p>;
        }
      });
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
              <BreadcrumbPage>Edukasi</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Edukasi Parenting</h1>
          <p className="text-lg text-gray-600">
            Pelajari tips dan panduan praktis seputar MPASI, gizi, dan pola makan anak
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Pencarian
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Search */}
              <div className="lg:col-span-2">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Cari artikel, tips, atau topik..."
                    value={searchQuery}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Category */}
              <Select value={selectedCategory} onValueChange={handleCategoryChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="mpasi">MPASI</SelectItem>
                  <SelectItem value="nutrition">Nutrisi</SelectItem>
                  <SelectItem value="picky-eater">Picky Eater</SelectItem>
                  <SelectItem value="meal-prep">Meal Prep</SelectItem>
                  <SelectItem value="development">Perkembangan</SelectItem>
                  <SelectItem value="safety">Keamanan</SelectItem>
                </SelectContent>
              </Select>

              {/* Age Range */}
              <Select value={selectedAgeRange} onValueChange={handleAgeRangeChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Usia Anak" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Usia</SelectItem>
                  <SelectItem value="0-6">0-6 bulan</SelectItem>
                  <SelectItem value="6-12">6-12 bulan</SelectItem>
                  <SelectItem value="12-24">1-2 tahun</SelectItem>
                  <SelectItem value="24-60">2-5 tahun</SelectItem>
                  <SelectItem value="60-144">5+ tahun</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Featured Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center gap-2"
            onClick={() => handleCategoryChange('mpasi')}
          >
            <Baby className="h-6 w-6 text-blue-500" />
            <span className="text-sm font-medium">MPASI</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center gap-2"
            onClick={() => handleCategoryChange('nutrition')}
          >
            <Heart className="h-6 w-6 text-green-500" />
            <span className="text-sm font-medium">Nutrisi</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center gap-2"
            onClick={() => handleCategoryChange('picky-eater')}
          >
            <AlertCircle className="h-6 w-6 text-red-500" />
            <span className="text-sm font-medium">Picky Eater</span>
          </Button>
          <Button 
            variant="outline" 
            className="h-auto p-4 flex flex-col items-center gap-2"
            onClick={() => handleCategoryChange('meal-prep')}
          >
            <BookOpen className="h-6 w-6 text-purple-500" />
            <span className="text-sm font-medium">Meal Prep</span>
          </Button>
        </div>

        {/* Results */}
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <p className="text-gray-600">
              Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredContent.length)} dari {filteredContent.length} artikel
            </p>
            <Button variant="outline" size="sm" onClick={toggleViewMode}>
              {viewMode === 'table' ? (
                <>
                  <Grid3X3 className="mr-2 h-4 w-4" />
                  Tampilan Grid
                </>
              ) : (
                <>
                  <Eye className="mr-2 h-4 w-4" />
                  Tampilan Tabel
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Content Display */}
        {viewMode === 'table' ? (
          <>
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50%]">Judul Artikel</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Usia Anak</TableHead>
                    <TableHead>Waktu Baca</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead className="w-[100px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.map((content) => (
                    <TableRow key={content.id} className="hover:bg-gray-50">
                      <TableCell>
                        <div className="space-y-1">
                          <Link
                            href={`/education/${content.id}`}
                            className="font-medium text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            {content.title}
                          </Link>
                          <p className="text-sm text-gray-500 line-clamp-2">
                            {content.content.substring(0, 100)}...
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge className={getCategoryColor(content.category)}>
                          <span className="flex items-center gap-1">
                            {getCategoryIcon(content.category)}
                            {getCategoryText(content.category)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {content.ageRange.min}-{content.ageRange.max} bulan
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {content.readTime} min
                        </span>
                      </TableCell>
                      <TableCell className="text-sm text-gray-600">
                        {new Date(content.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>
                        <Link href={`/education/${content.id}`}>
                          <Button variant="ghost" size="sm">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Card>

            {/* Pagination */}
            {totalPages > 1 && (
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
                  {getPaginationItems()}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        ) : (
          /* Grid View */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentItems.map((content) => (
              <Link key={content.id} href={`/education/${content.id}`}>
                <Card className="cursor-pointer h-full hover:shadow-md transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between mb-2">
                      <Badge className={getCategoryColor(content.category)}>
                        <span className="flex items-center gap-1">
                          {getCategoryIcon(content.category)}
                          {getCategoryText(content.category)}
                        </span>
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {content.ageRange.min}-{content.ageRange.max} bulan
                      </span>
                    </div>
                    <CardTitle className="text-lg leading-tight">{content.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {content.readTime} min baca
                      </span>
                      <span>
                        {new Date(content.createdAt).toLocaleDateString('id-ID')}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-3">
                      {content.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {content.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{content.tags.length - 3}
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 line-clamp-3">
                      {content.content.substring(0, 150)}...
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}

        {filteredContent.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Tidak ada artikel yang ditemukan
            </h3>
            <p className="text-gray-500">
              Coba ubah filter atau kata kunci pencarian Anda
            </p>
          </div>
        )}
      </div>
    </Sidebar>
  );
}
