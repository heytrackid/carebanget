'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Menu, Baby, Calendar, BookOpen, ShoppingCart, User, Sparkles, ClipboardList, TrendingUp, CheckSquare } from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: Baby },
  { name: 'Meal Planner', href: '/meal-planner', icon: Calendar },
  { name: 'AI Recipe', href: '/ai-recipe', icon: Sparkles },
  { name: 'Resep', href: '/recipes', icon: BookOpen },
  { name: 'Task Manager', href: '/tasks', icon: CheckSquare },
  { name: 'Meal Tracker', href: '/meal-tracker', icon: ClipboardList },
  { name: 'Growth Tracker', href: '/growth-tracker', icon: TrendingUp },
  { name: 'Shopping List', href: '/shopping-list', icon: ShoppingCart },
  { name: 'Edukasi', href: '/education', icon: BookOpen },
  { name: 'Profil', href: '/profile', icon: User },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Baby className="h-8 w-8 text-pink-500" />
              <span className="font-bold text-xl text-gray-900">
                Meal Planner
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className="flex items-center space-x-1 text-gray-600 hover:text-pink-600 transition-colors"
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-medium">{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile Navigation */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setIsOpen(false)}
                        className="flex items-center space-x-3 text-gray-600 hover:text-pink-600 transition-colors p-2 rounded-lg hover:bg-gray-50"
                      >
                        <Icon className="h-5 w-5" />
                        <span className="font-medium">{item.name}</span>
                      </Link>
                    );
                  })}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
