'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ArrowLeft } from 'lucide-react';
import { mockEducationalContent } from '@/data/mockData';
import { EducationalContent } from '@/types';
import { RichTextEditor } from '@/components/admin/RichTextEditor';
import Link from 'next/link';

// Article Form Component
function ArticleForm({ article, onSave, onCancel }: { article?: any; onSave: (data: any) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState({
    title: article?.title || '',
    content: article?.content || '',
    category: article?.category || 'nutrition',
    ageRange: article?.ageRange || { min: 0, max: 144 },
    tags: article?.tags || [],
    readTime: article?.readTime || 5,
    status: article?.status || 'draft'
  });

  const handleSubmit = (e: any) => {
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
      imageUrl: article?.imageUrl || '/images/default-article.jpg',
    };

    onSave(articleData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-h-[80vh] overflow-y-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Judul Artikel</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({...formData, title: e.target.value})}
            placeholder="Masukkan judul artikel..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Kategori</label>
          <select
            value={formData.category}
            onChange={(e) => setFormData({...formData, category: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="nutrition">🍎 Nutrisi</option>
            <option value="development">📈 Perkembangan</option>
            <option value="meal-prep">👨‍🍳 Meal Prep</option>
            <option value="mpasi">🍼 MPASI</option>
            <option value="picky-eater">😣 Picky Eater</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Usia Min (bulan)</label>
          <input
            type="number"
            value={formData.ageRange.min}
            onChange={(e) => setFormData({
              ...formData,
              ageRange: { ...formData.ageRange, min: parseInt(e.target.value) || 0 }
            })}
            min="0"
            max="144"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Usia Max (bulan)</label>
          <input
            type="number"
            value={formData.ageRange.max}
            onChange={(e) => setFormData({
              ...formData,
              ageRange: { ...formData.ageRange, max: parseInt(e.target.value) || 144 }
            })}
            min="0"
            max="144"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <select
            value={formData.status}
            onChange={(e) => setFormData({...formData, status: e.target.value})}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="draft">📝 Draft</option>
            <option value="published">✅ Published</option>
            <option value="archived">📦 Archived</option>
          </select>
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
          💾 {article ? 'Update Artikel' : 'Simpan Artikel'}
        </Button>
      </div>
    </form>
  );
}

export default function AdminArticleEditPage() {
  const params = useParams();
  const router = useRouter();
  const [article, setArticle] = useState<EducationalContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const articleId = params.id as string;
  const isNewArticle = articleId === 'new';

  useEffect(() => {
    if (isNewArticle) {
      setArticle(null);
      setLoading(false);
    } else {
      // Load existing article
      const foundArticle = mockEducationalContent.find(a => a.id === articleId);
      if (foundArticle) {
        setArticle(foundArticle);
      }
      setLoading(false);
    }
  }, [articleId, isNewArticle]);

  const handleSave = async (articleData: EducationalContent) => {
    setSaving(true);

    try {
      // In real app, call API
      console.log('Saving article:', articleData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Redirect back to articles list
      router.push('/admin/articles');
    } catch (error) {
      console.error('Failed to save article:', error);
      alert('Failed to save article. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    router.push('/admin/articles');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading article...</p>
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
            <Link href="/admin/articles">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Articles
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                {isNewArticle ? 'Tambah Artikel Baru' : 'Edit Artikel'}
              </h1>
              {!isNewArticle && article && (
                <p className="text-gray-600 text-sm mt-1">{article.title}</p>
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
              <BreadcrumbLink href="/admin/articles">Articles</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>
                {isNewArticle ? 'New Article' : 'Edit Article'}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Main Content */}
      <main className="p-6">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <ArticleForm
              article={article}
              onSave={handleSave}
              onCancel={handleCancel}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
