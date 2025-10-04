'use client';

import { useState, useMemo } from 'react';
import { Sidebar } from '@/components/navigation/Sidebar';
import { Task } from '@/types';
import { mockTasks } from '@/data/mockTasks';
import { TaskCard } from '@/components/tasks/TaskCard';
import { TaskForm } from '@/components/tasks/TaskForm';
import { TaskFilters, TaskFilters as TaskFiltersType } from '@/components/tasks/TaskFilters';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';
import {
  Plus,
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo,
  BarChart3,
  MoreVertical,
  Filter,
  SortAsc,
  Download,
  Upload,
  Settings
} from 'lucide-react';
import { isToday, isTomorrow, isThisWeek, isPast } from 'date-fns';

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(mockTasks);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [filters, setFilters] = useState<TaskFiltersType>({
    search: '',
    category: 'all',
    priority: 'all',
    status: 'all',
    dueDate: 'all',
  });
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'createdAt' | 'title'>('dueDate');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Filter and sort tasks
  const filteredTasks = useMemo(() => {
    let filtered = tasks.filter(task => {
      // Search filter
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        if (!task.title.toLowerCase().includes(searchLower) &&
            !task.description?.toLowerCase().includes(searchLower) &&
            !task.tags.some(tag => tag.toLowerCase().includes(searchLower))) {
          return false;
        }
      }

      // Category filter
      if (filters.category !== 'all' && task.category !== filters.category) {
        return false;
      }

      // Priority filter
      if (filters.priority !== 'all' && task.priority !== filters.priority) {
        return false;
      }

      // Status filter
      if (filters.status !== 'all' && task.status !== filters.status) {
        return false;
      }

      // Due date filter
      if (filters.dueDate !== 'all' && task.dueDate) {
        switch (filters.dueDate) {
          case 'today':
            if (!isToday(task.dueDate)) return false;
            break;
          case 'tomorrow':
            if (!isTomorrow(task.dueDate)) return false;
            break;
          case 'this-week':
            if (!isThisWeek(task.dueDate)) return false;
            break;
          case 'overdue':
            if (!isPast(task.dueDate) || task.status === 'completed') return false;
            break;
        }
      }

      return true;
    });

    // Sort tasks
    filtered.sort((a, b) => {
      let aValue: any, bValue: any;

      switch (sortBy) {
        case 'dueDate':
          aValue = a.dueDate ? new Date(a.dueDate).getTime() : Infinity;
          bValue = b.dueDate ? new Date(b.dueDate).getTime() : Infinity;
          break;
        case 'priority':
          const priorityOrder = { urgent: 4, high: 3, medium: 2, low: 1 };
          aValue = priorityOrder[a.priority];
          bValue = priorityOrder[b.priority];
          break;
        case 'createdAt':
          aValue = new Date(a.createdAt).getTime();
          bValue = new Date(b.createdAt).getTime();
          break;
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        default:
          return 0;
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });

    return filtered;
  }, [tasks, filters, sortBy, sortOrder]);

  // Calculate task counts
  const taskCounts = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'todo').length,
      inProgress: tasks.filter(t => t.status === 'in-progress').length,
      completed: tasks.filter(t => t.status === 'completed').length,
      overdue: tasks.filter(t => 
        t.dueDate && isPast(t.dueDate) && t.status !== 'completed'
      ).length,
    };
  }, [tasks]);

  // Group tasks by status for board view
  const tasksByStatus = useMemo(() => {
    return {
      todo: filteredTasks.filter(t => t.status === 'todo'),
      'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
      completed: filteredTasks.filter(t => t.status === 'completed'),
    };
  }, [filteredTasks]);

  const handleStatusChange = (taskId: string, status: Task['status']) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { 
              ...task, 
              status, 
              updatedAt: new Date(),
              completedAt: status === 'completed' ? new Date() : undefined
            }
          : task
      )
    );
  };

  const handleSaveTask = (taskData: Partial<Task>) => {
    if (editingTask) {
      // Update existing task
      setTasks(prevTasks =>
        prevTasks.map(task =>
          task.id === editingTask.id ? { ...task, ...taskData } : task
        )
      );
    } else {
      // Create new task
      const newTask: Task = {
        id: taskData.id || Date.now().toString(),
        title: taskData.title || '',
        description: taskData.description,
        category: taskData.category || 'other',
        priority: taskData.priority || 'medium',
        status: taskData.status || 'todo',
        dueDate: taskData.dueDate,
        childId: taskData.childId,
        tags: taskData.tags || [],
        createdAt: taskData.createdAt || new Date(),
        updatedAt: taskData.updatedAt || new Date(),
        completedAt: taskData.completedAt,
        estimatedTime: taskData.estimatedTime,
        recurrence: taskData.recurrence,
      };
      setTasks(prevTasks => [newTask, ...prevTasks]);
    }
    setEditingTask(undefined);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsFormOpen(true);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId));
  };

  const handleCreateTask = () => {
    setEditingTask(undefined);
    setIsFormOpen(true);
  };

  const handleSort = (field: typeof sortBy) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const handleExportTasks = () => {
    const dataStr = JSON.stringify(tasks, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tasks-backup-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <Sidebar>
      <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pengelola Tugas</h1>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">
                Atur dan pantau tugas-tugas parenting Anda
                <span className="ml-2 text-xs bg-gray-100 px-2 py-1 rounded">
                  Diurutkan: {sortBy === 'dueDate' ? 'Tanggal Tenggat' : 
                              sortBy === 'priority' ? 'Prioritas' : 
                              sortBy === 'title' ? 'Judul' : 'Tanggal Dibuat'} 
                  ({sortOrder === 'asc' ? '↑' : '↓'})
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button onClick={handleCreateTask}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Tugas
              </Button>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={handleCreateTask}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tugas Baru
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={() => handleSort('dueDate')}>
                    <SortAsc className="h-4 w-4 mr-2" />
                    Urutkan: Tanggal Tenggat
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('priority')}>
                    <Filter className="h-4 w-4 mr-2" />
                    Urutkan: Prioritas
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleSort('title')}>
                    <SortAsc className="h-4 w-4 mr-2" />
                    Urutkan: Judul
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem onClick={handleExportTasks}>
                    <Download className="h-4 w-4 mr-2" />
                    Export Tugas
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem>
                    <Settings className="h-4 w-4 mr-2" />
                    Pengaturan Tampilan
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <ListTodo className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Total Tugas</p>
                  <p className="text-2xl font-bold">{taskCounts.total}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <Clock className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="text-sm text-gray-600">Dalam Proses</p>
                  <p className="text-2xl font-bold">{taskCounts.inProgress}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Selesai</p>
                  <p className="text-2xl font-bold">{taskCounts.completed}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-600">Terlambat</p>
                  <p className="text-2xl font-bold">{taskCounts.overdue}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Filter</CardTitle>
          </CardHeader>
          <CardContent>
            <TaskFilters
              filters={filters}
              onFiltersChange={setFilters}
              taskCounts={taskCounts}
            />
          </CardContent>
        </Card>

        {/* Tasks */}
        <Tabs defaultValue="list" className="space-y-4 mt-6">
          <TabsList>
            <TabsTrigger value="list">
              <ListTodo className="h-4 w-4 mr-2" />
              Tampilan Daftar
            </TabsTrigger>
            <TabsTrigger value="board">
              <BarChart3 className="h-4 w-4 mr-2" />
              Tampilan Papan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="list" className="space-y-4">
            {filteredTasks.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <ListTodo className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada tugas ditemukan</h3>
                  <p className="text-gray-600 mb-4">
                    {filters.search || filters.category !== 'all' || filters.priority !== 'all' || filters.status !== 'all' || filters.dueDate !== 'all'
                      ? 'Coba sesuaikan filter untuk melihat tugas lainnya.'
                      : 'Mulai dengan membuat tugas pertama Anda.'
                    }
                  </p>
                  <Button onClick={handleCreateTask}>
                    <Plus className="h-4 w-4 mr-2" />
                    Buat Tugas
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4">
                {filteredTasks.map((task) => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    onStatusChange={handleStatusChange}
                    onEdit={handleEditTask}
                    onDelete={handleDeleteTask}
                  />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="board" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* To Do Column */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span>Belum Dikerjakan ({tasksByStatus.todo.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tasksByStatus.todo.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                  {tasksByStatus.todo.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Tidak ada tugas</p>
                  )}
                </CardContent>
              </Card>

              {/* In Progress Column */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span>Dalam Proses ({tasksByStatus['in-progress'].length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tasksByStatus['in-progress'].map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                  {tasksByStatus['in-progress'].length === 0 && (
                    <p className="text-gray-500 text-center py-4">Tidak ada tugas</p>
                  )}
                </CardContent>
              </Card>

              {/* Completed Column */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span>Selesai ({tasksByStatus.completed.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {tasksByStatus.completed.map((task) => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onStatusChange={handleStatusChange}
                      onEdit={handleEditTask}
                      onDelete={handleDeleteTask}
                    />
                  ))}
                  {tasksByStatus.completed.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Tidak ada tugas</p>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Task Form Dialog */}
        <TaskForm
          task={editingTask}
          isOpen={isFormOpen}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTask(undefined);
          }}
          onSave={handleSaveTask}
        />
      </div>
    </Sidebar>
  );
}
