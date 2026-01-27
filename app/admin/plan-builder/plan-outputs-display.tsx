'use client';

import { Card } from '@/components/ui/card';

interface PlanOutputsDisplayProps {
  planId: string;
  weeksFromNow: number;
  trainingWeeks: number;
  recoveryWeeks: number;
  maxKms: number;
}

export default function PlanOutputsDisplay({
  planId,
  weeksFromNow,
  trainingWeeks,
  recoveryWeeks,
  maxKms
}: PlanOutputsDisplayProps) {
  const outputMetrics = [
    { label: 'Level of Risk', value: 'TBD', description: 'Risk assessment based on inputs' },
    { label: 'Max Weekly Kms', value: `${maxKms} km`, description: 'Peak weekly mileage' },
    { label: 'Interval Run Frequency', value: 'Every other week', description: '0.5 - Every 2 weeks' },
    { label: 'Weeks Till Goal', value: weeksFromNow, description: 'From today to race date' },
    { label: 'Recovery Weeks', value: recoveryWeeks, description: 'Scheduled recovery weeks' },
    { label: 'Taper Weeks', value: 3, description: 'Final taper period' }
  ];

  return (
    <Card className="p-6 md:p-8 mb-8">
      <h2 className="text-2xl font-semibold mb-6">Plan Outputs & Analysis</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {outputMetrics.map((metric, idx) => (
          <div key={idx} className="p-4 bg-background rounded-lg border">
            <p className="text-sm text-muted-foreground mb-2">{metric.label}</p>
            <p className="text-2xl font-bold mb-1">{metric.value}</p>
            <p className="text-xs text-muted-foreground">{metric.description}</p>
          </div>
        ))}
      </div>
    </Card>
  );
}
