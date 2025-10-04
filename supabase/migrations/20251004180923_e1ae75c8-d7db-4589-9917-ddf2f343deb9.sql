-- Enable RLS on all tables
ALTER TABLE public."Chat" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ChatMessage" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."ChatParticipant" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Coordinator" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Event" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Organization" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."School" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Submission" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Task" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Volunteer" ENABLE ROW LEVEL SECURITY;

-- Create public read policies for all tables
CREATE POLICY "Public can read all chats"
ON public."Chat"
FOR SELECT
USING (true);

CREATE POLICY "Public can read all chat messages"
ON public."ChatMessage"
FOR SELECT
USING (true);

CREATE POLICY "Public can read all chat participants"
ON public."ChatParticipant"
FOR SELECT
USING (true);

CREATE POLICY "Public can read all coordinators"
ON public."Coordinator"
FOR SELECT
USING (true);

CREATE POLICY "Public can read all events"
ON public."Event"
FOR SELECT
USING (true);

CREATE POLICY "Public can read all organizations"
ON public."Organization"
FOR SELECT
USING (true);

CREATE POLICY "Public can read all schools"
ON public."School"
FOR SELECT
USING (true);

CREATE POLICY "Public can read all submissions"
ON public."Submission"
FOR SELECT
USING (true);

CREATE POLICY "Public can read all tasks"
ON public."Task"
FOR SELECT
USING (true);

CREATE POLICY "Public can read all volunteers"
ON public."Volunteer"
FOR SELECT
USING (true);