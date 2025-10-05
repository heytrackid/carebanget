import dynamic from 'next/dynamic';
import { ChartSkeleton } from '@/components/ui/skeleton';

export const ExpenseChart = dynamic(
  () => import('./ExpenseChart'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

export const ExpenseAnalytics = dynamic(
  () => import('./ExpenseAnalytics'),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);
