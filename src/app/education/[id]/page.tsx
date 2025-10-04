'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Clock, Calendar, ArrowLeft, Share2, Bookmark, Heart } from 'lucide-react';
import { mockEducationalContent } from '@/data/mockData';

export default function ArticleDetailPage() {
  const params = useParams();
  const articleId = params.id as string;

  // Find article by ID
  const article = mockEducationalContent.find(a => a.id === articleId) || mockEducationalContent[0];

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      'mpasi': 'bg-blue-100 text-blue-800',
      'nutrition': 'bg-green-100 text-green-800',
      'development': 'bg-purple-100 text-purple-800',
      'behavior': 'bg-orange-100 text-orange-800',
      'health': 'bg-red-100 text-red-800',
      'parenting': 'bg-pink-100 text-pink-800',
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'mpasi': '🥄',
      'nutrition': '🍎',
      'development': '🧠',
      'behavior': '😊',
      'health': '🏥',
      'parenting': '👨‍👩‍👧',
    };
    return icons[category] || '📚';
  };

  const getCategoryText = (category: string) => {
    const texts: { [key: string]: string } = {
      'mpasi': 'MPASI',
      'nutrition': 'Nutrisi',
      'development': 'Perkembangan',
      'behavior': 'Perilaku',
      'health': 'Kesehatan',
      'parenting': 'Parenting',
    };
    return texts[category] || category;
  };

  const formatContent = (content: string) => {
    return content.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mb-4 mt-6">{line.substring(2)}</h1>;
      } else if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mb-3 mt-5">{line.substring(3)}</h2>;
      } else if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-medium mb-2 mt-4">{line.substring(4)}</h3>;
      } else if (line.startsWith('- ')) {
        return <li key={index} className="ml-4 mb-1">{line.substring(2)}</li>;
      } else if (line.trim() === '') {
        return <br key={index} />;
      } else {
        return <p key={index} className="mb-3 leading-relaxed">{line}</p>;
      }
    });
  };

  // Get related articles (same category, different id)
  const relatedArticles = mockEducationalContent
    .filter(a => a.category === article.category && a.id !== article.id)
    .slice(0, 3);

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
                <Link href="/education">Edukasi</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>{article.title}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Back Button */}
        <div className="mb-6">
          <Link href="/education">
            <Button variant="outline" size="sm">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali ke Edukasi
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Article Header */}
            <Card>
              <CardHeader>
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <Badge className={getCategoryColor(article.category)}>
                      <span className="flex items-center gap-1">
                        {getCategoryIcon(article.category)}
                        {getCategoryText(article.category)}
                      </span>
                    </Badge>
                    <span className="text-sm text-gray-500">
                      Usia: {article.ageRange.min}-{article.ageRange.max} bulan
                    </span>
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

                <CardTitle className="text-3xl leading-tight mb-3">{article.title}</CardTitle>

                <div className="flex items-center gap-6 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {article.readTime} menit baca
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    {new Date(article.createdAt).toLocaleDateString('id-ID', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </CardHeader>
            </Card>

            {/* Article Content */}
            <Card>
              <CardContent className="pt-6">
                <div className="prose prose-gray max-w-none">
                  {formatContent(article.content)}
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
                  {article.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Article Actions */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-center gap-4">
                  <Button className="flex items-center gap-2">
                    <Heart className="h-4 w-4" />
                    Suka Artikel Ini
                  </Button>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Share2 className="h-4 w-4" />
                    Bagikan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Article Info */}
            <Card>
              <CardHeader>
                <CardTitle>Info Artikel</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="text-sm font-medium text-gray-500">Kategori</div>
                  <div className="flex items-center gap-2 mt-1">
                    <span>{getCategoryIcon(article.category)}</span>
                    <span>{getCategoryText(article.category)}</span>
                  </div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Usia Anak</div>
                  <div className="text-sm mt-1">{article.ageRange.min}-{article.ageRange.max} bulan</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Waktu Baca</div>
                  <div className="text-sm mt-1">{article.readTime} menit</div>
                </div>
                <div>
                  <div className="text-sm font-medium text-gray-500">Diterbitkan</div>
                  <div className="text-sm mt-1">
                    {new Date(article.createdAt).toLocaleDateString('id-ID')}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Artikel Terkait</CardTitle>
                  <CardDescription>
                    Artikel lain dalam kategori yang sama
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {relatedArticles.map((relatedArticle) => (
                      <Link key={relatedArticle.id} href={`/education/${relatedArticle.id}`}>
                        <div className="p-3 border rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                          <div className="font-medium text-sm mb-1 line-clamp-2">
                            {relatedArticle.title}
                          </div>
                          <div className="text-xs text-gray-500 flex items-center gap-2">
                            <Clock className="h-3 w-3" />
                            {relatedArticle.readTime} min
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Aksi Cepat</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Link href="/meal-planner">
                  <Button variant="outline" className="w-full justify-start">
                    📅 Buat Meal Plan
                  </Button>
                </Link>
                <Link href="/ai-assistant">
                  <Button variant="outline" className="w-full justify-start">
                    🤖 Tanya AI Assistant
                  </Button>
                </Link>
                <Link href="/recipes">
                  <Button variant="outline" className="w-full justify-start">
                    👨‍🍳 Cari Resep
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
