import dynamic from 'next/dynamic';
import { CardSkeleton } from '@/components/ui/skeleton';

export const TaskWidget = dynamic(
  () => import('./TaskWidget'),
  {
    loading: () => <CardSkeleton />,
    ssr: false,
  }
);
