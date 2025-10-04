'use client';

import { Sidebar } from '@/components/navigation/Sidebar';
import { NotificationSettings } from '@/components/notifications/NotificationSettings';

export default function SettingsPage() {
  return (
    <Sidebar>
      <div className="max-w-7xl mx-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Pengaturan</h1>
            <p className="text-gray-600 mt-1 text-sm sm:text-base">
              Kelola preferensi dan pengaturan aplikasi Anda
            </p>
          </div>
        </div>

        {/* Settings Content */}
        <div className="space-y-6">
          <NotificationSettings />
        </div>
      </div>
    </Sidebar>
  );
}
