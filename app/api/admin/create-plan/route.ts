import { sql } from '@vercel/postgres';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const {
      name,
      race_date,
      start_date,
      number_of_runs_per_week,
      current_weekly_kms,
      most_recent_long_run,
      recent_injury,
      goal_race,
      recent_race_effort,
      max_hr,
      life_events,
      starting_long_run_distance,
      max_weekly_mileage,
      recovery_week_interval,
      recovery_factor,
      long_run_cap,
      percentage_tiers
    } = body;

    // Calculate derived outputs
    const raceDate = new Date(race_date);
    const startDate = new Date(start_date);
    const today = new Date();
    
    const weeksFromNow = Math.ceil((raceDate.getTime() - today.getTime()) / (7 * 24 * 60 * 60 * 1000));
    const trainingWeeks = Math.ceil((raceDate.getTime() - startDate.getTime()) / (7 * 24 * 60 * 60 * 1000));
    
    // Calculate recovery weeks based on interval
    const recoveryWeeks = Math.floor(trainingWeeks / recovery_week_interval);
    
    // Taper: last 3 weeks, with progressive reduction
    const taper = 3;
    
    // Max kms based on percentage tiers
    let maxKms = current_weekly_kms;
    if (percentage_tiers && percentage_tiers.length > 0) {
      maxKms = Math.min(max_weekly_mileage, current_weekly_kms * (1 + percentage_tiers[0] / 100));
    }

    // Create training plan
    const planResult = await sql`
      INSERT INTO training_plans (name, race_date, start_date, training_weeks, starting_weekly_mileage, runs_per_week, starting_long_run_distance, max_weekly_mileage, recovery_week_interval, percentage_tiers, recovery_factor, long_run_cap, created_at)
      VALUES (${name}, ${race_date}, ${start_date}, ${trainingWeeks}, ${current_weekly_kms}, ${number_of_runs_per_week}, ${starting_long_run_distance}, ${max_weekly_mileage}, ${recovery_week_interval}, ${JSON.stringify(percentage_tiers)}, ${recovery_factor}, ${long_run_cap}, NOW())
      RETURNING id
    `;

    const planId = planResult.rows[0].id;

    // Create inputs record
    await sql`
      INSERT INTO training_plan_inputs (plan_id, number_of_runs_per_week, current_weekly_kms, most_recent_long_run, recent_injury, goal_race, goal_date, recent_race_effort, max_hr, life_events, created_at)
      VALUES (${planId}, ${number_of_runs_per_week}, ${current_weekly_kms}, ${most_recent_long_run}, ${recent_injury}, ${goal_race}, ${race_date}, ${recent_race_effort}, ${max_hr}, ${life_events}, NOW())
    `;

    // Create outputs record
    await sql`
      INSERT INTO training_plan_outputs (plan_id, level_of_risk, max_kms, interval_run_per_week, weeks_till_goal, recovery_weeks, taper, created_at)
      VALUES (${planId}, NULL, ${maxKms}, 0.5, ${weeksFromNow}, ${recoveryWeeks}, ${taper}, NOW())
    `;

    // Generate schedule weeks
    let weekNumber = 1;
    const schedule = [];
    
    for (let i = 0; i < trainingWeeks; i++) {
      const weekStartDate = new Date(startDate);
      weekStartDate.setDate(weekStartDate.getDate() + i * 7);
      
      const isTaperWeek = i >= trainingWeeks - taper;
      const isRecoveryWeek = (i + 1) % recovery_week_interval === 0;
      
      // Calculate weekly mileage
      let weeklyMileage = current_weekly_kms;
      
      if (percentage_tiers && percentage_tiers.length > 0) {
        const progressionFactor = i / (trainingWeeks - taper);
        const tierIndex = Math.min(Math.floor(progressionFactor * percentage_tiers.length), percentage_tiers.length - 1);
        weeklyMileage = current_weekly_kms * (1 + percentage_tiers[tierIndex] / 100);
      }
      
      // Apply recovery factor for recovery weeks
      if (isRecoveryWeek && !isTaperWeek) {
        weeklyMileage *= recovery_factor;
      }
      
      // Apply taper
      if (isTaperWeek) {
        const taperedWeekNum = i - (trainingWeeks - taper) + 1;
        const taperReduction = taperedWeekNum === 1 ? 0.8 : taperedWeekNum === 2 ? 0.6 : 0.4;
        weeklyMileage *= taperReduction;
      }
      
      weeklyMileage = Math.min(weeklyMileage, max_weekly_mileage);

      // Calculate run distances based on number of runs and types
      const longRunDistance = Math.min(starting_long_run_distance + (i * 0.5), long_run_cap);
      const intervalDistance = number_of_runs_per_week >= 3 ? weeklyMileage * 0.2 : 0;
      const aerobicDistance = number_of_runs_per_week >= 4 ? weeklyMileage * 0.15 : 0;
      const extraDistance = number_of_runs_per_week >= 5 ? weeklyMileage * 0.1 : 0;
      const easyDistance = Math.max(weeklyMileage - longRunDistance - intervalDistance - aerobicDistance - extraDistance, 0);

      schedule.push({
        plan_id: planId,
        week_number: weekNumber,
        week_start_date: weekStartDate.toISOString().split('T')[0],
        week_total_mileage: Math.round(weeklyMileage * 10) / 10,
        long_run_distance: Math.round(longRunDistance * 10) / 10,
        interval_run_distance: Math.round(intervalDistance * 10) / 10,
        aerobic_distance: Math.round(aerobicDistance * 10) / 10,
        extra_distance: Math.round(extraDistance * 10) / 10,
        easy_distance: Math.round(easyDistance * 10) / 10
      });
      
      weekNumber++;
    }

    // Insert all weeks
    for (const week of schedule) {
      await sql`
        INSERT INTO plan_weeks (plan_id, week_number, week_start_date, week_total_mileage, long_run_distance, interval_run_distance, aerobic_distance, extra_distance, easy_distance)
        VALUES (${week.plan_id}, ${week.week_number}, ${week.week_start_date}, ${week.week_total_mileage}, ${week.long_run_distance}, ${week.interval_run_distance}, ${week.aerobic_distance}, ${week.extra_distance}, ${week.easy_distance})
      `;
    }

    return NextResponse.json({
      success: true,
      plan_id: planId,
      outputs: {
        max_kms: Math.round(maxKms * 10) / 10,
        weeks_till_goal: weeksFromNow,
        recovery_weeks: recoveryWeeks,
        taper: taper
      },
      weeks: schedule.map(week => ({
        week_number: week.week_number,
        week_start_date: week.week_start_date,
        week_total_mileage: week.week_total_mileage,
        long_run_distance: week.long_run_distance,
        interval_distance: week.interval_run_distance,
        aerobic_distance: week.aerobic_distance,
        extra_distance: week.extra_distance,
        easy_distance: week.easy_distance
      }))
    });
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json({ error: 'Failed to create plan' }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const planId = searchParams.get('planId');

    if (!planId) {
      return NextResponse.json({ error: 'planId required' }, { status: 400 });
    }

    // Get plan with outputs and schedule
    const outputsResult = await sql`
      SELECT * FROM training_plan_outputs WHERE plan_id = ${planId}
    `;

    const scheduleResult = await sql`
      SELECT * FROM plan_weeks WHERE plan_id = ${planId} ORDER BY week_number
    `;

    return NextResponse.json({
      outputs: outputsResult.rows[0],
      schedule: scheduleResult.rows
    });
  } catch (error) {
    console.error('Error fetching plan:', error);
    return NextResponse.json({ error: 'Failed to fetch plan' }, { status: 500 });
  }
}
