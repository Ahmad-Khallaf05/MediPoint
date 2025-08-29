
'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { BrainCircuit, CheckCircle } from 'lucide-react';
import { SchedulerForm } from '@/components/smart-scheduler/scheduler-form';
import type { SmartSchedulerOutput } from '@/lib/types';
import { suggestAppointmentTime } from '@/ai/flows/suggest-appointment-time';
import { useLanguage } from '@/hooks/use-language';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function SmartSchedulerContent() {
  const { currentTranslations } = useLanguage();
  const T = currentTranslations.smartScheduler;
  
  const searchParams = useSearchParams();
  const [suggestionResult, setSuggestionResult] = useState<SmartSchedulerOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const patientPrefs = searchParams.get('patientSchedulePreferences');
    const doctorAvail = searchParams.get('doctorAvailability');

    if (patientPrefs && doctorAvail) {
      setIsLoading(true);
      setError(null);
      setSuggestionResult(null);
      suggestAppointmentTime({
        patientSchedulePreferences: patientPrefs,
        doctorAvailability: doctorAvail,
      })
      .then(result => {
        setSuggestionResult(result);
      })
      .catch(e => {
        console.error("Error calling AI flow:", e);
        setError(T.errorMessage);
      })
      .finally(() => {
        setIsLoading(false);
      });
    }
  }, [searchParams, T.errorMessage]);


  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="font-headline text-3xl text-primary flex items-center">
            <BrainCircuit className="mr-2 h-8 w-8" /> {T.pageTitle}
          </CardTitle>
          <CardDescription>
            {T.pageDescription}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SchedulerForm />
        </CardContent>
      </Card>

      {isLoading && (
         <Card className="shadow-lg">
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <svg className="animate-spin h-5 w-5 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <p>{currentTranslations.smartScheduler.suggestionTitle || 'Loading suggestion...'}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {error && !isLoading && (
        <Card className="border-destructive shadow-lg">
          <CardHeader>
            <CardTitle className="text-destructive">{T.errorTitle}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error}</p>
          </CardContent>
        </Card>
      )}

      {suggestionResult && !isLoading && (
        <Card className="shadow-lg bg-accent/50 animate-fadeIn">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center">
              <CheckCircle className="mr-2 h-7 w-7 text-green-600" /> {T.suggestionTitle}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-lg">{T.bestTimeLabel}</h3>
              <p className="text-xl text-primary font-bold">{suggestionResult.suggestedAppointmentTime}</p>
            </div>
            <div>
              <h3 className="font-semibold text-lg">{T.reasoningLabel}</h3>
              <p className="text-muted-foreground">{suggestionResult.reasoning}</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

