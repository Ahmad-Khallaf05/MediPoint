
'use client';

import type { Appointment } from '@/lib/types';
import { useLanguage } from '@/hooks/use-language';
import { ScrollArea } from '@/components/ui/scroll-area';

interface ServicePopularityDisplayProps {
  appointments: Appointment[];
}

export function ServicePopularityDisplay({ appointments }: ServicePopularityDisplayProps) {
  const { currentTranslations } = useLanguage();
  const T_AdminAnalysis = currentTranslations.adminDataAnalysis;
  const T_Admin = currentTranslations.admin;

  const getTopServiceReasons = () => {
    const reasonCounts: { [reason: string]: number } = {};
    appointments.forEach(app => {
      // Only count reasons from 'completed', 'scheduled', 'confirmed' appointments
      if (['completed', 'scheduled', 'confirmed'].includes(app.status)) {
        const reason = app.reason?.trim() || (T_Admin.reasonHeader || 'N/A'); // Use admin page 'Reason' header as fallback
        if (reasonCounts[reason]) {
          reasonCounts[reason]++;
        } else {
          reasonCounts[reason] = 1;
        }
      }
    });

    return Object.entries(reasonCounts)
      .map(([reason, count]) => ({ reason, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10); 
  };

  const topReasons = getTopServiceReasons();

  if (topReasons.length === 0) {
    return <p className="text-sm text-muted-foreground text-center p-4">{T_AdminAnalysis.noServiceData || "No service/reason data available."}</p>;
  }

  return (
    <ScrollArea className="h-[280px]"> {/* Fixed height for scroll area */}
      <ul className="space-y-2 pr-4">
        {topReasons.map((item, index) => (
          <li key={index} className="flex justify-between items-center text-sm p-3 rounded-md hover:bg-muted/50 transition-colors duration-150">
            <span className="font-medium text-foreground truncate max-w-[70%] capitalize">{item.reason}</span>
            <span className="text-primary font-semibold bg-primary/10 px-2 py-1 rounded-md">{item.count}</span>
          </li>
        ))}
      </ul>
    </ScrollArea>
  );
}
