'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface GrowthChartProps {
  data: any[];
  type: 'weight' | 'height' | 'head';
}

export function GrowthChart({ data, type }: GrowthChartProps) {
  const getChartConfig = (type: string) => {
    switch (type) {
      case 'weight':
        return {
          dataKey: 'weight',
          color: '#3b82f6',
          yLabel: 'Berat (kg)',
          formatter: (value: number) => [`${value} kg`, 'Berat Badan'],
        };
      case 'height':
        return {
          dataKey: 'height',
          color: '#10b981',
          yLabel: 'Tinggi (cm)',
          formatter: (value: number) => [`${value} cm`, 'Tinggi Badan'],
        };
      case 'head':
        return {
          dataKey: 'headCircumference',
          color: '#8b5cf6',
          yLabel: 'Lingkar Kepala (cm)',
          formatter: (value: number) => [`${value} cm`, 'Lingkar Kepala'],
        };
      default:
        return {
          dataKey: 'weight',
          color: '#3b82f6',
          yLabel: 'Berat (kg)',
          formatter: (value: number) => [`${value} kg`, 'Berat Badan'],
        };
    }
  };

  const config = getChartConfig(type);

  return (
    <div className="h-80">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="age"
            label={{ value: 'Usia (bulan)', position: 'insideBottom', offset: -5 }}
          />
          <YAxis
            label={{ value: config.yLabel, angle: -90, position: 'insideLeft' }}
          />
          <Tooltip
            formatter={config.formatter}
            labelFormatter={(label) => `Usia: ${label} bulan`}
          />
          <Area
            type="monotone"
            dataKey={config.dataKey}
            stroke={config.color}
            fill={config.color}
            fillOpacity={0.1}
            strokeWidth={3}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
