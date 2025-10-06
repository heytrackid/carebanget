'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Menu,
  Calendar,
  BookOpen,
  ShoppingCart,
  User,
  Sparkles,
  ClipboardList,
  TrendingUp,
  ChevronLeft,
  Settings,
  LogOut,
  Bell,
  Home,
  CheckCircle2,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: Home, description: 'Ringkasan aktivitas parenting' },
  { name: 'Rencana Makan', href: '/meal-planner', icon: Calendar, description: 'Buat jadwal makan harian/mingguan' },
  { name: 'AI Resep', href: '/ai-recipe', icon: Sparkles, description: 'Generate resep MPASI dari bahan yang ada' },
  { name: 'Koleksi Resep', href: '/recipes', icon: BookOpen, description: 'Jelajahi resep MPASI' },
  { name: 'Pantau Nutrisi', href: '/meal-tracker', icon: ClipboardList, description: 'Catat dan pantau asupan makan' },
  { name: 'Pelacak Pertumbuhan', href: '/growth-tracker', icon: TrendingUp, description: 'Monitor tinggi dan berat badan' },
  { name: 'To Do List', href: '/tasks', icon: CheckCircle2, description: 'Kelola tugas-tugas parenting' },
  { name: 'Pengeluaran Anak', href: '/expenses', icon: Wallet, description: 'Kelola pengeluaran untuk anak' },
  { name: 'Daftar Belanja', href: '/shopping-list', icon: ShoppingCart, description: 'Belanja bahan makanan otomatis' },
  { name: 'Profil', href: '/profile', icon: User, description: 'Kelola profil keluarga' }
];

interface SidebarProps {
  children: React.ReactNode;
}

export function Sidebar({ children }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(true); // Default collapsed like Supabase
  const [isHovered, setIsHovered] = useState(false);
  const [hoverTimeout, setHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const pathname = usePathname();

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [hoverTimeout]);

  const handleMouseEnter = () => {
    if (hoverTimeout) {
      clearTimeout(hoverTimeout);
      setHoverTimeout(null);
    }
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    const timeout = setTimeout(() => {
      setIsHovered(false);
    }, 300);
    setHoverTimeout(timeout);
  };

  const toggleCollapse = () => {
    if (window.innerWidth >= 1024) {
      setIsCollapsed(!isCollapsed);
    }
  };

  const toggleMobile = () => {
    setIsMobileOpen(!isMobileOpen);
  };

  const isActive = (href: string) => pathname === href;

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
      <div
        className={cn(
          "fixed left-0 top-0 z-50 h-full bg-white border-r border-gray-200 transition-all duration-300 ease-in-out lg:relative lg:translate-x-0 flex flex-col shadow-lg",
          isCollapsed && !isHovered ? "w-16" : "w-64",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <Link href="/dashboard" className="flex items-center">
            {(isCollapsed && !isHovered) ? (
              <img src="/icon.svg" alt="Carebanget" className="h-8 w-8" />
            ) : (
              <img src="/logo.svg" alt="Carebanget" className="h-8 w-8" />
            )}
          </Link>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleCollapse}
            className={cn(
              "h-8 w-8 p-0 hover:bg-gray-100 transition-opacity duration-200",
              (isCollapsed && !isHovered) ? "opacity-0" : "opacity-100"
            )}
          >
            <ChevronLeft className={cn(
              "h-4 w-4 transition-transform duration-200",
              isCollapsed ? "rotate-180" : ""
            )} />
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/avatars/user.jpg" />
              <AvatarFallback className="bg-pink-100 text-pink-600 text-sm">
                IS
              </AvatarFallback>
            </Avatar>
            <div className={cn(
              "flex-1 min-w-0 transition-opacity duration-200",
              (isCollapsed && !isHovered) ? "opacity-0" : "opacity-100"
            )}>
              <p className="text-sm font-medium text-gray-900 truncate">
                Ibu Sari
              </p>
              <p className="text-xs text-gray-500 truncate">
                Aisyah • 15 bulan
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMobileOpen(false)}
                className={cn(
                  "flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 group",
                  active
                    ? "bg-pink-50 text-pink-700 border border-pink-200"
                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100",
                  (isCollapsed && !isHovered) ? "justify-center px-2" : "justify-start"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 transition-colors duration-200",
                  active ? "text-pink-600" : "text-gray-500 group-hover:text-gray-700",
                  (isCollapsed && !isHovered) ? "" : "mr-3"
                )} />
                <span className={cn(
                  "transition-opacity duration-200 truncate",
                  (isCollapsed && !isHovered) ? "opacity-0 w-0" : "opacity-100"
                )}>
                  {item.name}
                </span>
                {(isCollapsed && !isHovered) && (
                  <div className="absolute left-16 ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap z-50">
                    {item.name}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div className="p-2 border-t border-gray-200 space-y-1">
          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full transition-all duration-200 hover:bg-gray-100",
              (isCollapsed && !isHovered) ? "justify-center px-2" : "justify-start"
            )}
          >
            <Bell className={cn(
              "h-4 w-4",
              (isCollapsed && !isHovered) ? "" : "mr-2"
            )} />
            <span className={cn(
              "transition-opacity duration-200",
              (isCollapsed && !isHovered) ? "opacity-0 w-0" : "opacity-100"
            )}>
              Notifikasi
            </span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full transition-all duration-200 hover:bg-gray-100",
              (isCollapsed && !isHovered) ? "justify-center px-2" : "justify-start"
            )}
          >
            <Settings className={cn(
              "h-4 w-4",
              (isCollapsed && !isHovered) ? "" : "mr-2"
            )} />
            <span className={cn(
              "transition-opacity duration-200",
              (isCollapsed && !isHovered) ? "opacity-0 w-0" : "opacity-100"
            )}>
              Pengaturan
            </span>
          </Button>

          <Button
            variant="ghost"
            size="sm"
            className={cn(
              "w-full text-red-600 hover:text-red-700 hover:bg-red-50 transition-all duration-200",
              (isCollapsed && !isHovered) ? "justify-center px-2" : "justify-start"
            )}
          >
            <LogOut className={cn(
              "h-4 w-4",
              (isCollapsed && !isHovered) ? "" : "mr-2"
            )} />
            <span className={cn(
              "transition-opacity duration-200",
              (isCollapsed && !isHovered) ? "opacity-0 w-0" : "opacity-100"
            )}>
              Keluar
            </span>
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
              <img src="/logo.svg" alt="Carebanget" className="h-10 w-10" />
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
