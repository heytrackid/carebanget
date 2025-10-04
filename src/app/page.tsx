import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Navbar } from '@/components/navigation/Navbar';
import { Baby, Calendar, BookOpen, ShoppingCart, Sparkles, Heart, Shield } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-pink-50 to-white">
      <Navbar />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Baby className="h-16 w-16 text-pink-500" />
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
            Parenting{' '}
            <span className="text-pink-500">Meal Planner</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Aplikasi lengkap untuk merencanakan makanan sehat anak sesuai usia, 
            dengan edukasi gizi dan tips parenting praktis untuk keluarga Indonesia.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/dashboard">
              <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white">
                <Baby className="mr-2 h-5 w-5" />
                Masuk ke Dashboard
              </Button>
            </Link>
            <Link href="/education">
              <Button size="lg" variant="outline">
                <BookOpen className="mr-2 h-5 w-5" />
                Pelajari Edukasi
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fitur Lengkap untuk Orang Tua Modern
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Semua yang Anda butuhkan untuk memberikan nutrisi terbaik bagi si kecil
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <Calendar className="h-12 w-12 text-pink-500 mb-4" />
                <CardTitle>Meal Planner Otomatis</CardTitle>
                <CardDescription>
                  Generate menu harian/mingguan sesuai usia anak dengan algoritma cerdas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Menu sesuai umur (0-12 tahun)</li>
                  <li>• Perhitungan nutrisi otomatis</li>
                  <li>• Variasi menu beragam</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Sparkles className="h-12 w-12 text-pink-500 mb-4" />
                <CardTitle>AI Recipe Generator</CardTitle>
                <CardDescription>
                  Input bahan yang tersedia, dapatkan resep sehat untuk anak
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Resep dari bahan tersedia</li>
                  <li>• Alternatif jika bahan habis</li>
                  <li>• Sesuai preferensi keluarga</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <ShoppingCart className="h-12 w-12 text-pink-500 mb-4" />
                <CardTitle>Shopping List Otomatis</CardTitle>
                <CardDescription>
                  Daftar belanja otomatis dari meal plan yang sudah dibuat
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Export ke PDF/WhatsApp</li>
                  <li>• Kategori bahan terorganisir</li>
                  <li>• Checklist saat berbelanja</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Heart className="h-12 w-12 text-pink-500 mb-4" />
                <CardTitle>Kalkulasi Nutrisi</CardTitle>
                <CardDescription>
                  Pantau asupan kalori, protein, dan nutrisi penting lainnya
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Visualisasi nutrisi</li>
                  <li>• Porsi sesuai berat badan</li>
                  <li>• Tracking harian</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <BookOpen className="h-12 w-12 text-pink-500 mb-4" />
                <CardTitle>Edukasi Parenting</CardTitle>
                <CardDescription>
                  Artikel dan tips praktis seputar MPASI, gizi, dan pola makan anak
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Panduan MPASI lengkap</li>
                  <li>• Tips mengatasi picky eater</li>
                  <li>• Edukasi sesuai usia anak</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-12 w-12 text-pink-500 mb-4" />
                <CardTitle>Aman & Terpercaya</CardTitle>
                <CardDescription>
                  Resep dan informasi dari ahli gizi dan dokter anak berpengalaman
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Resep teruji ahli gizi</li>
                  <li>• Informasi medis akurat</li>
                  <li>• Update berkala</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-pink-50">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Siap Memberikan Nutrisi Terbaik untuk Si Kecil?
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            Mulai perjalanan parenting yang lebih mudah dan menyenangkan dengan meal planner kami
          </p>
          <Link href="/dashboard">
            <Button size="lg" className="bg-pink-500 hover:bg-pink-600 text-white">
              Mulai Sekarang - Gratis!
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
