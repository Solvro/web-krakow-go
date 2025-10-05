import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Calculate cosine similarity between two vectors
function cosineSimilarity(a: number[], b: number[]): number {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;
  
  for (let i = 0; i < a.length; i++) {
    dotProduct += a[i] * b[i];
    magnitudeA += a[i] * a[i];
    magnitudeB += b[i] * b[i];
  }
  
  magnitudeA = Math.sqrt(magnitudeA);
  magnitudeB = Math.sqrt(magnitudeB);
  
  if (magnitudeA === 0 || magnitudeB === 0) return 0;
  
  return dotProduct / (magnitudeA * magnitudeB);
}

interface RecommendationFilters {
  dateRange?: {
    start?: string;
    end?: string;
  };
  location?: string;
  category?: string;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { volunteerId, limit = 10, filters = {} } = await req.json();
    
    if (!volunteerId) {
      return new Response(
        JSON.stringify({ error: 'Volunteer ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get events the volunteer has attended (from Submission table with ACCEPTED status)
    const { data: attendedSubmissions, error: submissionsError } = await supabase
      .from('Submission')
      .select('eventId')
      .eq('volunteerId', volunteerId)
      .eq('status', 'ACCEPTED');

    if (submissionsError) {
      console.error('Error fetching attended events:', submissionsError);
      return new Response(
        JSON.stringify({ error: 'Failed to fetch attended events' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!attendedSubmissions || attendedSubmissions.length === 0) {
      return new Response(
        JSON.stringify({ 
          recommendations: [],
          message: 'No attended events found. Attend some events first to get personalized recommendations.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const attendedEventIds = attendedSubmissions.map(s => s.eventId);

    // Get embeddings for attended events
    const { data: attendedEvents, error: eventsError } = await supabase
      .from('Event')
      .select('id, embedding')
      .in('id', attendedEventIds)
      .not('embedding', 'is', null);

    if (eventsError || !attendedEvents || attendedEvents.length === 0) {
      console.error('Error fetching event embeddings:', eventsError);
      return new Response(
        JSON.stringify({ 
          recommendations: [],
          message: 'Event embeddings not generated. Please generate embeddings first.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate average embedding from attended events
    const embeddingDim = attendedEvents[0].embedding.length;
    const avgEmbedding = new Array(embeddingDim).fill(0);
    
    attendedEvents.forEach(event => {
      event.embedding.forEach((val: number, idx: number) => {
        avgEmbedding[idx] += val;
      });
    });
    
    avgEmbedding.forEach((val, idx) => {
      avgEmbedding[idx] = val / attendedEvents.length;
    });

    // Find similar events based on average embedding
    // Exclude events the volunteer already attended
    let query = supabase
      .from('Event')
      .select('*')
      .gte('startDate', new Date().toISOString())
      .not('embedding', 'is', null)
      .not('id', 'in', `(${attendedEventIds.join(',')})`)
      .limit(limit * 3); // Get more to filter by similarity

    // Apply filters
    if (filters.dateRange?.start) {
      query = query.gte('startDate', filters.dateRange.start);
    }
    if (filters.dateRange?.end) {
      query = query.lte('endDate', filters.dateRange.end);
    }
    if (filters.location) {
      query = query.ilike('placeName', `%${filters.location}%`);
    }
    if (filters.category) {
      query = query.eq('topic', filters.category);
    }

    const { data: candidateEvents, error: candidatesError } = await query;

    if (candidatesError) {
      console.error('Error fetching candidate events:', candidatesError);
      throw candidatesError;
    }

    if (!candidateEvents || candidateEvents.length === 0) {
      return new Response(
        JSON.stringify({ 
          recommendations: [],
          message: 'No new events found matching your criteria.'
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Calculate cosine similarity for each candidate event
    const eventsWithSimilarity = candidateEvents.map(event => {
      const similarity = cosineSimilarity(avgEmbedding, event.embedding);
      return { ...event, similarity };
    });

    // Sort by similarity and return top results
    const recommendations = eventsWithSimilarity
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, limit);

    console.log(`Found ${recommendations.length} recommendations for volunteer ${volunteerId} based on ${attendedEvents.length} attended events`);

    return new Response(
      JSON.stringify({ 
        recommendations,
        volunteerId,
        basedOnEvents: attendedEvents.length
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in get-event-recommendations:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
