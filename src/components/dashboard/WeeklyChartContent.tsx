'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

interface WeeklyChartContentProps {
  type: 'nutrition' | 'completion';
  data: any[];
  className?: string;
}

export default function WeeklyChartContent({ type, data, className }: WeeklyChartContentProps) {
  if (type === 'nutrition') {
    return (
      <div className={className}>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip
              formatter={(value, name) => [
                `${value}${name === 'calories' ? ' kcal' : 'g'}`,
                name === 'calories' ? 'Kalori' :
                name === 'protein' ? 'Protein' :
                name === 'carbs' ? 'Karbohidrat' : 'Lemak'
              ]}
            />
            <Line type="monotone" dataKey="calories" stroke="#3b82f6" strokeWidth={2} />
            <Line type="monotone" dataKey="protein" stroke="#10b981" strokeWidth={2} />
            <Line type="monotone" dataKey="carbs" stroke="#f59e0b" strokeWidth={2} />
            <Line type="monotone" dataKey="fat" stroke="#ef4444" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (type === 'completion') {
    return (
      <div className={className}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip formatter={(value) => [`${value}%`, 'Completion']} />
            <Bar dataKey="breakfast" stackId="a" fill="#fbbf24" />
            <Bar dataKey="lunch" stackId="a" fill="#34d399" />
            <Bar dataKey="dinner" stackId="a" fill="#60a5fa" />
            <Bar dataKey="snack" stackId="a" fill="#a78bfa" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  return null;
}
