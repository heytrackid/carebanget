import dynamic from 'next/dynamic';
import { ChartSkeleton } from '@/components/ui/skeleton';

export const WeeklyChart = dynamic(
  () => import('./WeeklyChart').then(mod => ({ default: mod.WeeklyChart })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);

export const WeeklyChartContent = dynamic(
  () => import('./WeeklyChart').then(mod => ({ default: mod.WeeklyChartContent })),
  {
    loading: () => <ChartSkeleton />,
    ssr: false,
  }
);
