'use client';
import { IconLogo } from '@/components/ui/logo';
import { IconLogo } from '@/components/ui/logo';
import { IconLogo } from '@/components/ui/logo';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Menu,
  Baby,
  Calendar,
  BookOpen,
  ShoppingCart,
  User,
  Sparkles,
  ClipboardList,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Settings,
  LogOut,
  Bell,
  Bot,
  ChevronDown,
  Home,
  CheckCircle2,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationGroups = [
  {
    name: 'Dasar',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Ringkasan aktivitas parenting' },
      { name: 'Asisten AI', href: '/ai-assistant', icon: Bot, description: 'Konsultasi parenting 24/7' }
    ]
  },
  {
    name: 'Perencanaan Makan',
    items: [
      { name: 'Rencana Makan', href: '/meal-planner', icon: Calendar, description: 'Buat jadwal makan harian/mingguan untuk anak' },
      { name: 'AI Resep', href: '/ai-recipe', icon: Sparkles, description: 'Generate resep MPASI dari bahan yang ada' },
      { name: 'Koleksi Resep', href: '/recipes', icon: BookOpen, description: 'Jelajahi semua resep MPASI yang tersedia' },
      { name: 'Pelacak Makan', href: '/meal-tracker', icon: ClipboardList, description: 'Catat dan pantau asupan makan anak' }
    ]
  },
  {
    name: 'Pengembangan Anak',
    items: [
      { name: 'Pelacak Pertumbuhan', href: '/growth-tracker', icon: TrendingUp, description: 'Monitor tinggi dan berat badan anak' },
      { name: 'Edukasi', href: '/education', icon: BookOpen, description: 'Artikel parenting dan tips praktis' }
    ]
  },
  {
    name: 'Pengelolaan',
    items: [
      { name: 'Pengelola Tugas', href: '/tasks', icon: CheckCircle2, description: 'Kelola tugas-tugas parenting' },
      { name: 'Pengeluaran Anak', href: '/expenses', icon: Wallet, description: 'Kelola pengeluaran untuk anak' },
      { name: 'Daftar Belanja', href: '/shopping-list', icon: ShoppingCart, description: 'Belanja bahan makanan otomatis' },
      { name: 'Profil', href: '/profile', icon: User, description: 'Kelola profil keluarga dan preferensi' }
    ]
  },
  {
    name: 'Pengaturan',
    items: [
      { name: 'Pengaturan', href: '/settings', icon: Settings, description: 'Konfigurasi aplikasi dan notifikasi' }
    ]
  }
];

interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    'Dasar': true,
    'Perencanaan Makan': true,
    'Pengembangan Anak': false,
    'Pengelolaan': true,
    'Pengaturan': false
  });
  const pathname = usePathname();

  // Auto-expand group that contains the active item
  useEffect(() => {
    const activeGroup = navigationGroups.find(group =>
      group.items.some(item => pathname === item.href)
    );
    if (activeGroup) {
      setExpandedGroups(prev => ({
        ...prev,
        [activeGroup.name]: true
      }));
    }
  }, [pathname]);

  const toggleCollapse = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const toggleGroup = (groupName: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const isGroupActive = (items: { href: string }[]) => {
    return items.some(item => pathname === item.href);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobile}
        />
      )}

      {/* Sidebar */}
      <div className={cn(
        "fixed left-0 top-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 lg:relative lg:translate-x-0 flex flex-col",
        isCollapsed ? "w-16" : "w-64",
        isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center justify-center mb-4">
            <IconLogo />
          <div className="flex items-center justify-center mb-4">
            <IconLogo />
          </div>
            <IconLogo />
          </div>
          {!isCollapsed && (
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Baby className="h-8 w-8 text-pink-500" />
              <span className="font-bold text-xl text-gray-900">
                Carebanget
              </span>
            </Link>
          )}
          {isCollapsed && (
            <Link href="/dashboard" className="flex items-center justify-center w-full">
              <Baby className="h-8 w-8 text-pink-500" />
            </Link>
          )}
        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/avatars/user.jpg" />
              <AvatarFallback className="bg-pink-100 text-pink-600">
                IS
              </AvatarFallback>
            </Avatar>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  Ibu Sari
                </p>
                <p className="text-xs text-gray-500 truncate">
                  Aisyah • 15 bulan
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {navigationGroups.map((group) => {
            const isGroupExpanded = expandedGroups[group.name];
            const groupIsActive = isGroupActive(group.items);

            return (
              <div key={group.name} className="space-y-1">
                {/* Group Header */}
                {!isCollapsed && (
                  <button
                    onClick={() => toggleGroup(group.name)}
                    className={cn(
                      "w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider hover:bg-gray-100 transition-colors rounded-md",
                      groupIsActive && "text-pink-700 bg-pink-50"
                    )}
                  >
                    <span>{group.name}</span>
                    <ChevronDown
                      className={cn(
                        "h-3 w-3 transition-transform duration-200",
                        isGroupExpanded ? "rotate-180" : ""
                      )}
                    />
                  </button>
                )}

                {/* Group Items */}
                <div
                  className={cn(
                    "space-y-1 overflow-hidden transition-all duration-300 ease-in-out",
                    isGroupExpanded || isCollapsed ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const isActive = pathname === item.href;

                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsMobileOpen(false)}
                        className={cn(
                          "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200",
                          isActive
                            ? "bg-pink-100 text-pink-700 border border-pink-200 shadow-sm"
                            : "text-gray-600 hover:text-gray-900 hover:bg-gray-100 hover:translate-x-1",
                          isCollapsed ? "justify-center" : "justify-start"
                        )}
                      >
                        <Icon className={cn(
                          "h-5 w-5 transition-colors",
                          isActive ? "text-pink-600" : "text-gray-500",
                          isCollapsed ? "" : "mr-3"
                        )} />
                        {!isCollapsed && (
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <span className="truncate">{item.name}</span>
                              {item.name === 'Rencana Makan' && (
                                <span className="text-xs bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full font-medium">
                                  Rencana
                                </span>
                              )}
                              {item.name === 'Koleksi Resep' && (
                                <span className="text-xs bg-green-100 text-green-700 px-1.5 py-0.5 rounded-full font-medium">
                                  Jelajah
                                </span>
                              )}
                            </div>
                            {item.description && !isCollapsed && (
                              <p className="text-xs text-gray-500 mt-0.5 leading-tight">
                                {item.description}
                              </p>
                            )}
                          </div>
                        )}
                        {isCollapsed && (
                          <span className="sr-only">{item.name}</span>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-gray-200 space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full transition-all duration-200 hover:translate-x-1",
              isCollapsed ? "justify-center px-2" : "justify-start"
            )}
          >
            <Bell className={cn("h-4 w-4", isCollapsed ? "" : "mr-2")} />
            {!isCollapsed && "Notifikasi"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full transition-all duration-200 hover:translate-x-1",
              isCollapsed ? "justify-center px-2" : "justify-start"
            )}
          >
            <Settings className={cn("h-4 w-4", isCollapsed ? "" : "mr-2")} />
            {!isCollapsed && "Pengaturan"}
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200 hover:translate-x-1",
              isCollapsed ? "justify-center px-2" : "justify-start"
            )}
          >
            <LogOut className={cn("h-4 w-4", isCollapsed ? "" : "mr-2")} />
            {!isCollapsed && "Keluar"}
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobile}
            >
              <Menu className="h-6 w-6" />
            </Button>
            <Link href="/dashboard" className="flex items-center space-x-2">
              <Baby className="h-6 w-6 text-pink-500" />
              <span className="font-bold text-lg text-gray-900">
                Carebanget
              </span>
            </Link>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </div>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
