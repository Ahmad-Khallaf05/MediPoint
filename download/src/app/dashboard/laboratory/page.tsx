
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import Link from 'next/link';
import { Beaker, LogOut, Users } from 'lucide-react'; // Replaced FileSpreadsheet/Image with Users

export default function LaboratoryDashboardPage() {
  const auth = useAuth();
  const { currentTranslations } = useLanguage();
  const T = currentTranslations.laboratoryDashboard;
  
  if (auth.isLoading) {
    return <div className="flex justify-center items-center h-64"><p>{T?.loadingDashboard || 'Loading dashboard...'}</p></div>;
  }

  if (!auth.user || auth.user.role !== 'laboratory') {
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

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary flex items-center">
            <Beaker className="mr-2 h-8 w-8" /> {T?.pageTitle || `Laboratory Dashboard - Welcome, ${auth.user.name}!`}
          </CardTitle>
          <CardDescription>{T?.pageDescription || 'Manage lab tests, results, and related tasks.'}</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-1 gap-6">
           <DashboardActionCard
            title={T?.viewPatientRecordsTitle || "View Patient Records"}
            description={T?.viewPatientRecordsDescription || "Access patient files to view shared X-Rays and imaging."}
            link="/dashboard/laboratory/patient-list"
            icon={<Users className="h-10 w-10 text-primary" />}
          />
        </CardContent>
         <CardContent>
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
