'use client';

import { useEffect, useState } from 'react';
import { Card } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface WeekSchedule {
  id: string;
  plan_id: string;
  week_number: number;
  week_start_date: string;
  week_total_mileage: number;
  long_run_distance: number;
  interval_run_distance: number;
  aerobic_distance: number;
  extra_distance: number;
  easy_distance: number;
}

interface ScheduleTableProps {
  planId: string;
}

export default function ScheduleTable({ planId }: ScheduleTableProps) {
  const [schedule, setSchedule] = useState<WeekSchedule[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchSchedule = async () => {
      try {
        const response = await fetch(`/api/admin/create-plan?planId=${planId}`);
        if (!response.ok) throw new Error('Failed to fetch schedule');
        const data = await response.json();
        
        // Limit to 8-10 rows for display
        const displayWeeks = data.schedule.slice(0, 10);
        setSchedule(displayWeeks);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSchedule();
  }, [planId]);

  if (loading) return <div className="text-center py-8">Loading schedule...</div>;
  if (error) return <div className="text-red-500 text-center py-8">{error}</div>;
  if (schedule.length === 0) return <div className="text-center py-8">No schedule data</div>;

  const calculateWeeksRemaining = (weekStartDate: string) => {
    const today = new Date();
    const weekDate = new Date(weekStartDate);
    const weeksRemaining = Math.ceil((weekDate.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000));
    return Math.max(0, weeksRemaining);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  return (
    <Card className="p-6 md:p-8">
      <h2 className="text-2xl font-semibold mb-6">Training Schedule</h2>
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Week</TableHead>
              <TableHead>Start (Mon)</TableHead>
              <TableHead>Weeks Till Race</TableHead>
              <TableHead>Weeks From Now</TableHead>
              <TableHead>Long</TableHead>
              <TableHead>Interval</TableHead>
              <TableHead>Aerobic</TableHead>
              <TableHead>Extra</TableHead>
              <TableHead>Easy</TableHead>
              <TableHead>Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {schedule.map((week, idx) => {
              const weeksRemaining = schedule.length - week.week_number;
              const weeksFromNow = calculateWeeksRemaining(week.week_start_date);
              
              return (
                <TableRow key={week.id}>
                  <TableCell className="font-medium">{week.week_number}</TableCell>
                  <TableCell>{formatDate(week.week_start_date)}</TableCell>
                  <TableCell>{weeksRemaining}</TableCell>
                  <TableCell>{weeksFromNow}</TableCell>
                  <TableCell>{week.long_run_distance.toFixed(1)}</TableCell>
                  <TableCell>{week.interval_run_distance.toFixed(1)}</TableCell>
                  <TableCell>{week.aerobic_distance.toFixed(1)}</TableCell>
                  <TableCell>{week.extra_distance.toFixed(1)}</TableCell>
                  <TableCell>{week.easy_distance.toFixed(1)}</TableCell>
                  <TableCell className="font-semibold">{week.week_total_mileage.toFixed(1)}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </Card>
  );
}
