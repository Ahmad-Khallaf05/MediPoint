
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer } from '@/components/ui/chart';
import type { Appointment } from '@/lib/types';
import { getHours } from 'date-fns';
import { useLanguage } from '@/hooks/use-language';

interface PeakBookingTimesChartProps {
  appointments: Appointment[];
}

const chartConfig = {
  appointmentCount: {
    label: 'Appointments',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function PeakBookingTimesChart({ appointments }: PeakBookingTimesChartProps) {
  const { currentTranslations, language } = useLanguage();
  const T_AdminAnalysis = currentTranslations.adminDataAnalysis;

  const processDataForChart = () => {
    const hourlyCounts: { [hour: number]: number } = {};
    for (let i = 0; i < 24; i++) {
      hourlyCounts[i] = 0; 
    }

    appointments.forEach(app => {
      if (['completed', 'scheduled', 'confirmed'].includes(app.status)) {
        const appDate = app.dateTime instanceof Date ? app.dateTime : new Date(app.dateTime);
        const hour = getHours(appDate);
        if (hourlyCounts.hasOwnProperty(hour)) {
          hourlyCounts[hour]++;
        }
      }
    });

    const formatHour = (hour: number) => {
      if (language === 'ar') {
        if (hour === 0) return '12 ص';
        if (hour < 12) return `${hour} ص`;
        if (hour === 12) return '12 م';
        return `${hour - 12} م`;
      } else {
        if (hour === 0) return '12 AM';
        if (hour < 12) return `${hour} AM`;
        if (hour === 12) return '12 PM';
        return `${hour - 12} PM`;
      }
    };
    
    return Object.entries(hourlyCounts).map(([hourStr, count]) => {
      const hour = parseInt(hourStr, 10);
      return {
        hour: formatHour(hour),
        appointmentCount: count,
        sortKey: hour, 
      };
    }).sort((a,b) => a.sortKey - b.sortKey);
  };

  const chartData = processDataForChart();

  if (!chartData || chartData.length === 0 || chartData.every(d => d.appointmentCount === 0)) {
    return <p className="text-center text-muted-foreground p-4">{T_AdminAnalysis.noAppointmentDataForChart || "No appointment data available for peak times chart."}</p>;
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 5 }} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis 
            dataKey="hour" 
            tickLine={false} 
            axisLine={false} 
            tickMargin={8} 
          />
          <YAxis allowDecimals={false} />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
          />
          <Legend />
          <Bar dataKey="appointmentCount" fill="var(--color-appointmentCount)" radius={[4, 4, 0, 0]} name={T_AdminAnalysis.peakBookingTimesTitle || "Peak Booking Times"} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
