'use client';

import { Task } from '@/types';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  CalendarDays, 
  Clock, 
  MoreHorizontal, 
  User, 
  Tag,
  Edit,
  Trash2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { taskCategories, taskPriorities, taskStatuses } from '@/data/mockTasks';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, status: Task['status']) => void;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export function TaskCard({ task, onStatusChange, onEdit, onDelete }: TaskCardProps) {
  const category = taskCategories.find(c => c.value === task.category);
  const priority = taskPriorities.find(p => p.value === task.priority);
  const status = taskStatuses.find(s => s.value === task.status);

  const formatDueDate = (date: Date) => {
    if (isToday(date)) return 'Hari Ini';
    if (isTomorrow(date)) return 'Besok';
    return format(date, 'dd MMM');
  };

  const isDueSoon = task.dueDate && (isToday(task.dueDate) || isTomorrow(task.dueDate));
  const isOverdue = task.dueDate && isPast(task.dueDate) && task.status !== 'completed';

  const handleStatusToggle = () => {
    if (task.status === 'completed') {
      onStatusChange(task.id, 'todo');
    } else {
      onStatusChange(task.id, 'completed');
    }
  };

  return (
    <Card className={`transition-all duration-200 hover:shadow-md ${
      task.status === 'completed' ? 'opacity-75' : ''
    } ${isOverdue ? 'border-red-200 bg-red-50/30' : ''}`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <Checkbox
              checked={task.status === 'completed'}
              onCheckedChange={handleStatusToggle}
              className="mt-1"
            />
            <div className="flex-1 min-w-0">
              <h3 className={`font-medium text-sm ${
                task.status === 'completed' ? 'line-through text-gray-500' : ''
              }`}>
                {task.title}
              </h3>
              {task.description && (
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {task.description}
                </p>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(task)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(task.id)}
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Hapus
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Category */}
          <div className="flex items-center space-x-1">
            <span>{category?.icon}</span>
            <span className="text-gray-600">{category?.label}</span>
          </div>

          {/* Priority */}
          <Badge variant="secondary" className={priority?.color}>
            {priority?.label}
          </Badge>

          {/* Status */}
          <Badge variant="secondary" className={status?.color}>
            {status?.label}
          </Badge>

          {/* Due Date */}
          {task.dueDate && (
            <div className={`flex items-center space-x-1 ${
              isOverdue ? 'text-red-600' : isDueSoon ? 'text-orange-600' : 'text-gray-600'
            }`}>
              <CalendarDays className="h-3 w-3" />
              <span>{formatDueDate(task.dueDate)}</span>
            </div>
          )}

          {/* Estimated Time */}
          {task.estimatedTime && (
            <div className="flex items-center space-x-1 text-gray-600">
              <Clock className="h-3 w-3" />
              <span>{task.estimatedTime}m</span>
            </div>
          )}

          {/* Child */}
          {task.childId && (
            <div className="flex items-center space-x-1 text-gray-600">
              <User className="h-3 w-3" />
              <span>Kaia</span>
            </div>
          )}
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                <Tag className="h-2 w-2 mr-1" />
                {tag}
              </Badge>
            ))}
            {task.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{task.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Recurrence indicator */}
        {task.recurrence && (
          <div className="mt-2 text-xs text-blue-600 flex items-center space-x-1">
            <span>🔄</span>
            <span>Berulang {task.recurrence.type === 'daily' ? 'harian' : task.recurrence.type === 'weekly' ? 'mingguan' : 'bulanan'}</span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
