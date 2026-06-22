
CREATE TABLE public.notes (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  body text NOT NULL DEFAULT '',
  tags text[] NOT NULL DEFAULT '{}',
  file_url text,
  file_name text,
  file_type text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.notes TO anon, authenticated;
GRANT ALL ON public.notes TO service_role;
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notes are publicly readable" ON public.notes FOR SELECT USING (true);

CREATE TABLE public.note_comments (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  note_id uuid NOT NULL REFERENCES public.notes(id) ON DELETE CASCADE,
  author_name text NOT NULL,
  body text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.note_comments TO anon, authenticated;
GRANT ALL ON public.note_comments TO service_role;
ALTER TABLE public.note_comments ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Comments are publicly readable" ON public.note_comments FOR SELECT USING (true);
CREATE POLICY "Anyone can post comments" ON public.note_comments FOR INSERT WITH CHECK (
  length(trim(author_name)) BETWEEN 1 AND 60 AND length(trim(body)) BETWEEN 1 AND 1000
);

CREATE INDEX idx_note_comments_note_id ON public.note_comments(note_id, created_at DESC);
CREATE INDEX idx_notes_created_at ON public.notes(created_at DESC);
