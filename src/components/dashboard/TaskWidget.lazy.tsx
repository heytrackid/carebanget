import dynamic from 'next/dynamic';
import { CardSkeleton } from '@/components/ui/skeleton';

export const TaskWidget = dynamic(
  () => import('./TaskWidget').then(mod => ({ default: mod.TaskWidget })),
  {
    loading: () => <CardSkeleton />,
    ssr: false,
  }
);
