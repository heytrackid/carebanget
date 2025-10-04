import { Task } from '@/types';

export const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Siapkan MPASI untuk besok',
    description: 'Masak dan siapkan porsi makanan bayi untuk makan Kaia',
    category: 'meal-prep',
    priority: 'high',
    status: 'todo',
    dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000), // tomorrow
    childId: '1',
    tags: ['mpasi', 'cooking', 'baby-food'],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    estimatedTime: 45,
  },
  {
    id: '2',
    title: 'Beli sayuran organik',
    description: 'Dapatkan sayuran segar untuk persiapan makan minggu ini',
    category: 'shopping',
    priority: 'medium',
    status: 'in-progress',
    dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days
    tags: ['shopping', 'vegetables', 'organic'],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    estimatedTime: 60,
  },
  {
    id: '3',
    title: 'Jadwalkan kontrol dokter anak',
    description: 'Buat janji kontrol bulanan untuk Kaia',
    category: 'health',
    priority: 'high',
    status: 'todo',
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
    childId: '1',
    tags: ['health', 'appointment', 'pediatrician'],
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
    updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    estimatedTime: 15,
  },
  {
    id: '4',
    title: 'Baca artikel parenting tentang training tidur',
    description: 'Pelajari metode training tidur baru untuk balita',
    category: 'education',
    priority: 'low',
    status: 'todo',
    tags: ['education', 'sleep', 'research'],
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
    updatedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    estimatedTime: 30,
  },
  {
    id: '5',
    title: 'Sterilkan botol bayi',
    description: 'Bersihkan dan sterilkan semua botol makan',
    category: 'household',
    priority: 'medium',
    status: 'completed',
    completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    tags: ['cleaning', 'bottles', 'hygiene'],
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // yesterday
    updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    estimatedTime: 20,
    recurrence: {
      type: 'daily',
      interval: 1,
    },
  },
  {
    id: '6',
    title: 'Rencanakan aktivitas sensory play',
    description: 'Siapkan bahan untuk sesi sensory play minggu ini',
    category: 'development',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days
    childId: '1',
    tags: ['development', 'play', 'sensory'],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    updatedAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
    estimatedTime: 30,
  },
  {
    id: '7',
    title: 'Update meal planner dengan resep baru',
    description: 'Tambahkan 3 resep MPASI baru ke meal planner',
    category: 'meal-prep',
    priority: 'low',
    status: 'in-progress',
    tags: ['recipes', 'meal-planning', 'mpasi'],
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000), // 12 hours ago
    updatedAt: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    estimatedTime: 40,
  },
  {
    id: '8',
    title: 'Beli kado ulang tahun keponakan',
    description: 'Cari mainan yang sesuai usia untuk anak 2 tahun',
    category: 'personal',
    priority: 'medium',
    status: 'todo',
    dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days
    tags: ['gift', 'birthday', 'shopping'],
    createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
    updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    estimatedTime: 45,
  },
];

export const taskCategories = [
  { value: 'meal-prep', label: 'Persiapan Makanan', icon: '🍽️' },
  { value: 'shopping', label: 'Belanja', icon: '🛒' },
  { value: 'health', label: 'Kesehatan', icon: '🏥' },
  { value: 'development', label: 'Perkembangan', icon: '🧸' },
  { value: 'household', label: 'Rumah Tangga', icon: '🏠' },
  { value: 'education', label: 'Edukasi', icon: '📚' },
  { value: 'appointment', label: 'Janji Temu', icon: '📅' },
  { value: 'personal', label: 'Pribadi', icon: '👤' },
  { value: 'other', label: 'Lainnya', icon: '📝' },
];

export const taskPriorities = [
  { value: 'low', label: 'Rendah', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Sedang', color: 'bg-blue-100 text-blue-800' },
  { value: 'high', label: 'Tinggi', color: 'bg-orange-100 text-orange-800' },
  { value: 'urgent', label: 'Mendesak', color: 'bg-red-100 text-red-800' },
];

export const taskStatuses = [
  { value: 'todo', label: 'Belum Dikerjakan', color: 'bg-gray-100 text-gray-800' },
  { value: 'in-progress', label: 'Dalam Proses', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'completed', label: 'Selesai', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Dibatalkan', color: 'bg-red-100 text-red-800' },
];
