'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Lazy load the chart component to reduce bundle size
const ChartContent = dynamic(() => import('./WeeklyChartContent'), {
  loading: () => (
    <div className="h-64 sm:h-80 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
    </div>
  ),
  ssr: false // Disable SSR for charts
});

const weeklyNutritionData = [
  { day: 'Sen', calories: 950, protein: 28, carbs: 120, fat: 35 },
  { day: 'Sel', calories: 1020, protein: 32, carbs: 135, fat: 38 },
  { day: 'Rab', calories: 890, protein: 25, carbs: 110, fat: 32 },
  { day: 'Kam', calories: 1100, protein: 35, carbs: 145, fat: 42 },
  { day: 'Jum', calories: 980, protein: 30, carbs: 125, fat: 36 },
  { day: 'Sab', calories: 1050, protein: 33, carbs: 140, fat: 40 },
  { day: 'Min', calories: 920, protein: 27, carbs: 115, fat: 34 },
];

const mealCompletionData = [
  { day: 'Sen', breakfast: 100, lunch: 100, dinner: 100, snack: 50 },
  { day: 'Sel', breakfast: 100, lunch: 75, dinner: 100, snack: 100 },
  { day: 'Rab', breakfast: 100, lunch: 100, dinner: 100, snack: 75 },
  { day: 'Kam', breakfast: 50, lunch: 100, dinner: 75, snack: 0 },
  { day: 'Jum', breakfast: 0, lunch: 0, dinner: 0, snack: 0 },
  { day: 'Sab', breakfast: 0, lunch: 0, dinner: 0, snack: 0 },
  { day: 'Min', breakfast: 0, lunch: 0, dinner: 0, snack: 0 },
];

export function WeeklyChart() {
  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-3 sm:pb-6">
        <CardTitle className="text-base sm:text-lg">Analisis Mingguan</CardTitle>
        <CardDescription className="text-sm">
          Tracking nutrisi dan meal completion 7 hari terakhir
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="nutrition" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="nutrition">Nutrisi</TabsTrigger>
            <TabsTrigger value="completion">Meal Completion</TabsTrigger>
          </TabsList>

          <TabsContent value="nutrition" className="space-y-4">
            <Suspense fallback={
              <div className="h-64 sm:h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            }>
              <ChartContent
                type="nutrition"
                data={weeklyNutritionData}
                className="h-64 sm:h-80"
              />
            </Suspense>
            <div className="flex justify-center gap-3 sm:gap-6 text-xs sm:text-sm flex-wrap">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-500 rounded-full"></div>
                <span>Kalori</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-500 rounded-full"></div>
                <span>Protein</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-500 rounded-full"></div>
                <span>Karbo</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-red-500 rounded-full"></div>
                <span>Lemak</span>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="completion" className="space-y-4">
            <Suspense fallback={
              <div className="h-64 sm:h-80 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            }>
              <ChartContent
                type="completion"
                data={mealCompletionData}
                className="h-64 sm:h-80"
              />
            </Suspense>
            <div className="flex justify-center gap-3 sm:gap-6 text-xs sm:text-sm flex-wrap">
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-yellow-400 rounded-full"></div>
                <span>Sarapan</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-green-400 rounded-full"></div>
                <span>Siang</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-blue-400 rounded-full"></div>
                <span>Malam</span>
              </div>
              <div className="flex items-center gap-1 sm:gap-2">
                <div className="w-2 h-2 sm:w-3 sm:h-3 bg-purple-400 rounded-full"></div>
                <span>Snack</span>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
