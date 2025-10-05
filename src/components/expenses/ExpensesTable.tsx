"use client"

import { useState, useMemo } from "react"
import { Expense, ExpenseCategory, PaymentMethod } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  ChevronDown,
  Search,
  Filter,
  Download,
  Plus,
  Calendar,
  DollarSign,
  TrendingUp,
  TrendingDown,
  Settings,
  Edit3,
  Trash2,
  MoreHorizontal
} from "lucide-react"
import { BulkActions, BulkAction, useBulkSelection } from "@/components/ui/bulk-actions"

const CATEGORY_ICONS: Record<ExpenseCategory, any> = {
  food: "🍽️",
  groceries: "🛒",
  health: "❤️",
  education: "🎓",
  clothing: "👕",
  toys: "🎮",
  childcare: "👶",
  transportation: "🚗",
  utilities: "⚡",
  other: "📋",
};

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

interface ExpensesTableProps {
  expenses: Expense[]
  onAddExpense?: () => void
  onEditExpense?: (expense: Expense) => void
  onDeleteExpense?: (expense: Expense) => void
}

export function ExpensesTable({ expenses, onAddExpense, onEditExpense, onDeleteExpense }: ExpensesTableProps) {
  const [searchTerm, setSearchTerm] = useState("")
  const [categoryFilter, setCategoryFilter] = useState<ExpenseCategory | "all">("all")
  const [paymentFilter, setPaymentFilter] = useState<PaymentMethod | "all">("all")
  const [sortBy, setSortBy] = useState<"date" | "amount" | "category">("date")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [visibleColumns, setVisibleColumns] = useState({
    category: true,
    description: true,
    amount: true,
    date: true,
    payment: true,
    actions: true,
  })

  // Filter and sort expenses
  const filteredExpenses = useMemo(() => {
    let filtered = expenses.filter(expense => {
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesCategory = categoryFilter === "all" || expense.category === categoryFilter
      const matchesPayment = paymentFilter === "all" || expense.paymentMethod === paymentFilter

      return matchesSearch && matchesCategory && matchesPayment
    })

    // Sort
    filtered.sort((a, b) => {
      let comparison = 0

      switch (sortBy) {
        case "date":
          comparison = new Date(a.date).getTime() - new Date(b.date).getTime()
          break
        case "amount":
          comparison = a.amount - b.amount
          break
        case "category":
          comparison = a.category.localeCompare(b.category)
          break
      }

      return sortOrder === "asc" ? comparison : -comparison
    })

    return filtered
  }, [expenses, searchTerm, categoryFilter, paymentFilter, sortBy, sortOrder])

  // Bulk selection state
  const {
    selectedItems,
    setSelectedItems,
    toggleItem,
    toggleAll,
    clearSelection,
    isSelected,
    selectedCount,
    isAllSelected
  } = useBulkSelection(filteredExpenses)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(amount)
  }

  const exportToCSV = () => {
    const headers = ["Tanggal", "Kategori", "Deskripsi", "Jumlah", "Metode Pembayaran"]
    const csvContent = [
      headers.join(","),
      ...filteredExpenses.map(expense => [
        new Date(expense.date).toLocaleDateString('id-ID'),
        CATEGORY_LABELS[expense.category],
        `"${expense.description}"`,
        expense.amount,
        expense.paymentMethod
      ].join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `expenses-${new Date().toISOString().split('T')[0]}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Bulk actions
  const bulkActions: BulkAction<Expense>[] = [
    {
      id: "bulk-edit",
      label: `Edit ${selectedItems.length} pengeluaran`,
      icon: <Edit3 className="h-4 w-4" />,
      onExecute: (items) => {
        console.log("Bulk edit items:", items)
        // Implement bulk edit logic
      },
      variant: "default"
    }
  ]

  return (
    <div className="space-y-4">
      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <BulkActions
          items={filteredExpenses}
          selectedItems={selectedItems}
          onSelectionChange={setSelectedItems}
          actions={bulkActions}
          itemName="pengeluaran"
          showSelectAll={false}
        />
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Cari pengeluaran..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <Select value={categoryFilter} onValueChange={(value) => setCategoryFilter(value as ExpenseCategory | "all")}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>{label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={paymentFilter} onValueChange={(value) => setPaymentFilter(value as PaymentMethod | "all")}>
              <SelectTrigger className="w-full sm:w-48">
                <SelectValue placeholder="Pembayaran" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Metode</SelectItem>
                <SelectItem value="cash">Tunai</SelectItem>
                <SelectItem value="debit">Debit</SelectItem>
                <SelectItem value="credit">Kredit</SelectItem>
                <SelectItem value="e-wallet">E-Wallet</SelectItem>
                <SelectItem value="bank-transfer">Transfer Bank</SelectItem>
                <SelectItem value="other">Lainnya</SelectItem>
              </SelectContent>
            </Select>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Settings className="h-4 w-4 mr-2" />
                  Kolom
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Kolom yang Ditampilkan</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {Object.entries({
                  category: "Kategori",
                  description: "Deskripsi",
                  amount: "Jumlah",
                  date: "Tanggal",
                  payment: "Pembayaran",
                  actions: "Aksi"
                }).map(([key, label]) => (
                  <DropdownMenuCheckboxItem
                    key={key}
                    checked={visibleColumns[key as keyof typeof visibleColumns]}
                    onCheckedChange={(checked) =>
                      setVisibleColumns(prev => ({ ...prev, [key]: checked }))
                    }
                  >
                    {label}
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button onClick={exportToCSV} variant="outline">
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>

            {onAddExpense && (
              <Button onClick={onAddExpense} className="bg-pink-500 hover:bg-pink-600">
                <Plus className="h-4 w-4 mr-2" />
                Tambah
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardHeader>
          <CardTitle>Riwayat Pengeluaran</CardTitle>
          <CardDescription>
            Menampilkan {filteredExpenses.length} dari {expenses.length} pengeluaran
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={toggleAll}
                    aria-label="Select all expenses"
                  />
                </TableHead>
                {visibleColumns.category && (
                  <TableHead className="w-16">Kat.</TableHead>
                )}
                {visibleColumns.description && (
                  <TableHead className="min-w-48">Deskripsi</TableHead>
                )}
                {visibleColumns.amount && (
                  <TableHead className="text-right">Jumlah</TableHead>
                )}
                {visibleColumns.date && (
                  <TableHead className="w-32">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        if (sortBy === "date") {
                          setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                        } else {
                          setSortBy("date")
                          setSortOrder("desc")
                        }
                      }}
                      className="h-auto p-0 font-medium"
                    >
                      Tanggal
                      <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${
                        sortBy === "date" && sortOrder === "asc" ? "rotate-180" : ""
                      }`} />
                    </Button>
                  </TableHead>
                )}
                {visibleColumns.payment && (
                  <TableHead className="w-32">Pembayaran</TableHead>
                )}
                {visibleColumns.actions && (
                  <TableHead className="w-16">Aksi</TableHead>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredExpenses.map((expense) => (
                <TableRow key={expense.id} className={isSelected(expense) ? "bg-blue-50" : ""}>
                  <TableCell>
                    <Checkbox
                      checked={isSelected(expense)}
                      onCheckedChange={() => toggleItem(expense)}
                      aria-label={`Select expense ${expense.description}`}
                    />
                  </TableCell>
                  {visibleColumns.category && (
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{CATEGORY_ICONS[expense.category]}</span>
                        <Badge variant="outline" className="text-xs">
                          {CATEGORY_LABELS[expense.category]}
                        </Badge>
                      </div>
                    </TableCell>
                  )}
                  {visibleColumns.description && (
                    <TableCell className="font-medium">{expense.description}</TableCell>
                  )}
                  {visibleColumns.amount && (
                    <TableCell className="text-right font-bold">
                      {formatCurrency(expense.amount)}
                    </TableCell>
                  )}
                  {visibleColumns.date && (
                    <TableCell className="text-sm text-gray-600">
                      {new Date(expense.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </TableCell>
                  )}
                  {visibleColumns.payment && (
                    <TableCell>
                      <Badge variant="secondary" className="text-xs capitalize">
                        {expense.paymentMethod}
                      </Badge>
                    </TableCell>
                  )}
                  {visibleColumns.actions && (
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40">
                          {onEditExpense && (
                            <DropdownMenuItem
                              onClick={() => onEditExpense(expense)}
                              className="cursor-pointer"
                            >
                              <Edit3 className="mr-2 h-4 w-4" />
                              Edit
                            </DropdownMenuItem>
                          )}
                          {onDeleteExpense && (
                            <DropdownMenuItem
                              onClick={() => onDeleteExpense(expense)}
                              className="cursor-pointer text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Hapus
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {filteredExpenses.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Tidak ada pengeluaran yang sesuai dengan filter
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
