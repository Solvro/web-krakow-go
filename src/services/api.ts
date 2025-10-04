import { supabase } from '@/integrations/supabase/client';

export interface ApiEvent {
  id: string;
  title: string;
  topic: 'ANIMALS' | 'CHILDREN' | 'COMMUNITY' | 'EDUCATION' | 'ELDERLY' | 'ENVIRONMENT' | 'HEALTH' | 'OTHER' | 'TECH';
  description: any;
  startDate: string;
  endDate: string;
  longitude: number;
  latitude: number;
  placeName: string;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export const api = {
  async getEvents(): Promise<ApiEvent[]> {
    const { data, error } = await supabase
      .from('Event')
      .select('*')
      .order('startDate', { ascending: true });
    
    if (error) {
      throw new Error('Failed to fetch events');
    }
    
    return (data || []).map(event => ({
      ...event,
      startDate: event.startDate,
      endDate: event.endDate,
      createdAt: event.createdAt,
      updatedAt: event.updatedAt,
    }));
  },
};
