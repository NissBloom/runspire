-- Make user_id nullable in training_plans table
ALTER TABLE training_plans ALTER COLUMN user_id DROP NOT NULL;
