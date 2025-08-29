import { Stethoscope } from 'lucide-react';
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 text-primary hover:text-primary/90 transition-colors">
      <Stethoscope className="h-8 w-8" />
      <span className="font-headline text-2xl font-bold">MediPoint</span>
    </Link>
  );
}
