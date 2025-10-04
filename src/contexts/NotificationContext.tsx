'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Task } from '@/types';
import { isToday, isTomorrow, isPast, differenceInMinutes, differenceInHours } from 'date-fns';

export interface NotificationSettings {
  enabled: boolean;
  taskReminders: boolean;
  taskOverdue: boolean;
  dailySummary: boolean;
  reminderTimes: {
    urgent: number; // minutes before deadline
    high: number;   // minutes before deadline
    medium: number; // minutes before deadline
    low: number;    // minutes before deadline
  };
  dailySummaryTime: string; // HH:MM format
  soundEnabled: boolean;
  vibrationEnabled: boolean;
}

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: 'task-reminder' | 'task-overdue' | 'daily-summary' | 'achievement';
  taskId?: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationContextType {
  settings: NotificationSettings;
  notifications: NotificationItem[];
  permission: NotificationPermission;
  unreadCount: number;
  updateSettings: (settings: Partial<NotificationSettings>) => void;
  requestPermission: () => Promise<NotificationPermission>;
  sendNotification: (title: string, options?: NotificationOptions) => Promise<void>;
  markAsRead: (notificationId: string) => void;
  markAllAsRead: () => void;
  clearNotification: (notificationId: string) => void;
  clearAllNotifications: () => void;
  checkTaskNotifications: (tasks: Task[]) => void;
}

const defaultSettings: NotificationSettings = {
  enabled: true,
  taskReminders: true,
  taskOverdue: true,
  dailySummary: true,
  reminderTimes: {
    urgent: 15,  // 15 minutes before
    high: 60,    // 1 hour before
    medium: 240, // 4 hours before
    low: 1440,   // 1 day before
  },
  dailySummaryTime: '08:00',
  soundEnabled: true,
  vibrationEnabled: true,
};

