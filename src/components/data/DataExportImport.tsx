'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Upload, FileText, CheckCircle, AlertCircle } from 'lucide-react';

interface ExportedData {
  version: string;
  exportedAt: string;
  children: Array<{
    id: string;
    name: string;
    age: number;
    weight: number;
    preferences: string[];
  }>;
  mealPlans: Array<{
    id: string;
    name: string;
    days: any[];
  }>;
  recipes: any[];
  mealLogs: any[];
  growthRecords: any[];
  shoppingLists: any[];
}

interface DataExportProps {
  onExport?: (data: ExportedData) => void;
  onImport?: (data: ExportedData) => void;
}

export function DataExportImport({ onExport, onImport }: DataExportProps) {
  const [exportStatus, setExportStatus] = useState<'idle' | 'exporting' | 'success' | 'error'>('idle');
  const [importStatus, setImportStatus] = useState<'idle' | 'importing' | 'success' | 'error'>('idle');

  const handleExport = async () => {
    try {
      setExportStatus('exporting');

      // Mock data structure - in real app, this would come from actual data
      const exportData = {
        version: '1.0',
        exportedAt: new Date().toISOString(),
        children: [
          {
            id: 'child-1',
            name: 'Aisyah',
            age: 15,
            weight: 10.9,
            preferences: ['halal', 'vegetarian']
          }
        ],
        mealPlans: [
          {
            id: 'plan-1',
            name: 'Meal Plan Minggu 1',
            days: []
          }
        ],
        recipes: [],
        mealLogs: [],
        growthRecords: [],
        shoppingLists: []
      };

      if (onExport) {
        onExport(exportData);
      }

      // Create and download JSON file
      const blob = new Blob([JSON.stringify(exportData, null, 2)], {
        type: 'application/json'
      });

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `parenting-meal-planner-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setExportStatus('success');
      setTimeout(() => setExportStatus('idle'), 3000);
    } catch (error) {
      console.error('Export failed:', error);
      setExportStatus('error');
      setTimeout(() => setExportStatus('idle'), 3000);
    }
  };

  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setImportStatus('importing');

      const text = await file.text();
      const importData = JSON.parse(text);

      // Basic validation
      if (!importData.version || !importData.children) {
        throw new Error('Invalid file format');
      }

      if (onImport) {
        onImport(importData);
      }

      setImportStatus('success');
      setTimeout(() => setImportStatus('idle'), 3000);
    } catch (error) {
      console.error('Import failed:', error);
      setImportStatus('error');
      setTimeout(() => setImportStatus('idle'), 3000);
    }

    // Reset file input
    event.target.value = '';
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Backup & Restore Data
        </CardTitle>
        <CardDescription>
          Export data Anda untuk backup atau import dari device lain
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Export Section */}
        <div className="space-y-3">
          <h4 className="font-medium text-gray-900">Export Data</h4>
          <p className="text-sm text-gray-600">
            Download semua data aplikasi Anda dalam format JSON untuk backup
          </p>

          <div className="flex items-center gap-3">
            <Button
              onClick={handleExport}
              disabled={exportStatus === 'exporting'}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {exportStatus === 'exporting' ? 'Mengekspor...' :
               exportStatus === 'success' ? 'Berhasil!' :
               exportStatus === 'error' ? 'Gagal' : 'Export Data'}
            </Button>

            {exportStatus === 'success' && (
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Berhasil
              </Badge>
            )}

            {exportStatus === 'error' && (
              <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Gagal
              </Badge>
            )}
          </div>
        </div>

        {/* Import Section */}
        <div className="space-y-3 pt-6 border-t">
          <h4 className="font-medium text-gray-900">Import Data</h4>
          <p className="text-sm text-gray-600">
            Upload file backup untuk memulihkan data Anda
          </p>

          <div className="flex items-center gap-3">
            <div>
              <input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
                id="import-file"
              />
              <label htmlFor="import-file">
                <Button
                  variant="outline"
                  disabled={importStatus === 'importing'}
                  className="flex items-center gap-2 cursor-pointer"
                  asChild
                >
                  <span>
                    <Upload className="h-4 w-4" />
                    {importStatus === 'importing' ? 'Mengimport...' :
                     importStatus === 'success' ? 'Berhasil!' :
                     importStatus === 'error' ? 'Gagal' : 'Import Data'}
                  </span>
                </Button>
              </label>
            </div>

            {importStatus === 'success' && (
              <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Berhasil
              </Badge>
            )}

            {importStatus === 'error' && (
              <Badge className="bg-red-100 text-red-800 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Gagal
              </Badge>
            )}
          </div>
        </div>

        {/* Data Types Info */}
        <div className="pt-6 border-t">
          <h4 className="font-medium text-gray-900 mb-3">Data yang Diekspor:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600">
            <div>• Profil anak & preferensi</div>
            <div>• Meal plans & recipes</div>
            <div>• Meal logs & tracking</div>
            <div>• Growth records</div>
            <div>• Shopping lists</div>
            <div>• Settings & preferences</div>
          </div>
        </div>

        {/* Warning */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm">
              <p className="font-medium text-yellow-800 mb-1">Peringatan</p>
              <p className="text-yellow-700">
                Pastikan file backup dari sumber terpercaya. Import akan menimpa data yang ada.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
