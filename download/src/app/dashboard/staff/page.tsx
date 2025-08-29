
'use client';

// This file is planned for removal as specific roles (doctor, pharmacist, laboratory)
// will have their own dashboards. If a generic staff dashboard is still needed,
// this can be repurposed or kept. For now, login directs to specific role dashboards.

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import Link from 'next/link';
import { LayoutGrid, Users, Share2, Settings, LogOut } from 'lucide-react';


export default function StaffDashboardPage() {
  const auth = useAuth();
  const { currentTranslations } = useLanguage();
  const T = currentTranslations.staffDashboard; 

  if (auth.isLoading) {
    return <div className="flex justify-center items-center h-64"><p>Loading dashboard...</p></div>;
  }

  // This check might need to be updated if 'staff' is no longer a distinct role
  // or if this page becomes a fallback.
  if (!auth.user || !['doctor', 'pharmacist', 'laboratory'].includes(auth.user.role || '')) {
    // A more generic check if this page is kept for other staff types.
    // Or simply redirect if this page is fully deprecated.
     return (
      <div className="text-center py-10">
        <h1 className="text-2xl font-semibold text-destructive">Access Denied</h1>
        <p className="text-muted-foreground">You do not have permission to view this page or your role has a specific dashboard.</p>
        <Button asChild className="mt-4">
          <Link href="/login">Go to Login</Link>
        </Button>
      </div>
    );
  }
  

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary flex items-center">
            <LayoutGrid className="mr-2 h-8 w-8" /> {T?.pageTitle || `Generic Staff Dashboard - Welcome, ${auth.user.name}!`}
          </CardTitle>
          <CardDescription>{T?.pageDescription || 'This is a generic staff dashboard. Specific roles may have different views.'}</CardDescription>
        </CardHeader>
        <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
           <DashboardActionCard
            title={T?.adminPanelTitle || "Admin Panel"}
            description={T?.adminPanelDescription || "Manage appointments and clinic settings."}
            link="/admin"
            icon={<Settings className="h-10 w-10 text-primary" />}
          />
          <DashboardActionCard
            title={T?.patientManagementTitle || "Patient Management"}
            description={T?.patientManagementDescription || "Access and manage patient records."}
            link="/patients/1" 
            icon={<Users className="h-10 w-10 text-primary" />}
          />
          <DashboardActionCard
            title={T?.shareCenterTitle || "Share Center"}
            description={T?.shareCenterDescription || "Share patient data with labs/pharmacies."}
            link="/share"
            icon={<Share2 className="h-10 w-10 text-primary" />}
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
