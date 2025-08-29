
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn, Phone, KeyRound, UserCircle, Shield, LockKeyhole, UserPlus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useLanguage } from '@/hooks/use-language';
import type { Language } from '@/context/language-context';
import { useAuth, type User, type UserRole } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { mockSystemUsers, mockPatients, addOrUpdatePatient } from '@/lib/data';


type LoginMethod = 'patient' | 'code' | 'register';

export default function LoginPage() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [patientPassword, setPatientPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [accessPassword, setAccessPassword] = useState('');
  const [loginMethod, setLoginMethod] = useState<LoginMethod>('patient');
  const [isClient, setIsClient] = useState(false);

  // Registration form state
  const [regFullName, setRegFullName] = useState('');
  const [regPhoneNumber, setRegPhoneNumber] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');

  const { toast } = useToast();
  const { language, setLanguage, currentTranslations } = useLanguage();
  const T = currentTranslations.login;
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    if (auth.user) {
      if (auth.user.role === 'patient') router.push('/dashboard/patient');
      else if (auth.user.role === 'doctor') router.push('/dashboard/doctor');
      else if (auth.user.role === 'pharmacist') router.push('/dashboard/pharmacist');
      else if (auth.user.role === 'laboratory') router.push('/dashboard/laboratory');
      else if (auth.user.role === 'admin') router.push('/dashboard/admin');
      else router.push('/');
    }
  }, [auth.user, router]);

  useEffect(() => {
    setPhoneNumber('');
    setPatientPassword('');
    setAccessCode('');
    setAccessPassword('');
    setRegFullName('');
    setRegPhoneNumber('');
    setRegPassword('');
    setRegConfirmPassword('');
  }, [language, loginMethod]);


  const handlePatientPasswordLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber || !patientPassword) {
      toast({
        title: T.missingPhoneOrPasswordTitle || 'Missing Information',
        description: T.missingPhoneOrPasswordDescription || 'Please enter both phone number and password.',
        variant: 'destructive',
      });
      return;
    }

    const existingPatient = mockPatients.find(p => p.phone === phoneNumber);

    if (existingPatient && existingPatient.password === patientPassword) {
      const loginUser: User = {
        id: existingPatient.id,
        name: existingPatient.name,
        role: 'patient',
      };
      auth.login(loginUser);
      toast({
        title: T.loginSuccessTitle,
        description: T.loginSuccessDescriptionPatient,
      });
    } else {
      toast({
        title: T.invalidPhoneOrPasswordTitle || 'Login Failed',
        description: T.invalidPhoneOrPasswordDescription || 'Invalid phone number or password.',
        variant: 'destructive',
      });
    }
  };

  const handleCodeLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!accessCode || !accessPassword) {
      toast({
        title: T.missingAccessCodeOrPasswordTitle || 'Missing Credentials',
        description: T.missingAccessCodeOrPasswordDescription || 'Please enter both Access Code and Password.',
        variant: 'destructive',
      });
      return;
    }

    const user = mockSystemUsers.find(
      (u) => u.accessCode?.toLowerCase() === accessCode.toLowerCase()
    );

    if (user && user.accessPassword === accessPassword) {
      let description = T.loginSuccessDescriptionStaff;
      if (user.role === 'doctor') description = T.loginSuccessDescriptionDoctor || 'Redirecting to Doctor Dashboard...';
      else if (user.role === 'pharmacist') description = T.loginSuccessDescriptionPharmacist || 'Redirecting to Pharmacist Dashboard...';
      else if (user.role === 'laboratory') description = T.loginSuccessDescriptionLaboratory || 'Redirecting to Laboratory Dashboard...';
      else if (user.role === 'admin') description = T.loginSuccessDescriptionAdmin || 'Redirecting to Admin Dashboard...';

      auth.login(user);
      toast({
        title: T.loginSuccessTitle,
        description: description,
      });
    } else {
      toast({
        title: T.invalidCredentialsTitle || 'Invalid Credentials',
        description: T.invalidCredentialsDescription || 'The Access Code or Password is incorrect.',
        variant: 'destructive',
      });
    }
  };

  const handlePatientRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regFullName || !regPhoneNumber || !regPassword || !regConfirmPassword) {
      toast({
        title: T.missingRegistrationFieldsTitle,
        description: T.missingRegistrationFieldsDescription,
        variant: 'destructive',
      });
      return;
    }
    if (regPassword !== regConfirmPassword) {
      toast({
        title: T.passwordsDoNotMatchTitle,
        description: T.passwordsDoNotMatchDescription,
        variant: 'destructive',
      });
      return;
    }

    const existingPatientByPhone = mockPatients.find(p => p.phone === regPhoneNumber);
    if (existingPatientByPhone) {
      toast({
        title: T.phoneNumberExistsTitle,
        description: T.phoneNumberExistsDescription,
        variant: 'destructive',
      });
      return;
    }

    try {
      // Create new patient. addOrUpdatePatient will assign a new ID.
      const newPatientRecord = await addOrUpdatePatient(regFullName, regPhoneNumber, undefined, regPassword);

      const loginUser: User = {
        id: newPatientRecord.id,
        name: newPatientRecord.name,
        role: 'patient',
      };
      auth.login(loginUser);
      toast({
        title: T.registrationSuccessTitle,
        description: T.registrationSuccessDescription,
      });
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: T.registrationErrorTitle || "Registration Failed",
        description: T.registrationErrorDescription || "An unexpected error occurred. Please try again.",
        variant: 'destructive',
      });
    }
  };


  if (!isClient || auth.isLoading || auth.user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-150px)] py-12 bg-gradient-to-br from-background via-primary/5 to-accent/5">
      <Card className="w-full max-w-lg shadow-2xl border-primary/20">
        <CardHeader className="text-center">
          <div className="mx-auto bg-primary/10 p-4 rounded-full w-fit mb-4 border border-primary/20">
            <UserCircle className="w-12 h-12 text-primary" />
          </div>
          <CardTitle className="font-headline text-4xl text-primary">{T.loginTitle}</CardTitle>
          <CardDescription className="text-lg">{T.loginDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 p-8">
          <Tabs value={loginMethod} onValueChange={(value) => setLoginMethod(value as LoginMethod)} className="w-full">
            <TabsList className="grid w-full grid-cols-3 h-12 text-base">
              <TabsTrigger value="patient" className="gap-2 h-full">
                <Phone className="h-5 w-5" /> {T.patientLoginTab}
              </TabsTrigger>
              <TabsTrigger value="register" className="gap-2 h-full">
                <UserPlus className="h-5 w-5" /> {T.registerTab || 'Register'}
              </TabsTrigger>
              <TabsTrigger value="code" className="gap-2 h-full">
                <Shield className="h-5 w-5" /> {T.staffLoginTab}
              </TabsTrigger>
            </TabsList>
            <TabsContent value="patient" className="mt-8">
              <form onSubmit={handlePatientPasswordLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="phoneNumber" className="text-base">{T.phoneNumberLabel}</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    placeholder={T.phoneNumberPlaceholder}
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    className="text-lg py-6"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="patientPassword" className="text-base">{T.patientPasswordLabel || 'Password'}</Label>
                  <Input
                    id="patientPassword"
                    type="password"
                    placeholder={T.patientPasswordPlaceholder || 'Enter your password'}
                    value={patientPassword}
                    onChange={(e) => setPatientPassword(e.target.value)}
                    required
                    className="text-lg py-6"
                  />
                </div>
                <p className="text-xs text-muted-foreground">{T.patientLoginHint || "Hint: Use phone '+15551234567' with password 'password123'."}</p>
                <Button type="submit" className="w-full text-xl py-7 transform hover:scale-105 transition-transform duration-300">
                   <LockKeyhole className="mr-2 h-6 w-6" /> {T.patientLoginButton || 'Login'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="register" className="mt-8">
              <form onSubmit={handlePatientRegistration} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="regFullName" className="text-base">{T.fullNameLabelReg || 'Full Name'}</Label>
                  <Input
                    id="regFullName"
                    type="text"
                    placeholder={T.fullNamePlaceholderReg || 'Enter your full name'}
                    value={regFullName}
                    onChange={(e) => setRegFullName(e.target.value)}
                    required
                    className="text-lg py-6"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regPhoneNumber" className="text-base">{T.phoneNumberLabelReg || 'Phone Number'}</Label>
                  <Input
                    id="regPhoneNumber"
                    type="tel"
                    placeholder={T.phoneNumberPlaceholderReg || 'Enter your phone number'}
                    value={regPhoneNumber}
                    onChange={(e) => setRegPhoneNumber(e.target.value)}
                    required
                    className="text-lg py-6"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regPassword" className="text-base">{T.passwordLabelReg || 'Password'}</Label>
                  <Input
                    id="regPassword"
                    type="password"
                    placeholder={T.passwordPlaceholderReg || 'Choose a strong password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    required
                    className="text-lg py-6"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regConfirmPassword" className="text-base">{T.confirmPasswordLabelReg || 'Confirm Password'}</Label>
                  <Input
                    id="regConfirmPassword"
                    type="password"
                    placeholder={T.confirmPasswordPlaceholderReg || 'Re-enter your password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    required
                    className="text-lg py-6"
                  />
                </div>
                <Button type="submit" className="w-full text-xl py-7 transform hover:scale-105 transition-transform duration-300">
                  <UserPlus className="mr-2 h-6 w-6" /> {T.registerButton || 'Register'}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="code" className="mt-8">
              <form onSubmit={handleCodeLogin} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="accessCode" className="text-base">{T.accessCodeLabel}</Label>
                  <Input
                    id="accessCode"
                    type="text"
                    placeholder={T.accessCodePlaceholder}
                    value={accessCode}
                    onChange={(e) => setAccessCode(e.target.value)}
                    required
                    className="text-lg py-6"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="accessPassword" className="text-base">{T.accessPasswordLabel || 'Password'}</Label>
                  <Input
                    id="accessPassword"
                    type="password"
                    placeholder={T.accessPasswordPlaceholder || 'Enter your password'}
                    value={accessPassword}
                    onChange={(e) => setAccessPassword(e.target.value)}
                    required
                    className="text-lg py-6"
                  />
                </div>
                <p className="text-xs text-muted-foreground">{T.accessCodeHint || "Hint: Use codes like DOCTOR123 with password 'password123' or ADMIN123 with 'adminpass'."}</p>
                <Button type="submit" className="w-full text-xl py-7 transform hover:scale-105 transition-transform duration-300">
                  <KeyRound className="mr-2 h-6 w-6" /> {T.loginWithCodeButton}
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

    