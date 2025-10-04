'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff, Volume2, VolumeX, Monitor, Smartphone } from 'lucide-react';

interface AccessibilitySettings {
  highContrast: boolean;
  largeText: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  reducedMotion: boolean;
}

export function AccessibilityPanel() {
  const [settings, setSettings] = useState<AccessibilitySettings>({
    highContrast: false,
    largeText: false,
    screenReader: false,
    keyboardNavigation: true,
    reducedMotion: false,
  });

  const [isOpen, setIsOpen] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('accessibility-settings');
    if (saved) {
      const parsedSettings = JSON.parse(saved);
      setSettings(parsedSettings);
      applySettings(parsedSettings);
    }
  }, []);

  // Apply settings to document
  const applySettings = (newSettings: AccessibilitySettings) => {
    const root = document.documentElement;

    // High contrast
    if (newSettings.highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }

    // Large text
    if (newSettings.largeText) {
      root.classList.add('large-text');
    } else {
      root.classList.remove('large-text');
    }

    // Reduced motion
    if (newSettings.reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  };

  const updateSetting = (key: keyof AccessibilitySettings, value: boolean) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    applySettings(newSettings);
    localStorage.setItem('accessibility-settings', JSON.stringify(newSettings));
  };

  const resetSettings = () => {
    const defaultSettings: AccessibilitySettings = {
      highContrast: false,
      largeText: false,
      screenReader: false,
      keyboardNavigation: true,
      reducedMotion: false,
    };
    setSettings(defaultSettings);
    applySettings(defaultSettings);
    localStorage.removeItem('accessibility-settings');
  };

  return (
    <>
      {/* Accessibility Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-4 left-4 z-50 rounded-full w-12 h-12 shadow-lg"
        aria-label="Buka pengaturan aksesibilitas"
      >
        <Eye className="h-5 w-5" />
      </Button>

      {/* Accessibility Panel */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 z-50 w-80">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Eye className="h-5 w-5" />
                Aksesibilitas
              </CardTitle>
              <CardDescription>
                Sesuaikan aplikasi untuk kebutuhan Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* High Contrast */}
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="high-contrast" className="text-sm font-medium">
                    Kontras Tinggi
                  </label>
                  <p className="text-xs text-gray-600">Lebih mudah dibaca</p>
                </div>
                <Button
                  variant={settings.highContrast ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting('highContrast', !settings.highContrast)}
                  aria-pressed={settings.highContrast}
                  aria-label={settings.highContrast ? "Nonaktifkan kontras tinggi" : "Aktifkan kontras tinggi"}
                >
                  {settings.highContrast ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                </Button>
              </div>

              {/* Large Text */}
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="large-text" className="text-sm font-medium">
                    Teks Besar
                  </label>
                  <p className="text-xs text-gray-600">Perbesar ukuran teks</p>
                </div>
                <Button
                  variant={settings.largeText ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting('largeText', !settings.largeText)}
                  aria-pressed={settings.largeText}
                  aria-label={settings.largeText ? "Kecilkan teks" : "Perbesar teks"}
                >
                  <Monitor className="h-4 w-4" />
                </Button>
              </div>

              {/* Reduced Motion */}
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="reduced-motion" className="text-sm font-medium">
                    Gerakan Minimal
                  </label>
                  <p className="text-xs text-gray-600">Kurangi animasi</p>
                </div>
                <Button
                  variant={settings.reducedMotion ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting('reducedMotion', !settings.reducedMotion)}
                  aria-pressed={settings.reducedMotion}
                  aria-label={settings.reducedMotion ? "Aktifkan animasi" : "Nonaktifkan animasi"}
                >
                  <VolumeX className="h-4 w-4" />
                </Button>
              </div>

              {/* Keyboard Navigation */}
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="keyboard-nav" className="text-sm font-medium">
                    Navigasi Keyboard
                  </label>
                  <p className="text-xs text-gray-600">Gunakan Tab untuk navigasi</p>
                </div>
                <Button
                  variant={settings.keyboardNavigation ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting('keyboardNavigation', !settings.keyboardNavigation)}
                  aria-pressed={settings.keyboardNavigation}
                  aria-label={settings.keyboardNavigation ? "Nonaktifkan navigasi keyboard" : "Aktifkan navigasi keyboard"}
                >
                  ⌨️
                </Button>
              </div>

              {/* Screen Reader Support */}
              <div className="flex items-center justify-between">
                <div>
                  <label htmlFor="screen-reader" className="text-sm font-medium">
                    Screen Reader
                  </label>
                  <p className="text-xs text-gray-600">Optimasi untuk screen reader</p>
                </div>
                <Button
                  variant={settings.screenReader ? "default" : "outline"}
                  size="sm"
                  onClick={() => updateSetting('screenReader', !settings.screenReader)}
                  aria-pressed={settings.screenReader}
                  aria-label={settings.screenReader ? "Nonaktifkan screen reader" : "Aktifkan screen reader"}
                >
                  <Volume2 className="h-4 w-4" />
                </Button>
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4 border-t">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetSettings}
                  className="flex-1"
                >
                  Reset
                </Button>
                <Button
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  className="flex-1"
                >
                  Tutup
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Skip to main content link */}
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-blue-600 text-white px-4 py-2 rounded z-50"
      >
        Loncat ke konten utama
      </a>
    </>
  );
}

// Hook for screen reader announcements
export function useAnnouncer() {
  const announce = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.style.position = 'absolute';
    announcement.style.left = '-10000px';
    announcement.style.width = '1px';
    announcement.style.height = '1px';
    announcement.style.overflow = 'hidden';

    document.body.appendChild(announcement);
    announcement.textContent = message;

    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  };

  return { announce };
}

// Enhanced button component with better accessibility
export function AccessibleButton({
  children,
  onClick,
  disabled,
  loading,
  ...props
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  loading?: boolean;
} & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <Button
      onClick={onClick}
      disabled={disabled || loading}
      aria-disabled={disabled || loading}
      aria-describedby={loading ? "loading-description" : undefined}
      {...props}
    >
      {loading && (
        <span id="loading-description" className="sr-only">
          Memuat...
        </span>
      )}
      {children}
    </Button>
  );
}

// Accessible card component
export function AccessibleCard({
  title,
  description,
  children,
  ...props
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  return (
    <Card {...props}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent role="region" aria-labelledby="card-title">
        {children}
      </CardContent>
    </Card>
  );
}
