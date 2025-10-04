'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, TrendingDown, Target, Award, AlertTriangle, CheckCircle } from 'lucide-react';

interface NutritionAnalyticsProps {
  weeklyData?: {
    calories: number[];
    protein: number[];
    carbs: number[];
    fat: number[];
  };
  mealLogs?: Array<{
    date: string;
    mealType: string;
    reaction: 'happy' | 'neutral' | 'sad';
    nutrition: { calories: number; protein: number };
  }>;
}

export function NutritionAnalytics({ weeklyData, mealLogs }: NutritionAnalyticsProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month'>('week');

  // Mock data for demonstration
  const mockWeeklyData = {
    calories: [950, 1020, 890, 1100, 980, 1050, 920],
    protein: [28, 32, 25, 35, 30, 33, 27],
    carbs: [120, 135, 110, 145, 125, 140, 115],
    fat: [35, 38, 32, 42, 36, 40, 34],
  };

  const mockMealLogs = [
    { date: '2024-10-01', mealType: 'breakfast', reaction: 'happy' as const, nutrition: { calories: 120, protein: 3 } },
    { date: '2024-10-01', mealType: 'lunch', reaction: 'neutral' as const, nutrition: { calories: 180, protein: 12 } },
    { date: '2024-10-02', mealType: 'breakfast', reaction: 'happy' as const, nutrition: { calories: 130, protein: 4 } },
    { date: '2024-10-02', mealType: 'lunch', reaction: 'happy' as const, nutrition: { calories: 200, protein: 15 } },
  ];

  const data = weeklyData || mockWeeklyData;
  const logs = mealLogs || mockMealLogs;

  // Calculate nutrition averages
  const avgCalories = data.calories.reduce((a, b) => a + b, 0) / data.calories.length;
  const avgProtein = data.protein.reduce((a, b) => a + b, 0) / data.protein.length;

  // Calculate nutrition goals (based on WHO recommendations for 12-24 months)
  const calorieGoal = 1000; // kcal per day
  const proteinGoal = 30; // grams per day
  const calorieProgress = Math.min((avgCalories / calorieGoal) * 100, 100);
  const proteinProgress = Math.min((avgProtein / proteinGoal) * 100, 100);

  // Calculate meal satisfaction
  const totalMeals = logs.length;
  const happyMeals = logs.filter(log => log.reaction === 'happy').length;
  const satisfactionRate = (happyMeals / totalMeals) * 100;

  // Find trends
  const recentCalories = data.calories.slice(-3);
  const calorieTrend = recentCalories[2] - recentCalories[0];
  const proteinTrend = data.protein.slice(-3)[2] - data.protein.slice(-3)[0];

  // Generate insights
  const insights = [
    {
      type: calorieProgress >= 90 ? 'success' : calorieProgress >= 70 ? 'warning' : 'error',
      title: 'Asupan Kalori',
      message: calorieProgress >= 90
        ? 'Target kalori tercapai dengan baik!'
        : calorieProgress >= 70
        ? 'Asupan kalori cukup, tapi bisa ditingkatkan'
        : 'Asupan kalori perlu ditingkatkan',
      progress: calorieProgress
    },
    {
      type: proteinProgress >= 90 ? 'success' : proteinProgress >= 70 ? 'warning' : 'error',
      title: 'Asupan Protein',
      message: proteinProgress >= 90
        ? 'Protein cukup untuk pertumbuhan!'
        : proteinProgress >= 70
        ? 'Protein cukup, tapi bisa lebih bervariasi'
        : 'Perlu tambah sumber protein',
      progress: proteinProgress
    },
    {
      type: satisfactionRate >= 80 ? 'success' : satisfactionRate >= 60 ? 'warning' : 'error',
      title: 'Kepuasan Makan',
      message: satisfactionRate >= 80
        ? 'Anak sangat menikmati makanannya!'
        : satisfactionRate >= 60
        ? 'Mayoritas makanan disukai anak'
        : 'Perlu lebih banyak variasi menu',
      progress: satisfactionRate
    }
  ];

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning': return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'error': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'success': return 'border-green-200 bg-green-50';
      case 'warning': return 'border-yellow-200 bg-yellow-50';
      case 'error': return 'border-red-200 bg-red-50';
      default: return 'border-gray-200 bg-gray-50';
    }
  };

  return (
    <div className="space-y-6">
      {/* Nutrition Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analisis Nutrisi Mingguan
          </CardTitle>
          <CardDescription>
            Ringkasan nutrisi dan pola makan anak Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Calorie Analysis */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Kalori Harian</span>
                <Badge variant={calorieProgress >= 90 ? "default" : "secondary"}>
                  {Math.round(avgCalories)} kcal
                </Badge>
              </div>
              <Progress value={calorieProgress} className="h-2" />
              <div className="flex items-center gap-1 text-xs text-gray-600">
                {calorieTrend > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span>{Math.abs(calorieTrend)} kcal trend</span>
              </div>
            </div>

            {/* Protein Analysis */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Protein Harian</span>
                <Badge variant={proteinProgress >= 90 ? "default" : "secondary"}>
                  {Math.round(avgProtein)}g
                </Badge>
              </div>
              <Progress value={proteinProgress} className="h-2" />
              <div className="flex items-center gap-1 text-xs text-gray-600">
                {proteinTrend > 0 ? (
                  <TrendingUp className="h-3 w-3 text-green-500" />
                ) : (
                  <TrendingDown className="h-3 w-3 text-red-500" />
                )}
                <span>{Math.abs(proteinTrend)}g trend</span>
              </div>
            </div>

            {/* Meal Satisfaction */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Kepuasan Makan</span>
                <Badge variant={satisfactionRate >= 80 ? "default" : "secondary"}>
                  {Math.round(satisfactionRate)}%
                </Badge>
              </div>
              <Progress value={satisfactionRate} className="h-2" />
              <div className="text-xs text-gray-600">
                {happyMeals}/{totalMeals} meals disukai
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Insights & Rekomendasi
          </CardTitle>
          <CardDescription>
            Analisis mendalam dan saran untuk nutrisi anak Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as 'week' | 'month')}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="week">Minggu Ini</TabsTrigger>
              <TabsTrigger value="month">Bulan Ini</TabsTrigger>
            </TabsList>

            <TabsContent value="week" className="space-y-4 mt-4">
              {insights.map((insight, index) => (
                <div key={index} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                  <div className="flex items-start gap-3">
                    {getInsightIcon(insight.type)}
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                      <p className="text-sm text-gray-700 mb-2">{insight.message}</p>
                      <Progress value={insight.progress} className="h-1" />
                    </div>
                  </div>
                </div>
              ))}
            </TabsContent>

            <TabsContent value="month" className="space-y-4 mt-4">
              <div className="text-center py-8">
                <Award className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Data bulanan akan tersedia setelah 4 minggu penggunaan</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader>
          <CardTitle>Rekomendasi untuk Minggu Depan</CardTitle>
          <CardDescription>
            Saran berdasarkan pola makan anak Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {calorieProgress < 90 && (
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  💡 <strong>Tambah asupan kalori:</strong> Tambahkan camilan sehat seperti alpukat atau yogurt di antara waktu makan utama
                </p>
              </div>
            )}

            {proteinProgress < 90 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  🥚 <strong>Variasi protein:</strong> Putar sumber protein antara ayam, ikan, telur, dan kacang-kacangan
                </p>
              </div>
            )}

            {satisfactionRate < 80 && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-800">
                  🎨 <strong>Kreasikan presentasi:</strong> Bentuk makanan menjadi karakter lucu atau gunakan berbagai warna untuk menarik perhatian
                </p>
              </div>
            )}

            {satisfactionRate >= 90 && calorieProgress >= 90 && proteinProgress >= 90 && (
              <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  🎉 <strong>Excellent!</strong> Nutrisi anak Anda sangat baik. Pertahankan pola makan yang seimbang!
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
