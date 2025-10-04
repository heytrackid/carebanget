'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Bell,
  BellOff,
  Clock,
  AlertTriangle,
  Calendar,
  Volume2,
  VolumeX,
  Smartphone,
  Settings as SettingsIcon
} from 'lucide-react';
import { useNotifications } from '@/contexts/NotificationContext';

export function NotificationSettings() {
  const { settings, updateSettings, requestPermission, permission } = useNotifications();
  const [localSettings, setLocalSettings] = useState(settings);

  const handleSave = () => {
    updateSettings(localSettings);
  };

  const handleRequestPermission = async () => {
    const result = await requestPermission();
    if (result === 'granted') {
      // You could show a success message here
    }
  };

  const updateLocalSetting = (key: string, value: any) => {
    setLocalSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const updateReminderTime = (priority: keyof typeof settings.reminderTimes, value: number) => {
    setLocalSettings(prev => ({
      ...prev,
      reminderTimes: {
        ...prev.reminderTimes,
        [priority]: value
      }
    }));
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Pengaturan Notifikasi
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Permission Status */}
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-3">
            {permission === 'granted' ? (
              <Bell className="h-5 w-5 text-green-600" />
            ) : permission === 'denied' ? (
              <BellOff className="h-5 w-5 text-red-600" />
            ) : (
              <Bell className="h-5 w-5 text-yellow-600" />
            )}
            <div>
              <p className="font-medium">
                Izin Browser Notifikasi
              </p>
              <p className="text-sm text-gray-600">
                {permission === 'granted' ? 'Diizinkan' :
                 permission === 'denied' ? 'Ditolak' : 'Belum diminta'}
              </p>
            </div>
          </div>
          {permission !== 'granted' && (
            <Button onClick={handleRequestPermission} variant="outline">
              Izinkan Notifikasi
            </Button>
          )}
        </div>

        {/* Main Settings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="h-5 w-5" />
              <div>
                <Label htmlFor="enabled" className="font-medium">Aktifkan Notifikasi</Label>
                <p className="text-sm text-gray-600">Nyalakan notifikasi untuk semua fitur</p>
              </div>
            </div>
            <Checkbox
              id="enabled"
              checked={localSettings.enabled}
              onCheckedChange={(checked: boolean) => updateLocalSetting('enabled', checked)}
            />
          </div>

          <Separator />

          {/* Task Notifications */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Notifikasi Tugas
            </h4>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="task-reminders" className="font-medium">Pengingat Tugas</Label>
                <p className="text-sm text-gray-600">Ingatkan sebelum deadline</p>
              </div>
              <Checkbox
                id="task-reminders"
                checked={localSettings.taskReminders}
                onCheckedChange={(checked: boolean) => updateLocalSetting('taskReminders', checked)}
                disabled={!localSettings.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="task-overdue" className="font-medium">Tugas Terlambat</Label>
                <p className="text-sm text-gray-600">Beritahu saat tugas melewati deadline</p>
              </div>
              <Checkbox
                id="task-overdue"
                checked={localSettings.taskOverdue}
                onCheckedChange={(checked: boolean) => updateLocalSetting('taskOverdue', checked)}
                disabled={!localSettings.enabled}
              />
            </div>
          </div>

          <Separator />

          {/* Reminder Times */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Waktu Pengingat
            </h4>
            <p className="text-sm text-gray-600">Berapa menit sebelum deadline tugas diingatkan</p>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="urgent-time" className="text-sm">Mendesak</Label>
                <Input
                  id="urgent-time"
                  type="number"
                  value={localSettings.reminderTimes.urgent}
                  onChange={(e) => updateReminderTime('urgent', parseInt(e.target.value) || 15)}
                  disabled={!localSettings.enabled || !localSettings.taskReminders}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">menit sebelum deadline</p>
              </div>

              <div>
                <Label htmlFor="high-time" className="text-sm">Tinggi</Label>
                <Input
                  id="high-time"
                  type="number"
                  value={localSettings.reminderTimes.high}
                  onChange={(e) => updateReminderTime('high', parseInt(e.target.value) || 60)}
                  disabled={!localSettings.enabled || !localSettings.taskReminders}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">menit sebelum deadline</p>
              </div>

              <div>
                <Label htmlFor="medium-time" className="text-sm">Sedang</Label>
                <Input
                  id="medium-time"
                  type="number"
                  value={localSettings.reminderTimes.medium}
                  onChange={(e) => updateReminderTime('medium', parseInt(e.target.value) || 240)}
                  disabled={!localSettings.enabled || !localSettings.taskReminders}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">menit sebelum deadline</p>
              </div>

              <div>
                <Label htmlFor="low-time" className="text-sm">Rendah</Label>
                <Input
                  id="low-time"
                  type="number"
                  value={localSettings.reminderTimes.low}
                  onChange={(e) => updateReminderTime('low', parseInt(e.target.value) || 1440)}
                  disabled={!localSettings.enabled || !localSettings.taskReminders}
                  className="mt-1"
                />
                <p className="text-xs text-gray-500 mt-1">menit sebelum deadline</p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Daily Summary */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="daily-summary" className="font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Ringkasan Harian
                </Label>
                <p className="text-sm text-gray-600">Notifikasi summary tugas setiap hari</p>
              </div>
              <Checkbox
                id="daily-summary"
                checked={localSettings.dailySummary}
                onCheckedChange={(checked: boolean) => updateLocalSetting('dailySummary', checked)}
                disabled={!localSettings.enabled}
              />
            </div>

            <div>
              <Label htmlFor="summary-time" className="text-sm">Waktu Ringkasan Harian</Label>
              <Input
                id="summary-time"
                type="time"
                value={localSettings.dailySummaryTime}
                onChange={(e) => updateLocalSetting('dailySummaryTime', e.target.value)}
                disabled={!localSettings.enabled || !localSettings.dailySummary}
                className="mt-1"
              />
            </div>
          </div>

          <Separator />

          {/* Audio & Vibration */}
          <div className="space-y-3">
            <h4 className="font-medium">Audio & Getaran</h4>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {localSettings.soundEnabled ? (
                  <Volume2 className="h-4 w-4" />
                ) : (
                  <VolumeX className="h-4 w-4" />
                )}
                <Label htmlFor="sound" className="font-medium">Suara Notifikasi</Label>
              </div>
              <Checkbox
                id="sound"
                checked={localSettings.soundEnabled}
                onCheckedChange={(checked: boolean) => updateLocalSetting('soundEnabled', checked)}
                disabled={!localSettings.enabled}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Smartphone className="h-4 w-4" />
                <Label htmlFor="vibration" className="font-medium">Getaran</Label>
              </div>
              <Checkbox
                id="vibration"
                checked={localSettings.vibrationEnabled}
                onCheckedChange={(checked: boolean) => updateLocalSetting('vibrationEnabled', checked)}
                disabled={!localSettings.enabled}
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex justify-end pt-4">
          <Button onClick={handleSave} className="flex items-center gap-2">
            <SettingsIcon className="h-4 w-4" />
            Simpan Pengaturan
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
