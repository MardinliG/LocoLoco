-- Drop all existing policies
DROP POLICY IF EXISTS "Users can insert their own quiz results" ON public.quiz_results;
DROP POLICY IF EXISTS "Users can read their own quiz results" ON public.quiz_results;
DROP POLICY IF EXISTS "Admins can read all quiz results" ON public.quiz_results;
DROP POLICY IF EXISTS "Users can update their own quiz results" ON public.quiz_results;
DROP POLICY IF EXISTS "Users can view their own quiz results" ON public.quiz_results;

-- Enable Row Level Security
ALTER TABLE public.quiz_results ENABLE ROW LEVEL SECURITY;

-- Create a single policy for all operations
CREATE POLICY "Enable all operations for authenticated users"
ON public.quiz_results
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true); 