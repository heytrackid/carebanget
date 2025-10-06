'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Calendar,
  TrendingUp,
  ShoppingCart,
  BookOpen,
  Clock,
  Heart,
  ChefHat,
  Bell,
  Plus,
  ArrowRight,
  Star,
  Bot,
  CheckSquare
} from 'lucide-react';
import { mockChild } from '@/data/mockData';
import { Sidebar } from '@/components/navigation/Sidebar';
import { WeeklyChart } from '@/components/dashboard/WeeklyChart.lazy';
import { TaskWidget } from '@/components/dashboard/TaskWidget.lazy';
import { NotificationPanel } from '@/components/notifications/NotificationPanel';
import { useNotifications } from '@/contexts/NotificationContext';
import { mockTasks } from '@/data/mockTasks';
import { ChartSkeleton, CardSkeleton } from '@/components/ui/skeleton';
import React, { Suspense } from 'react';

export default function DashboardPage() {
  const [selectedChild] = useState(mockChild);
  const { checkTaskNotifications } = useNotifications();
  const dashboardStats = {
    totalMeals: 28,
    completedMeals: 21,
    weeklyNutrition: 85,
    recipesLearned: 12,
    shoppingItems: 8,
    articlesRead: 5,
  };

  // Check for task notifications on component mount and when tasks might change
  useEffect(() => {
    checkTaskNotifications(mockTasks);
  }, [checkTaskNotifications]);

  const upcomingMeals = [
    { time: '07:00', meal: 'Sarapan', recipe: 'Bubur Pisang Alpukat', status: 'upcoming' },
    { time: '12:00', meal: 'Makan Siang', recipe: 'Nasi Tim Ayam Sayur', status: 'upcoming' },
    { time: '15:00', meal: 'Snack', recipe: 'Puree Buah', status: 'upcoming' },
    { time: '18:00', meal: 'Makan Malam', recipe: 'Sup Wortel Kentang', status: 'upcoming' },
  ];

  const recentActivities = [
    { action: 'Menyelesaikan', item: 'Bubur Pisang Alpukat', time: '2 jam lalu', type: 'meal' },
    { action: 'Membaca artikel', item: 'Tips MPASI 6 Bulan', time: '4 jam lalu', type: 'education' },
    { action: 'Menambah resep', item: 'Puree Wortel Kentang', time: '1 hari lalu', type: 'recipe' },
    { action: 'Generate meal plan', item: '7 hari ke depan', time: '2 hari lalu', type: 'plan' },
  ];

  const nutritionGoals = [
    { name: 'Kalori Harian', current: 850, target: 1000, unit: 'kcal', color: 'bg-blue-500' },
    { name: 'Protein', current: 25, target: 30, unit: 'g', color: 'bg-green-500' },
    { name: 'Kalsium', current: 400, target: 500, unit: 'mg', color: 'bg-yellow-500' },
    { name: 'Zat Besi', current: 8, target: 10, unit: 'mg', color: 'bg-red-500' },
  ];

  return (
    <Sidebar>
        <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Dashboard</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Selamat datang kembali! Pantau perkembangan nutrisi {selectedChild.name}
              </p>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <Button className="bg-pink-500 hover:bg-pink-600 text-sm sm:text-base">
                <Plus className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Buat Meal Plan</span>
                <span className="sm:hidden">Meal Plan</span>
              </Button>
              <Button variant="outline" size="sm" className="sm:size-default">
                <Bell className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Child Selector */}
        <Card className="mb-6 sm:mb-8">
          <CardContent className="pt-4 sm:pt-6">
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <Avatar className="h-12 w-12 sm:h-16 sm:w-16 mx-auto sm:mx-0">
                <AvatarImage src="/avatars/child.jpg" />
                <AvatarFallback className="bg-pink-100 text-pink-600 text-lg sm:text-xl">
                  {selectedChild.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 text-center sm:text-left">
                <h3 className="text-lg sm:text-xl font-semibold">{selectedChild.name}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{selectedChild.age} bulan • {selectedChild.weight} kg</p>
                <div className="flex flex-wrap gap-1 sm:gap-2 mt-2 justify-center sm:justify-start">
                  {selectedChild.preferences.map((pref) => (
                    <Badge key={pref.type} variant="secondary" className="text-xs">
                      {pref.label}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className="text-center sm:text-right">
                <div className="text-xl sm:text-2xl font-bold text-pink-600">
                  {Math.round((dashboardStats.completedMeals / dashboardStats.totalMeals) * 100)}%
                </div>
                <div className="text-xs sm:text-sm text-gray-500">Meal completion</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Meals Minggu Ini</p>
                  <p className="text-xl sm:text-2xl font-bold">{dashboardStats.completedMeals}/{dashboardStats.totalMeals}</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600" />
                </div>
              </div>
              <Progress value={(dashboardStats.completedMeals / dashboardStats.totalMeals) * 100} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Target Nutrisi</p>
                  <p className="text-xl sm:text-2xl font-bold">{dashboardStats.weeklyNutrition}%</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-600" />
                </div>
              </div>
              <Progress value={dashboardStats.weeklyNutrition} className="mt-3" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Resep Dipelajari</p>
                  <p className="text-xl sm:text-2xl font-bold">{dashboardStats.recipesLearned}</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <ChefHat className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-600" />
                </div>
              </div>
              <div className="mt-3 flex items-center text-xs sm:text-sm text-gray-600">
                <Star className="h-3 w-3 sm:h-4 sm:w-4 mr-1 text-yellow-500" />
                <span className="hidden sm:inline">+3 resep baru minggu ini</span>
                <span className="sm:hidden">+3 resep baru</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-4 sm:pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs sm:text-sm font-medium text-gray-600">Shopping Items</p>
                  <p className="text-xl sm:text-2xl font-bold">{dashboardStats.shoppingItems}</p>
                </div>
                <div className="h-10 w-10 sm:h-12 sm:w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600" />
                </div>
              </div>
              <Button variant="outline" size="sm" className="mt-3 w-full text-xs sm:text-sm">
                <span className="hidden sm:inline">Lihat Daftar</span>
                <span className="sm:hidden">Daftar</span>
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 mb-6 sm:mb-8">
          {/* Weekly Analytics Chart */}
          <Suspense fallback={<ChartSkeleton />}>
            <WeeklyChart />
          </Suspense>

          {/* Nutrition Goals */}
          <Card>
            <CardHeader>
              <CardTitle>Target Nutrisi Harian</CardTitle>
              <CardDescription>
                Progress nutrisi hari ini
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nutritionGoals.map((goal) => (
                  <div key={goal.name}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium">{goal.name}</span>
                      <span className="text-sm text-gray-600">
                        {goal.current}/{goal.target} {goal.unit}
                      </span>
                    </div>
                    <Progress 
                      value={(goal.current / goal.target) * 100} 
                      className="h-2"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {/* Today's Meal Schedule */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Jadwal Makan Hari Ini
              </CardTitle>
              <CardDescription>
                Rencana makan untuk {new Date().toLocaleDateString('id-ID')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 sm:space-y-4">
                {upcomingMeals.map((meal, index) => (
                  <div key={index} className="flex items-center gap-3 sm:gap-4 p-3 rounded-lg border">
                    <div className="text-center min-w-0 flex-shrink-0">
                      <div className="text-sm font-medium">{meal.time}</div>
                      <div className="text-xs text-gray-500 hidden sm:block">{meal.meal}</div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm sm:text-base truncate">{meal.recipe}</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="text-xs text-gray-500 sm:hidden">{meal.meal}</div>
                        <Badge variant="outline" className="text-xs">
                          {meal.status === 'upcoming' ? 'Akan datang' : 'Selesai'}
                        </Badge>
                      </div>
                    </div>
                    <Button size="sm" variant="outline" className="flex-shrink-0">
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Task Widget */}
          <div className="lg:col-span-1">
            <Suspense fallback={<CardSkeleton />}>
              <TaskWidget />
            </Suspense>
          </div>

          {/* Recent Activities */}
          <Card>
            <CardHeader>
              <CardTitle>Aktivitas Terbaru</CardTitle>
              <CardDescription>
                Riwayat aktivitas meal planning Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs ${
                      activity.type === 'meal' ? 'bg-green-500' :
                      activity.type === 'education' ? 'bg-blue-500' :
                      activity.type === 'recipe' ? 'bg-yellow-500' : 'bg-purple-500'
                    }`}>
                      {activity.type === 'meal' ? <Heart className="h-4 w-4" /> :
                       activity.type === 'education' ? <BookOpen className="h-4 w-4" /> :
                       activity.type === 'recipe' ? <ChefHat className="h-4 w-4" /> : <Calendar className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">
                        <span className="font-medium">{activity.action}</span> {activity.item}
                      </p>
                      <p className="text-xs text-gray-500">{activity.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Aksi cepat untuk mengelola meal planning
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
              <Link href="/ai-assistant">
                <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 w-full border-purple-200 hover:bg-purple-50">
                  <Bot className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
                  <span className="text-xs sm:text-sm">AI Assistant</span>
                </Button>
              </Link>
              <Link href="/meal-planner">
                <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 w-full">
                  <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-xs sm:text-sm">Meal Plan</span>
                </Button>
              </Link>
              <Link href="/tasks">
                <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 w-full border-blue-200 hover:bg-blue-50">
                  <CheckSquare className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
                  <span className="text-xs sm:text-sm">Tasks</span>
                </Button>
              </Link>
              <Link href="/ai-recipe">
                <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 w-full">
                  <ChefHat className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-xs sm:text-sm">AI Recipe</span>
                </Button>
              </Link>
              <Link href="/shopping-list">
                <Button variant="outline" className="h-16 sm:h-20 flex flex-col gap-1 sm:gap-2 w-full">
                  <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6" />
                  <span className="text-xs sm:text-sm">Shopping</span>
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
      <NotificationPanel />
    </Sidebar>
  );
}
