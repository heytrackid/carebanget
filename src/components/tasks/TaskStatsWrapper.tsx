'use client';

import { Suspense, lazy } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo
} from 'lucide-react';

// Lazy load task stats component
const TaskStatsCards = lazy(() => import('./TaskStatsCards'));

interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

interface TaskStatsWrapperProps {
  taskCounts: TaskStats;
}

export function TaskStatsWrapper({ taskCounts }: TaskStatsWrapperProps) {
  return (
    <Suspense fallback={
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="animate-pulse">
                <div className="flex items-center space-x-2">
                  <div className="h-5 w-5 bg-gray-300 rounded"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-16 mb-2"></div>
                    <div className="h-6 bg-gray-300 rounded w-8"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    }>
      <TaskStatsCards taskCounts={taskCounts} />
    </Suspense>
  );
}
