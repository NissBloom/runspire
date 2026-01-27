'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import PlanOutputsDisplay from './plan-outputs-display';
import ScheduleTable from './schedule-table';

interface PlanData {
  planId: string;
  weeksFromNow: number;
  trainingWeeks: number;
  recoveryWeeks: number;
  maxKms: number;
}

export default function AdminPlanBuilderPage() {
  const [formData, setFormData] = useState({
    name: '',
    race_date: '',
    start_date: '',
    number_of_runs_per_week: 4,
    current_weekly_kms: 40,
    most_recent_long_run: 16,
    recent_injury: '',
    goal_race: '',
    recent_race_effort: '',
    max_hr: '',
    life_events: '',
    starting_long_run_distance: 14,
    max_weekly_mileage: 80,
    recovery_week_interval: 4,
    recovery_factor: 0.8,
    long_run_cap: 35,
    percentage_tiers: [10, 15, 20, 25, 30]
  });

  const [loading, setLoading] = useState(false);
  const [planData, setPlanData] = useState<PlanData | null>(null);
  const [error, setError] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name.includes('_') && !name.includes('date') ? parseFloat(value) || value : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/admin/create-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Failed to create plan');
      }

      const data = await response.json();
      setPlanData(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Marathon Plan Builder</h1>

        {!planData ? (
          <Card className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Plan Basics */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">Plan Basics</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Plan Name</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="e.g., John's Marathon Plan"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="goal_race">Goal Race</Label>
                    <Input
                      id="goal_race"
                      name="goal_race"
                      value={formData.goal_race}
                      onChange={handleInputChange}
                      placeholder="e.g., Boston Marathon"
                    />
                  </div>
                  <div>
                    <Label htmlFor="race_date">Goal Race Date</Label>
                    <Input
                      id="race_date"
                      name="race_date"
                      type="date"
                      value={formData.race_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="start_date">Training Start Date</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      value={formData.start_date}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Client Inputs */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">Client Input Data</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="number_of_runs_per_week">Runs Per Week</Label>
                    <Input
                      id="number_of_runs_per_week"
                      name="number_of_runs_per_week"
                      type="number"
                      value={formData.number_of_runs_per_week}
                      onChange={handleInputChange}
                      min="3"
                      max="7"
                    />
                  </div>
                  <div>
                    <Label htmlFor="current_weekly_kms">Current Weekly Kms (Last 4 Weeks)</Label>
                    <Input
                      id="current_weekly_kms"
                      name="current_weekly_kms"
                      type="number"
                      value={formData.current_weekly_kms}
                      onChange={handleInputChange}
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="most_recent_long_run">Most Recent Long Run (Kms)</Label>
                    <Input
                      id="most_recent_long_run"
                      name="most_recent_long_run"
                      type="number"
                      value={formData.most_recent_long_run}
                      onChange={handleInputChange}
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_hr">Max Heart Rate</Label>
                    <Input
                      id="max_hr"
                      name="max_hr"
                      type="number"
                      value={formData.max_hr}
                      onChange={handleInputChange}
                      placeholder="e.g., 185"
                    />
                  </div>
                  <div>
                    <Label htmlFor="recent_race_effort">Recent Race Effort</Label>
                    <Input
                      id="recent_race_effort"
                      name="recent_race_effort"
                      value={formData.recent_race_effort}
                      onChange={handleInputChange}
                      placeholder="e.g., Half Marathon - 1:45"
                    />
                  </div>
                  <div>
                    <Label htmlFor="recent_injury">Recent Injury</Label>
                    <Input
                      id="recent_injury"
                      name="recent_injury"
                      value={formData.recent_injury}
                      onChange={handleInputChange}
                      placeholder="None or describe injury"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="life_events">Life Events / Notes</Label>
                    <Textarea
                      id="life_events"
                      name="life_events"
                      value={formData.life_events}
                      onChange={handleInputChange}
                      placeholder="Any important life events or notes"
                      rows={3}
                    />
                  </div>
                </div>
              </div>

              {/* Training Parameters */}
              <div className="border-b pb-6">
                <h2 className="text-xl font-semibold mb-4">Training Parameters</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="starting_long_run_distance">Starting Long Run (Kms)</Label>
                    <Input
                      id="starting_long_run_distance"
                      name="starting_long_run_distance"
                      type="number"
                      value={formData.starting_long_run_distance}
                      onChange={handleInputChange}
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="long_run_cap">Long Run Cap (Kms)</Label>
                    <Input
                      id="long_run_cap"
                      name="long_run_cap"
                      type="number"
                      value={formData.long_run_cap}
                      onChange={handleInputChange}
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="max_weekly_mileage">Max Weekly Mileage (Kms)</Label>
                    <Input
                      id="max_weekly_mileage"
                      name="max_weekly_mileage"
                      type="number"
                      value={formData.max_weekly_mileage}
                      onChange={handleInputChange}
                      step="0.1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="recovery_week_interval">Recovery Week Interval</Label>
                    <Input
                      id="recovery_week_interval"
                      name="recovery_week_interval"
                      type="number"
                      value={formData.recovery_week_interval}
                      onChange={handleInputChange}
                      min="2"
                      max="8"
                    />
                  </div>
                  <div>
                    <Label htmlFor="recovery_factor">Recovery Factor (0.0 - 1.0)</Label>
                    <Input
                      id="recovery_factor"
                      name="recovery_factor"
                      type="number"
                      value={formData.recovery_factor}
                      onChange={handleInputChange}
                      step="0.05"
                      min="0"
                      max="1"
                    />
                  </div>
                </div>
              </div>

              {error && <div className="text-red-500">{error}</div>}

              <Button type="submit" disabled={loading} className="w-full">
                {loading ? 'Creating Plan...' : 'Create Training Plan'}
              </Button>
            </form>
          </Card>
        ) : (
          <>
            <PlanOutputsDisplay
              planId={planData.planId}
              weeksFromNow={planData.weeksFromNow}
              trainingWeeks={planData.trainingWeeks}
              recoveryWeeks={planData.recoveryWeeks}
              maxKms={planData.maxKms}
            />
            <ScheduleTable planId={planData.planId} />
            <Button
              onClick={() => setPlanData(null)}
              className="mt-8"
              variant="outline"
            >
              Create Another Plan
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
