"use client"

import { useState } from "react"
import { Expense, ExpenseCategory, PaymentMethod } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Plus } from "lucide-react"

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

interface AddExpenseFormProps {
  onAddExpense: (expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'>) => void
  onCancel: () => void
}

export function AddExpenseForm({ onAddExpense, onCancel }: AddExpenseFormProps) {
  const [formData, setFormData] = useState({
    category: 'food' as ExpenseCategory,
    amount: '',
    currency: 'IDR',
    description: '',
    date: new Date().toISOString().split('T')[0],
    paymentMethod: 'cash' as PaymentMethod,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.description || !formData.amount) {
      return
    }

    const expense: Omit<Expense, 'id' | 'createdAt' | 'updatedAt'> = {
      category: formData.category,
      amount: parseFloat(formData.amount),
      currency: formData.currency,
      description: formData.description,
      date: new Date(formData.date),
      paymentMethod: formData.paymentMethod,
      tags: [],
    }

    onAddExpense(expense)

    // Reset form
    setFormData({
      category: 'food',
      amount: '',
      currency: 'IDR',
      description: '',
      date: new Date().toISOString().split('T')[0],
      paymentMethod: 'cash',
    })
  }

  return (
    <Card className="border-pink-200 bg-pink-50">
      <CardHeader>
        <CardTitle>Tambah Pengeluaran Baru</CardTitle>
        <CardDescription>Catat pengeluaran untuk anak Anda</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
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
              <Label htmlFor="amount">Jumlah (IDR)</Label>
              <Input
                id="amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({...formData, amount: e.target.value})}
                placeholder="50000"
                min="0"
                step="1000"
                required
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="description">Deskripsi</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Contoh: Belanja susu formula"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date">Tanggal</Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({...formData, date: e.target.value})}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment">Metode Pembayaran</Label>
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

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="bg-pink-500 hover:bg-pink-600">
              <Plus className="mr-2 h-4 w-4" />
              Simpan
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Batal
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
