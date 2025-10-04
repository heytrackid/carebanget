'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  BookOpen,
  Users,
  TrendingUp,
  Calendar,
  Eye,
  ThumbsUp,
  MessageCircle,
  BarChart3,
  Settings,
  FileText,
  Home,
  Plus
} from 'lucide-react';

// Admin Layout Component
function AdminLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <Badge variant="outline" className="text-green-600 border-green-600">
              Parenting Meal Planner
            </Badge>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Link href="/">
              <Button variant="outline" size="sm">
                <Home className="h-4 w-4 mr-2" />
                View Site
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Admin Sidebar */}
        <aside className="w-64 bg-white border-r border-gray-200 min-h-[calc(100vh-73px)]">
          <nav className="p-6">
            <div className="space-y-2">
              <Link href="/admin">
                <Button variant="ghost" className="w-full justify-start">
                  <BarChart3 className="h-4 w-4 mr-3" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/admin/recipes">
                <Button variant="ghost" className="w-full justify-start">
                  🍳 Manage Recipes
                </Button>
              </Link>
              <Link href="/admin/articles">
                <Button variant="ghost" className="w-full justify-start">
                  <FileText className="h-4 w-4 mr-3" />
                  Manage Articles
                </Button>
              </Link>
              <Link href="/admin/users">
                <Button variant="ghost" className="w-full justify-start">
                  <Users className="h-4 w-4 mr-3" />
                  Users
                </Button>
              </Link>
              <Link href="/admin/analytics">
                <Button variant="ghost" className="w-full justify-start">
                  <TrendingUp className="h-4 w-4 mr-3" />
                  Analytics
                </Button>
              </Link>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalArticles: 0,
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    recentArticles: [],
    categoryStats: [],
    monthlyGrowth: [],
    draftArticles: 0,
    publishedArticles: 0
  });

  useEffect(() => {
    // In real app, fetch from API
    // For now, mock data
    setStats({
      totalArticles: 6,
      totalViews: 12450,
      totalLikes: 892,
      totalComments: 156,
      draftArticles: 1,
      publishedArticles: 5,
      recentArticles: [
        {
          id: '1',
          title: 'Meal Planning Guide',
          views: 1234,
          likes: 89,
          status: 'published',
          category: 'nutrition',
          createdAt: new Date('2024-10-01')
        },
        {
          id: '2',
          title: 'Picky Eater Solutions',
          views: 987,
          likes: 76,
          status: 'published',
          category: 'nutrition',
          createdAt: new Date('2024-10-02')
        },
        {
          id: '3',
          title: 'Growth Monitoring',
          views: 756,
          likes: 54,
          status: 'draft',
          category: 'development',
          createdAt: new Date('2024-10-03')
        }
      ],
      categoryStats: [
        { category: 'nutrition', count: 2, percentage: 33, color: 'bg-green-100 text-green-800' },
        { category: 'development', count: 1, percentage: 17, color: 'bg-blue-100 text-blue-800' },
        { category: 'meal-prep', count: 3, percentage: 50, color: 'bg-purple-100 text-purple-800' }
      ],
      monthlyGrowth: [
        { month: 'Aug', articles: 2, views: 2100 },
        { month: 'Sep', articles: 1, views: 1800 },
        { month: 'Oct', articles: 3, views: 3200 }
      ]
    });
  }, []);

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600 mt-2">Pantau performa konten dan aktivitas admin</p>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Quick Actions</h2>
            <Link href="/admin/articles">
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Tambah Artikel Baru
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <FileText className="h-8 w-8 text-blue-500" />
                  <div>
                    <p className="font-medium">Manage Articles</p>
                    <p className="text-sm text-gray-600">CRUD artikel edukasi</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <BarChart3 className="h-8 w-8 text-green-500" />
                  <div>
                    <p className="font-medium">View Analytics</p>
                    <p className="text-sm text-gray-600">Laporan performa</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Settings className="h-8 w-8 text-purple-500" />
                  <div>
                    <p className="font-medium">System Settings</p>
                    <p className="text-sm text-gray-600">Konfigurasi aplikasi</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Artikel</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalArticles}</div>
              <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                <span className="text-green-600">{stats.publishedArticles} published</span>
                <span>•</span>
                <span className="text-yellow-600">{stats.draftArticles} draft</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalViews.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +12% dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalLikes}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +8% dari bulan lalu
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
              <MessageCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalComments}</div>
              <p className="text-xs text-muted-foreground mt-1">
                +15% dari bulan lalu
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Articles */}
          <Card>
            <CardHeader>
              <CardTitle>Artikel Terbaru</CardTitle>
              <CardDescription>Artikel yang baru saja dipublikasikan</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.recentArticles.map((article) => (
                  <div key={article.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{article.title}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={stats.categoryStats.find(c => c.category === article.category)?.color || 'bg-gray-100'}>
                          {article.category}
                        </Badge>
                        <span className={`text-xs px-2 py-1 rounded ${
                          article.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {article.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-xs text-gray-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <ThumbsUp className="h-3 w-3" />
                          {article.likes}
                        </span>
                        <span>{new Date(article.createdAt).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                    <Link href={`/admin/articles/${article.id}`}>
                      <Button variant="ghost" size="sm">
                        Edit
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Category Distribution */}
          <Card>
            <CardHeader>
              <CardTitle>Distribusi Kategori</CardTitle>
              <CardDescription>Breakdown artikel berdasarkan kategori</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {stats.categoryStats.map((stat) => (
                  <div key={stat.category} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Badge className={stat.color}>
                        {stat.category}
                      </Badge>
                      <span className="text-sm text-gray-600">
                        {stat.count} artikel
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-20 bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${stat.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-10">
                        {stat.percentage}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle>Aktivitas Terbaru</CardTitle>
            <CardDescription>Timeline aktivitas admin terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">Artikel "Meal Planning Guide" dipublikasikan</p>
                  <p className="text-xs text-gray-500">2 jam yang lalu</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">Artikel "Picky Eater Solutions" mendapat 15 likes baru</p>
                  <p className="text-xs text-gray-500">4 jam yang lalu</p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div className="flex-1">
                  <p className="text-sm">Draft artikel "Baby Sleep Tips" dibuat</p>
                  <p className="text-xs text-gray-500">1 hari yang lalu</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
