'use client';

import { useState } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Baby, Settings, Plus, Edit, Trash2, Calendar } from 'lucide-react';
import { mockChild, dietaryPreferences } from '@/data/mockData';
import { Child, DietaryPreference } from '@/types';

export default function ProfilePage() {
  const [children, setChildren] = useState<Child[]>([mockChild]);
  const [isAddingChild, setIsAddingChild] = useState(false);
  const [newChild, setNewChild] = useState({
    name: '',
    birthDate: '',
    weight: '',
    allergies: '',
    preferences: [] as DietaryPreference[],
  });

  const calculateAge = (birthDate: Date): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    const diffTime = Math.abs(today.getTime() - birth.getTime());
    const diffMonths = Math.ceil(diffTime / (1000 * 60 * 60 * 24 * 30.44));
    return diffMonths;
  };

  const getAgeCategory = (ageInMonths: number): string => {
    if (ageInMonths < 6) return 'ASI Eksklusif';
    if (ageInMonths < 12) return 'MPASI Awal';
    if (ageInMonths < 24) return 'MPASI Lanjutan';
    if (ageInMonths < 60) return 'Balita';
    return 'Anak';
  };

  const handlePreferenceToggle = (preference: DietaryPreference) => {
    setNewChild(prev => ({
      ...prev,
      preferences: prev.preferences.find(p => p.type === preference.type)
        ? prev.preferences.filter(p => p.type !== preference.type)
        : [...prev.preferences, preference]
    }));
  };

  const addChild = () => {
    if (!newChild.name || !newChild.birthDate) return;

    const child: Child = {
      id: Date.now().toString(),
      name: newChild.name,
      birthDate: new Date(newChild.birthDate),
      age: calculateAge(new Date(newChild.birthDate)),
      weight: newChild.weight ? parseFloat(newChild.weight) : undefined,
      allergies: newChild.allergies ? newChild.allergies.split(',').map(a => a.trim()) : [],
      preferences: newChild.preferences,
    };

    setChildren([...children, child]);
    setNewChild({
      name: '',
      birthDate: '',
      weight: '',
      allergies: '',
      preferences: [],
    });
    setIsAddingChild(false);
  };

  const removeChild = (id: string) => {
    setChildren(children.filter(child => child.id !== id));
  };

  return (
    <Sidebar>
      
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Profil Keluarga</h1>
          <p className="text-lg text-gray-600">
            Kelola informasi keluarga dan preferensi untuk meal planning yang lebih personal
          </p>
        </div>

        <Tabs defaultValue="children" className="space-y-6">
          <TabsList>
            <TabsTrigger value="children" className="flex items-center gap-2">
              <Baby className="h-4 w-4" />
              Data Anak
            </TabsTrigger>
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              Profil Saya
            </TabsTrigger>
            <TabsTrigger value="preferences" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Preferensi
            </TabsTrigger>
          </TabsList>

          <TabsContent value="children" className="space-y-6">
            {/* Children List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {children.map((child) => (
                <Card key={child.id}>
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={`/avatars/${child.name.toLowerCase()}.jpg`} />
                          <AvatarFallback className="bg-pink-100 text-pink-600">
                            {child.name.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <CardTitle className="text-lg">{child.name}</CardTitle>
                          <CardDescription>
                            {child.age} bulan • {getAgeCategory(child.age)}
                          </CardDescription>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeChild(child.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span>Lahir: {child.birthDate.toLocaleDateString('id-ID')}</span>
                      </div>
                      
                      {child.weight && (
                        <div className="text-sm">
                          <span className="font-medium">Berat: </span>
                          {child.weight} kg
                        </div>
                      )}

                      {child.preferences.length > 0 && (
                        <div>
                          <div className="text-sm font-medium mb-2">Preferensi Diet:</div>
                          <div className="flex flex-wrap gap-1">
                            {child.preferences.map((pref) => (
                              <Badge key={pref.type} variant="secondary" className="text-xs">
                                {pref.label}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      {child.allergies.length > 0 && (
                        <div>
                          <div className="text-sm font-medium mb-2">Alergi:</div>
                          <div className="flex flex-wrap gap-1">
                            {child.allergies.map((allergy) => (
                              <Badge key={allergy} variant="destructive" className="text-xs">
                                {allergy}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <Button variant="outline" size="sm" className="w-full mt-4">
                        <Edit className="mr-2 h-4 w-4" />
                        Edit Data
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}

              {/* Add Child Card */}
              <Card className="border-dashed border-2 border-gray-300 hover:border-pink-400 transition-colors">
                {!isAddingChild ? (
                  <CardContent className="flex flex-col items-center justify-center h-full min-h-[300px] text-center">
                    <Baby className="h-12 w-12 text-gray-400 mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Tambah Anak
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Tambahkan data anak untuk meal planning yang lebih personal
                    </p>
                    <Button onClick={() => setIsAddingChild(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Tambah Anak
                    </Button>
                  </CardContent>
                ) : (
                  <>
                    <CardHeader>
                      <CardTitle>Tambah Anak Baru</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor="child-name">Nama Anak</Label>
                        <Input
                          id="child-name"
                          value={newChild.name}
                          onChange={(e) => setNewChild(prev => ({ ...prev, name: e.target.value }))}
                          placeholder="Masukkan nama anak"
                        />
                      </div>

                      <div>
                        <Label htmlFor="child-birthdate">Tanggal Lahir</Label>
                        <Input
                          id="child-birthdate"
                          type="date"
                          value={newChild.birthDate}
                          onChange={(e) => setNewChild(prev => ({ ...prev, birthDate: e.target.value }))}
                        />
                      </div>

                      <div>
                        <Label htmlFor="child-weight">Berat Badan (kg) - Opsional</Label>
                        <Input
                          id="child-weight"
                          type="number"
                          step="0.1"
                          value={newChild.weight}
                          onChange={(e) => setNewChild(prev => ({ ...prev, weight: e.target.value }))}
                          placeholder="10.5"
                        />
                      </div>

                      <div>
                        <Label>Preferensi Diet</Label>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {dietaryPreferences.map((preference) => (
                            <Badge
                              key={preference.type}
                              variant={newChild.preferences.find(p => p.type === preference.type) ? "default" : "outline"}
                              className="cursor-pointer"
                              onClick={() => handlePreferenceToggle(preference)}
                            >
                              {preference.label}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="child-allergies">Alergi (pisahkan dengan koma)</Label>
                        <Input
                          id="child-allergies"
                          value={newChild.allergies}
                          onChange={(e) => setNewChild(prev => ({ ...prev, allergies: e.target.value }))}
                          placeholder="kacang, telur, susu"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button onClick={addChild} className="flex-1">
                          Simpan
                        </Button>
                        <Button 
                          variant="outline" 
                          onClick={() => setIsAddingChild(false)}
                          className="flex-1"
                        >
                          Batal
                        </Button>
                      </div>
                    </CardContent>
                  </>
                )}
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Informasi Pribadi</CardTitle>
                <CardDescription>
                  Kelola informasi akun dan preferensi personal Anda
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-20 w-20">
                    <AvatarImage src="/avatars/user.jpg" />
                    <AvatarFallback className="bg-pink-100 text-pink-600 text-xl">
                      U
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <Button variant="outline" size="sm">
                      Ganti Foto
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="user-name">Nama Lengkap</Label>
                    <Input id="user-name" defaultValue="Ibu Sari" />
                  </div>
                  <div>
                    <Label htmlFor="user-email">Email</Label>
                    <Input id="user-email" type="email" defaultValue="sari@email.com" />
                  </div>
                  <div>
                    <Label htmlFor="user-phone">Nomor Telepon</Label>
                    <Input id="user-phone" defaultValue="+62 812 3456 7890" />
                  </div>
                  <div>
                    <Label htmlFor="user-location">Lokasi</Label>
                    <Input id="user-location" defaultValue="Jakarta, Indonesia" />
                  </div>
                </div>

                <Button className="bg-pink-500 hover:bg-pink-600">
                  Simpan Perubahan
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="preferences" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Preferensi Meal Planning</CardTitle>
                <CardDescription>
                  Atur preferensi default untuk meal planning
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label>Durasi Meal Plan Default</Label>
                  <Select defaultValue="7">
                    <SelectTrigger className="mt-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 Hari</SelectItem>
                      <SelectItem value="7">7 Hari</SelectItem>
                      <SelectItem value="30">30 Hari</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Jenis Makanan yang Disukai</Label>
                  <div className="grid grid-cols-2 gap-2 mt-2">
                    {['Sarapan', 'Makan Siang', 'Makan Malam', 'Snack'].map((meal) => (
                      <label key={meal} className="flex items-center space-x-2">
                        <input type="checkbox" defaultChecked className="rounded" />
                        <span className="text-sm">{meal}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <Label>Notifikasi</Label>
                  <div className="space-y-2 mt-2">
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Reminder meal planning mingguan</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" defaultChecked className="rounded" />
                      <span className="text-sm">Tips edukasi harian</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input type="checkbox" className="rounded" />
                      <span className="text-sm">Notifikasi resep baru</span>
                    </label>
                  </div>
                </div>

                <Button className="bg-pink-500 hover:bg-pink-600">
                  Simpan Preferensi
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Sidebar>
  );
}
