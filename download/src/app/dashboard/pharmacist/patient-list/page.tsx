
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import Link from 'next/link';
import { Users, Eye, Pill } from 'lucide-react';
import { mockPatients } from '@/lib/data';
import type { Patient } from '@/lib/types';
import { format } from 'date-fns';
import { enUS, arSA } from 'date-fns/locale';

export default function PharmacistPatientListPage() {
  const auth = useAuth();
  const { currentTranslations, language } = useLanguage();
  const T = currentTranslations.pharmacistPatientList;
  const dateLocale = language === 'ar' ? arSA : enUS;

  const [patients, setPatients] = useState<Patient[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setPatients(mockPatients); // In a real app, you might filter patients relevant to the pharmacy
  }, []);

  if (!isClient || auth.isLoading) {
    return <div className="flex justify-center items-center h-64"><p>{T?.loadingPage || 'Loading page...'}</p></div>;
  }

  if (!auth.user || auth.user.role !== 'pharmacist') {
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
            <Pill className="mr-2 h-8 w-8" /> {T?.pageTitle || 'Patient List for Pharmacy'}
          </CardTitle>
          <CardDescription>{T?.pageDescription || 'Select a patient to view their shared prescriptions.'}</CardDescription>
        </CardHeader>
        <CardContent>
          {patients.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{T?.tableHeaderName || 'Name'}</TableHead>
                  <TableHead>{T?.tableHeaderDob || 'Date of Birth'}</TableHead>
                  <TableHead>{T?.tableHeaderPhone || 'Phone'}</TableHead>
                  <TableHead>{T?.tableHeaderActions || 'Actions'}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>{patient.name}</TableCell>
                    <TableCell>{format(new Date(patient.dateOfBirth), 'PPP', { locale: dateLocale })}</TableCell>
                    <TableCell>{patient.phone}</TableCell>
                    <TableCell>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/patients/${patient.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          {T?.viewRecordButton || 'View Record'}
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-muted-foreground py-4">{T?.noPatientsFound || 'No patients found.'}</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
