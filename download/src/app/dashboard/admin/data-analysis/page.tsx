
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import Link from 'next/link';
import { AreaChart, Users, Clock, ClipboardList, TrendingUp, BarChart3 as RevenueIcon, Eye } from 'lucide-react';
import { AppointmentVolumeChart } from '@/components/charts/appointment-volume-chart';
import { PatientDemographicsChart } from '@/components/charts/patient-demographics-chart';
import { PeakBookingTimesChart } from '@/components/charts/peak-booking-times-chart';
import { ServicePopularityDisplay } from '@/components/charts/service-popularity-display';
import { getAppointments, mockPatients, mockClinics } from '@/lib/data';
import type { Appointment, Patient, Clinic } from '@/lib/types';

interface MetricCardProps {
  title: string;
  description?: string;
  icon: React.ReactNode;
  children?: React.ReactNode;
  isLoading?: boolean;
  loadingText?: string;
}

function MetricCard({ title, description, icon, children, isLoading, loadingText }: MetricCardProps) {
  return (
    <Card className="flex flex-col min-h-[380px] shadow-md hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center space-x-4 pb-2">
        {icon}
        <CardTitle className="text-xl font-semibold text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-center items-center">
        {isLoading ? (
          <div className="text-center">
            <svg className="mx-auto h-8 w-8 text-primary animate-spin mb-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="text-sm text-muted-foreground">{loadingText || "Loading data..."}</p>
          </div>
        ) : children ? <div className="w-full h-full flex justify-center items-center">{children}</div> : (description && <p className="text-sm text-muted-foreground text-center px-2">{description}</p>)}
      </CardContent>
    </Card>
  );
}


export default function AdminDataAnalysisPage() {
  const auth = useAuth();
  const { currentTranslations } = useLanguage();
  const T = currentTranslations.adminDataAnalysis; 
  const T_Dashboard = currentTranslations.adminDashboard;
  
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [clinics, setClinics] = useState<Clinic[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true);

  useEffect(() => {
    async function loadData() {
      setIsLoadingData(true);
      try {
        const [apptsData, patientsData, clinicsData] = await Promise.all([
          getAppointments(), // Fetches all appointments
          Promise.resolve(mockPatients), 
          Promise.resolve(mockClinics)   
        ]);
        setAppointments(apptsData);
        setPatients(patientsData);
        setClinics(clinicsData);
      } catch (error) {
        console.error("Failed to load data for analysis page:", error);
        // Optionally set an error state here to display to the user
      } finally {
        setIsLoadingData(false);
      }
    }
    loadData();
  }, []);

  if (auth.isLoading) {
    return <div className="flex justify-center items-center h-64"><p>{T?.loadingPage || 'Loading...'}</p></div>;
  }

  if (!auth.user || auth.user.role !== 'admin') {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold text-destructive">{T_Dashboard?.accessDeniedTitle || 'Access Denied'}</h1>
        <p className="text-muted-foreground">{T_Dashboard?.accessDeniedDescription || 'You do not have permission to view this page.'}</p>
        <Button asChild className="mt-4">
          <Link href="/login">{currentTranslations.login?.loginTitle || 'Go to Login'}</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary flex items-center">
            <RevenueIcon className="mr-2 h-8 w-8" /> {T?.pageTitle || 'Data Analysis & Reporting'}
          </CardTitle>
          <CardDescription>{T?.pageDescription || 'View key metrics, generate reports, and gain insights into clinic operations.'}</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           <MetricCard 
            title={T?.appointmentVolumeTitle || "Appointment Volume"}
            icon={<AreaChart className="h-8 w-8 text-primary/70" />}
            isLoading={isLoadingData}
            loadingText={T.loadingChartData || "Loading chart data..."}
          >
            {!isLoadingData && appointments.length > 0 ? <AppointmentVolumeChart appointments={appointments} /> : !isLoadingData && <p className="text-center text-muted-foreground p-4">{T.noAppointmentDataForChart}</p>}
          </MetricCard>
          
          <MetricCard 
            title={T?.patientDemographicsTitle || "Patient Demographics"}
            icon={<Users className="h-8 w-8 text-primary/70" />}
            isLoading={isLoadingData}
            loadingText={T.loadingPatientData || "Loading patient data..."}
          >
            {!isLoadingData && patients.length > 0 && clinics.length > 0 ? <PatientDemographicsChart patients={patients} clinics={clinics} /> : !isLoadingData && <p className="text-center text-muted-foreground p-4">{T.noPatientDataForChart}</p>}
          </MetricCard>

          <MetricCard 
            title={T?.peakBookingTimesTitle || "Peak Booking Times"}
            icon={<Clock className="h-8 w-8 text-primary/70" />}
            isLoading={isLoadingData}
            loadingText={T.loadingAppointmentData || "Loading appointment data..."}
          >
            {!isLoadingData && appointments.length > 0 ? <PeakBookingTimesChart appointments={appointments} /> : !isLoadingData && <p className="text-center text-muted-foreground p-4">{T.noAppointmentDataForChart}</p>}
          </MetricCard>

          <MetricCard 
            title={T?.servicePopularityTitle || "Service Popularity"}
            icon={<ClipboardList className="h-8 w-8 text-primary/70" />}
            isLoading={isLoadingData}
            loadingText={T.loadingServiceData || "Loading service data..."}
          >
             {!isLoadingData && appointments.length > 0 ? <ServicePopularityDisplay appointments={appointments} /> : !isLoadingData && <p className="text-center text-muted-foreground p-4">{T.noServiceData}</p>}
          </MetricCard>

           <MetricCard 
            title={T?.userActivityLogsTitle || "User Activity Logs"}
            icon={<TrendingUp className="h-8 w-8 text-primary/70" />}
            description={T?.userActivityLogsDetailDesc || "User activity logs are typically sourced from a backend system and would display key actions and access patterns here. This feature is for future integration."}
          />
           <MetricCard 
            title={T?.revenueAnalyticsTitle || "Revenue Analytics"}
            description={T?.revenueAnalyticsDescription || "Insights into financial performance, service revenue, etc. This feature is planned for future integration with financial data systems."}
            icon={<RevenueIcon className="h-8 w-8 text-primary/70" />}
          />
        </CardContent>
      </Card>
    </div>
  );
}
