import { Recipe, EducationalContent, DietaryPreference, Child } from '@/types';

export const dietaryPreferences: DietaryPreference[] = [
  { type: 'halal', label: 'Halal' },
  { type: 'vegetarian', label: 'Vegetarian' },
  { type: 'vegan', label: 'Vegan' },
  { type: 'no-dairy', label: 'No Dairy' },
  { type: 'no-gluten', label: 'No Gluten' },
  { type: 'no-nuts', label: 'No Nuts' },
];

export const mockRecipes: Recipe[] = [
  {
    id: '1',
    name: 'Bubur Pisang Alpukat',
    description: 'Bubur lembut dengan pisang dan alpukat untuk bayi 6+ bulan',
    imageUrl: '/images/bubur-pisang-alpukat.jpg',
    prepTime: 10,
    cookTime: 15,
    servings: 2,
    ageMin: 6,
    ageMax: 12,
    mealType: ['breakfast', 'lunch'],
    ingredients: [
      { id: '1', name: 'Beras putih', amount: 50, unit: 'gram', category: 'grains' },
      { id: '2', name: 'Pisang', amount: 1, unit: 'buah', category: 'fruits' },
      { id: '3', name: 'Alpukat', amount: 0.5, unit: 'buah', category: 'fruits' },
      { id: '4', name: 'Air', amount: 200, unit: 'ml', category: 'others' },
    ],
    instructions: [
      'Cuci beras hingga bersih',
      'Masak beras dengan air hingga menjadi bubur lembut',
      'Haluskan pisang dan alpukat',
      'Campurkan buah yang sudah dihaluskan ke dalam bubur',
      'Aduk rata dan sajikan hangat',
    ],
    nutrition: {
      calories: 120,
      protein: 3,
      carbs: 25,
      fat: 2,
      fiber: 3,
      sugar: 8,
      sodium: 5,
    },
    tags: ['mpasi', 'buah', 'mudah'],
    difficulty: 'easy',
  },
  {
    id: '2',
    name: 'Puree Wortel Kentang',
    description: 'Puree lembut kaya beta karoten untuk bayi',
    imageUrl: '/images/puree-wortel-kentang.jpg',
    prepTime: 15,
    cookTime: 20,
    servings: 3,
    ageMin: 6,
    ageMax: 10,
    mealType: ['lunch', 'dinner'],
    ingredients: [
      { id: '5', name: 'Wortel', amount: 100, unit: 'gram', category: 'vegetables' },
      { id: '6', name: 'Kentang', amount: 100, unit: 'gram', category: 'vegetables' },
      { id: '7', name: 'ASI/Sufor', amount: 50, unit: 'ml', category: 'dairy' },
    ],
    instructions: [
      'Kupas dan potong wortel dan kentang',
      'Kukus hingga empuk (sekitar 15-20 menit)',
      'Haluskan dengan blender atau food processor',
      'Tambahkan ASI/sufor untuk konsistensi yang diinginkan',
      'Saring jika perlu untuk tekstur yang lebih halus',
    ],
    nutrition: {
      calories: 80,
      protein: 2,
      carbs: 18,
      fat: 1,
      fiber: 3,
      sugar: 4,
      sodium: 10,
    },
    tags: ['mpasi', 'sayuran', 'mudah'],
    difficulty: 'easy',
  },
  {
    id: '3',
    name: 'Nasi Tim Ayam Sayur',
    description: 'Nasi tim dengan ayam dan sayuran untuk balita',
    imageUrl: '/images/nasi-tim-ayam.jpg',
    prepTime: 20,
    cookTime: 30,
    servings: 2,
    ageMin: 12,
    ageMax: 36,
    mealType: ['lunch', 'dinner'],
    ingredients: [
      { id: '8', name: 'Beras putih', amount: 100, unit: 'gram', category: 'grains' },
      { id: '9', name: 'Dada ayam', amount: 50, unit: 'gram', category: 'protein' },
      { id: '10', name: 'Wortel', amount: 30, unit: 'gram', category: 'vegetables' },
      { id: '11', name: 'Brokoli', amount: 30, unit: 'gram', category: 'vegetables' },
      { id: '12', name: 'Kaldu ayam', amount: 300, unit: 'ml', category: 'others' },
    ],
    instructions: [
      'Cuci beras dan rendam 30 menit',
      'Potong kecil ayam, wortel, dan brokoli',
      'Masukkan semua bahan ke dalam panci tim',
      'Tim selama 30 menit hingga nasi empuk',
      'Haluskan sesuai kemampuan makan anak',
    ],
    nutrition: {
      calories: 180,
      protein: 12,
      carbs: 28,
      fat: 3,
      fiber: 2,
      sugar: 3,
      sodium: 150,
    },
    tags: ['nasi-tim', 'protein', 'sayuran'],
    difficulty: 'medium',
  },
];

