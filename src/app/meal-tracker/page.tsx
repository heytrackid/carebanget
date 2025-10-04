'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Calendar, Clock, Plus, Check, X, Camera, Smile, Frown, Meh } from 'lucide-react';

export default function MealTrackerPage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLogging, setIsLogging] = useState(false);
  const [newMealLog, setNewMealLog] = useState({
    mealType: '',
    foodName: '',
    portion: '',
    reaction: '',
    notes: '',
    photo: null as File | null,
  });

  // Mock meal logs data
  const [mealLogs, setMealLogs] = useState([
    {
      id: '1',
      date: new Date().toISOString().split('T')[0],
      mealType: 'breakfast',
      foodName: 'Bubur Pisang Alpukat',
      portion: 'Habis semua',
      reaction: 'happy',
      notes: 'Aisyah suka sekali, minta tambah',
      time: '07:30',
      nutrition: { calories: 120, protein: 3 }
    },
    {
      id: '2',
      date: new Date().toISOString().split('T')[0],
      mealType: 'lunch',
      foodName: 'Nasi Tim Ayam Sayur',
      portion: 'Setengah porsi',
      reaction: 'neutral',
      notes: 'Makan perlahan, tidak terlalu antusias',
      time: '12:00',
      nutrition: { calories: 180, protein: 12 }
    },
  ]);

  const getMealTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      breakfast: 'Sarapan',
      lunch: 'Makan Siang',
      dinner: 'Makan Malam',
      snack: 'Snack',
    };
    return labels[type] || type;
  };

  const getReactionIcon = (reaction: string) => {
    switch (reaction) {
      case 'happy': return <Smile className="h-4 w-4 text-green-500" />;
      case 'neutral': return <Meh className="h-4 w-4 text-yellow-500" />;
      case 'sad': return <Frown className="h-4 w-4 text-red-500" />;
      default: return null;
    }
  };

  const getReactionColor = (reaction: string) => {
    switch (reaction) {
      case 'happy': return 'bg-green-100 text-green-800';
      case 'neutral': return 'bg-yellow-100 text-yellow-800';
      case 'sad': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const addMealLog = () => {
    if (!newMealLog.mealType || !newMealLog.foodName) return;

    const log = {
      id: Date.now().toString(),
      date: selectedDate,
      ...newMealLog,
      time: new Date().toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
      nutrition: { calories: Math.floor(Math.random() * 200) + 50, protein: Math.floor(Math.random() * 15) + 2 }
    };

    setMealLogs([...mealLogs, log]);
    setNewMealLog({
      mealType: '',
      foodName: '',
      portion: '',
      reaction: '',
      notes: '',
      photo: null,
    });
    setIsLogging(false);
  };

  const todayLogs = mealLogs.filter(log => log.date === selectedDate);
  const totalCalories = todayLogs.reduce((sum, log) => sum + log.nutrition.calories, 0);
  const totalProtein = todayLogs.reduce((sum, log) => sum + log.nutrition.protein, 0);

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
              <BreadcrumbPage>Meal Tracker</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Meal Tracker</h1>
          <p className="text-gray-500">
            Catat asupan makanan anak hari ini untuk memantau nutrisi yang diterima
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Date Selector & Quick Stats */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Tracking untuk Tanggal</CardTitle>
                    <CardDescription>Pilih tanggal untuk melihat log makanan</CardDescription>
                  </div>
                  <Button onClick={() => setIsLogging(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Log Makanan
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-6">
                  <div>
                    <Label htmlFor="date">Tanggal</Label>
                    <Input
                      id="date"
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div className="flex-1 grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-blue-50 rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">{todayLogs.length}</div>
                      <div className="text-sm text-gray-600">Meals Logged</div>
                    </div>
                    <div className="text-center p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-600">{totalCalories}</div>
                      <div className="text-sm text-gray-600">Total Kalori</div>
                    </div>
                    <div className="text-center p-3 bg-purple-50 rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{totalProtein}g</div>
                      <div className="text-sm text-gray-600">Total Protein</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Meal Logs */}
            <Card>
              <CardHeader>
                <CardTitle>Log Makanan Hari Ini</CardTitle>
                <CardDescription>
                  Riwayat makanan yang sudah dicatat untuk {new Date(selectedDate).toLocaleDateString('id-ID')}
                </CardDescription>
              </CardHeader>
              <CardContent>
                {todayLogs.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">Belum ada log makanan untuk tanggal ini</p>
                    <Button onClick={() => setIsLogging(true)} className="mt-4">
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Log Pertama
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {todayLogs.map((log) => (
                      <div key={log.id} className="border rounded-lg p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <Badge variant="outline">{getMealTypeLabel(log.mealType)}</Badge>
                            <span className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {log.time}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {getReactionIcon(log.reaction)}
                            <Badge className={getReactionColor(log.reaction)}>
                              {log.reaction === 'happy' ? 'Suka' : 
                               log.reaction === 'neutral' ? 'Biasa' : 'Tidak Suka'}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-1">{log.foodName}</h4>
                            <p className="text-sm text-gray-600">Porsi: {log.portion}</p>
                            {log.notes && (
                              <p className="text-sm text-gray-600 mt-2 italic">"{log.notes}"</p>
                            )}
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-gray-600">
                              <span className="font-medium">{log.nutrition.calories} kcal</span> • 
                              <span className="ml-1">{log.nutrition.protein}g protein</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Add Meal Log Form */}
            {isLogging && (
              <Card>
                <CardHeader>
                  <CardTitle>Log Makanan Baru</CardTitle>
                  <CardDescription>Catat makanan yang baru saja dikonsumsi</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Jenis Makanan</Label>
                    <Select value={newMealLog.mealType} onValueChange={(value) => 
                      setNewMealLog(prev => ({ ...prev, mealType: value }))
                    }>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Pilih jenis makanan" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="breakfast">Sarapan</SelectItem>
                        <SelectItem value="lunch">Makan Siang</SelectItem>
                        <SelectItem value="dinner">Makan Malam</SelectItem>
                        <SelectItem value="snack">Snack</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="food-name">Nama Makanan</Label>
                    <Input
                      id="food-name"
                      value={newMealLog.foodName}
                      onChange={(e) => setNewMealLog(prev => ({ ...prev, foodName: e.target.value }))}
                      placeholder="Contoh: Bubur Pisang Alpukat"
                      className="mt-1"
                    />
                  </div>

                  <div>
                    <Label htmlFor="portion">Porsi yang Dimakan</Label>
                    <Select value={newMealLog.portion} onValueChange={(value) => 
                      setNewMealLog(prev => ({ ...prev, portion: value }))
                    }>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Pilih porsi" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Habis semua">Habis semua</SelectItem>
                        <SelectItem value="3/4 porsi">3/4 porsi</SelectItem>
                        <SelectItem value="Setengah porsi">Setengah porsi</SelectItem>
                        <SelectItem value="1/4 porsi">1/4 porsi</SelectItem>
                        <SelectItem value="Sedikit">Sedikit</SelectItem>
                        <SelectItem value="Tidak mau makan">Tidak mau makan</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label>Reaksi Anak</Label>
                    <Select value={newMealLog.reaction} onValueChange={(value) => 
                      setNewMealLog(prev => ({ ...prev, reaction: value }))
                    }>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Bagaimana reaksinya?" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="happy">😊 Suka sekali</SelectItem>
                        <SelectItem value="neutral">😐 Biasa saja</SelectItem>
                        <SelectItem value="sad">😞 Tidak suka</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="notes">Catatan (Opsional)</Label>
                    <Textarea
                      id="notes"
                      value={newMealLog.notes}
                      onChange={(e) => setNewMealLog(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Catatan tambahan tentang makanan ini..."
                      className="mt-1"
                      rows={3}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button onClick={addMealLog} className="flex-1">
                      <Check className="mr-2 h-4 w-4" />
                      Simpan Log
                    </Button>
                    <Button variant="outline" onClick={() => setIsLogging(false)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Daily Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Progress Harian</CardTitle>
                <CardDescription>Target nutrisi untuk hari ini</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Kalori</span>
                    <span>{totalCalories}/1000 kcal</span>
                  </div>
                  <Progress value={(totalCalories / 1000) * 100} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Protein</span>
                    <span>{totalProtein}/30g</span>
                  </div>
                  <Progress value={(totalProtein / 30) * 100} />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Meals Logged</span>
                    <span>{todayLogs.length}/4</span>
                  </div>
                  <Progress value={(todayLogs.length / 4) * 100} />
                </div>
              </CardContent>
            </Card>

            {/* Quick Tips */}
            <Card>
              <CardHeader>
                <CardTitle>Tips Meal Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Catat makanan segera setelah anak makan</li>
                  <li>• Perhatikan reaksi dan preferensi anak</li>
                  <li>• Foto makanan untuk dokumentasi</li>
                  <li>• Catat porsi yang benar-benar dimakan</li>
                  <li>• Tambahkan catatan untuk pola makan</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Sidebar>
  );
}
