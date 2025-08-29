
'use client';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Lightbulb } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState, useEffect } from 'react';
import { useLanguage } from '@/hooks/use-language';

export function SchedulerForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [patientPrefs, setPatientPrefs] = useState('');
  const [doctorAvail, setDoctorAvail] = useState('');
  const { currentTranslations } = useLanguage();
  const T = currentTranslations.schedulerForm;

  useEffect(() => {
    setPatientPrefs(searchParams.get('patientSchedulePreferences') || '');
    setDoctorAvail(searchParams.get('doctorAvailability') || '');
  }, [searchParams]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const params = new URLSearchParams();
    params.set('patientSchedulePreferences', patientPrefs);
    params.set('doctorAvailability', doctorAvail);
    router.push(`/smart-scheduler?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="patientSchedulePreferences" className="text-lg font-medium">
          {T.patientPrefsLabel}
        </Label>
        <Textarea
          id="patientSchedulePreferences"
          value={patientPrefs}
          onChange={(e) => setPatientPrefs(e.target.value)}
          placeholder={T.patientPrefsPlaceholder}
          rows={4}
          required
          className="transition-shadow duration-300 focus:shadow-md"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="doctorAvailability" className="text-lg font-medium">
          {T.doctorAvailLabel}
        </Label>
        <Textarea
          id="doctorAvailability"
          value={doctorAvail}
          onChange={(e) => setDoctorAvail(e.target.value)}
          placeholder={T.doctorAvailPlaceholder}
          rows={4}
          required
          className="transition-shadow duration-300 focus:shadow-md"
        />
      </div>
      <Button type="submit" className="w-full md:w-auto transform hover:scale-105 transition-transform duration-300">
        <Lightbulb className="mr-2 h-5 w-5" /> {T.getSuggestionButton}
      </Button>
    </form>
  );
}