export const mockEducationalContent: EducationalContent[] = [
  // Makanan & Gizi Anak
  {
    id: 'meal-planning-guide',
    title: 'Panduan Merencanakan Makanan Keluarga: Hemat Waktu & Sehat',
    category: 'nutrition',
    content: `# Panduan Merencanakan Makanan Keluarga

Bayangkan setiap pagi Anda bangun dengan tenang, tahu persis menu apa yang akan dimasak hari itu. Tidak ada lagi drama "mau makan apa hari ini?" yang membuat stres. Bayangkan pula dompet Anda tidak jebol karena belanja bahan makanan seenaknya, dan anak-anak Anda makan sehat tanpa ribet.

Itulah yang bisa Anda dapatkan dengan merencanakan makanan keluarga. Bukan hanya tentang menyusun menu, tapi tentang menciptakan rutinitas yang membuat hidup lebih mudah dan sehat.

Seorang ibu bernama Siti, yang bekerja sebagai guru TK, bercerita pengalamannya. "Dulu setiap sore saya panik mikirin makan malam. Kadang beli makanan cepat saji karena gak ada waktu masak. Sekarang, setiap Minggu malam saya luangin 1 jam buat rencana makan seminggu. Senin ayam, Selasa ikan, Rabu tahu tempe, dan seterusnya. Hasilnya? Anak-anak lebih sehat, dompet lebih hemat, dan saya lebih tenang."

Mulai dengan yang sederhana. Catat menu favorit keluarga selama 3 hari. Lihat pola apa yang bisa diulang. Misalnya, kalau keluarga suka ayam goreng, buat variasi: ayam goreng, ayam bakar, ayam tumis. Beli bahan dalam jumlah besar untuk beberapa hari, simpan di freezer.

Saat merencanakan, pikirkan juga nutrisi anak. Bayi 6 bulan butuh MPASI yang halus, anak 2 tahun butuh finger food yang mudah dipegang. Sesuaikan dengan fase tumbuh kembang mereka.

Yang penting, jadikan ini rutinitas keluarga. Libatkan anak dalam memilih menu. Biarkan mereka bantu potong sayuran atau aduk adonan. Ini bukan hanya tentang makan sehat, tapi tentang membangun kenangan bersama.

Percaya deh, setelah 2-3 minggu, Anda akan heran betapa hidup jadi lebih mudah. Anak makan teratur, Anda gak stres, dan keluarga lebih harmonis.`,
    tags: ['rencana makan', 'budget', 'kelola waktu', 'kesehatan keluarga', 'persiapan makan'],
    ageRange: { min: 0, max: 144 },
    readTime: 8,
    createdAt: new Date('2024-10-01'),
    updatedAt: new Date('2024-10-01')
  },

  {
    id: 'picky-eater-solutions',
    title: 'Menyelesaikan Masalah Picky Eater: Panduan Lengkap untuk Orang Tua',
    category: 'nutrition',
    content: `# Menyelesaikan Masalah Picky Eater

## Memahami Picky Eater

Picky eater adalah anak yang sangat selektif dengan makanan. Ini normal pada usia 2-6 tahun karena:
- **Perkembangan sensorik**: Mulut sensitif terhadap tekstur, rasa, bau
- **Kontrol autonomy**: Anak ingin kontrol atas hidupnya
- **Pengalaman buruk**: Makanan yang terlalu panas/dingin
- **Faktor genetik**: Beberapa anak memang lebih cautious

## Strategi Utama Mengatasi Picky Eater

### **1. Tetapkan Jadwal Makan Teratur**
- **3x makan utama** + **2x snack** per hari
- **Jadwal tetap**: Sarapan 07:00, Makan siang 12:00, dll
- **Waktu makan 20-30 menit** maksimal
- **Tidak ada snack** 1 jam sebelum makan utama

### **2. Aturan "The Clean Plate Club"**
Jangan paksa anak menghabiskan makanan. Sebaliknya:
- **Tawarkan porsi kecil** (1-2 sendok makan)
- **Biarkan anak berhenti** kalau sudah kenyang
- **Hormati batas** anak
- **Jangan jadikan reward/punishment**

### **3. Libatkan Anak dalam Proses**
- **Belanja bersama**: Biarkan pilih sayuran favorit
- **Masak bersama**: Ajar cara potong sayuran, aduk
- **Dekorasi makanan**: Bentuk bintang, hati, mobil
- **Cerita makanan**: "Bayam Superman yang kuat"

### **4. Diversifikasi Presentasi**
- **Warna-warnai**: Hidangkan makanan beraneka warna
- **Bentuk kreatif**: Gunakan cetakan bintang, hati
- **Tekstur berbeda**: Crispy, soft, chewy
- **Suhu berbeda**: Dingin, hangat, suhu ruang

## Menu Khusus Picky Eater

### **Finger Foods yang Disukai Anak**
- **Sayuran**: Wortel batang, kembang kol, paprika
- **Protein**: Nugget ayam homemade, keju kubus
- **Karbo**: Roti panggang, pasta berbentuk
- **Buah**: Pisang, anggur, strawberry

### **Smoothie & Puree**
- **Smoothie hijau**: Bayam + pisang + yogurt
- **Smoothie merah**: Tomat + wortel + jeruk
- **Puree campur**: Apel + wortel + jahe

### **"Camouflage" Menu**
- **Sembunyikan sayuran**: Dalam saus pasta, roti, kue
- **Puree dalam hidangan**: Bayam dalam macaroni
- **Smoothie tersembunyi**: Bayam + buah favorit

## Teknik Behavioral

### **Division of Responsibility (Ellyn Satter)**
- **Tugas orang tua**: Apa, kapan, di mana makan
- **Tugas anak**: Berapa banyak, mau makan apa
- **Jangan negosiasi** soal makan
- **Percaya anak tahu** kapan kenyang

### **Positive Reinforcement**
- **Puji usaha**: "Kamu coba 1 gigitan, hebat!"
- **Fokus proses**: Bukan hasil akhir
- **Tanpa paksaan**: Tawaran santai tanpa tekanan
- **Beri waktu**: Mungkin butuh 10-15 kali coba

### **Model Perilaku**
- **Makan bersama**: Tunjukkan cara makan sehat
- **Tanpa komentar**: Jangan kritik pilihan anak
- **Enjoy makanan**: Tunjukkan senang makan sayuran
- **Variasi piring**: Berbagai makanan untuk dipilih

## Nutrisi Penting Saat Picky Eater

### **Vitamin & Mineral Utama**
- **Vitamin A**: Wortel, bayam, ubi jalar
- **Vitamin C**: Jeruk, strawberry, paprika
- **Kalsium**: Yogurt, keju, brokoli
- **Zat besi**: Daging merah, bayam, kacang

### **Suplemen Jika Perlu**
- **Vitamin D**: Untuk anak kurang sinar matahari
- **Omega-3**: Ikan, flaxseed, walnut
- **Probiotik**: Yogurt, kefir
- **Konsultasi dokter** sebelum suplementasi

## Kapan Harus Khawatir?

### **Tanda Perlu Perhatian**
- **Berat badan turun drastis** dalam 1 bulan
- **Tidak naik berat badan** 3 bulan berturut
- **Sangat lelah, lesu** sepanjang hari
- **Pertumbuhan terhambat** (kurva pertumbuhan turun)
- **Defisiensi nutrisi** terdeteksi dokter

### **Kapan Konsultasi Ahli**
- **Dokter anak**: Jika ada gejala kekurangan nutrisi
- **Ahli gizi**: Untuk menu khusus dan suplementasi
- **Psikolog anak**: Jika ada trauma makan atau masalah perilaku
- **Terapis wicara**: Jika ada masalah sensori makan

## Kesimpulan & Tips Jangka Panjang

### **Kesabaran adalah Kunci**
- **Proses bertahap**: Butuh waktu 6-12 bulan
- **Konsistensi**: Tetap tawarkan makanan sehat
- **Tanpa drama**: Jadikan makan waktu menyenangkan
- **Percaya anak**: Tubuh anak tahu kebutuhan nutrisi

### **Tips untuk Orang Tua**
- **Jaga mental health**: Parenting bukan kompetisi
- **Support system**: Diskusi dengan orang tua lain
- **Educate yourself**: Pelajari perkembangan anak
- **Celebrate small wins**: Setiap gigitan adalah kemenangan

### **Outlook Jangka Panjang**
- **80% anak picky eater** akan membaik saat remaja
- **Kebiasaan sehat** akan terbentuk dengan waktu
- **Hubungan baik** dengan makanan lebih penting daripada sempurna
- **Anak yang bahagia** lebih sehat daripada anak yang "makan sempurna"

Ingat: Setiap anak unik. Apa yang berhasil untuk anak lain belum tentu berhasil untuk anak Anda. Percaya insting parenting Anda dan konsultasi dengan profesional jika perlu.`,
    tags: ['picky eater', 'feeding difficulties', 'child nutrition', 'behavioral eating', 'parenting tips'],
    ageRange: { min: 12, max: 72 },
    readTime: 12,
    createdAt: new Date('2024-10-02'),
    updatedAt: new Date('2024-10-02')
  },

  // Kesehatan & Perkembangan
  {
    id: 'growth-monitoring-guide',
    title: 'Panduan Lengkap Monitoring Pertumbuhan Anak: Apa yang Perlu Diketahui',
    category: 'development',
    content: `# Panduan Lengkap Monitoring Pertumbuhan Anak

## Mengapa Monitoring Pertumbuhan Penting?

Pertumbuhan anak adalah indikator kesehatan yang paling penting. Monitoring rutin membantu:
- **Deteksi dini masalah** kesehatan atau nutrisi
- **Evaluasi efektivitas** pola makan dan parenting
- **Intervensi tepat waktu** jika ada penyimpangan
- **Tenang pikiran** orang tua dengan data objektif

## Standar Pertumbuhan WHO

### **0-2 Tahun: Periode Emas**
- **Berat badan**: Naik 2-3x lipat dari lahir
- **Tinggi badan**: Tambah 50cm dalam 2 tahun
- **Lingkar kepala**: Indikator perkembangan otak

### **2-5 Tahun: Steady Growth**
- **Berat badan**: Tambah 2-3kg per tahun
- **Tinggi badan**: Tambah 5-7cm per tahun
- **BMI**: Tetap stabil atau turun sedikit

## Cara Mengukur dengan Benar

### **Berat Badan**
- **Waktu terbaik**: Pagi sebelum makan, setelah buang air
- **Pakaian minimal**: Celana dalam atau tanpa pakaian
- **Timbangan digital**: Akurat sampai 0.1kg
- **Posisi**: Berdiri stabil (anak >2 tahun), duduk (balita)

### **Tinggi Badan**
- **Stadiometer**: Alat ukur tinggi medis
- **Tanpa alas kaki**: Berdiri tegak, tumit menyentuh dinding
- **Tengkorak horizontal**: Pandangan lurus ke depan
- **Ukur 2-3x**: Ambil rata-rata

### **Lingkar Kepala**
- **Pita ukur fleksibel**: Khusus antropometri
- **Tengkorak terbesar**: Dari dahi ke belakang kepala
- **Ukur bulanan**: Sampai usia 2 tahun
- **Normal range**: 42-47cm saat lahir, tambah 12cm dalam 1 tahun

## Menggunakan Kurva Pertumbuhan

### **Membaca Kurva WHO**
- **Garis biru**: Median (50th percentile)
- **Garis orange/kuning**: -2SD sampai +2SD
- **Zona hijau**: Normal (25th-75th percentile)
- **Zona kuning**: Perlu perhatian (5th-25th atau 75th-95th)
- **Zona merah**: Perlu intervensi (<5th atau >95th)

### **Tracking Overtime**
- **Plot setiap bulan**: Untuk bayi 0-1 tahun
- **Plot setiap 3 bulan**: Untuk anak 1-2 tahun
- **Plot setiap 6 bulan**: Untuk anak >2 tahun
- **Trend lebih penting**: Daripada angka absolut

## Masalah Pertumbuhan Umum

### **Berat Badan Tidak Naik**
**Penyebab:**
- Asupan kalori kurang
- Infeksi berulang
- Gangguan pencernaan
- Masalah hormonal

**Solusi:**
- Tingkatkan densitas kalori
- Konsultasi dokter
- Perbaiki hygiene makanan
- Cek ada tidak intoleransi

### **Berat Badan Berlebih**
**Penyebab:**
- Pola makan tidak sehat
- Kurang aktivitas fisik
- Faktor genetik
- Masalah hormonal

**Solusi:**
- Pola makan seimbang
- Aktivitas fisik teratur
- Edukasi pola hidup sehat
- Konsultasi ahli gizi

### **Tinggi Badan Lambat**
**Penyebab:**
- Malnutrisi kronis
- Gangguan hormonal pertumbuhan
- Penyakit kronis
- Faktor genetik

**Solusi:**
- Nutrisi optimal
- Check hormon pertumbuhan
- Treatment penyakit dasar
- Genetic counseling jika perlu

## Waktu yang Tepat untuk Check

### **Posyandu/Balita Check**
- **0-12 bulan**: Setiap bulan
- **12-24 bulan**: Setiap 2-3 bulan
- **24-60 bulan**: Setiap 3-6 bulan

### **Kunjungan Dokter**
- **Well baby visit**: 1, 2, 4, 6, 9, 12 bulan
- **Toddler visit**: 15, 18, 24, 30, 36 bulan
- **Preschool visit**: Setiap tahun

### **Jika Ada Keluhan**
- **Berat badan turun**: Segera ke dokter
- **Tidak naik BB 3 bulan**: Check nutrisi
- **Tinggi badan <5th percentile**: Evaluasi lengkap
- **Lingkar kepala abnormal**: Check neurologis

## Tools untuk Monitoring

### **Aplikasi Mobile**
- **Grow Baby**: Tracking pertumbuhan lengkap
- **Baby Daybook**: Digital growth chart
- **PediaSure Growth Tracker**: Dengan edukasi
- **WHO Growth Charts App**: Official app

### **Tools Rumah**
- **Timbangan digital**: Akurat dan mudah
- **Meteran lipat**: Untuk tinggi badan
- **Pita ukur antropometri**: Untuk lingkar kepala
- **Notebook**: Catat hasil pengukuran

### **Online Tools**
- **WHO Anthro**: Software resmi WHO
- **CDC Growth Charts**: Untuk anak >2 tahun
- **Percentile Calculator**: Online tools

## Tips untuk Orang Tua

### **Jaga Konsistensi**
- Ukur pada waktu yang sama
- Gunakan alat yang sama
- Catat dengan teliti
- Bawa data ke dokter

### **Fokus pada Kesehatan**
- Jangan bandingkan dengan anak lain
- Setiap anak unik
- Trend lebih penting daripada angka
- Konsultasi jika ragu

### **Support Sistem**
- Diskusi dengan dokter
- Join grup parenting
- Edukasi diri tentang pertumbuhan
- Tenang dan positif

## Kesimpulan

Monitoring pertumbuhan bukan untuk membuat stres, tapi untuk:
- **Deteksi dini** masalah kesehatan
- **Evaluasi** efektivitas parenting
- **Tenang pikiran** dengan data objektif
- **Intervensi tepat** jika diperlukan

Ingat: 80% masalah pertumbuhan disebabkan nutrisi. Pastikan anak mendapat:
- **Kalori cukup** sesuai usia
- **Protein optimal** untuk growth
- **Vitamin mineral** lengkap
- **Lingkungan sehat** untuk tumbuh kembang

Pertumbuhan anak adalah proses alami. Dengan monitoring yang benar dan nutrisi optimal, anak Anda akan tumbuh sehat dan bahagia!`,
    tags: ['growth monitoring', 'child development', 'WHO standards', 'height weight', 'pediatric care'],
    ageRange: { min: 0, max: 72 },
    readTime: 10,
    createdAt: new Date('2024-10-03'),
    updatedAt: new Date('2024-10-03')
  },

  // Waktu & Energi
  {
    id: 'time-management-parenting',
    title: 'Time Management untuk Orang Tua Modern: Jaga Keseimbangan Hidup',
    category: 'meal-prep',
    content: `# Time Management untuk Orang Tua Modern

## Tantangan Time Management Parenting

Orang tua modern menghadapi multitasking berat:
- **Work from home** sambil urus anak
- **Remote work** dengan gangguan anak
- **Household chores** yang tidak pernah selesai
- **Self-care** yang sering terlupakan

## Prinsip Dasar Time Management

### **1. Prioritas Berdasarkan Nilai**
- **Family time**: Kualitas lebih penting dari quantity
- **Self-care**: Orang tua yang bahagia = anak yang bahagia
- **Work efficiency**: Fokus saat kerja, istirahat saat istirahat
- **Household**: Sistem yang sustainable, bukan perfect

### **2. Batch Processing**
- **Meal prep**: 1x seminggu untuk 3-4 hari
- **Laundry**: Hari tertentu untuk semua pakaian
- **Grocery shopping**: 1x seminggu atau 2x bulan
- **Cleaning**: 15 menit sehari vs marathon weekend

### **3. Energy Management**
- **Circadian rhythm**: Hormati jam tidur anak
- **Power hours**: Waktu paling produktif untuk kerja
- **Rest periods**: Istirahat yang cukup untuk recovery
- **Sabbath moments**: Waktu tanpa agenda

## Sistem Harian yang Efektif

### **Morning Routine (6:00-8:00)**
- **Wake up early**: 30 menit untuk diri sendiri
- **Family breakfast**: Makan bersama sambil plan hari
- **School prep**: Siapkan anak untuk daycare/sekolah
- **Commute buffer**: Antisipasi macet atau delay

### **Work Block (8:00-12:00)**
- **Deep work**: 90 menit fokus tanpa gangguan
- **Break 10 menit**: Gerak badan, snack sehat
- **Meeting block**: Kelompokkan rapat di waktu tertentu
- **Email batch**: Proses email 2x sehari

### **Lunch & Family Time (12:00-14:00)**
- **Family lunch**: Makan bersama, diskusi hari
- **Nap time**: Istirahat anak 1-2 jam
- **Personal time**: Baca, meditasi, atau hobby ringan
- **Light chores**: Yang tidak mengganggu energi

### **Afternoon Work (14:00-17:00)**
- **Creative work**: Waktu untuk brainstorming
- **Collaborative tasks**: Yang butuh koordinasi
- **Admin work**: Email, reports, planning
- **End-of-day review**: Recap achievement hari ini

### **Evening Routine (17:00-21:00)**
- **Family dinner**: Makan bersama tanpa gadget
- **Play time**: Aktivitas bersama anak
- **Bedtime routine**: Mandi, baca cerita, tidur
- **Wind down**: 30 menit untuk relaksasi

## Tools dan Teknik Praktis

### **Digital Tools**
- **Google Calendar**: Schedule sharing dengan partner
- **Todoist/Trello**: Task management keluarga
- **Forest App**: Pomodoro timer untuk fokus
- **Headspace**: Guided meditation 5 menit

### **Analog Systems**
- **Family calendar**: Cork board dengan jadwal mingguan
- **Chore chart**: Tanggung jawab tiap anggota keluarga
- **Meal plan board**: Menu mingguan terlihat
- **Gratitude jar**: Catat hal baik setiap hari

### **Time Blocking Techniques**
- **Eisenhower Matrix**: Urgent vs Important
- **Pareto Principle**: 80/20 rule untuk prioritas
- **Time boxing**: Alokasikan waktu spesifik per task
- **Buffer time**: Antisipasi delay dan gangguan

## Mengelola Energi, Bukan Waktu

### **Energy Drainers**
- **Decision fatigue**: Kurangi pilihan harian
- **Context switching**: Kelompokkan task serupa
- **Perfectionism**: Done is better than perfect
- **People pleasing**: Set boundaries yang jelas

### **Energy Boosters**
- **Morning routine**: Yoga, meditation, journaling
- **Nutrition timing**: Makan teratur, snack sehat
- **Exercise**: 30 menit gerak badan per hari
- **Sleep hygiene**: 7-8 jam tidur berkualitas

## Sistem untuk Keluarga dengan Anak Kecil

### **0-2 Tahun: High Touch Period**
- **Partner sharing**: Shift parenting 24/7
- **Grandparent help**: Babysitting saat kerja
- **Flexible work**: Remote work arrangements
- **Minimalist home**: Kurangi maintenance

### **2-5 Tahun: Active Learning**
- **Structured days**: Routine yang predictable
- **Educational activities**: Play-based learning
- **Social time**: Park, playground dengan anak lain
- **Weekend family time**: Quality time bersama

## Menghindari Burnout

### **Warning Signs**
- **Constant fatigue**: Selalu lelah walau tidur cukup
- **Irritability**: Mudah marah pada hal kecil
- **Withdrawal**: Kurang interaksi sosial
- **Decreased productivity**: Sulit fokus dan konsentrasi

### **Recovery Strategies**
- **Weekly sabbath**: 1 hari tanpa agenda
- **Self-care rituals**: Mandi panas, massage, spa
- **Support network**: Teman, keluarga, professional help
- **Work boundaries**: No work email after hours

## Kesimpulan: Balance, Not Perfection

### **Paradigm Shift**
- **From perfection to progress**: Small wins setiap hari
- **From control to influence**: Guide instead of dictate
- **From individual to team**: Parenting as partnership
- **From survival to thriving**: Enjoy the journey

### **Key Takeaways**
- **Time management** = Energy management
- **Quality > Quantity** dalam parenting
- **Systems beat willpower** setiap saat
- **Self-care enables care** untuk orang lain

### **Final Words**
Parenting adalah marathon, bukan sprint. Dengan sistem yang tepat, Anda bisa:
- **Work efficiently** tanpa mengorbankan keluarga
- **Enjoy parenting** tanpa kelelahan konstan
- **Maintain sanity** di tengah chaos kehidupan
- **Grow as person** sambil menjadi orang tua hebat

Ingat: Anak belajar dari bagaimana Anda mengelola waktu dan energi. Jadilah model yang baik untuk mereka!`,
    tags: ['time management', 'work life balance', 'parenting energy', 'family systems', 'self care'],
    ageRange: { min: 0, max: 144 },
    readTime: 9,
    createdAt: new Date('2024-10-04'),
    updatedAt: new Date('2024-10-04')
  },

  // Edukasi & Informasi
  {
    id: 'parenting-information-overload',
    title: 'Mengelola Information Overload Parenting: Temukan Info Terpercaya',
    category: 'meal-prep',
    content: `# Mengelola Information Overload Parenting

## Tantangan Information Overload

Di era digital, orang tua dihadapkan pada:
- **1000+ artikel parenting** per hari di internet
- **Ribuan reels TikTok** dengan tips instan
- **Berbagai pendapat** dari keluarga, tetangga, media
- **FOMO parenting** - takut ketinggalan trend terbaru

## Sumber Terpercaya untuk Info Parenting

### **1. Organisasi Kesehatan Resmi**
- **WHO (World Health Organization)**
  - Standar pertumbuhan anak
  - Panduan MPASI global
  - Milestone perkembangan

- **Kemenkes RI / IDAI (Ikatan Dokter Anak Indonesia)**
  - Panduan parenting sesuai konteks Indonesia
  - Imunisasi schedule
  - Panduan gizi anak

- **AAP (American Academy of Pediatrics)**
  - Research-based parenting advice
  - Sleep training guidelines
  - Discipline strategies

### **2. Platform Edukasi Terverifikasi**
- **What to Expect**: Evidence-based content
- **KellyMom**: Breastfeeding & newborn care
- **Zero to Three**: Brain development 0-3 tahun
- **Bright Futures**: Preventive health guidelines

### **3. Professional Organizations**
- **La Leche League**: Breastfeeding support
- **Montessori Foundation**: Educational philosophy
- **RIE (Resources for Infant Educarers)**: Respectful parenting
- **API (Attachment Parenting International)**: Gentle parenting

## Cara Mengevaluasi Sumber Informasi

### **CREDIBLE Framework**
- **Currency**: Informasi terbaru (max 3-5 tahun)
- **Reliability**: Sumber terpercaya dengan kredibilitas
- **Expertise**: Ditulis oleh ahli/professional
- **Bias**: Tidak ada agenda komersial tersembunyi
- **Links**: Referensi ke research/studi
- **Ease**: Mudah dipahami tapi tetap akurat

### **Red Flags**
- **Sensational headlines**: "Rahasia parenting yang tak pernah Anda ketahui"
- **Quick fixes**: "Solusi instan untuk anak rewel"
- **Fear mongering**: "Jangan lakukan ini atau anak rusak seumur hidup"
- **Unverified claims**: Tanpa sumber atau research

## Sistem Mengelola Informasi Parenting

### **1. Curated Content Library**
- **Bookmark folders**: WHO guidelines, sleep training, nutrition
- **Trusted sources**: 5-10 website terpercaya saja
- **Newsletter subscriptions**: Weekly digest dari sumber terpercaya
- **Print resources**: Buku parenting klasik untuk referensi

### **2. Information Diet**
- **Time limits**: Max 30 menit per hari untuk parenting research
- **Scheduled learning**: Hari tertentu untuk baca artikel
- **Batch processing**: Baca artikel sekaligus, bukan setiap hari
- **Unfollow/unsubscribe**: Dari sumber yang membuat anxious

### **3. Critical Thinking**
- **Question everything**: "Siapa yang menulis ini? Apa tujuannya?"
- **Context matters**: Apa yang berhasil untuk bayi mungkin tidak untuk toddler
- **Individual differences**: Setiap anak unik, bukan formula baku
- **Long-term thinking**: Fokus development, bukan quick wins

## Panduan Berdasarkan Usia Anak

### **0-6 Bulan: Newborn Period**
**Fokus utama:**
- Breastfeeding & bonding
- Sleep patterns & soothing
- Basic care routines
- Growth monitoring

**Sumber terpercaya:**
- La Leche League untuk breastfeeding
- Dr. Harvey Karp untuk soothing
- AAP untuk sleep safety

### **6-18 Bulan: Toddler Development**
**Fokus utama:**
- Solid foods introduction
- Language development
- Motor skills
- Independence building

**Sumber terpercaya:**
- Ellyn Satter untuk feeding
- RIE untuk respectful parenting
- Montessori for practical life

### **18-36 Bulan: Preschool Years**
**Fokus utama:**
- Social skills
- Emotional regulation
- Learning readiness
- Behavior guidance

**Sumber terpercaya:**
- Pyramid Model for social-emotional
- Tools of the Mind for executive function
- Positive Discipline for guidance

## Tools untuk Parenting Research

### **Digital Tools**
- **Feedly/Pocket**: Content curation
- **Evernote/Notion**: Personal knowledge base
- **Google Scholar**: Academic research
- **PubMed**: Medical research database

### **Community Support**
- **Reddit r/Parenting**: Dengan filter skeptis
- **Facebook groups**: Local parenting communities
- **WhatsApp groups**: Dengan moderator ahli
- **Professional consultants**: Pediatricians, child psychologists

### **Learning Resources**
- **Coursera parenting courses**: Evidence-based
- **Khan Academy child development**: Free resources
- **Local workshops**: Dengan professional facilitators
- **Books**: Classic parenting literature

## Membuat Keputusan Parenting yang Baik

### **1. Gather Information**
- Baca dari 2-3 sumber terpercaya
- Compare different perspectives
- Consider child's unique needs
- Think long-term impact

### **2. Consult Professionals**
- Pediatrician untuk health issues
- Child psychologist untuk behavior
- Lactation consultant untuk breastfeeding
- Nutritionist untuk feeding

### **3. Trust Your Instincts**
- You know your child best
- Professional advice is guidance, not gospel
- Every family is different
- Flexibility is key

### **4. Implement Gradually**
- Start with small changes
- Observe child's response
- Adjust based on results
- Be patient with process

## Mengatasi Parenting Anxiety

### **Common Triggers**
- **Comparison culture**: Social media highlights
- **Conflicting advice**: Different experts say different things
- **Fear of missing out**: FOMO on latest trends
- **Perfection pressure**: "Good parent" stereotypes

### **Coping Strategies**
- **Limit social media**: 30 menit per hari maksimal
- **Focus on joy**: Celebrate small moments
- **Trust process**: Parenting improves with time
- **Seek balance**: Theory + practical experience

## Kesimpulan: Quality Over Quantity

### **Paradox of Choice**
Dalam parenting, lebih banyak informasi ≠ lebih baik parenting. Sebaliknya:
- **Kurangi input**: Fokus pada sumber terpercaya
- **Tingkatkan wisdom**: Apply knowledge dengan hikmat
- **Percaya diri**: Trust your parenting instincts
- **Enjoy process**: Parenting adalah journey, bukan destination

### **Essential Parenting Knowledge**
**Must-know topics:**
- Child development milestones
- Nutrition & feeding guidelines
- Sleep & routine establishment
- Emotional intelligence development
- Discipline with dignity

**Nice-to-know topics:**
- Latest parenting trends
- Educational philosophies
- Product reviews
- Activity ideas

### **Final Wisdom**
Informasi parenting seperti nutrisi: terlalu banyak junk food membuat sakit, tapi nutrisi seimbang membuat sehat dan kuat. Pilih sumber Anda dengan bijak, konsumsi dengan balance, dan implement dengan cinta.

Parenting yang baik datang dari hati yang tenang, bukan kepala yang penuh informasi. Tetap belajar, tapi jangan lupa enjoy perjalanan!`,
    tags: ['information overload', 'parenting research', 'trusted sources', 'critical thinking', 'parenting anxiety'],
    ageRange: { min: 0, max: 144 },
    readTime: 11,
    createdAt: new Date('2024-10-05'),
    updatedAt: new Date('2024-10-05')
  },

  // Mental & Emosi
  {
    id: 'parenting-stress-management',
    title: 'Mengelola Stres Parenting: Tetap Tenang di Tengah Badai',
    category: 'meal-prep',
    content: `# Mengelola Stres Parenting

## Sumber Stres Parenting Modern

Parenting hari ini penuh tantangan unik:
- **Dual-income families**: Work-life balance sulit
- **Social media pressure**: Membandingkan dengan "parent perfect"
- **Economic uncertainty**: Biaya anak yang tinggi
- **24/7 availability**: Tidak ada "off duty" untuk orang tua

## Memahami Siklus Stres Parenting

### **1. Trigger Events**
- Anak rewel terus menerus
- Tantrum di tempat umum
- Tidak mau makan
- Sulit tidur malam
- Sakit mendadak

### **2. Physical Response**
- Heart rate meningkat
- Breathing menjadi cepat dangkal
- Muscle tension
- Adrenaline rush

### **3. Emotional Response**
- Frustrasi, marah, guilty
- Feeling overwhelmed
- Self-doubt tentang kemampuan parenting
- Isolation (merasa sendiri)

### **4. Behavioral Response**
- Raise voice, yell
- Withdraw dari anak
- Overcompensate dengan material
- Seek validation di social media

## Teknik Mengelola Stres Real-time

### **1. Pause & Breathe (4-7-8 Technique)**
- **Inhale**: 4 detik (hitung dalam hati)
- **Hold**: 7 detik (tahan napas)
- **Exhale**: 8 detik (hembuskan perlahan)
- **Repeat**: 3-4 kali sampai tenang

### **2. Self-Check Questions**
- "Apakah ini masalah besar atau kecil?"
- "Bagaimana perasaan anak sekarang?"
- "Apa yang anak butuhkan dari saya?"
- "Apakah saya model yang baik saat ini?"

### **3. Safe Withdrawal**
- "Excuse me for a moment" ke anak
- Pergi ke kamar mandi atau ruangan lain
- 2 menit breathing exercise
- Kembali dengan tenang

### **4. Reframe Situation**
- Alihkan dari "Anak nakal" ke "Anak butuh bantuan"
- Dari "Saya gagal" ke "Ini kesempatan belajar"
- Dari "Mereka semua bisa" ke "Setiap orang tua punya tantangan"

## Strategi Pencegahan Stres Jangka Panjang

### **1. Build Support Network**
- **Partner communication**: Diskusi terbuka tentang parenting
- **Family support**: Grandparents untuk babysitting
- **Parenting groups**: Local community atau online
- **Professional help**: Therapist atau counselor jika perlu

### **2. Self-Care Rituals**
- **Morning routine**: 15 menit untuk meditasi atau journaling
- **Weekly date night**: Quality time dengan partner
- **Personal hobbies**: Aktivitas yang membuat bahagia
- **Sleep hygiene**: Prioritas tidur cukup

### **3. Set Realistic Expectations**
- **No perfect parenting**: Accept imperfection
- **Child-led development**: Hormati pace anak
- **Seasonal adjustments**: Expect different energy levels
- **Flexibility**: Adapt plan saat kondisi berubah

### **4. Time Management**
- **Batch household tasks**: Satu waktu untuk semua laundry
- **Meal planning**: Reduce decision fatigue
- **Routines**: Predictable schedule untuk anak dan orang tua
- **Boundaries**: Work time vs family time

## Mengatasi Tantrum dengan Tenang

### **1. Stay Calm First**
- Jangan react dengan emosi
- Breathing exercise sebelum respond
- Remember: Tantrum adalah komunikasi anak

### **2. Acknowledge Feelings**
- "I see you're really angry right now"
- "It's okay to feel frustrated"
- "Mama/Papa understand"

### **3. Set Limits with Love**
- "I can't let you hit, but I can help you calm down"
- "We don't throw toys, but we can build something together"
- Clear boundaries tanpa ancaman

### **4. Offer Choices**
- "Do you want to calm down with deep breaths or counting?"
- "Would you like a hug or to be alone for a minute?"
- Give child sense of control

## Teknik Recovery Setelah Stres Episode

### **1. Self-Compassion**
- "I'm doing my best"
- "This is hard for everyone"
- "Tomorrow is new day"
- Forgive yourself untuk kesalahan kecil

### **2. Reconnect with Child**
- Extra cuddle time
- Special one-on-one activity
- Verbal affirmation of love
- Make up stories atau games

### **3. Process Feelings**
- Journal tentang apa yang trigger stres
- Identify patterns dan early warning signs
- Plan better response untuk next time
- Share dengan partner atau trusted friend

### **4. Restore Energy**
- Short nap atau rest
- Healthy snack
- Walk in nature
- Listen to calming music

## Kapan Perlu Bantuan Profesional

### **Warning Signs**
- **Chronic fatigue**: Selalu lelah walau tidur cukup
- **Persistent anxiety**: Worry yang tidak bisa dikontrol
- **Irritability**: Mudah marah pada hal kecil
- **Sleep problems**: Insomnia atau tidur tidak nyenyak

### **Parenting-Specific Issues**
- **Postpartum depression**: Mood changes ekstrem
- **Parenting burnout**: Feeling empty dan hopeless
- **Anxiety about child**: Excessive worry tentang safety/health
- **Relationship strain**: Conflict dengan partner karena parenting

### **When to Seek Help**
- **Dokter keluarga**: Untuk health screening
- **Counselor/therapist**: Untuk coping strategies
- **Grup support parenting**: Untuk sharing experiences
- **Hotline services**: Crisis intervention

## Building Resilience sebagai Orang Tua

### **1. Mindset Shift**
- **Dari sempurna ke progress**: Rayakan kemenangan kecil
- **Dari kontrol ke pengaruh**: Pandu instead of dictate
- **Dari individu ke tim**: Parenting sebagai partnership
- **Dari survive ke thrive**: Enjoy perjalanan

### **2. Daily Practices**
- **Gratitude journaling**: 3 hal baik setiap hari
- **Mindful moments**: 5 menit presence dengan anak
- **Self-compassion**: Treat yourself seperti treat anak
- **Connection rituals**: Family dinner tanpa gadget

### **3. Long-term Perspective**
- **This too shall pass**: Semua fase punya akhir
- **Children are resilient**: Mereka belajar dari model kita
- **Personal growth**: Parenting membuat kita lebih baik
- **Legacy of love**: Yang penting adalah connection, bukan achievement

## Kesimpulan: Gentle Parenting untuk Diri Sendiri

### **Core Truths**
- **You are enough**: Kamu sudah cukup
- **It's okay to struggle**: It's okay to struggle at some point
- **Ask for help**: Support network is crucial
- **Prioritize mental health**: Healthy parent = healthy child

### **Daily Reminder**
- **Breathe**: Saat overwhelmed, pause and breathe
- **Connect**: Find moments of joy with your child
- **Rest**: Take breaks when needed
- **Love**: Yourself first, then others

### **Final Wisdom**
Stres parenting tidak bisa dihindari, tapi penderitaan bisa dipilih. Dengan tools yang tepat, support yang baik, dan self-compassion yang cukup, Anda bisa navigate parenting dengan lebih tenang dan bahagia.

Ingat: Anak memilih kamu sebagai orang tua karena mereka tahu kamu punya kapasitas untuk mencintai mereka secara sempurna, imperfections and all. Trust the process, trust yourself, trust your child. You got this! 💕`,
    tags: ['parenting stress', 'mental health', 'emotional regulation', 'self care', 'parenting burnout'],
    ageRange: { min: 0, max: 144 },
    readTime: 13,
    createdAt: new Date('2024-10-06'),
    updatedAt: new Date('2024-10-06')
  },

  // Finansial
  {
    id: 'parenting-budget-planning',
    title: 'Anggaran Parenting yang Bijak: Hemat tapi Berkualitas',
    category: 'meal-prep',
    content: `# Anggaran Parenting yang Bijak

## Realitas Biaya Parenting di Indonesia

Biaya membesarkan anak dari 0-18 tahun:
- **Estimasi total**: Rp 800 juta - 1.5 milyar
- **Breakdown utama**: Pendidikan (40%), Food (20%), Health (15%)
- **Biaya tersembunhi**: Kehilangan income saat cuti parenting

## Prinsip Budgeting untuk Keluarga

### **1. Needs vs Wants**
**Kebutuhan Esensial:**
- Makanan bergizi & air bersih
- Tempat tinggal aman & pakaian
- Kesehatan & pendidikan
- Transportasi dasar

**Inginan Pintar:**
- Mainan edukatif & buku
- Kegiatan ekstrakurikuler
- Liburan keluarga
- Brand premium

### **2. Quality over Quantity**
- **Invest di barang timeless**: Furniture yang tahan lama
- **Prioritaskan pengalaman**: Waktu berkualitas vs hadiah material
- **Beli bekas**: Marketplace second-hand untuk pakaian/mainan
- **Solusi DIY**: Makanan bayi homemade & aktivitas

### **3. Long-term Perspective**
- **Dana pendidikan**: Mulai dari dini
- **Dana darurat**: 3-6 bulan pengeluaran
- **Rencana investasi**: Saham, deposito untuk masa depan
- **Pertanggungan asuransi**: Kesehatan & pendidikan

## Breakdown Biaya Berdasarkan Usia

### **0-2 Tahun: High Initial Cost**
**Pengeluaran sekali jalan:**
- Furniture bayi: Rp 5-15 juta
- Gear bayi (stroller, carrier): Rp 3-8 juta
- Setup kamar: Rp 2-5 juta

**Bulanan berulang:**
- Popok: Rp 500rb-1jt
- Susu formula: Rp 800rb-1.5jt
- Makanan bayi: Rp 300rb-600rb
- Kesehatan: Rp 200rb-500rb

**Tips hemat:**
- Popok kain untuk jangka panjang
- ASI untuk natural & gratis
- Beli furniture bekas
- Makanan bayi homemade

### **2-5 Tahun: Educational Investment**
**Pengeluaran bulanan:**
- TK/daycare: Rp 1-3jt
- Buku & mainan edukatif: Rp 200rb-500rb
- Pakaian: Rp 150rb-300rb
- Aktivitas: Rp 100rb-300rb

**Tips hemat:**
- Aktivitas belajar di rumah
- Perpustakaan untuk buku & resources
- Pakaian hand-me-down dari keluarga
- Program komunitas gratis

### **5-12 Tahun: Growing Needs**
**Pengeluaran bulanan:**
- SPP sekolah: Rp 500rb-2jt
- Seragam & alat tulis: Rp 200rb-500rb
- Ekstrakurikuler: Rp 300rb-1jt
- Makanan & transportasi: Rp 400rb-800rb

**Tips hemat:**
- Opsi sekolah negeri
- Beli alat tulis bulk
- Carpool untuk transportasi
- Makanan masak rumah

## Strategi Hemat untuk Setiap Kategori

### **1. Food & Nutrition**
- **Meal planning**: Kurangi waste makanan 30%
- **Bulk buying**: Beras, tepung, bahan pokok
- **Produk lokal**: Buah/sayur musiman, lebih murah
- **Camilan homemade**: Instead of kemasan
- **Tanam sendiri**: Kebun kecil untuk herbs/sayuran

### **2. Clothing & Personal Care**
- **Hand-me-downs**: Jaringan keluarga & teman
- **Thrifting**: Toko bekas & marketplace online
- **Capsule wardrobe**: 10 pieces serbaguna per musim
- **Solusi DIY**: Sabun, lotion homemade
- **Sales & diskon**: Tunggu seasonal sales

### **3. Education & Development**
- **Perpustakaan umum**: Buku & resources gratis
- **Belajar online**: Channel YouTube edukasi gratis
- **Program komunitas**: Workshop & kelas gratis
- **Aktivitas DIY**: Game belajar rumahan
- **Diskon guru**: Untuk bahan edukasi

### **4. Health & Medical**
- **Preventive care**: Check-up rutin cegah pengobatan mahal
- **Obat generic**: Efektivitas sama, harga lebih murah
- **Asuransi kesehatan**: BPJS Kesehatan untuk basic coverage
- **Telemedicine**: Konsultasi online lebih murah
- **Obat alami**: Untuk keluhan ringan

### **5. Transportation**
- **Transportasi umum**: Lebih murah dari kendaraan pribadi
- **Jalan kaki/sepeda**: Olahraga gratis & bonding time
- **Carpooling**: Bagi biaya dengan orang tua lain
- **School bus**: Kalau ada di daerah
- **Off-peak travel**: Tarif lebih murah

## Tools dan Apps untuk Budgeting

### **Budgeting Apps**
- **Money as You Can** (Indonesian app)
- **YNAB** (You Need A Budget)
- **Mint**: Automatic expense tracking
- **PocketGuard**: Real-time budget monitoring

### **Saving Strategies**
- **50/30/20 rule**: 50% kebutuhan, 30% keinginan, 20% tabungan
- **Zero-based budgeting**: Setiap rupiah punya tugas
- **Envelope system**: Uang tunai untuk kategori berbeda
- **Sinking funds**: Tabung untuk pengeluaran masa depan yang diketahui

### **Family Budget Meetings**
- **Review mingguan**: Track pengeluaran vs budget
- **Planning bulanan**: Sesuaikan untuk pengeluaran mendatang
- **Goal setting**: Tabungan jangka pendek dan panjang
- **Involve keluarga**: Ajari anak tentang uang

## Membangun Dana Darurat

### **Target Dana Darurat**
- **3 bulan pengeluaran**: Minimum recommended
- **6 bulan pengeluaran**: Untuk keluarga dengan anak
- **1 tahun pengeluaran**: Untuk keamanan maksimal

### **Membangun Dana Darurat**
- **Transfer otomatis**: 10-20% dari income
- **Uang windfall**: Bonus, refund pajak langsung ke dana darurat
- **Side hustle income**: Les, freelance work
- **Uang hadiah**: Hadiah pernikahan, dll.

### **Yang Dicover**
- **Darurat medis**: Hospitalisasi tak terduga
- **Perbaikan rumah**: Plumbing, electrical issues
- **PHK**: Pengganti income sementara
- **Perbaikan mobil**: Kerusakan transportasi

## Investasi Jangka Panjang untuk Anak

### **Dana Pendidikan**
- **Mulai awal**: Keuntungan bunga compound
- **Kontribusi konsisten**: Transfer otomatis bulanan
- **Target amount**: Berdasarkan sekolah/universitas yang diinginkan

### **Opsi Investasi**
- **P2P Lending**: Return lebih tinggi (10-15% per tahun)
- **Index Funds**: Investasi diversified biaya rendah
- **Asuransi Pendidikan**: Return guaranteed untuk pendidikan
- **Emas/Perak**: Hedge terhadap inflasi

### **Tax Benefits**
- **Child deduction**: Kurangi taxable income
- **Biaya pendidikan**: Tax deductible
- **Premi asuransi**: Tax benefits
- **Konsultasi tax advisor**: Untuk personalized advice

## Mindset yang Tepat tentang Uang

### **Abundance vs Scarcity**
- **Fokus pada nilai**: Pengalaman lebih dari material things
- **Ajarkan gratitude**: Hargai apa yang dimiliki
- **Delayed gratification**: Simpan untuk pembelian meaningful
- **Generosity**: Ajarkan memberi melalui charity

### **Breaking Money Taboos**
- **Diskusi terbuka**: Bahas uang dengan keluarga
- **Financial literacy**: Ajari anak tentang uang dari kecil
- **Realistic expectations**: Sesuaikan lifestyle dengan income level
- **Cari bantuan professional**: Financial advisor untuk situasi kompleks

## Kesimpulan: Balance antara Hemat dan Berkualitas

### **Key Principles**
- **Prioritaskan kesehatan & pendidikan**: Essential investments
- **Potong pengeluaran tidak perlu**: Fokus pada yang penting
- **Bangun kebiasaan sustainable**: Kesehatan finansial jangka panjang
- **Libatkan seluruh keluarga**: Tanggung jawab bersama

### **Final Wisdom**
Budget parenting bukan tentang deprivation, tapi tentang **smart allocation** dari resources terbatas. Dengan planning yang baik, Anda bisa provide:
- **Pendidikan berkualitas**: Foundation untuk sukses masa depan
- **Lifestyle sehat**: Prevention lebih baik dari cure
- **Masa kecil bahagia**: Kenangan lebih dari material possessions
- **Keamanan finansial**: Peace of mind untuk seluruh keluarga

Remember: Children learn financial habits from observing their parents. Model good money management, and you'll give them the greatest gift of financial wisdom for life! 💰👨‍👩‍👧‍👦`,
    tags: ['parenting budget', 'family finances', 'saving tips', 'education fund', 'financial planning'],
    ageRange: { min: 0, max: 144 },
    readTime: 14,
    createdAt: new Date('2024-10-07'),
    updatedAt: new Date('2024-10-07')
  }
];

export const mockChild: Child = {
  id: '1',
  name: 'Aisyah',
  birthDate: new Date('2023-06-15'),
  age: 15, // 15 months
  weight: 10.5,
  allergies: [],
  preferences: [
    { type: 'halal', label: 'Halal' }
  ],
};