const NotificationContext = createContext<NotificationContextType | null>(null);

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<NotificationSettings>(defaultSettings);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [permission, setPermission] = useState<NotificationPermission>('default');

  // Load settings from localStorage on mount
  useEffect(() => {
    const savedSettings = localStorage.getItem('parenting-notifications');
    if (savedSettings) {
      try {
        const parsed = JSON.parse(savedSettings);
        setSettings({ ...defaultSettings, ...parsed });
      } catch (error) {
        console.error('Failed to parse notification settings:', error);
      }
    }

    const savedNotifications = localStorage.getItem('parenting-notification-items');
    if (savedNotifications) {
      try {
        const parsed = JSON.parse(savedNotifications);
        setNotifications(parsed);
      } catch (error) {
        console.error('Failed to parse notifications:', error);
      }
    }

    // Check current permission
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  // Save settings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('parenting-notifications', JSON.stringify(settings));
  }, [settings]);

  // Save notifications to localStorage
  useEffect(() => {
    localStorage.setItem('parenting-notification-items', JSON.stringify(notifications));
  }, [notifications]);

  // Check permission on mount
  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const updateSettings = (newSettings: Partial<NotificationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const requestPermission = async (): Promise<NotificationPermission> => {
    if (!('Notification' in window)) {
      return 'denied';
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    } catch (error) {
      console.error('Failed to request notification permission:', error);
      return 'denied';
    }
  };

  const sendNotification = async (title: string, options?: NotificationOptions): Promise<void> => {
    if (permission !== 'granted' || !settings.enabled) {
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        silent: !settings.soundEnabled,
        requireInteraction: false,
        ...options,
      });

      // Auto close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      // Handle click
      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      // Play sound if enabled
      if (settings.soundEnabled) {
        // You could add a custom sound here
        // const audio = new Audio('/notification.mp3');
        // audio.play().catch(() => {});
      }

      // Vibration if supported and enabled
      if (settings.vibrationEnabled && 'vibrate' in navigator) {
        navigator.vibrate(200);
      }
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  };

  const addNotificationItem = (item: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const newItem: NotificationItem = {
      ...item,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };

    setNotifications(prev => [newItem, ...prev]);

    // Send browser notification if enabled
    if (settings.enabled) {
      sendNotification(item.title, {
        body: item.message,
        tag: item.type,
        data: { taskId: item.taskId, type: item.type },
      });
    }
  };

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev =>
      prev.map(notif => ({ ...notif, read: true }))
    );
  };

  const clearNotification = (notificationId: string) => {
    setNotifications(prev => prev.filter(notif => notif.id !== notificationId));
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  const checkTaskNotifications = (tasks: Task[]) => {
    if (!settings.enabled || !settings.taskReminders) return;

    const now = new Date();

    tasks.forEach(task => {
      if (!task.dueDate || task.status === 'completed') return;

      const timeUntilDue = differenceInMinutes(task.dueDate, now);
      const isOverdue = isPast(task.dueDate);

      // Check for overdue notifications
      if (isOverdue && settings.taskOverdue) {
        const existingNotification = notifications.find(
          n => n.taskId === task.id && n.type === 'task-overdue' && !n.read
        );

        if (!existingNotification) {
          addNotificationItem({
            title: `Tugas Terlambat: ${task.title}`,
            message: `Tugas "${task.title}" sudah melewati batas waktu yang ditentukan.`,
            type: 'task-overdue',
            taskId: task.id,
            actionUrl: `/tasks?highlight=${task.id}`,
          });
        }
      }
      // Check for reminder notifications
      else if (!isOverdue) {
        const reminderTime = settings.reminderTimes[task.priority] || 60; // default 1 hour
        const shouldRemind = timeUntilDue <= reminderTime && timeUntilDue > 0;

        if (shouldRemind) {
          const existingNotification = notifications.find(
            n => n.taskId === task.id && n.type === 'task-reminder' &&
            differenceInMinutes(now, n.timestamp) < 30 // Don't spam within 30 minutes
          );

          if (!existingNotification) {
            const timeLeft = timeUntilDue < 60
              ? `${timeUntilDue} menit lagi`
              : `${Math.floor(timeUntilDue / 60)} jam lagi`;

            addNotificationItem({
              title: `Pengingat Tugas: ${task.title}`,
              message: `Tugas "${task.title}" akan jatuh tempo dalam ${timeLeft}.`,
              type: 'task-reminder',
              taskId: task.id,
              actionUrl: `/tasks?highlight=${task.id}`,
            });
          }
        }
      }
    });
  };

  // Daily summary check
  useEffect(() => {
    if (!settings.enabled || !settings.dailySummary) return;

    const checkDailySummary = () => {
      const now = new Date();
      const [hours, minutes] = settings.dailySummaryTime.split(':').map(Number);
      const summaryTime = new Date();
      summaryTime.setHours(hours, minutes, 0, 0);

      // Check if it's time for daily summary (within 5 minutes)
      if (Math.abs(differenceInMinutes(now, summaryTime)) <= 5) {
        const todayTasks = notifications.filter(
          n => isToday(n.timestamp) && (n.type === 'task-reminder' || n.type === 'task-overdue')
        );

        if (todayTasks.length > 0) {
          addNotificationItem({
            title: 'Ringkasan Harian Tugas',
            message: `Anda memiliki ${todayTasks.length} notifikasi tugas hari ini. Jaga terus rutinitas parenting Anda!`,
            type: 'daily-summary',
            actionUrl: '/tasks',
          });
        }
      }
    };

    const interval = setInterval(checkDailySummary, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [settings.dailySummary, settings.dailySummaryTime, settings.enabled]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const value: NotificationContextType = {
    settings,
    notifications,
    permission,
    unreadCount,
    updateSettings,
    requestPermission,
    sendNotification,
    markAsRead,
    markAllAsRead,
    clearNotification,
    clearAllNotifications,
    checkTaskNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider');
  }
  return context;
}
