
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import Link from 'next/link';
import { LayoutGrid, CalendarCheck, Users, LogOut, BriefcaseMedical, Clock } from 'lucide-react';
import { mockAppointments } from '@/lib/data';
import type { Appointment } from '@/lib/types';
import { format, isSameDay, parseISO } from 'date-fns';
import type { Locale } from 'date-fns';

export default function DoctorDashboardPage() {
  const auth = useAuth();
  const { currentTranslations, language } = useLanguage();
  const T = currentTranslations.doctorDashboard;

  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [appointmentsForSelectedDate, setAppointmentsForSelectedDate] = useState<Appointment[]>([]);
  const [bookedDays, setBookedDays] = useState<Date[]>([]);
  const [dateFnsLocale, setDateFnsLocale] = useState<Locale | undefined>(undefined);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    async function loadLocale() {
      if (!isClient) return;
      try {
        const localeModule = language === 'ar' 
          ? await import('date-fns/locale/ar-SA') 
          : await import('date-fns/locale/en-US');
        setDateFnsLocale(localeModule.default);
      } catch (error) {
        console.error("Failed to load date-fns locale:", error);
        const enLocaleModule = await import('date-fns/locale/en-US'); // Fallback
        setDateFnsLocale(enLocaleModule.default);
      }
    }
    loadLocale();
  }, [language, isClient]);

  useEffect(() => {
    if (!isClient) return;
    // Normalize appointment dates and identify booked days
    const processedAppointments = mockAppointments.map(app => ({
      ...app,
      dateTime: app.dateTime instanceof Date ? app.dateTime : parseISO(app.dateTime as unknown as string)
    }));

    const daysWithAppointments = processedAppointments
      .filter(app => app.status === 'scheduled' || app.status === 'confirmed')
      .map(app => new Date(new Date(app.dateTime).setHours(0, 0, 0, 0)));
      
    setBookedDays([...new Set(daysWithAppointments.map(d => d.getTime()))].map(t => new Date(t)));
  }, [isClient, mockAppointments]); // Re-run if mockAppointments could change externally

  useEffect(() => {
    if (!selectedDate || !isClient) {
      setAppointmentsForSelectedDate([]);
      return;
    }
    const newAppointments = mockAppointments
      .map(app => ({
        ...app,
        dateTime: app.dateTime instanceof Date ? app.dateTime : parseISO(app.dateTime as unknown as string)
      }))
      .filter(app => isSameDay(new Date(app.dateTime), selectedDate) && (app.status === 'scheduled' || app.status === 'confirmed'))
      .sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
    setAppointmentsForSelectedDate(newAppointments);
  }, [selectedDate, isClient, mockAppointments]); // Re-run if mockAppointments could change

  if (auth.isLoading || !isClient || !dateFnsLocale) {
    return <div className="flex justify-center items-center h-64"><p>{T?.loadingDashboard || 'Loading dashboard...'}</p></div>;
  }

  if (!auth.user || auth.user.role !== 'doctor') {
    return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold text-destructive">{currentTranslations.adminDashboard?.accessDeniedTitle || 'Access Denied'}</h1>
        <p className="text-muted-foreground">{currentTranslations.adminDashboard?.accessDeniedDescription || 'You do not have permission to view this page.'}</p>
        <Button asChild className="mt-4">
          <Link href="/login">{currentTranslations.login?.loginTitle || 'Go to Login'}</Link>
        </Button>
      </div>
    );
  }

  const bookedModifier = { booked: bookedDays };
  const bookedStyle = { 
    booked: { 
      fontWeight: 'bold', 
      border: `2px solid hsl(var(--primary))`,
      borderRadius: '0.375rem' 
    } 
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary flex items-center">
            <BriefcaseMedical className="mr-2 h-8 w-8" /> {T?.pageTitle || `Doctor Dashboard - Welcome, ${auth.user.name}!`}
          </CardTitle>
          <CardDescription>{T?.pageDescription || 'Manage your appointments, patient records, and clinic tasks.'}</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <DashboardActionCard
            title={T?.manageAppointmentsTitle || "Manage Appointments"}
            description={T?.manageAppointmentsDescription || "View and update appointment schedules."}
            link="/admin"
            icon={<CalendarCheck className="h-10 w-10 text-primary" />}
          />
          <DashboardActionCard
            title={T?.patientRecordsTitle || "Patient Records"}
            description={T?.patientRecordsDescription || "Access and manage patient information."}
            link="/dashboard/doctor/patient-management" 
            icon={<Users className="h-10 w-10 text-primary" />}
          />
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-2xl text-primary flex items-center">
             <CalendarCheck className="mr-2 h-7 w-7" /> {T?.appointmentCalendarTitle || "Appointment Calendar"}
          </CardTitle>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 gap-8 items-start">
          <div>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              locale={dateFnsLocale}
              modifiers={bookedModifier}
              modifiersStyles={bookedStyle}
            />
          </div>
          <div className="space-y-4">
            {selectedDate && (
              <h3 className="text-lg font-semibold">
                {(T?.appointmentsForDateLabel || 'Appointments for {date}').replace('{date}', format(selectedDate, 'PPP', { locale: dateFnsLocale }))}
              </h3>
            )}
            {appointmentsForSelectedDate.length > 0 ? (
              <ul className="space-y-3">
                {appointmentsForSelectedDate.map(app => (
                  <li key={app.id} className="p-3 border rounded-md shadow-sm bg-card hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-primary">
                          <Clock className="inline mr-2 h-4 w-4" />
                          {format(new Date(app.dateTime), 'p', { locale: dateFnsLocale })}
                        </p>
                        <p><span className="font-medium">{T?.patientLabel || "Patient"}:</span> {app.patientName}</p>
                        {app.reason && <p><span className="font-medium">{T?.reasonLabel || "Reason"}:</span> {app.reason}</p>}
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/patients/${app.patientId}`}>
                          {T?.viewPatientButton || "View Patient"}
                        </Link>
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              selectedDate && <p className="text-muted-foreground">{T?.noAppointmentsForDay || "No appointments scheduled for this day."}</p>
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
         <CardContent className="pt-6"> {/* Adjusted padding top for CardContent */}
            <Button onClick={auth.logout} variant="outline" className="w-full md:w-auto">
                <LogOut className="mr-2 h-5 w-5" /> {currentTranslations.header.logout}
            </Button>
        </CardContent>
      </Card>
    </div>
  );
}

interface DashboardActionCardProps {
  title: string;
  description: string;
  link: string;
  icon: React.ReactNode;
}

function DashboardActionCard({ title, description, link, icon }: DashboardActionCardProps) {
  return (
    <Card className="hover:shadow-xl transition-shadow duration-300 ease-in-out transform hover:-translate-y-1">
      <Link href={link} className="block h-full">
        <CardContent className="flex flex-col items-center text-center p-6">
          <div className="mb-4 p-3 bg-primary/10 rounded-full">{icon}</div>
          <h3 className="font-headline text-xl font-semibold mb-2 text-primary">{title}</h3>
          <p className="text-sm text-foreground/70">{description}</p>
        </CardContent>
      </Link>
    </Card>
  );
}
