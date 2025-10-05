import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { volunteerId } = await req.json();
    
    if (!volunteerId) {
      return new Response(
        JSON.stringify({ error: 'Volunteer ID is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch volunteer data
    const { data: volunteer, error: volunteerError } = await supabase
      .from('Volunteer')
      .select('name, interests, skills, past_events')
      .eq('id', volunteerId)
      .single();

    if (volunteerError || !volunteer) {
      console.error('Error fetching volunteer:', volunteerError);
      return new Response(
        JSON.stringify({ error: 'Volunteer not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch interaction history
    const { data: interactions } = await supabase
      .from('volunteer_event_interactions')
      .select('interaction_type, event_id')
      .eq('volunteer_id', volunteerId)
      .order('created_at', { ascending: false })
      .limit(50);

    // Fetch past events if available
    let pastEventsText = '';
    if (volunteer.past_events && volunteer.past_events.length > 0) {
      const { data: pastEvents } = await supabase
        .from('Event')
        .select('title, description, topic')
        .in('id', volunteer.past_events);

      if (pastEvents) {
        pastEventsText = pastEvents
          .map(e => `${e.title}: ${e.description || ''} (${e.topic})`)
          .join('. ');
      }
    }

    // Weight interactions (completed = 3, registered = 2, interested = 1, view = 0.5)
    const interactionWeights: Record<string, number> = {
      completed: 3,
      registered: 2,
      interested: 1,
      view: 0.5,
    };

    const weightedInteractions = interactions?.map(i => 
      `${i.interaction_type} (weight: ${interactionWeights[i.interaction_type] || 0})`
    ).join(', ') || '';

    // Combine all volunteer preference data
    const volunteerText = [
      volunteer.name,
      volunteer.interests?.length ? `Interests: ${volunteer.interests.join(', ')}` : '',
      volunteer.skills?.length ? `Skills: ${volunteer.skills.join(', ')}` : '',
      pastEventsText ? `Past events: ${pastEventsText}` : '',
      weightedInteractions ? `Recent activity: ${weightedInteractions}` : '',
    ].filter(Boolean).join('. ');

    console.log('Generating embedding for volunteer:', volunteerId);

    // Generate embedding using OpenAI
    const embeddingResponse = await fetch('https://api.openai.com/v1/embeddings', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'text-embedding-3-small',
        input: volunteerText,
      }),
    });

    if (!embeddingResponse.ok) {
      const errorText = await embeddingResponse.text();
      console.error('OpenAI API error:', embeddingResponse.status, errorText);
      throw new Error(`OpenAI API error: ${embeddingResponse.status}`);
    }

    const embeddingData = await embeddingResponse.json();
    const embedding = embeddingData.data[0].embedding;

    // Update volunteer with embedding
    const { error: updateError } = await supabase
      .from('Volunteer')
      .update({ preference_embedding: embedding })
      .eq('id', volunteerId);

    if (updateError) {
      console.error('Error updating volunteer embedding:', updateError);
      throw updateError;
    }

    console.log('Successfully generated and stored embedding for volunteer:', volunteerId);

    return new Response(
      JSON.stringify({ success: true, volunteerId }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in generate-volunteer-embedding:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
