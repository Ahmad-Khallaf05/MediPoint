
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/use-auth';
import { useLanguage } from '@/hooks/use-language';
import Link from 'next/link';
import { Settings, Save } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';


interface SystemSettings {
  clinicName: string;
  defaultAppointmentDuration: number;
  enableWhatsAppNotifications: boolean;
  adminEmail: string;
}

export default function SystemSettingsPage() {
  const auth = useAuth();
  const { currentTranslations } = useLanguage();
  const T = currentTranslations.adminSystemSettings;
  const { toast } = useToast();

  const [settings, setSettings] = useState<SystemSettings>({
    clinicName: 'MediPoint Clinic',
    defaultAppointmentDuration: 30,
    enableWhatsAppNotifications: true,
    adminEmail: 'admin@medipoint.com'
  });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    // In a real app, load settings from a backend/database here
  }, []);

  const handleInputChange = (field: keyof SystemSettings, value: string | number | boolean) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveSettings = () => {
    // In a real app, save settings to a backend/database here
    console.log("Saving settings:", settings);
    toast({
      title: T.toastSettingsSavedTitle,
      description: T.toastSettingsSavedDescription,
      className: 'bg-accent text-accent-foreground'
    });
  };

  if (!isClient || auth.isLoading) {
    return <div className="flex justify-center items-center h-64"><p>{T?.loadingPage || 'Loading page...'}</p></div>;
  }

  if (!auth.user || auth.user.role !== 'admin') {
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
            <Settings className="mr-2 h-8 w-8" /> {T?.pageTitle || 'System Settings'}
          </CardTitle>
          <CardDescription>{T?.pageDescription || 'Configure overall application settings and integrations.'}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-secondary-foreground">{T.generalSettingsTitle || 'General Settings'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <Label htmlFor="clinicName">{T.clinicNameLabel || 'Clinic Name'}</Label>
                <Input 
                  id="clinicName" 
                  value={settings.clinicName} 
                  onChange={(e) => handleInputChange('clinicName', e.target.value)}
                  placeholder={T.clinicNamePlaceholder || 'Enter clinic name'}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <Label htmlFor="adminEmail">{T.adminEmailLabel || 'Admin Contact Email'}</Label>
                <Input 
                  id="adminEmail" 
                  type="email"
                  value={settings.adminEmail} 
                  onChange={(e) => handleInputChange('adminEmail', e.target.value)}
                  placeholder={T.adminEmailPlaceholder || 'Enter admin email'}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-secondary-foreground">{T.appointmentSettingsTitle || 'Appointment Settings'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                <Label htmlFor="defaultDuration">{T.defaultDurationLabel || 'Default Appointment Duration (minutes)'}</Label>
                <Input 
                  id="defaultDuration" 
                  type="number"
                  value={settings.defaultAppointmentDuration} 
                  onChange={(e) => handleInputChange('defaultAppointmentDuration', parseInt(e.target.value) || 30)}
                  min="5"
                />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl text-secondary-foreground">{T.notificationSettingsTitle || 'Notification Settings'}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="whatsappNotifications" 
                  checked={settings.enableWhatsAppNotifications}
                  onCheckedChange={(checked) => handleInputChange('enableWhatsAppNotifications', checked)}
                />
                <Label htmlFor="whatsappNotifications">{T.enableWhatsappLabel || 'Enable WhatsApp Notifications (Mock)'}</Label>
              </div>
               <p className="text-xs text-muted-foreground">{T.whatsappHint || 'WhatsApp integration is currently mocked.'}</p>
            </CardContent>
          </Card>

        </CardContent>
        <CardFooter className="border-t pt-6">
          <Button onClick={handleSaveSettings} className="w-full md:w-auto transform hover:scale-105 transition-transform duration-300">
            <Save className="mr-2 h-5 w-5" /> {T.saveSettingsButton || 'Save Settings'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
