
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/context/language-context';
import { useAuth } from '@/hooks/use-auth';
import { Activity, CalendarCheck, Cpu, LayoutDashboard, Share2, Users, MessageSquare, HeartPulse, BrainCircuit, FileText, LogIn } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link?: string;
  linkLabel?: string;
}

function FeatureCard({ icon, title, description, link, linkLabel }: FeatureCardProps) {
  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 flex flex-col">
      <CardHeader className="flex flex-row items-center space-x-4 pb-3">
        <div className="p-3 bg-primary/10 rounded-full text-primary">{icon}</div>
        <CardTitle className="font-headline text-xl text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground">{description}</p>
      </CardContent>
      {link && linkLabel && (
        <CardContent className="pt-0">
          <Button asChild variant="outline" className="w-full sm:w-auto">
            <Link href={link}>{linkLabel}</Link>
          </Button>
        </CardContent>
      )}
    </Card>
  );
}

export default function HomePage() {
  const { currentTranslations } = useLanguage();
  const T = currentTranslations.home;
  const auth = useAuth();

  return (
    <div className="space-y-12">
      <section className="text-center py-12 bg-gradient-to-br from-primary/5 via-background to-accent/5 rounded-xl shadow-md">
        <h1 className="font-headline text-5xl md:text-6xl font-bold text-primary mb-6 animate-fadeIn">
          {T.welcomeTitle || 'Welcome to MediPoint'}
        </h1>
        <p className="text-xl text-foreground/80 max-w-3xl mx-auto mb-10 animate-fadeIn" style={{ animationDelay: '0.2s' }}>
          {T.welcomeDescription || 'Streamlining healthcare appointments with smart technology and seamless communication.'}
        </p>
        {/* Buttons removed from here */}
      </section>

      <section className="py-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<CalendarCheck className="h-10 w-10" />}
            title={T.featureEasySchedulingTitle || 'Easy Appointment Scheduling'}
            description={T.featureEasySchedulingDescription || 'Patients can easily view available slots and book appointments online in minutes.'}
          />
          <FeatureCard
            icon={<LayoutDashboard className="h-10 w-10" />}
            title={T.featureAdminPanelTitle || 'Admin Management Panel'}
            description={T.featureAdminPanelDescription || 'Clinic staff can efficiently manage schedules, update availabilities, and oversee appointments.'}
          />
          <FeatureCard
            icon={<Cpu className="h-10 w-10" />}
            title={T.featureSmartAssistantTitle || 'Smart Scheduling Assistant'}
            description={T.featureSmartAssistantDescription || 'AI-powered tool to recommend optimal appointment times based on preferences and availability.'}
          />
          <FeatureCard
            icon={<FileText className="h-10 w-10" />}
            title={T.featureHealthRecordsTitle || "Comprehensive Health Records"}
            description={T.featureHealthRecordsDescription || "Access and manage detailed patient profiles, including medical history, prescriptions, and lab results, all in one secure place."}
          />
          <FeatureCard
            icon={<MessageSquare className="h-10 w-10" />}
            title={T.featureWhatsappTitle || 'WhatsApp Notifications'}
            description={T.featureWhatsappDescription || 'Automated WhatsApp messages for confirmations and reminders (integration mock).'}
          />
          <FeatureCard
            icon={<HeartPulse className="h-10 w-10" />}
            title={T.featurePatientInfoTitle || 'Patient Information Hub'}
            description={T.featurePatientInfoDescription || 'Securely manage patient data, including medical history, prescriptions, and X-rays.'}
          />
        </div>
      </section>
      
      <section className="py-10 bg-card rounded-xl shadow-md">
        <CardContent className="grid md:grid-cols-1 gap-8 items-center"> 
            <div>
                <h2 className="font-headline text-4xl font-bold text-primary mb-6">{T.modernCareTitle || "Modern Care, Simplified"}</h2>
                <p className="text-lg text-foreground/80 mb-4">
                    {T.modernCarePara1 || "MediPoint is designed to enhance the patient experience and optimize clinic operations. Our platform is built with cutting-edge technology to ensure reliability, security, and ease of use for both patients and healthcare providers."}
                </p>
                <p className="text-lg text-foreground/80">
                    {T.modernCarePara2 || "Accessible on both desktop and mobile devices, MediPoint offers a comprehensive solution for modern healthcare management."}
                </p>
            </div>
        </CardContent>
      </section>

    </div>
  );
}
