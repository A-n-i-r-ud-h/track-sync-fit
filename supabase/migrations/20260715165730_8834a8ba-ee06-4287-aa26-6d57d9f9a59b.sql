
CREATE TABLE public.workouts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL CHECK (char_length(name) BETWEEN 1 AND 100),
  duration_minutes INTEGER NOT NULL CHECK (duration_minutes > 0 AND duration_minutes <= 1440),
  calories INTEGER NOT NULL CHECK (calories >= 0 AND calories <= 10000),
  workout_date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX workouts_user_date_idx ON public.workouts (user_id, workout_date DESC);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.workouts TO authenticated;
GRANT ALL ON public.workouts TO service_role;

ALTER TABLE public.workouts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users select own workouts" ON public.workouts
  FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users insert own workouts" ON public.workouts
  FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users update own workouts" ON public.workouts
  FOR UPDATE USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users delete own workouts" ON public.workouts
  FOR DELETE USING (auth.uid() = user_id);
