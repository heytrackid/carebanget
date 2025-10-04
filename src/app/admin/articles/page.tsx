'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Edit, Trash2, Save, Eye, Search, Filter, MoreHorizontal, Download } from 'lucide-react';
import { mockEducationalContent } from '@/data/mockData';
import { EducationalContent } from '@/types';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import Link from 'next/link';

// Reusable Admin Layout (extracted to avoid duplication)
function AdminLayout({ children }) {
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
              <Link href="/admin/articles">
                <Button variant="default" className="w-full justify-start">
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

// Article Form Component
function ArticleForm({ article, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    content: article?.content || '',
    category: article?.category || 'nutrition',
    ageRange: article?.ageRange || { min: 0, max: 144 },
    tags: article?.tags || [],
    readTime: article?.readTime || 5,
    status: article?.status || 'draft'
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Calculate read time based on content length (rough estimate)
    const wordCount = formData.content.split(' ').length;
    const calculatedReadTime = Math.max(1, Math.ceil(wordCount / 200)); // Assume 200 words per minute

    const articleData = {
      ...formData,
      readTime: calculatedReadTime,
      id: article?.id || Date.now().toString(),
      createdAt: article?.createdAt || new Date(),
      updatedAt: new Date(),
    };

    onSave(articleData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Judul Artikel</label>
          <Input
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Masukkan judul artikel..."
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Kategori</label>
          <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="nutrition">🍎 Nutrisi</SelectItem>
              <SelectItem value="development">📈 Perkembangan</SelectItem>
              <SelectItem value="meal-prep">👨‍🍳 Meal Prep</SelectItem>
              <SelectItem value="mpasi">🍼 MPASI</SelectItem>
              <SelectItem value="picky-eater">😣 Picky Eater</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Usia Min (bulan)</label>
          <Input
            type="number"
            value={formData.ageRange.min}
            onChange={(e) => setFormData({
              ...formData,
              ageRange: { ...formData.ageRange, min: parseInt(e.target.value) || 0 }
            })}
            min="0"
            max="144"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Usia Max (bulan)</label>
          <Input
            type="number"
            value={formData.ageRange.max}
            onChange={(e) => setFormData({
              ...formData,
              ageRange: { ...formData.ageRange, max: parseInt(e.target.value) || 144 }
            })}
            min="0"
            max="144"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={formData.status} onValueChange={(value) => setFormData({...formData, status: value})}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">📝 Draft</SelectItem>
              <SelectItem value="published">✅ Published</SelectItem>
              <SelectItem value="archived">📦 Archived</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Konten Artikel</label>
        <RichTextEditor
          content={formData.content}
          onChange={(content) => setFormData({...formData, content})}
          placeholder="Tulis konten artikel di sini... Gunakan markdown untuk formatting yang lebih baik."
        />
      </div>

      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button type="button" variant="outline" onClick={onCancel}>
          Batal
        </Button>
        <Button type="submit">
          <Save className="mr-2 h-4 w-4" />
          {article ? 'Update Artikel' : 'Simpan Artikel'}
        </Button>
      </div>
    </form>
  );
}

export default function AdminArticlesPage() {
  const router = useRouter();
  const [articles, setArticles] = useState<EducationalContent[]>([]);
  const [filteredArticles, setFilteredArticles] = useState<EducationalContent[]>([]);
  const [selectedArticle, setSelectedArticle] = useState<EducationalContent | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Load articles
  useEffect(() => {
    // In real app: fetch from API
    setArticles(mockEducationalContent.map(article => ({
      ...article,
      status: article.status || 'published' // Default status
    })));
  }, []);

  // Filter articles
  useEffect(() => {
    let filtered = articles;

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory);
    }

    if (selectedStatus !== 'all') {
      filtered = filtered.filter(article => article.status === selectedStatus);
    }

    setFilteredArticles(filtered);
  }, [articles, searchTerm, selectedCategory, selectedStatus]);

  const handleSaveArticle = (articleData: EducationalContent) => {
    if (isEditing && selectedArticle) {
      // Update existing
      setArticles(prev => prev.map(a => a.id === selectedArticle.id ? articleData : a));
    } else {
      // Add new
      setArticles(prev => [...prev, articleData]);
    }
    setIsDialogOpen(false);
    setSelectedArticle(null);
    setIsEditing(false);
  };

  const handleEditArticle = (article: EducationalContent) => {
    router.push(`/admin/articles/${article.id}`);
  };

  const handleDeleteArticle = (articleId: string) => {
    if (confirm('Yakin ingin menghapus artikel ini?')) {
      setArticles(prev => prev.filter(a => a.id !== articleId));
    }
  };

  const handleBulkDelete = () => {
    if (confirm(`Yakin ingin menghapus ${selectedItems.length} artikel?`)) {
      setArticles(prev => prev.filter(a => !selectedItems.includes(a.id)));
      setSelectedItems([]);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800';
      case 'draft': return 'bg-yellow-100 text-yellow-800';
      case 'archived': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryText = (category: string) => {
    const categories = {
      'nutrition': '🍎 Nutrisi',
      'development': '📈 Perkembangan',
      'meal-prep': '👨‍🍳 Meal Prep',
      'mpasi': '🍼 MPASI',
      'picky-eater': '😣 Picky Eater'
    };
    return categories[category] || category;
  };

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Articles</h1>
            <p className="text-gray-600 mt-1">Kelola semua artikel edukasi parenting</p>
          </div>
          <Link href="/admin/articles/new">
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Tambah Artikel Baru
            </Button>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold">{articles.length}</div>
              <p className="text-sm text-gray-600">Total Artikel</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {articles.filter(a => a.status === 'published').length}
              </div>
              <p className="text-sm text-gray-600">Published</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {articles.filter(a => a.status === 'draft').length}
              </div>
              <p className="text-sm text-gray-600">Draft</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-gray-600">
                {articles.filter(a => a.status === 'archived').length}
              </div>
              <p className="text-sm text-gray-600">Archived</p>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari artikel..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Kategori" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  <SelectItem value="nutrition">🍎 Nutrisi</SelectItem>
                  <SelectItem value="development">📈 Perkembangan</SelectItem>
                  <SelectItem value="meal-prep">👨‍🍳 Meal Prep</SelectItem>
                  <SelectItem value="mpasi">🍼 MPASI</SelectItem>
                  <SelectItem value="picky-eater">😣 Picky Eater</SelectItem>
                </SelectContent>
              </Select>
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Semua Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="published">✅ Published</SelectItem>
                  <SelectItem value="draft">📝 Draft</SelectItem>
                  <SelectItem value="archived">📦 Archived</SelectItem>
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

        {/* Articles Table */}
        <Card>
          <CardHeader>
            <CardTitle>Daftar Artikel ({filteredArticles.length})</CardTitle>
            <CardDescription>
              Klik checkbox untuk bulk actions, klik judul untuk preview
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox
                      checked={selectedItems.length === filteredArticles.length && filteredArticles.length > 0}
                      onCheckedChange={(checked) => {
                        if (checked) {
                          setSelectedItems(filteredArticles.map(a => a.id));
                        } else {
                          setSelectedItems([]);
                        }
                      }}
                    />
                  </TableHead>
                  <TableHead>Judul Artikel</TableHead>
                  <TableHead>Kategori</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Usia</TableHead>
                  <TableHead>Dibuat</TableHead>
                  <TableHead className="w-24">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArticles.map((article) => (
                  <TableRow key={article.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedItems.includes(article.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedItems(prev => [...prev, article.id]);
                          } else {
                            setSelectedItems(prev => prev.filter(id => id !== article.id));
                          }
                        }}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{article.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">
                          {article.content.substring(0, 80)}...
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {getCategoryText(article.category)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(article.status || 'published')}>
                        {article.status || 'published'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {article.ageRange.min}-{article.ageRange.max} bln
                    </TableCell>
                    <TableCell className="text-sm">
                      {new Date(article.createdAt).toLocaleDateString('id-ID')}
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
                            <Link href={`/education/${article.id}`} target="_blank">
                              <Eye className="mr-2 h-4 w-4" />
                              Preview
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEditArticle(article)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDeleteArticle(article.id)}
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

            {filteredArticles.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📝</div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Tidak ada artikel ditemukan
                </h3>
                <p className="text-gray-500 mb-4">
                  Coba ubah filter pencarian atau buat artikel baru
                </p>
                <Button onClick={() => setIsDialogOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Tambah Artikel Pertama
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
