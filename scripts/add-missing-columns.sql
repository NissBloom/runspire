-- Add name column to training_plans if it doesn't exist
ALTER TABLE training_plans ADD COLUMN IF NOT EXISTS name VARCHAR(255);

-- Ensure other required columns exist
ALTER TABLE training_plans ADD COLUMN IF NOT EXISTS training_weeks INTEGER;
ALTER TABLE training_plans ADD COLUMN IF NOT EXISTS starting_weekly_mileage DECIMAL(10, 2);
ALTER TABLE training_plans ADD COLUMN IF NOT EXISTS runs_per_week INTEGER;
