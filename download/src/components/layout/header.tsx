
'use client';

import Link from 'next/link';
import { Logo } from '@/components/icons/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Menu, LogIn, LogOut, LayoutDashboard, BriefcaseMedical, Pill, Beaker, UserCog, Users, CalendarDays, BrainCircuit, Globe } from 'lucide-react';
import { useLanguage, type Language } from '@/context/language-context';
import { useAuth } from '@/hooks/use-auth';
import { usePathname } from 'next/navigation';

export function Header() {
  const { language, setLanguage, currentTranslations, dir } = useLanguage();
  const T = currentTranslations.header;
  const auth = useAuth();
  const pathname = usePathname();

  type NavItem = {
    href: string;
    labelKey: keyof typeof T;
    icon?: React.ReactNode;
  };

  const baseNavItems: NavItem[] = []; 

  const loggedInGeneralNavItems: NavItem[] = [
    { href: '/appointments', labelKey: 'appointments' as keyof typeof T, icon: <CalendarDays className="mr-2 h-4 w-4" /> },
    { href: '/smart-scheduler', labelKey: 'smartScheduler' as keyof typeof T, icon: <BrainCircuit className="mr-2 h-4 w-4" /> },
  ];

  const patientNavItems: NavItem[] = [
    { href: '/dashboard/patient', labelKey: 'patientDashboard' as keyof typeof T, icon: <LayoutDashboard className="mr-2 h-4 w-4" /> },
  ];

  const doctorNavItems: NavItem[] = [
    { href: '/dashboard/doctor', labelKey: 'doctorDashboard' as keyof typeof T, icon: <BriefcaseMedical className="mr-2 h-4 w-4" /> },
    { href: '/admin', labelKey: 'adminPanel' as keyof typeof T },
    { href: '/dashboard/doctor/patient-management', labelKey: 'patientManagement' as keyof typeof T, icon: <Users className="mr-2 h-4 w-4"/> },
  ];

  const pharmacistNavItems: NavItem[] = [
     { href: '/dashboard/pharmacist', labelKey: 'pharmacistDashboard' as keyof typeof T, icon: <Pill className="mr-2 h-4 w-4" /> },
     { href: '/dashboard/pharmacist/patient-list', labelKey: 'patientRecordsPharmacist' as keyof typeof T, icon: <Users className="mr-2 h-4 w-4" /> },
  ];

  const laboratoryNavItems: NavItem[] = [
     { href: '/dashboard/laboratory', labelKey: 'laboratoryDashboard' as keyof typeof T, icon: <Beaker className="mr-2 h-4 w-4" /> },
     { href: '/dashboard/laboratory/patient-list', labelKey: 'patientRecordsLaboratory' as keyof typeof T, icon: <Users className="mr-2 h-4 w-4" /> },
  ];

  const adminNavItems: NavItem[] = [
     { href: '/dashboard/admin', labelKey: 'adminManagementDashboard' as keyof typeof T, icon: <UserCog className="mr-2 h-4 w-4" /> },
  ];

  let navItems: NavItem[] = [...baseNavItems];

  if (auth.user) {
    if (!(auth.user.role === 'admin' && pathname.startsWith('/dashboard/admin'))) {
        navItems.push(...loggedInGeneralNavItems);
    }
     
    if (auth.user.role === 'patient') {
      navItems.push(...patientNavItems);
    } else if (auth.user.role === 'doctor') {
      navItems.push(...doctorNavItems);
    } else if (auth.user.role === 'pharmacist') {
      navItems.push(...pharmacistNavItems);
    } else if (auth.user.role === 'laboratory') {
      navItems.push(...laboratoryNavItems);
    } else if (auth.user.role === 'admin') {
      navItems.push(...adminNavItems);
    }
  }

  const showHeaderLoginButton = !auth.user;


  const AuthButton = () => (
    auth.user ? (
      <Button variant="outline" onClick={auth.logout} className="ml-2">
        <LogOut className="mr-2 h-4 w-4" />
        {T.logout} {auth.user.name ? `(${auth.user.name.split(' ')[0]})` : ''}
      </Button>
    ) : showHeaderLoginButton ? ( 
      <Button variant="outline" asChild className="ml-2">
        <Link href="/login">
          <LogIn className="mr-2 h-4 w-4" />
          {T.login}
        </Link>
      </Button>
    ) : null
  );

  const AuthButtonMobile = () => (
     auth.user ? (
      <Button variant="outline" onClick={auth.logout} className="w-full justify-start text-lg">
        <LogOut className="mr-2 h-5 w-5" />
         {T.logout} {auth.user.name ? `(${auth.user.name.split(' ')[0]})` : ''}
      </Button>
    ) : ( 
      <Button variant="outline" className="w-full justify-start text-lg" asChild>
        <Link href="/login">
          <LogIn className="mr-2 h-5 w-5" />
          {T.login}
        </Link>
      </Button>
    )
  );

  const LanguageSwitcher = () => (
    <Select
      value={language}
      onValueChange={(value) => setLanguage(value as Language)}
    >
      <SelectTrigger className="w-auto px-3 py-1.5 text-xs md:text-sm border-none shadow-none bg-transparent hover:bg-muted/50">
        <Globe className="mr-1.5 h-4 w-4" />
        <SelectValue />
      </SelectTrigger>
      <SelectContent align="end">
        <SelectItem value="en">{currentTranslations.login.switchToEnglish || 'English'}</SelectItem>
        <SelectItem value="ar">{currentTranslations.login.switchToArabic || 'العربية'}</SelectItem>
      </SelectContent>
    </Select>
  );


  if (auth.isLoading) {
    return (
      <header className="bg-card shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Logo />
          <div className="h-8 w-20 bg-muted rounded animate-pulse"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="bg-card shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Logo />
        <nav className="hidden md:flex items-center space-x-1">
          <LanguageSwitcher />
          {navItems.map((item) => (
            <Button key={item.href} variant="ghost" asChild>
              <Link href={item.href}>
                {item.icon || null}
                {T[item.labelKey]}
              </Link>
            </Button>
          ))}
          <AuthButton />
        </nav>
        <div className="md:hidden flex items-center">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">{T.openMenu}</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col space-y-4 mt-8">
                <div className="px-2">
                  <LanguageSwitcher />
                </div>
                {navItems.map((item) => ( 
                  <Button key={item.href} variant="ghost" className="w-full justify-start text-lg" asChild>
                    <Link href={item.href}>
                      {item.icon || null}
                      {T[item.labelKey]}
                    </Link>
                  </Button>
                ))}
                <AuthButtonMobile />
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
