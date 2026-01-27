'use client'

import { useState, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle } from 'lucide-react'

interface PlanOutputs {
  max_kms: number
  weeks_till_goal: number
  recovery_weeks: number
  taper: number
}

interface PlanWeek {
  week_number: number
  week_start_date: string
  week_total_mileage: number
  long_run_distance: number
  interval_distance: number
  aerobic_distance: number
  extra_distance: number
  easy_distance: number
}

export function PlanBuilderForm() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [outputs, setOutputs] = useState<PlanOutputs | null>(null)
  const [weeks, setWeeks] = useState<PlanWeek[]>([])
  const [planId, setPlanId] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    // Plan basics
    plan_name: '',
    race_date: '',
    start_date: '',

    // Client inputs
    number_of_runs_per_week: '4',
    current_weekly_kms: '40',
    most_recent_long_run: '12',
    recent_injury: '',
    goal_race: 'Marathon',
    goal_date: '',
    recent_race_effort: 'moderate',
    max_hr: '180',
    life_events: '',

    // Training parameters
    training_weeks: '16',
    starting_weekly_mileage: '40',
    starting_long_run_distance: '10',
    max_weekly_mileage: '80',
    recovery_week_interval: '4',
    recovery_factor: '0.7',
    long_run_cap: '32',
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess(false)

    try {
      const response = await fetch('/api/admin/create-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create plan')
      }

      setPlanId(data.plan_id)
      setOutputs(data.outputs)
      setWeeks(data.weeks)
      setSuccess(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (success && outputs && weeks.length > 0) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-semibold">Plan Generated Successfully</h3>
          <Button variant="outline" onClick={() => {
            setSuccess(false)
            setPlanId(null)
            setOutputs(null)
            setWeeks([])
            setFormData({
              plan_name: '',
              race_date: '',
              start_date: '',
              number_of_runs_per_week: '4',
              current_weekly_kms: '40',
              most_recent_long_run: '12',
              recent_injury: '',
              goal_race: 'Marathon',
              goal_date: '',
              recent_race_effort: 'moderate',
              max_hr: '180',
              life_events: '',
              training_weeks: '16',
              starting_weekly_mileage: '40',
              starting_long_run_distance: '10',
              max_weekly_mileage: '80',
              recovery_week_interval: '4',
              recovery_factor: '0.7',
              long_run_cap: '32',
            })
          }}>Create New Plan</Button>
        </div>

        {/* Outputs Display */}
        <Card className="p-6 bg-blue-50 border-blue-200">
          <h4 className="font-semibold mb-4 text-blue-900">Plan Outputs</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <p className="text-sm text-blue-700">Max Weekly Kms</p>
              <p className="text-2xl font-bold text-blue-900">{outputs.max_kms.toFixed(1)}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700">Weeks Till Goal</p>
              <p className="text-2xl font-bold text-blue-900">{outputs.weeks_till_goal}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700">Recovery Weeks</p>
              <p className="text-2xl font-bold text-blue-900">{outputs.recovery_weeks}</p>
            </div>
            <div>
              <p className="text-sm text-blue-700">Taper (weeks)</p>
              <p className="text-2xl font-bold text-blue-900">{outputs.taper}</p>
            </div>
          </div>
        </Card>

        {/* Schedule Table */}
        <Card className="p-6 overflow-x-auto">
          <h4 className="font-semibold mb-4">Training Schedule</h4>
          <table className="w-full text-sm">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-2 py-2 text-left">Week</th>
                <th className="px-2 py-2 text-left">Start (Mon)</th>
                <th className="px-2 py-2 text-right">Weeks Left</th>
                <th className="px-2 py-2 text-right">Long</th>
                <th className="px-2 py-2 text-right">Interval</th>
                <th className="px-2 py-2 text-right">Aerobic</th>
                <th className="px-2 py-2 text-right">Extra</th>
                <th className="px-2 py-2 text-right">Easy</th>
                <th className="px-2 py-2 text-right font-bold">Total</th>
              </tr>
            </thead>
            <tbody>
              {weeks.map((week) => {
                const weekStart = new Date(week.week_start_date)
                const weekFromNow = Math.ceil((new Date(formData.race_date).getTime() - weekStart.getTime()) / (7 * 24 * 60 * 60 * 1000))
                return (
                  <tr key={week.week_number} className="border-b hover:bg-gray-50">
                    <td className="px-2 py-2">{week.week_number}</td>
                    <td className="px-2 py-2">{weekStart.toLocaleDateString()}</td>
                    <td className="px-2 py-2 text-right">{weekFromNow}</td>
                    <td className="px-2 py-2 text-right">{week.long_run_distance.toFixed(1)}</td>
                    <td className="px-2 py-2 text-right">{week.interval_distance.toFixed(1)}</td>
                    <td className="px-2 py-2 text-right">{week.aerobic_distance.toFixed(1)}</td>
                    <td className="px-2 py-2 text-right">{week.extra_distance.toFixed(1)}</td>
                    <td className="px-2 py-2 text-right">{week.easy_distance.toFixed(1)}</td>
                    <td className="px-2 py-2 text-right font-bold">{week.week_total_mileage.toFixed(1)}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </Card>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-4xl">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg flex gap-3">
          <AlertCircle className="text-red-600 mt-0.5" size={20} />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Plan Basics Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Plan Basics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="plan_name">Plan Name</Label>
            <Input
              id="plan_name"
              name="plan_name"
              value={formData.plan_name}
              onChange={handleInputChange}
              placeholder="e.g., Jane's Marathon Plan"
              required
            />
          </div>
          <div>
            <Label htmlFor="race_date">Race Date</Label>
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
      </Card>

      {/* Client Inputs Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Client Inputs</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="number_of_runs_per_week">Runs per Week</Label>
            <Input
              id="number_of_runs_per_week"
              name="number_of_runs_per_week"
              type="number"
              value={formData.number_of_runs_per_week}
              onChange={handleInputChange}
              min="3"
              max="7"
              required
            />
          </div>
          <div>
            <Label htmlFor="current_weekly_kms">Current Weekly Kms (Last 4 weeks)</Label>
            <Input
              id="current_weekly_kms"
              name="current_weekly_kms"
              type="number"
              value={formData.current_weekly_kms}
              onChange={handleInputChange}
              step="0.1"
              required
            />
          </div>
          <div>
            <Label htmlFor="most_recent_long_run">Most Recent Long Run (km)</Label>
            <Input
              id="most_recent_long_run"
              name="most_recent_long_run"
              type="number"
              value={formData.most_recent_long_run}
              onChange={handleInputChange}
              step="0.1"
              required
            />
          </div>
          <div>
            <Label htmlFor="recent_injury">Recent Injury</Label>
            <Input
              id="recent_injury"
              name="recent_injury"
              value={formData.recent_injury}
              onChange={handleInputChange}
              placeholder="None, or describe injury"
            />
          </div>
          <div>
            <Label htmlFor="goal_race">Goal Race</Label>
            <Input
              id="goal_race"
              name="goal_race"
              value={formData.goal_race}
              onChange={handleInputChange}
              placeholder="Marathon, Half Marathon, etc."
            />
          </div>
          <div>
            <Label htmlFor="recent_race_effort">Recent Race Effort</Label>
            <select
              id="recent_race_effort"
              name="recent_race_effort"
              value={formData.recent_race_effort}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border rounded-md"
            >
              <option value="easy">Easy</option>
              <option value="moderate">Moderate</option>
              <option value="hard">Hard</option>
              <option value="very_hard">Very Hard</option>
            </select>
          </div>
          <div>
            <Label htmlFor="max_hr">Max HR</Label>
            <Input
              id="max_hr"
              name="max_hr"
              type="number"
              value={formData.max_hr}
              onChange={handleInputChange}
              required
            />
          </div>
          <div>
            <Label htmlFor="life_events">Life Events</Label>
            <Input
              id="life_events"
              name="life_events"
              value={formData.life_events}
              onChange={handleInputChange}
              placeholder="Any significant life events"
            />
          </div>
        </div>
      </Card>

      {/* Training Parameters Section */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Training Parameters</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="training_weeks">Total Training Weeks</Label>
            <Input
              id="training_weeks"
              name="training_weeks"
              type="number"
              value={formData.training_weeks}
              onChange={handleInputChange}
              min="8"
              max="24"
              required
            />
          </div>
          <div>
            <Label htmlFor="starting_weekly_mileage">Starting Weekly Mileage (km)</Label>
            <Input
              id="starting_weekly_mileage"
              name="starting_weekly_mileage"
              type="number"
              value={formData.starting_weekly_mileage}
              onChange={handleInputChange}
              step="0.1"
              required
            />
          </div>
          <div>
            <Label htmlFor="starting_long_run_distance">Starting Long Run (km)</Label>
            <Input
              id="starting_long_run_distance"
              name="starting_long_run_distance"
              type="number"
              value={formData.starting_long_run_distance}
              onChange={handleInputChange}
              step="0.1"
              required
            />
          </div>
          <div>
            <Label htmlFor="max_weekly_mileage">Max Weekly Mileage (km)</Label>
            <Input
              id="max_weekly_mileage"
              name="max_weekly_mileage"
              type="number"
              value={formData.max_weekly_mileage}
              onChange={handleInputChange}
              step="0.1"
              required
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
              max="6"
              help="Every Nth week is a recovery week"
              required
            />
          </div>
          <div>
            <Label htmlFor="recovery_factor">Recovery Factor</Label>
            <Input
              id="recovery_factor"
              name="recovery_factor"
              type="number"
              value={formData.recovery_factor}
              onChange={handleInputChange}
              step="0.1"
              min="0.4"
              max="0.9"
              placeholder="0.7 (70% of normal mileage)"
              required
            />
          </div>
          <div>
            <Label htmlFor="long_run_cap">Long Run Cap (km)</Label>
            <Input
              id="long_run_cap"
              name="long_run_cap"
              type="number"
              value={formData.long_run_cap}
              onChange={handleInputChange}
              step="0.1"
              required
            />
          </div>
        </div>
      </Card>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? 'Generating Plan...' : 'Generate Training Plan'}
      </Button>
    </form>
  )
}
