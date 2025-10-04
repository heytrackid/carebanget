# Parenting Meal Planner & Edukasi

Aplikasi web lengkap untuk membantu orang tua merencanakan makanan sehat untuk anak sesuai usia, kebutuhan gizi, dan preferensi keluarga. Dilengkapi dengan edukasi praktis seputar gizi, MPASI, dan pola makan anak.

## 🎯 Target User
- Orang tua bayi & balita (0–5 tahun)
- Keluarga dengan anak sekolah (6–12 tahun)
- UMKM katering sehat/daycare

## ✨ Fitur Utama

### 🍽️ Meal Planner Otomatis
- Generate menu harian/mingguan berdasarkan usia anak
- Algoritma cerdas untuk variasi menu yang beragam
- Penyesuaian porsi otomatis sesuai umur/berat badan
- Support untuk alergi dan preferensi diet (halal, vegetarian, dll)

### 🤖 AI Recipe Generator
- Input bahan yang tersedia → AI buat resep sehat
- Rekomendasi alternatif jika bahan habis/mahal
- Tips memasak khusus untuk anak
- Analisis nutrisi otomatis

### 📊 Nutrisi & Kalkulasi
- Info kalori, protein, karbohidrat, lemak, serat
- Visualisasi nutrisi dengan pie chart & bar chart
- Porsi otomatis menyesuaikan usia anak
- Tracking harian nutrisi

### 🛒 Shopping List Otomatis
- Generate daftar belanja dari meal plan
- Export ke PDF atau share ke WhatsApp
- Kategori bahan terorganisir
- Checklist saat berbelanja

### 📚 Edukasi Parenting & Gizi
- Artikel sesuai usia anak (MPASI, picky eater, dll)
- Tips praktis berbasis masalah
- Panduan lengkap nutrisi anak
- Content yang terus diupdate

## 🛠️ Tech Stack

- **Framework**: Next.js 15 dengan App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Charts**: Recharts
- **Icons**: Lucide React
- **Development**: ESLint, Prettier

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm atau yarn

### Installation

1. Clone repository
```bash
git clone <repository-url>
cd parenting-meal-planner
```

2. Install dependencies
```bash
npm install
```

3. Run development server
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) di browser

## 📁 Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── page.tsx           # Homepage
│   ├── meal-planner/      # Meal planning feature
│   ├── ai-recipe/         # AI recipe generator
│   ├── recipes/           # Recipe collection
│   ├── shopping-list/     # Shopping list manager
│   ├── education/         # Educational content
│   └── profile/           # User profile
├── components/            # Reusable components
│   ├── ui/               # shadcn/ui components
│   ├── navigation/       # Navigation components
│   └── nutrition/        # Nutrition charts
├── data/                 # Mock data & constants
├── types/                # TypeScript type definitions
└── lib/                  # Utility functions
```

## 🎨 Design System

### Color Palette
- **Primary**: Pink (#ec4899) - Warm, family-friendly
- **Secondary**: Gray tones for text and backgrounds
- **Accent**: Blue, Green, Yellow untuk kategori dan status

### Typography
- **Font**: Geist Sans (modern, readable)
- **Hierarchy**: Clear heading structure dengan consistent spacing

### Components
- Menggunakan shadcn/ui untuk konsistensi
- Responsive design untuk mobile & desktop
- Accessible dengan proper ARIA labels

## 📱 Features Overview

### 1. Homepage
- Hero section dengan value proposition
- Feature cards dengan penjelasan lengkap
- Call-to-action untuk mulai meal planning

### 2. Meal Planner
- Form input usia anak, preferensi, alergi
- Generate meal plan 3/7/30 hari
- Tampilan tabs untuk setiap hari
- Export ke PDF

### 3. AI Recipe Generator
- Input multiple bahan makanan
- AI generate resep custom
- Nutrition analysis dengan charts
- Tips & alternatif resep

### 4. Recipe Collection
- Filter berdasarkan usia, jenis makanan, kesulitan
- Search functionality
- Detail resep dengan step-by-step
- Nutrition information

### 5. Shopping List
- Generate dari meal plan
- Add custom items
- Kategori bahan (protein, sayuran, dll)
- Export & share functionality

### 6. Education
- Artikel berdasarkan kategori & usia
- Search & filter content
- Markdown-style content rendering
- Reading time estimation

### 7. Profile
- Manage multiple children data
- Family preferences
- Notification settings
- Account management

## 🔮 Future Enhancements

### Database Integration
- User authentication
- Save meal plans & recipes
- Sync across devices
- Community features

### Advanced Features
- Video tutorials
- Community forum
- Premium meal plans
- Nutrition tracking history
- Integration dengan e-commerce

### Mobile App
- React Native version
- Offline functionality
- Push notifications
- Camera untuk scan bahan

## 🤝 Contributing

1. Fork repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👥 Team

Developed with ❤️ for Indonesian families
