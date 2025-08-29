
import type { Metadata } from 'next';
import './globals.css';
import { Header } from '@/components/layout/header';
import { AppProviders } from '@/components/layout/app-providers';
// import { Toaster } from '@/components/ui/toaster'; // Keep Toaster commented for now

export const metadata: Metadata = {
  title: 'MediPoint',
  description: 'Efficient Appointment Scheduling',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (<html lang="en" dir="ltr"><head><link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet"></link>
        <link href="https://fonts.googleapis.com/css2?family=Tajawal:wght@400;700&display=swap" rel="stylesheet" />
      </head><body className="font-body antialiased min-h-screen flex flex-col lang-en">
        <AppProviders>
          <Header />
          <main className="flex-grow container mx-auto px-4 py-8">
            {children}
          </main>
          {/* <Toaster /> */} {/* Keep Toaster commented for now */}
        </AppProviders>
      </body></html>);
}
