
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import type { Appointment } from '@/lib/types';
import { format, subMonths, getMonth, getYear } from 'date-fns';
import { useLanguage } from '@/hooks/use-language';

interface AppointmentVolumeChartProps {
  appointments: Appointment[];
}

const chartConfig = {
  appointments: {
    label: 'Appointments',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

export function AppointmentVolumeChart({ appointments }: AppointmentVolumeChartProps) {
  const { currentTranslations, language } = useLanguage();
  const T = currentTranslations.adminDataAnalysis;

  const processDataForChart = () => {
    const today = new Date();
    const monthNames = language === 'ar' 
      ? ["يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو", "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر"]
      : ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const monthlyData: { [key: string]: { month: string; yearMonth: string; appointments: number } } = {};

    // Initialize last 3 months + current month
    for (let i = 3; i >= 0; i--) {
      const monthDate = subMonths(today, i);
      const monthKey = format(monthDate, 'yyyy-MM');
      const displayMonth = `${monthNames[getMonth(monthDate)]} ${getYear(monthDate)}`;
      monthlyData[monthKey] = { month: displayMonth, yearMonth: monthKey, appointments: 0 };
    }
    
    appointments.forEach(app => {
      // Consider 'completed', 'scheduled', 'confirmed' appointments for volume
      if (['completed', 'scheduled', 'confirmed'].includes(app.status)) {
        const appDate = app.dateTime instanceof Date ? app.dateTime : new Date(app.dateTime);
        const monthKey = format(appDate, 'yyyy-MM');
        if (monthlyData[monthKey]) {
          monthlyData[monthKey].appointments += 1;
        }
      }
    });

    return Object.values(monthlyData).sort((a,b) => a.yearMonth.localeCompare(b.yearMonth));
  };

  const chartData = processDataForChart();

  if (!chartData || chartData.length === 0) {
    return <p>{T.noAppointmentDataForChart || "No appointment data available for the chart."}</p>;
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false}/>
          <XAxis 
            dataKey="month" 
            tickLine={false} 
            axisLine={false} 
            tickMargin={8} 
            />
          <YAxis 
            tickLine={false} 
            axisLine={false} 
            tickMargin={8}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
          />
          <Legend />
          <Bar dataKey="appointments" fill="var(--color-appointments)" radius={4} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
