'use client';

import { TaskCategory, TaskPriority, TaskStatus } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Search, X } from 'lucide-react';
import { taskCategories, taskPriorities, taskStatuses } from '@/data/mockTasks';

export interface TaskFilters {
  search: string;
  category: TaskCategory | 'all';
  priority: TaskPriority | 'all';
  status: TaskStatus | 'all';
  dueDate: 'all' | 'today' | 'tomorrow' | 'this-week' | 'overdue';
}

interface TaskFiltersProps {
  filters: TaskFilters;
  onFiltersChange: (filters: TaskFilters) => void;
  taskCounts: {
    total: number;
    todo: number;
    inProgress: number;
    completed: number;
    overdue: number;
  };
}

export function TaskFilters({ filters, onFiltersChange, taskCounts }: TaskFiltersProps) {
  const updateFilter = (key: keyof TaskFilters, value: TaskFilters[keyof TaskFilters]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({
      search: '',
      category: 'all',
      priority: 'all',
      status: 'all',
      dueDate: 'all',
    });
  };

  const hasActiveFilters = 
    filters.search || 
    filters.category !== 'all' || 
    filters.priority !== 'all' || 
    filters.status !== 'all' || 
    filters.dueDate !== 'all';

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
        <Input
          placeholder="Cari tugas..."
          value={filters.search}
          onChange={(e) => updateFilter('search', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Quick Stats */}
      <div className="flex flex-wrap gap-2">
        <Badge 
          variant={filters.status === 'all' ? 'default' : 'secondary'}
          className="cursor-pointer"
          onClick={() => updateFilter('status', 'all')}
        >
          Semua ({taskCounts.total})
        </Badge>
        <Badge 
          variant={filters.status === 'todo' ? 'default' : 'secondary'}
          className="cursor-pointer"
          onClick={() => updateFilter('status', 'todo')}
        >
          Belum Dikerjakan ({taskCounts.todo})
        </Badge>
        <Badge 
          variant={filters.status === 'in-progress' ? 'default' : 'secondary'}
          className="cursor-pointer"
          onClick={() => updateFilter('status', 'in-progress')}
        >
          Dalam Proses ({taskCounts.inProgress})
        </Badge>
        <Badge 
          variant={filters.status === 'completed' ? 'default' : 'secondary'}
          className="cursor-pointer"
          onClick={() => updateFilter('status', 'completed')}
        >
          Selesai ({taskCounts.completed})
        </Badge>
        {taskCounts.overdue > 0 && (
          <Badge 
            variant={filters.dueDate === 'overdue' ? 'default' : 'destructive'}
            className="cursor-pointer"
            onClick={() => updateFilter('dueDate', 'overdue')}
          >
            Terlambat ({taskCounts.overdue})
          </Badge>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Category Filter */}
        <Select
          value={filters.category}
          onValueChange={(value: TaskCategory | 'all') => updateFilter('category', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Kategori" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Kategori</SelectItem>
            {taskCategories.map((category) => (
              <SelectItem key={category.value} value={category.value}>
                <div className="flex items-center space-x-2">
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Priority Filter */}
        <Select
          value={filters.priority}
          onValueChange={(value: TaskPriority | 'all') => updateFilter('priority', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Prioritas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Prioritas</SelectItem>
            {taskPriorities.map((priority) => (
              <SelectItem key={priority.value} value={priority.value}>
                {priority.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Status Filter */}
        <Select
          value={filters.status}
          onValueChange={(value: TaskStatus | 'all') => updateFilter('status', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            {taskStatuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Due Date Filter */}
        <Select
          value={filters.dueDate}
          onValueChange={(value) => updateFilter('dueDate', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Tanggal Tenggat" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Tanggal</SelectItem>
            <SelectItem value="overdue">Terlambat</SelectItem>
            <SelectItem value="today">Hari Ini</SelectItem>
            <SelectItem value="tomorrow">Besok</SelectItem>
            <SelectItem value="this-week">Minggu Ini</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">
            Filter aktif diterapkan
          </span>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={clearFilters}
            className="text-xs"
          >
            <X className="h-3 w-3 mr-1" />
            Hapus Filter
          </Button>
        </div>
      )}
    </div>
  );
}
