-- Run in the Supabase SQL editor so the public (anon) key can READ the data.
-- Without RLS policies, anon queries return zero rows.
DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['investigations','materials','ntrs_papers','flex_tests','bass_ii_tests','taskbook_projects']
  LOOP
    EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', t);
    EXECUTE format('DROP POLICY IF EXISTS "public read" ON public.%I', t);
    EXECUTE format('CREATE POLICY "public read" ON public.%I FOR SELECT TO anon USING (true)', t);
  END LOOP;
END $$;
