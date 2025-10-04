const API_BASE_URL = 'http://10.250.161.41:3000/api';

export interface ApiEvent {
  id: string;
  title: string;
  topic: 'ANIMALS' | 'ENVIRONMENT' | 'EDUCATION' | 'HEALTH' | 'CULTURE' | 'SPORT' | 'OTHER';
  description: any;
  startDate: string;
  endDate: string;
  longitude: number;
  latitude: number;
  organizationId: string;
  createdAt: string;
  updatedAt: string;
}

export const api = {
  async getEvents(): Promise<ApiEvent[]> {
    const response = await fetch(`${API_BASE_URL}/event`);
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    return response.json();
  },
};
