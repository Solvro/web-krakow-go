import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

interface MapProps {
  latitude?: number;
  longitude?: number;
  placeName?: string;
  showAllEvents?: boolean;
}

interface Event {
  id: string;
  title: string;
  latitude: number;
  longitude: number;
  startDate: string;
  endDate: string;
  placeName: string;
  topic: string;
  Organization: {
    name: string;
  };
}

const Map = ({ latitude, longitude, placeName, showAllEvents = false }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const mapboxToken = 'pk.eyJ1IjoicmVpLW9rZWoiLCJhIjoiY21nY2Q0bXJqMTU5eDJpc2FodWszbzFzMiJ9.-14h-1T7nra54h4EL5z9hg';

  // Fetch events only once
  useEffect(() => {
    if (showAllEvents) {
      const fetchEvents = async () => {
        const { data, error } = await supabase
          .from('Event')
          .select('id, title, latitude, longitude, startDate, endDate, placeName, topic, Organization(name)')
          .order('startDate', { ascending: true });

        if (!error && data) {
          setEvents(data as Event[]);
        }
      };

      fetchEvents();
    }
  }, [showAllEvents]);

  // Initialize map only once
  useEffect(() => {
    if (!mapContainer.current || map.current) return;

    mapboxgl.accessToken = mapboxToken;
    
    const centerLng = showAllEvents ? 19.9209 : (longitude || 19.9449);
    const centerLat = showAllEvents ? 50.0647 : (latitude || 50.0647);
    const zoomLevel = showAllEvents ? 14 : 16;

    try {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        center: [centerLng, centerLat],
        zoom: zoomLevel,
      });

      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, [showAllEvents, latitude, longitude]);

  // Update markers when events or coordinates change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    if (showAllEvents && events.length > 0) {
      // Add markers for all events
      events.forEach((event) => {
        const el = document.createElement('div');
        el.className = 'w-8 h-8 rounded-full cursor-pointer border-2 border-white shadow-lg transition-transform hover:scale-125';
        el.style.backgroundColor = 'hsl(var(--primary))';
        
        // Create popup with navigation button
        const popup = new mapboxgl.Popup({ 
          offset: 25,
          closeButton: true,
          className: 'event-popup'
        }).setHTML(`
          <div class="p-3 min-w-[200px]">
            <h3 class="font-semibold text-sm mb-1">${event.title}</h3>
            <p class="text-xs text-muted-foreground mb-1">${event.Organization?.name || 'Organizator'}</p>
            <p class="text-xs text-muted-foreground mb-1">${event.placeName}</p>
            <p class="text-xs text-muted-foreground mb-2">${format(new Date(event.startDate), 'd MMM yyyy, HH:mm', { locale: pl })}</p>
            <button 
              class="w-full bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-2 rounded-md text-xs font-medium transition-colors"
              data-event-id="${event.id}"
            >
              Zobacz wydarzenie
            </button>
          </div>
        `);

        const marker = new mapboxgl.Marker(el)
          .setLngLat([event.longitude, event.latitude])
          .setPopup(popup)
          .addTo(map.current!);

        markersRef.current.push(marker);

        // Show popup on marker click
        el.addEventListener('click', () => {
          popup.addTo(map.current!);
        });

        // Handle button click in popup
        popup.on('open', () => {
          const button = document.querySelector(`[data-event-id="${event.id}"]`);
          if (button) {
            button.addEventListener('click', () => {
              navigate(`/oferta/${event.id}`);
            });
          }
        });
      });
    } else if (!showAllEvents && latitude && longitude) {
      // Single marker for event details page
      const el = document.createElement('div');
      el.className = 'w-8 h-8 rounded-full border-2 border-white shadow-lg';
      el.style.backgroundColor = 'hsl(var(--primary))';
      
      const marker = new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .addTo(map.current!);

      markersRef.current.push(marker);
    }
  }, [events, latitude, longitude, showAllEvents, navigate]);

  return <div ref={mapContainer} className="h-[600px] w-full rounded-lg" />;
};

export default Map;