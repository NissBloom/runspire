-- Check if tables exist and have correct structure
SELECT 
  table_name, 
  column_name, 
  data_type
FROM information_schema.columns
WHERE table_name IN ('training_plans', 'training_plan_inputs', 'training_plan_outputs', 'plan_weeks')
ORDER BY table_name, ordinal_position;
