'use client';

import { Card, CardContent } from '@/components/ui/card';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  ListTodo
} from 'lucide-react';

interface TaskStats {
  total: number;
  todo: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

interface TaskStatsCardsProps {
  taskCounts: TaskStats;
}

export default function TaskStatsCards({ taskCounts }: TaskStatsCardsProps) {
  return (
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
  );
}
