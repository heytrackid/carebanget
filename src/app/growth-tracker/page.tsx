'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { TrendingUp, TrendingDown, Ruler, Weight, Plus, Calendar } from 'lucide-react';
import { ChartSkeleton } from '@/components/ui/skeleton';
import React, { Suspense, lazy } from 'react';

// Lazy load chart components
const GrowthChart = lazy(() => import('@/components/growth/GrowthChart').then(module => ({ default: module.GrowthChart })));

export default function GrowthTrackerPage() {
  const [isAddingRecord, setIsAddingRecord] = useState(false);
  const [newRecord, setNewRecord] = useState({
    date: new Date().toISOString().split('T')[0],
    weight: '',
    height: '',
    headCircumference: '',
  });

  // Mock growth data
  const [growthData, setGrowthData] = useState([
    { date: '2024-01-15', age: 6, weight: 7.2, height: 65, headCircumference: 42 },
    { date: '2024-02-15', age: 7, weight: 7.8, height: 67, headCircumference: 43 },
    { date: '2024-03-15', age: 8, weight: 8.3, height: 69, headCircumference: 43.5 },
    { date: '2024-04-15', age: 9, weight: 8.7, height: 71, headCircumference: 44 },
    { date: '2024-05-15', age: 10, weight: 9.2, height: 73, headCircumference: 44.5 },
    { date: '2024-06-15', age: 11, weight: 9.6, height: 75, headCircumference: 45 },
    { date: '2024-07-15', age: 12, weight: 10.1, height: 76, headCircumference: 45.2 },
    { date: '2024-08-15', age: 13, weight: 10.4, height: 77, headCircumference: 45.5 },
    { date: '2024-09-15', age: 14, weight: 10.7, height: 78, headCircumference: 45.8 },
    { date: '2024-10-15', age: 15, weight: 10.9, height: 79, headCircumference: 46 },
  ]);

  // WHO Growth Standards (simplified)
  const whoStandards = {
    weight: {
      p3: [5.5, 6.2, 6.8, 7.3, 7.8, 8.2, 8.6, 8.9, 9.2, 9.5],
      p50: [7.3, 8.0, 8.6, 9.2, 9.7, 10.2, 10.6, 11.0, 11.3, 11.6],
      p97: [9.4, 10.2, 10.9, 11.6, 12.2, 12.8, 13.3, 13.8, 14.2, 14.6],
    },
    height: {
      p3: [61, 64, 67, 69, 71, 73, 75, 76, 78, 79],
      p50: [65, 69, 72, 74, 76, 78, 80, 81, 83, 84],
      p97: [70, 74, 77, 79, 81, 83, 85, 86, 88, 89],
    }
  };

  const addGrowthRecord = () => {
    if (!newRecord.weight || !newRecord.height) return;

    const record = {
      date: newRecord.date,
      age: Math.floor((new Date(newRecord.date).getTime() - new Date('2023-06-15').getTime()) / (1000 * 60 * 60 * 24 * 30.44)),
      weight: parseFloat(newRecord.weight),
      height: parseFloat(newRecord.height),
      headCircumference: newRecord.headCircumference ? parseFloat(newRecord.headCircumference) : 0,
    };

    setGrowthData([...growthData, record].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()));
    setNewRecord({
      date: new Date().toISOString().split('T')[0],
      weight: '',
      height: '',
      headCircumference: '',
    });
    setIsAddingRecord(false);
  };

  const latestRecord = growthData[growthData.length - 1];
  const previousRecord = growthData[growthData.length - 2];

  const getPercentile = (value: number, standards: number[], age: number) => {
    const ageIndex = Math.min(Math.max(age - 6, 0), standards.length - 1);
    const p3 = whoStandards.weight.p3[ageIndex];
    const p50 = whoStandards.weight.p50[ageIndex];
    const p97 = whoStandards.weight.p97[ageIndex];

    if (value <= p3) return 'P3';
    if (value <= p50) return 'P50';
    if (value <= p97) return 'P97';
    return 'P97+';
  };

  const getPercentileColor = (percentile: string) => {
    switch (percentile) {
      case 'P3': return 'bg-red-100 text-red-800';
      case 'P50': return 'bg-green-100 text-green-800';
      case 'P97': return 'bg-blue-100 text-blue-800';
      case 'P97+': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTrend = (current: number, previous: number) => {
    if (current > previous) return { icon: TrendingUp, color: 'text-green-500', text: 'Naik' };
    if (current < previous) return { icon: TrendingDown, color: 'text-red-500', text: 'Turun' };
    return { icon: TrendingUp, color: 'text-gray-500', text: 'Stabil' };
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
              <BreadcrumbPage>Growth Tracker</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Growth Tracker</h1>
            <p className="text-lg text-gray-600">
              Pantau pertumbuhan fisik anak dengan grafik dan persentil WHO
            </p>
          </div>
          <Button onClick={() => setIsAddingRecord(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Tambah Record
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mb-8">
          {/* Current Stats */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Weight className="h-5 w-5 text-blue-500" />
                Berat Badan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600 mb-2">
                {latestRecord?.weight} kg
              </div>
              {previousRecord && (
                <div className="flex items-center gap-2 text-sm">
                  {(() => {
                    const trend = getTrend(latestRecord.weight, previousRecord.weight);
                    const TrendIcon = trend.icon;
                    return (
                      <>
                        <TrendIcon className={`h-4 w-4 ${trend.color}`} />
                        <span className={trend.color}>
                          {trend.text} {Math.abs(latestRecord.weight - previousRecord.weight).toFixed(1)} kg
                        </span>
                      </>
                    );
                  })()}
                </div>
              )}
              <Badge className={getPercentileColor(getPercentile(latestRecord?.weight || 0, whoStandards.weight.p50, latestRecord?.age || 0))} variant="secondary">
                {getPercentile(latestRecord?.weight || 0, whoStandards.weight.p50, latestRecord?.age || 0)}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Ruler className="h-5 w-5 text-green-500" />
                Tinggi Badan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600 mb-2">
                {latestRecord?.height} cm
              </div>
              {previousRecord && (
                <div className="flex items-center gap-2 text-sm">
                  {(() => {
                    const trend = getTrend(latestRecord.height, previousRecord.height);
                    const TrendIcon = trend.icon;
                    return (
                      <>
                        <TrendIcon className={`h-4 w-4 ${trend.color}`} />
                        <span className={trend.color}>
                          {trend.text} {Math.abs(latestRecord.height - previousRecord.height).toFixed(1)} cm
                        </span>
                      </>
                    );
                  })()}
                </div>
              )}
              <Badge className={getPercentileColor(getPercentile(latestRecord?.height || 0, whoStandards.height.p50, latestRecord?.age || 0))} variant="secondary">
                {getPercentile(latestRecord?.height || 0, whoStandards.height.p50, latestRecord?.age || 0)}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Lingkar Kepala</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600 mb-2">
                {latestRecord?.headCircumference} cm
              </div>
              {previousRecord && (
                <div className="flex items-center gap-2 text-sm">
                  {(() => {
                    const trend = getTrend(latestRecord.headCircumference, previousRecord.headCircumference);
                    const TrendIcon = trend.icon;
                    return (
                      <>
                        <TrendIcon className={`h-4 w-4 ${trend.color}`} />
                        <span className={trend.color}>
                          {trend.text} {Math.abs(latestRecord.headCircumference - previousRecord.headCircumference).toFixed(1)} cm
                        </span>
                      </>
                    );
                  })()}
                </div>
              )}
              <Badge variant="secondary">Normal</Badge>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Usia Saat Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 mb-2">
                {latestRecord?.age} bulan
              </div>
              <div className="text-sm text-gray-600">
                {Math.floor((latestRecord?.age || 0) / 12)} tahun {(latestRecord?.age || 0) % 12} bulan
              </div>
              <Badge variant="outline">
                {latestRecord?.age < 12 ? 'Bayi' : latestRecord?.age < 24 ? 'Batita' : 'Balita'}
              </Badge>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Growth Charts */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Grafik Pertumbuhan</CardTitle>
                <CardDescription>
                  Tracking pertumbuhan anak dari waktu ke waktu
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="weight" className="w-full">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="weight">Berat Badan</TabsTrigger>
                    <TabsTrigger value="height">Tinggi Badan</TabsTrigger>
                    <TabsTrigger value="head">Lingkar Kepala</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="weight" className="space-y-4">
                    <Suspense fallback={<ChartSkeleton />}>
                      <GrowthChart data={growthData} type="weight" />
                    </Suspense>
                  </TabsContent>
                  
                  <TabsContent value="height" className="space-y-4">
                    <Suspense fallback={<ChartSkeleton />}>
                      <GrowthChart data={growthData} type="height" />
                    </Suspense>
                  </TabsContent>
                  
                  <TabsContent value="head" className="space-y-4">
                    <Suspense fallback={<ChartSkeleton />}>
                      <GrowthChart data={growthData} type="head" />
                    </Suspense>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Add Record Form */}
            {isAddingRecord && (
              <Card>
                <CardHeader>
                  <CardTitle>Tambah Record Baru</CardTitle>
                  <CardDescription>Catat pengukuran terbaru</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="record-date">Tanggal Pengukuran</Label>
                    <Input
                      id="record-date"
                      type="date"
                      value={newRecord.date}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, date: e.target.value }))}
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="weight">Berat Badan (kg)</Label>
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      value={newRecord.weight}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, weight: e.target.value }))}
                      placeholder="10.5"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="height">Tinggi Badan (cm)</Label>
                    <Input
                      id="height"
                      type="number"
                      step="0.1"
                      value={newRecord.height}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, height: e.target.value }))}
                      placeholder="79"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="head">Lingkar Kepala (cm)</Label>
                    <Input
                      id="head"
                      type="number"
                      step="0.1"
                      value={newRecord.headCircumference}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, headCircumference: e.target.value }))}
                      placeholder="46"
                      className="mt-1"
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={addGrowthRecord} className="flex-1">
                      Simpan Record
                    </Button>
                    <Button variant="outline" onClick={() => setIsAddingRecord(false)}>
                      Batal
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Growth Milestones */}
            <Card>
              <CardHeader>
                <CardTitle>Milestone Pertumbuhan</CardTitle>
                <CardDescription>Target pertumbuhan sesuai usia</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="font-medium text-green-800">Berat Badan Normal</div>
                    <div className="text-sm text-green-600">Sesuai persentil WHO</div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="font-medium text-blue-800">Tinggi Badan Baik</div>
                    <div className="text-sm text-blue-600">Pertumbuhan konsisten</div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="font-medium text-purple-800">Lingkar Kepala Normal</div>
                    <div className="text-sm text-purple-600">Perkembangan otak baik</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Recent Records */}
            <Card>
              <CardHeader>
                <CardTitle>Record Terbaru</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {growthData.slice(-5).reverse().map((record, index) => (
                    <div key={index} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <div className="text-sm font-medium">
                          {new Date(record.date).toLocaleDateString('id-ID')}
                        </div>
                        <div className="text-xs text-gray-500">{record.age} bulan</div>
                      </div>
                      <div className="text-right text-sm">
                        <div>{record.weight}kg • {record.height}cm</div>
                        <div className="text-xs text-gray-500">{record.headCircumference}cm</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
