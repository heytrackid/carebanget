'use client';

import { useState } from 'react';
import { Task, TaskCategory, TaskPriority } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { X, Plus } from 'lucide-react';
import { taskCategories, taskPriorities } from '@/data/mockTasks';
import { format } from 'date-fns';

interface TaskFormProps {
  task?: Task;
  isOpen: boolean;
  onClose: () => void;
  onSave: (task: Partial<Task>) => void;
}

export function TaskForm({ task, isOpen, onClose, onSave }: TaskFormProps) {
  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    category: task?.category || 'other' as TaskCategory,
    priority: task?.priority || 'medium' as TaskPriority,
    dueDate: task?.dueDate ? format(task.dueDate, 'yyyy-MM-dd') : '',
    estimatedTime: task?.estimatedTime?.toString() || '',
    tags: task?.tags || [],
  });

  const [newTag, setNewTag] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const taskData: Partial<Task> = {
      ...formData,
      dueDate: formData.dueDate ? new Date(formData.dueDate) : undefined,
      estimatedTime: formData.estimatedTime ? parseInt(formData.estimatedTime) : undefined,
      updatedAt: new Date(),
    };

    if (!task) {
      taskData.id = Date.now().toString();
      taskData.status = 'todo';
      taskData.createdAt = new Date();
    }

    onSave(taskData);
    onClose();
  };

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()]
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove)
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {task ? 'Edit Tugas' : 'Buat Tugas Baru'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Judul Tugas *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Masukkan judul tugas"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Masukkan deskripsi tugas (opsional)"
              rows={3}
            />
          </div>

          {/* Category and Priority */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Kategori</Label>
              <Select
                value={formData.category}
                onValueChange={(value: TaskCategory) => 
                  setFormData({ ...formData, category: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="priority">Prioritas</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: TaskPriority) => 
                  setFormData({ ...formData, priority: value })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {taskPriorities.map((priority) => (
                    <SelectItem key={priority.value} value={priority.value}>
                      {priority.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Due Date and Estimated Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Tanggal Tenggat</Label>
              <Input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="estimatedTime">Estimasi Waktu (menit)</Label>
              <Input
                id="estimatedTime"
                type="number"
                value={formData.estimatedTime}
                onChange={(e) => setFormData({ ...formData, estimatedTime: e.target.value })}
                placeholder="30"
                min="1"
              />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label>Tag</Label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-1 hover:text-red-600"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
            <div className="flex space-x-2">
              <Input
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Tambahkan tag"
                className="flex-1"
              />
              <Button type="button" onClick={addTag} size="sm" variant="outline">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Batal
            </Button>
            <Button type="submit">
              {task ? 'Update Tugas' : 'Buat Tugas'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
