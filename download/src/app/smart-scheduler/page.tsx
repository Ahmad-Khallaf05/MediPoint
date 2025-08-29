
import { Suspense } from 'react';
import SmartSchedulerContent from '@/components/smart-scheduler/smart-scheduler-content';

function SmartSchedulerLoadingFallback() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)]">
      <div className="p-8 text-center">
        {/* You can use a simple SVG spinner or an icon component if preferred and available in this context */}
        <svg className="mx-auto h-12 w-12 text-primary animate-spin mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p className="text-lg font-semibold text-primary">Loading Smart Scheduler...</p>
        <p className="text-sm text-muted-foreground">Please wait a moment.</p>
      </div>
    </div>
  );
}

export default function SmartSchedulerPage() {
  return (
    <Suspense fallback={<SmartSchedulerLoadingFallback />}>
      <SmartSchedulerContent />
    </Suspense>
  );
}
