'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import {
  Bell,
  BellRing,
  AlertTriangle,
  Calendar,
  CheckCircle2,
  Clock,
  X,
  MoreVertical,
  Trash2,
  Settings
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useNotifications } from '@/contexts/NotificationContext';
import { formatDistanceToNow } from 'date-fns';
import { id } from 'date-fns/locale';

export function NotificationPanel() {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    permission
  } = useNotifications();

  const [isOpen, setIsOpen] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'task-reminder':
        return <Clock className="h-4 w-4 text-blue-600" />;
      case 'task-overdue':
        return <AlertTriangle className="h-4 w-4 text-red-600" />;
      case 'daily-summary':
        return <Calendar className="h-4 w-4 text-green-600" />;
      case 'achievement':
        return <CheckCircle2 className="h-4 w-4 text-yellow-600" />;
      default:
        return <Bell className="h-4 w-4 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'task-reminder':
        return 'border-blue-200 bg-blue-50';
      case 'task-overdue':
        return 'border-red-200 bg-red-50';
      case 'daily-summary':
        return 'border-green-200 bg-green-50';
      case 'achievement':
        return 'border-yellow-200 bg-yellow-50';
      default:
        return 'border-gray-200 bg-gray-50';
    }
  };

  if (permission !== 'granted') {
    return (
      <div className="fixed top-4 right-4 z-40">
        <Card className="p-3 shadow-lg bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-2 text-sm">
            <BellRing className="h-4 w-4 text-yellow-600" />
            <span className="text-yellow-800">Aktifkan notifikasi untuk pengingat tugas</span>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 z-40">
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="icon" className="relative">
            <Bell className="h-4 w-4" />
            {unreadCount > 0 && (
              <Badge
                variant="destructive"
                className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs"
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="w-80 p-0" side="bottom">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifikasi</h3>
              <div className="flex items-center gap-2">
                {unreadCount > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={markAllAsRead}
                    className="text-xs h-7"
                  >
                    Tandai Semua Dibaca
                  </Button>
                )}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={clearAllNotifications}>
                      <Trash2 className="h-3 w-3 mr-2" />
                      Hapus Semua
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => window.location.href = '/settings'}>
                      <Settings className="h-3 w-3 mr-2" />
                      Pengaturan Notifikasi
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
            {unreadCount > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                {unreadCount} notifikasi belum dibaca
              </p>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Belum ada notifikasi</p>
              </div>
            ) : (
              <div className="divide-y">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      !notification.read ? getNotificationColor(notification.type) : ''
                    }`}
                    onClick={() => {
                      markAsRead(notification.id);
                      if (notification.actionUrl) {
                        window.location.href = notification.actionUrl;
                      }
                    }}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-0.5">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className={`text-sm font-medium truncate ${
                            !notification.read ? 'text-gray-900' : 'text-gray-600'
                          }`}>
                            {notification.title}
                          </p>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-600 rounded-full flex-shrink-0"></div>
                          )}
                        </div>
                        <p className={`text-sm ${
                          !notification.read ? 'text-gray-700' : 'text-gray-600'
                        }`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDistanceToNow(notification.timestamp, {
                            addSuffix: true,
                            locale: id
                          })}
                        </p>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => {
                          e.stopPropagation();
                          clearNotification(notification.id);
                        }}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t bg-gray-50">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllNotifications}
                className="w-full text-xs"
              >
                Hapus Semua Notifikasi
              </Button>
            </div>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
