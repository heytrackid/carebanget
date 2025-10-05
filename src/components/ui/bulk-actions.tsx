"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Trash2,
  Download,
  Edit3,
  X,
  CheckSquare,
  Square,
  MoreHorizontal
} from "lucide-react"

export interface BulkAction<T = any> {
  id: string
  label: string
  icon?: React.ReactNode
  onExecute: (items: T[]) => void | Promise<void>
  variant?: "default" | "destructive" | "secondary"
  disabled?: boolean
}

interface BulkActionsProps<T = any> {
  items: T[]
  selectedItems: T[]
  onSelectionChange: (items: T[]) => void
  actions?: BulkAction<T>[]
  itemName?: string
  showSelectAll?: boolean
  className?: string
}

export function BulkActions<T extends { id: string }>({
  items,
  selectedItems,
  onSelectionChange,
  actions = [],
  itemName = "item",
  showSelectAll = true,
  className = ""
}: BulkActionsProps<T>) {
  const [isExecuting, setIsExecuting] = useState<string | null>(null)

  const selectedIds = selectedItems.map(item => item.id)
  const isAllSelected = items.length > 0 && selectedItems.length === items.length
  const isSomeSelected = selectedItems.length > 0 && selectedItems.length < items.length

  const handleSelectAll = useCallback(() => {
    if (isAllSelected) {
      onSelectionChange([])
    } else {
      onSelectionChange(items)
    }
  }, [isAllSelected, items, onSelectionChange])

  const handleSelectItem = useCallback((item: T, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedItems, item])
    } else {
      onSelectionChange(selectedItems.filter(selected => selected.id !== item.id))
    }
  }, [selectedItems, onSelectionChange])

  const handleClearSelection = useCallback(() => {
    onSelectionChange([])
  }, [onSelectionChange])

  const handleExecuteAction = useCallback(async (action: BulkAction<T>) => {
    if (selectedItems.length === 0) return

    setIsExecuting(action.id)
    try {
      await action.onExecute(selectedItems)
      handleClearSelection()
    } catch (error) {
      console.error(`Failed to execute bulk action ${action.id}:`, error)
    } finally {
      setIsExecuting(null)
    }
  }, [selectedItems, handleClearSelection])

  // Default actions
  const defaultActions: BulkAction<T>[] = [
    {
      id: "delete",
      label: `Hapus ${selectedItems.length} ${itemName}`,
      icon: <Trash2 className="h-4 w-4" />,
      onExecute: (items) => {
        if (confirm(`Apakah Anda yakin ingin menghapus ${items.length} ${itemName}?`)) {
          console.log("Deleting items:", items)
        }
      },
      variant: "destructive"
    },
    {
      id: "export",
      label: `Export ${selectedItems.length} ${itemName}`,
      icon: <Download className="h-4 w-4" />,
      onExecute: (items) => {
        console.log("Exporting items:", items)
        // Implement export logic
      },
      variant: "secondary"
    }
  ]

  const allActions = [...defaultActions, ...actions]

  if (selectedItems.length === 0) {
    return showSelectAll ? (
      <div className={`flex items-center gap-2 ${className}`}>
        <Button
          variant="outline"
          size="sm"
          onClick={handleSelectAll}
          disabled={items.length === 0}
          className="h-8"
        >
          <CheckSquare className="h-4 w-4 mr-2" />
          Select All
        </Button>
      </div>
    ) : null
  }

  return (
    <div className={`flex items-center justify-between p-3 bg-blue-50 border border-blue-200 rounded-lg ${className}`}>
      <div className="flex items-center gap-3">
        {showSelectAll && (
          <Checkbox
            checked={isAllSelected}
            onCheckedChange={handleSelectAll}
          />
        )}

        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="bg-blue-100 text-blue-800">
            {selectedItems.length} {itemName} dipilih
          </Badge>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleClearSelection}
            className="h-6 px-2 text-xs hover:bg-blue-100"
          >
            <X className="h-3 w-3 mr-1" />
            Clear
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {allActions.map((action) => (
          <Button
            key={action.id}
            variant={action.variant || "default"}
            size="sm"
            onClick={() => handleExecuteAction(action)}
            disabled={isExecuting === action.id || action.disabled}
            className="h-8"
          >
            {isExecuting === action.id ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current mr-2" />
            ) : (
              action.icon
            )}
            <span className="ml-2">{action.label}</span>
          </Button>
        ))}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>More Actions</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleClearSelection}>
              <X className="h-4 w-4 mr-2" />
              Clear Selection
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleSelectAll}>
              <CheckSquare className="h-4 w-4 mr-2" />
              Select All
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

// Hook for managing bulk selection state
export function useBulkSelection<T extends { id: string }>(initialItems: T[] = []) {
  const [selectedItems, setSelectedItems] = useState<T[]>([])

  const toggleItem = useCallback((item: T) => {
    setSelectedItems(prev =>
      prev.some(selected => selected.id === item.id)
        ? prev.filter(selected => selected.id !== item.id)
        : [...prev, item]
    )
  }, [])

  const toggleAll = useCallback((items: T[]) => {
    setSelectedItems(prev =>
      prev.length === items.length ? [] : items
    )
  }, [])

  const clearSelection = useCallback(() => {
    setSelectedItems([])
  }, [])

  const isSelected = useCallback((item: T) => {
    return selectedItems.some(selected => selected.id === item.id)
  }, [selectedItems])

  return {
    selectedItems,
    setSelectedItems,
    toggleItem,
    toggleAll,
    clearSelection,
    isSelected,
    selectedCount: selectedItems.length,
    isAllSelected: initialItems.length > 0 && selectedItems.length === initialItems.length,
    isSomeSelected: selectedItems.length > 0 && selectedItems.length < initialItems.length
  }
}
