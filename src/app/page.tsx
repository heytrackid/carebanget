import { redirect } from 'next/navigation';
import { OfflineIndicator, OfflineBanner } from "@/components/ui/offline-indicator";

export default function Home() {
  redirect('/dashboard');
}
