-- Drop existing tables if they exist (in correct dependency order)
DROP TABLE IF EXISTS plan_weeks CASCADE;
DROP TABLE IF EXISTS training_plan_outputs CASCADE;
DROP TABLE IF EXISTS training_plan_inputs CASCADE;
DROP TABLE IF EXISTS training_plans CASCADE;

-- Create training_plans table (parameters)
CREATE TABLE training_plans (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  race_date DATE NOT NULL,
  start_date DATE NOT NULL,
  training_weeks INTEGER NOT NULL,
  starting_weekly_mileage DECIMAL(10, 2) NOT NULL,
  runs_per_week INTEGER NOT NULL,
  starting_long_run_distance DECIMAL(10, 2) NOT NULL,
  max_weekly_mileage DECIMAL(10, 2) NOT NULL,
  recovery_week_interval INTEGER,
  percentage_tiers JSONB,
  recovery_factor DECIMAL(5, 2),
  long_run_cap DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create training_plan_inputs table
CREATE TABLE training_plan_inputs (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER REFERENCES training_plans(id) ON DELETE CASCADE,
  number_of_runs_per_week INTEGER NOT NULL,
  current_weekly_kms DECIMAL(10, 2) NOT NULL,
  most_recent_long_run DECIMAL(10, 2) NOT NULL,
  recent_injury VARCHAR(255),
  goal_race VARCHAR(255) NOT NULL,
  goal_date DATE,
  recent_race_effort VARCHAR(255),
  max_hr INTEGER,
  life_events VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create training_plan_outputs table
CREATE TABLE training_plan_outputs (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER UNIQUE REFERENCES training_plans(id) ON DELETE CASCADE,
  level_of_risk VARCHAR(50),
  max_kms DECIMAL(10, 2),
  interval_run_per_week DECIMAL(5, 2) DEFAULT 0.5,
  weeks_till_goal INTEGER,
  recovery_weeks INTEGER,
  taper INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create plan_weeks table for detailed weekly schedules
CREATE TABLE plan_weeks (
  id SERIAL PRIMARY KEY,
  plan_id INTEGER REFERENCES training_plans(id) ON DELETE CASCADE,
  week_number INTEGER NOT NULL,
  week_start_date DATE NOT NULL,
  week_total_mileage DECIMAL(10, 2) NOT NULL,
  long_run_distance DECIMAL(10, 2),
  interval_run_distance DECIMAL(10, 2),
  aerobic_distance DECIMAL(10, 2),
  extra_distance DECIMAL(10, 2),
  easy_distance DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(plan_id, week_number)
);

-- Add indexes for performance
CREATE INDEX idx_training_plan_inputs_plan_id ON training_plan_inputs(plan_id);
CREATE INDEX idx_training_plan_outputs_plan_id ON training_plan_outputs(plan_id);
CREATE INDEX idx_plan_weeks_plan_id ON plan_weeks(plan_id);
