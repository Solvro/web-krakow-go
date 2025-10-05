-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to Event table
ALTER TABLE public."Event" 
ADD COLUMN IF NOT EXISTS embedding vector(1536);

-- Add columns to Volunteer table for recommendations
ALTER TABLE public."Volunteer"
ADD COLUMN IF NOT EXISTS interests text[],
ADD COLUMN IF NOT EXISTS skills text[],
ADD COLUMN IF NOT EXISTS past_events text[],
ADD COLUMN IF NOT EXISTS preference_embedding vector(1536);

-- Create volunteer_event_interactions table
CREATE TABLE IF NOT EXISTS public.volunteer_event_interactions (
  id text PRIMARY KEY DEFAULT gen_random_uuid()::text,
  volunteer_id text NOT NULL REFERENCES public."Volunteer"(id) ON DELETE CASCADE,
  event_id text NOT NULL REFERENCES public."Event"(id) ON DELETE CASCADE,
  interaction_type text NOT NULL CHECK (interaction_type IN ('view', 'interested', 'registered', 'completed')),
  created_at timestamp without time zone NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster similarity searches
CREATE INDEX IF NOT EXISTS event_embedding_idx ON public."Event" USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
CREATE INDEX IF NOT EXISTS volunteer_embedding_idx ON public."Volunteer" USING ivfflat (preference_embedding vector_cosine_ops) WITH (lists = 100);

-- Create index for volunteer_event_interactions queries
CREATE INDEX IF NOT EXISTS volunteer_interactions_idx ON public.volunteer_event_interactions(volunteer_id, created_at DESC);
CREATE INDEX IF NOT EXISTS event_interactions_idx ON public.volunteer_event_interactions(event_id, created_at DESC);

-- Enable RLS on volunteer_event_interactions
ALTER TABLE public.volunteer_event_interactions ENABLE ROW LEVEL SECURITY;

-- RLS policies for volunteer_event_interactions (users can read their own interactions)
CREATE POLICY "Users can view their own interactions" 
ON public.volunteer_event_interactions 
FOR SELECT 
USING (true);

CREATE POLICY "Users can create their own interactions" 
ON public.volunteer_event_interactions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Users can update their own interactions" 
ON public.volunteer_event_interactions 
FOR UPDATE 
USING (true);