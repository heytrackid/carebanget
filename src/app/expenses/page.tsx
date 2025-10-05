'use client';

import { Sidebar } from '@/components/navigation/Sidebar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useState, Suspense, lazy } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Expense, ExpenseCategory, PaymentMethod } from '@/types';
import {
  Wallet,
  Plus,
  TrendingUp,
  TrendingDown,
  Calendar,
  DollarSign,
  PieChart,
  BarChart3,
  Download
} from 'lucide-react';
import { EditExpenseDialog } from './add/page';

// Lazy load heavy components for code splitting
const ExpensesTable = lazy(() => import("@/components/expenses/ExpensesTable").then(module => ({ default: module.ExpensesTable })));
const AddExpenseForm = lazy(() => import("@/components/expenses/AddExpenseForm").then(module => ({ default: module.AddExpenseForm })));
const COLORS = ['#ec4899', '#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#84cc16', '#f97316', '#6366f1'];

export default function ExpensesPage() {
  const router = useRouter();
  const [expenses, setExpenses] = useState<Expense[]>([
    {
      id: '1',
      category: 'food',
      amount: 150000,
      currency: 'IDR',
      description: 'Belanja sayur dan buah',
      date: new Date('2025-10-01'),
      paymentMethod: 'cash',
      tags: ['groceries', 'healthy'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      category: 'health',
      amount: 500000,
      currency: 'IDR',
      description: 'Vaksin anak',
      date: new Date('2025-10-02'),
      paymentMethod: 'debit',
      tags: ['medical', 'vaccination'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '3',
      category: 'education',
      amount: 300000,
      currency: 'IDR',
      description: 'Buku cerita anak',
      date: new Date('2025-10-03'),
      paymentMethod: 'e-wallet',
      tags: ['books', 'learning'],
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);

  // Calculate summary
  const totalExpense = expenses.reduce((sum: number, exp: Expense) => sum + exp.amount, 0);
  const thisMonthExpenses = expenses.filter((exp: Expense) => {
    const expDate = new Date(exp.date);
    const now = new Date();
    return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear();
  });
  const thisMonthTotal = thisMonthExpenses.reduce((sum: number, exp: Expense) => sum + exp.amount, 0);

  const lastMonthExpenses = expenses.filter((exp: Expense) => {
    const expDate = new Date(exp.date);
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);
    return expDate.getMonth() === lastMonth.getMonth() && expDate.getFullYear() === lastMonth.getFullYear();
  });
  const lastMonthTotal = lastMonthExpenses.reduce((sum: number, exp: Expense) => sum + exp.amount, 0);

  const percentageChange = lastMonthTotal > 0
    ? ((thisMonthTotal - lastMonthTotal) / lastMonthTotal * 100).toFixed(1)
    : '0';

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const handleAddExpense = (expenseData: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newExpense: Expense = {
      ...expenseData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setExpenses([newExpense, ...expenses]);
    setShowAddForm(false);
  };

  const handleEditExpense = (expense: Expense) => {
    // For now, just show an alert. In real app, this would navigate to edit page or open edit modal
    alert(`Edit expense: ${expense.description}`);
  };

  const handleDeleteExpense = (expense: Expense) => {
    if (confirm(`Apakah Anda yakin ingin menghapus pengeluaran "${expense.description}"?`)) {
      setExpenses(expenses.filter(e => e.id !== expense.id));
    }
  };

  const LoadingFallback = () => (
    <Card>
      <CardContent className="flex items-center justify-center h-32">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto mb-2"></div>
          <p className="text-sm text-gray-500">Memuat komponen...</p>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <Sidebar>
      <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Wallet className="h-8 w-8 text-pink-500" />
              Pengeluaran Anak
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Kelola dan pantau pengeluaran untuk kebutuhan anak
            </p>
          </div>
          <Button
            onClick={() => router.push('/expenses/add')}
            className="bg-pink-500 hover:bg-pink-600"
          >
            <Plus className="mr-2 h-4 w-4" />
            Tambah
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Total Pengeluaran</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(totalExpense)}</div>
              <p className="text-xs text-gray-500 mt-1">Semua waktu</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Bulan Ini</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{formatCurrency(thisMonthTotal)}</div>
              <div className="flex items-center gap-1 mt-1">
                {Number(percentageChange) >= 0 ? (
                  <>
                    <TrendingUp className="h-4 w-4 text-red-500" />
                    <span className="text-xs text-red-500">+{percentageChange}%</span>
                  </>
                ) : (
                  <>
                    <TrendingDown className="h-4 w-4 text-green-500" />
                    <span className="text-xs text-green-500">{percentageChange}%</span>
                  </>
                )}
                <span className="text-xs text-gray-500">vs bulan lalu</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Rata-rata/Hari</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">
                {formatCurrency(thisMonthTotal / new Date().getDate())}
              </div>
              <p className="text-xs text-gray-500 mt-1">Bulan ini</p>
            </CardContent>
          </Card>
        </div>

        {/* Add Expense Form */}
        {showAddForm && (
          <Suspense fallback={<LoadingFallback />}>
            <AddExpenseForm
              onAddExpense={handleAddExpense}
              onCancel={() => setShowAddForm(false)}
            />
          </Suspense>
        )}

        {/* Tabs with Lazy Loaded Components */}
        <Tabs defaultValue="list" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="list">
              <Calendar className="mr-2 h-4 w-4" />
              Daftar
            </TabsTrigger>
            <TabsTrigger value="category">
              <PieChart className="mr-2 h-4 w-4" />
              Per Kategori
            </TabsTrigger>
            <TabsTrigger value="trends">
              <BarChart3 className="mr-2 h-4 w-4" />
              Tren
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list">
            <Suspense fallback={<LoadingFallback />}>
              <ExpensesTable
                expenses={expenses}
                onAddExpense={() => router.push('/expenses/add')}
                onEditExpense={handleEditExpense}
                onDeleteExpense={handleDeleteExpense}
              />
            </Suspense>
          </TabsContent>

          <TabsContent value="category">
            <Card>
              <CardHeader>
                <CardTitle>Visualisasi Per Kategori</CardTitle>
                <CardDescription>Coming soon - Pie chart dan breakdown per kategori</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <PieChart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Visualisasi chart akan ditambahkan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends">
            <Card>
              <CardHeader>
                <CardTitle>Tren Pengeluaran</CardTitle>
                <CardDescription>Coming soon - Line chart tren bulanan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center text-gray-500">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Visualisasi tren akan ditambahkan</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Sidebar>
  );
}
