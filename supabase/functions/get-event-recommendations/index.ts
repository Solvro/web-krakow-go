import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Fetch volunteer's preference embedding
    const { data: volunteer, error: volunteerError } = await supabase
      .from('Volunteer')
      .select('preference_embedding')
      .eq('id', volunteerId)
      .single();

    if (volunteerError || !volunteer) {
      console.error('Error fetching volunteer:', volunteerError);
      return new Response(
        JSON.stringify({ error: 'Volunteer not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!volunteer.preference_embedding) {
      return new Response(
        JSON.stringify({ 
          error: 'Volunteer profile embedding not generated. Please update volunteer profile first.',
          recommendations: []
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Build query for event recommendations using vector similarity
    // Note: Using RPC for complex vector queries with filters
    const { data: recommendations, error: recError } = await supabase.rpc(
      'get_event_recommendations',
      {
        volunteer_embedding: volunteer.preference_embedding,
        match_limit: limit,
        date_filter: filters.dateRange?.start || null,
        location_filter: filters.location || null,
        category_filter: filters.category || null,
      }
    );

    if (recError) {
      // If RPC doesn't exist, fall back to direct query
      console.log('RPC not found, using direct query');
      
      let query = supabase
        .from('Event')
        .select('*, similarity:embedding.cosine_similarity(preference_embedding)')
        .gte('startDate', new Date().toISOString())
        .not('embedding', 'is', null)
        .order('similarity', { ascending: false })
        .limit(limit);

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

      const { data: events, error: eventsError } = await query;

      if (eventsError) {
        console.error('Error fetching recommendations:', eventsError);
        throw eventsError;
      }

      console.log(`Found ${events?.length || 0} recommendations for volunteer:`, volunteerId);

      return new Response(
        JSON.stringify({ 
          recommendations: events || [],
          volunteerId,
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Found ${recommendations?.length || 0} recommendations for volunteer:`, volunteerId);

    return new Response(
      JSON.stringify({ 
        recommendations: recommendations || [],
        volunteerId,
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
