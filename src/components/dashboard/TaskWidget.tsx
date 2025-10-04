'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  CheckSquare, 
  Clock, 
  AlertCircle, 
  Plus, 
  ArrowRight,
  Calendar,
  User
} from 'lucide-react';
import { Task } from '@/types';
import { mockTasks, taskPriorities } from '@/data/mockTasks';
import { format, isToday, isTomorrow, isPast } from 'date-fns';

export function TaskWidget() {
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // In a real app, this would fetch from API
    setTasks(mockTasks);
  }, []);

  // Calculate task statistics
  const taskStats = {
    total: tasks.length,
    completed: tasks.filter(t => t.status === 'completed').length,
    inProgress: tasks.filter(t => t.status === 'in-progress').length,
    overdue: tasks.filter(t => 
      t.dueDate && isPast(t.dueDate) && t.status !== 'completed'
    ).length,
    dueToday: tasks.filter(t => 
      t.dueDate && isToday(t.dueDate) && t.status !== 'completed'
    ).length,
  };

  const completionRate = taskStats.total > 0 
    ? Math.round((taskStats.completed / taskStats.total) * 100) 
    : 0;

  // Get upcoming tasks (next 3 tasks due soon)
  const upcomingTasks = tasks
    .filter(t => t.status !== 'completed' && t.dueDate)
    .sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
    })
    .slice(0, 3);

  const formatDueDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd');
  };

  const getPriorityColor = (priority: string) => {
    const priorityConfig = taskPriorities.find(p => p.value === priority);
    return priorityConfig?.color || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-4">
      {/* Task Statistics Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Task Overview</CardTitle>
          <CheckSquare className="h-5 w-5 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{taskStats.total}</div>
              <div className="text-xs text-gray-500">Total Tasks</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{completionRate}%</div>
              <div className="text-xs text-gray-500">Completed</div>
            </div>
          </div>
          
          <Progress value={completionRate} className="mb-4" />
          
          <div className="flex justify-between text-sm">
            <div className="flex items-center space-x-1">
              <Clock className="h-3 w-3 text-yellow-600" />
              <span>{taskStats.inProgress} in progress</span>
            </div>
            {taskStats.overdue > 0 && (
              <div className="flex items-center space-x-1 text-red-600">
                <AlertCircle className="h-3 w-3" />
                <span>{taskStats.overdue} overdue</span>
              </div>
            )}
          </div>
          
          {taskStats.dueToday > 0 && (
            <div className="mt-2 p-2 bg-orange-50 rounded-lg">
              <div className="flex items-center space-x-1 text-orange-700 text-sm">
                <Calendar className="h-3 w-3" />
                <span>{taskStats.dueToday} task{taskStats.dueToday > 1 ? 's' : ''} due today</span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Upcoming Tasks Card */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold">Upcoming Tasks</CardTitle>
          <Link href="/tasks">
            <Button variant="ghost" size="sm" className="text-xs">
              View All
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {upcomingTasks.length === 0 ? (
            <div className="text-center py-4">
              <CheckSquare className="h-8 w-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">No upcoming tasks</p>
              <Link href="/tasks">
                <Button size="sm" className="mt-2">
                  <Plus className="h-3 w-3 mr-1" />
                  Add Task
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingTasks.map((task) => (
                <div key={task.id} className="flex items-start space-x-3 p-2 rounded-lg hover:bg-gray-50">
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-medium text-gray-900 truncate">
                      {task.title}
                    </h4>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge 
                        variant="secondary" 
                        className={`text-xs ${getPriorityColor(task.priority)}`}
                      >
                        {task.priority}
                      </Badge>
                      {task.dueDate && (
                        <div className={`flex items-center space-x-1 text-xs ${
                          isPast(task.dueDate) ? 'text-red-600' : 
                          isToday(task.dueDate) ? 'text-orange-600' : 'text-gray-500'
                        }`}>
                          <Calendar className="h-3 w-3" />
                          <span>{formatDueDate(task.dueDate)}</span>
                        </div>
                      )}
                      {task.childId && (
                        <div className="flex items-center space-x-1 text-xs text-gray-500">
                          <User className="h-3 w-3" />
                          <span>Kaia</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
              
              <Link href="/tasks">
                <Button variant="outline" size="sm" className="w-full mt-2">
                  <CheckSquare className="h-3 w-3 mr-1" />
                  Manage All Tasks
                </Button>
              </Link>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
