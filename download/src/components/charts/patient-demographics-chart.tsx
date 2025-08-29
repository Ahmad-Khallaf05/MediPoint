
'use client';

import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';
import { ChartContainer } from '@/components/ui/chart';
import type { Patient, Clinic } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';

interface PatientDemographicsChartProps {
  patients: Patient[];
  clinics: Clinic[];
}

const chartConfig = {
  patientCount: {
    label: 'Patients',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

export function PatientDemographicsChart({ patients, clinics }: PatientDemographicsChartProps) {
  const { currentTranslations } = useLanguage();
  const T_AdminAnalysis = currentTranslations.adminDataAnalysis;

  const processDataForChart = () => {
    const clinicPatientCounts: { [clinicId: string]: number } = {};
    clinics.forEach(clinic => {
      clinicPatientCounts[clinic.id] = 0;
    });

    patients.forEach(patient => {
      if (patient.registeredClinicId && clinicPatientCounts.hasOwnProperty(patient.registeredClinicId)) {
        clinicPatientCounts[patient.registeredClinicId]++;
      }
    });

    return clinics.map(clinic => ({
      clinicName: clinic.name,
      patientCount: clinicPatientCounts[clinic.id] || 0,
    })).sort((a,b) => b.patientCount - a.patientCount); // Sort for better readability
  };

  const chartData = processDataForChart();

  if (!chartData || chartData.length === 0 || chartData.every(d => d.patientCount === 0)) {
    return <p className="text-center text-muted-foreground p-4">{T_AdminAnalysis.noPatientDataForChart || "No patient data available for demographics chart."}</p>;
  }

  return (
    <ChartContainer config={chartConfig} className="min-h-[200px] w-full">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} layout="vertical" margin={{ top: 5, right: 20, left: 30, bottom: 5 }} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" allowDecimals={false} />
          <YAxis 
            dataKey="clinicName" 
            type="category" 
            tickLine={false} 
            axisLine={false} 
            tickMargin={8}
            width={120} // Adjusted width for potentially longer clinic names
            interval={0}
          />
          <Tooltip
            cursor={{ fill: 'hsl(var(--muted))' }}
            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
          />
          <Legend />
          <Bar dataKey="patientCount" fill="var(--color-patientCount)" radius={[0, 4, 4, 0]} name={T_AdminAnalysis.patientDemographicsTitle || "Patient Demographics"} />
        </BarChart>
      </ResponsiveContainer>
    </ChartContainer>
  );
}
