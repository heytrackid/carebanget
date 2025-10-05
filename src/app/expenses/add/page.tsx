'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Expense, ExpenseCategory, PaymentMethod } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { Plus, Wallet, ArrowLeft, Edit3, Save, X } from 'lucide-react';
import Link from 'next/link';

const CATEGORY_LABELS: Record<ExpenseCategory, string> = {
  food: 'Makanan & Minuman',
  groceries: 'Belanja Bulanan',
  health: 'Kesehatan',
  education: 'Pendidikan',
  clothing: 'Pakaian',
  toys: 'Mainan & Hiburan',
  childcare: 'Penitipan Anak',
  transportation: 'Transportasi',
  utilities: 'Utilitas',
  other: 'Lain-lain',
};

interface EditExpenseDialogProps {
  expense: Expense | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (expense: Expense) => void;
}

function EditExpenseDialog({ expense, isOpen, onClose, onSave }: EditExpenseDialogProps) {
  const [formData, setFormData] = useState({
    category: expense?.category || 'food' as ExpenseCategory,
    amount: expense?.amount?.toString() || '',
    description: expense?.description || '',
    date: expense?.date ? new Date(expense.date).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
    paymentMethod: expense?.paymentMethod || 'cash' as PaymentMethod,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || !formData.amount || !expense) {
      return;
    }

    const updatedExpense: Expense = {
      ...expense,
      category: formData.category,
      amount: parseFloat(formData.amount),
      description: formData.description,
      date: new Date(formData.date),
      paymentMethod: formData.paymentMethod,
      updatedAt: new Date(),
    };

    onSave(updatedExpense);
  };

  if (!expense) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-blue-500" />
            Edit Pengeluaran
          </DialogTitle>
          <DialogDescription>
            Ubah detail pengeluaran anak Anda
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-category">Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({...formData, category: value as ExpenseCategory})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-amount">Jumlah (IDR)</Label>
              <Input
                id="edit-amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="50000"
                min="0"
                step="1000"
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="edit-description">Deskripsi</Label>
              <Input
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Contoh: Belanja susu formula"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-date">Tanggal</Label>
              <Input
                id="edit-date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="edit-payment">Metode Pembayaran</Label>
              <Select
                value={formData.paymentMethod}
                onValueChange={(value) => setFormData({...formData, paymentMethod: value as PaymentMethod})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="cash">Tunai</SelectItem>
                  <SelectItem value="debit">Debit</SelectItem>
                  <SelectItem value="credit">Kredit</SelectItem>
                  <SelectItem value="e-wallet">E-Wallet</SelectItem>
                  <SelectItem value="bank-transfer">Transfer Bank</SelectItem>
                  <SelectItem value="other">Lainnya</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              <X className="mr-2 h-4 w-4" />
              Batal
            </Button>
            <Button type="submit">
              <Save className="mr-2 h-4 w-4" />
              Simpan Perubahan
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

export default function AddExpensePage() {
  const router = useRouter();
  const [editingExpense, setEditingExpense] = useState<Expense | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const [formData, setFormData] = useState({
    category: 'food' as ExpenseCategory,
    amount: '',
    currency: 'IDR',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash' as PaymentMethod,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.description || !formData.amount) {
      return;
    }

    const expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'> = {
      category: formData.category,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      description: formData.description,
      date: new Date(formData.date),
      paymentMethod: formData.paymentMethod,
      tags: [],
    };

    // In a real app, this would be an API call
    console.log('Adding expense:', expense);

    // For now, we'll just redirect back to expenses
    router.push('/expenses');
  };

  const handleEditExpense = (expense: Expense) => {
    setEditingExpense(expense);
    setIsEditDialogOpen(true);
  };

  const handleSaveEditedExpense = (updatedExpense: Expense) => {
    // In a real app, this would update the expense via API
    console.log('Updating expense:', updatedExpense);
    // For demo purposes, we'll just close the dialog
    setIsEditDialogOpen(false);
    setEditingExpense(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-200 px-4 sm:px-6 lg:px-8 py-4">
        {/* Breadcrumb Navigation */}
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/expenses" className="flex items-center gap-2">
                  <Wallet className="h-4 w-4" />
                  Pengeluaran Anak
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Tambah Pengeluaran
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Kembali
            </Button>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Plus className="h-8 w-8 text-pink-500" />
              Tambah Pengeluaran Baru
            </h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Catat pengeluaran untuk kebutuhan anak Anda
            </p>
          </div>
        </div>

        {/* Form Card */}
        <Card className="border-pink-200 bg-pink-50/30">
          <CardHeader className="bg-gradient-to-r from-pink-50 to-purple-50">
            <CardTitle className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-pink-100 flex items-center justify-center">
                <Plus className="h-4 w-4 text-pink-600" />
              </div>
              Detail Pengeluaran
            </CardTitle>
            <CardDescription>
              Isi informasi lengkap tentang pengeluaran anak Anda
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <Label htmlFor="category" className="text-sm font-medium text-gray-700">
                    Kategori Pengeluaran
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => setFormData({...formData, category: value as ExpenseCategory})}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Pilih kategori" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                        <SelectItem key={key} value={key} className="cursor-pointer">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-gray-700">{label}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                </Select>
              </div>

                <div className="space-y-3">
                  <Label htmlFor="amount" className="text-sm font-medium text-gray-700">
                    Jumlah (IDR)
                  </Label>
                  <Input
                    id="amount"
                    type="number"
                    value={formData.amount}
                    onChange={(e) => setFormData({...formData, amount: e.target.value})}
                    placeholder="50000"
                    min="0"
                    step="1000"
                    className="h-11"
                    required
                  />
                  {formData.amount && (
                    <p className="text-xs text-gray-500">
                      Rp {parseFloat(formData.amount).toLocaleString('id-ID')}
                    </p>
                  )}
                </div>

                <div className="space-y-3 md:col-span-2">
                  <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                    Deskripsi Pengeluaran
                  </Label>
                  <Input
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Contoh: Belanja susu formula, vitamin anak, dll."
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                    Tanggal Pengeluaran
                  </Label>
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({...formData, date: e.target.value})}
                    className="h-11"
                    required
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="payment" className="text-sm font-medium text-gray-700">
                    Metode Pembayaran
                  </Label>
                  <Select
                    value={formData.paymentMethod}
                    onValueChange={(value) => setFormData({...formData, paymentMethod: value as PaymentMethod})}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Pilih metode pembayaran" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cash">💵 Tunai</SelectItem>
                      <SelectItem value="debit">💳 Debit</SelectItem>
                      <SelectItem value="credit">💳 Kredit</SelectItem>
                      <SelectItem value="e-wallet">📱 E-Wallet</SelectItem>
                      <SelectItem value="bank-transfer">🏦 Transfer Bank</SelectItem>
                      <SelectItem value="other">📋 Lainnya</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-200">
                <Button
                  type="submit"
                  className="bg-pink-500 hover:bg-pink-600 h-11 flex-1 sm:flex-none"
                  disabled={!formData.description || !formData.amount}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Simpan Pengeluaran
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="h-11"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Batal
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Tips Card */}
        <Card className="mt-6 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900 text-lg">💡 Tips Pengeluaran</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-blue-800">
              <p>• Catat pengeluaran secara rutin untuk tracking yang akurat</p>
              <p>• Gunakan kategori yang sesuai untuk analisis yang lebih baik</p>
              <p>• Simpan struk sebagai referensi untuk pengeluaran besar</p>
              <p>• Review pengeluaran bulanan untuk optimasi budget</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
