'use client';

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { NutritionInfo } from '@/types';

interface NutritionChartProps {
  nutrition: NutritionInfo;
  title?: string;
  showDetails?: boolean;
}

export function NutritionChart({ nutrition, title = "Informasi Nutrisi", showDetails = true }: NutritionChartProps) {
  const macroData = [
    { name: 'Protein', value: nutrition.protein * 4, color: '#10b981' },
    { name: 'Karbohidrat', value: nutrition.carbs * 4, color: '#f59e0b' },
    { name: 'Lemak', value: nutrition.fat * 9, color: '#ef4444' },
  ];

  const detailData = [
    { name: 'Kalori', value: nutrition.calories, unit: 'kcal', color: '#3b82f6' },
    { name: 'Protein', value: nutrition.protein, unit: 'g', color: '#10b981' },
    { name: 'Karbohidrat', value: nutrition.carbs, unit: 'g', color: '#f59e0b' },
    { name: 'Lemak', value: nutrition.fat, unit: 'g', color: '#ef4444' },
    { name: 'Serat', value: nutrition.fiber, unit: 'g', color: '#8b5cf6' },
    { name: 'Gula', value: nutrition.sugar, unit: 'g', color: '#ec4899' },
  ];

  const RADIAN = Math.PI / 180;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCustomizedLabel = (props: any) => {
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        fontSize="12"
        fontWeight="bold"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          {title}
          <Badge variant="outline">{nutrition.calories} kcal</Badge>
        </CardTitle>
        <CardDescription>
          Breakdown nutrisi makro dan mikro per porsi
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart - Macronutrients */}
          <div>
            <h4 className="text-sm font-medium mb-4 text-center">Distribusi Kalori</h4>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={macroData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomizedLabel}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {macroData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number, name: string) => [
                    `${value.toFixed(0)} kcal`, 
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex justify-center gap-4 mt-2">
              {macroData.map((item) => (
                <div key={item.name} className="flex items-center gap-1">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-xs text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bar Chart - All Nutrients */}
          <div>
            <h4 className="text-sm font-medium mb-4 text-center">Detail Nutrisi</h4>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={detailData} layout="horizontal">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={80} fontSize={12} />
                <Tooltip 
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  formatter={(value: number, name: string, props: any) => [
                    `${value} ${props.payload.unit}`, 
                    name
                  ]}
                />
                <Bar dataKey="value" fill="#8884d8">
                  {detailData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {showDetails && (
          <div className="mt-6 pt-6 border-t">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {detailData.map((item) => (
                <div key={item.name} className="text-center p-3 bg-gray-50 rounded-lg">
                  <div 
                    className="text-2xl font-bold mb-1"
                    style={{ color: item.color }}
                  >
                    {item.value}
                  </div>
                  <div className="text-xs text-gray-600">
                    {item.name} ({item.unit})
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
