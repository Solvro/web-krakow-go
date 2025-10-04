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
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const mapboxToken = 'pk.eyJ1IjoicmVpLW9rZWoiLCJhIjoiY21nY2Q0bXJqMTU5eDJpc2FodWszbzFzMiJ9.-14h-1T7nra54h4EL5z9hg';

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

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    const centerLng = showAllEvents ? 19.9449 : (longitude || 19.9449);
    const centerLat = showAllEvents ? 50.0647 : (latitude || 50.0647);
    const zoomLevel = showAllEvents ? 12 : 14;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [centerLng, centerLat],
      zoom: zoomLevel,
    });

    if (showAllEvents && events.length > 0) {
      // Add markers for all events
      events.forEach((event) => {
        const el = document.createElement('div');
        el.className = 'w-8 h-8 rounded-full cursor-pointer border-2 border-white shadow-lg transition-transform hover:scale-125';
        el.style.backgroundColor = 'hsl(var(--primary))';
        
        // Create popup
        const popup = new mapboxgl.Popup({ 
          offset: 25,
          closeButton: false,
          className: 'event-popup'
        }).setHTML(`
          <div class="p-3 min-w-[200px]">
            <h3 class="font-semibold text-sm mb-1">${event.title}</h3>
            <p class="text-xs text-muted-foreground mb-1">${event.Organization?.name || 'Organizator'}</p>
            <p class="text-xs text-muted-foreground mb-1">${event.placeName}</p>
            <p class="text-xs text-muted-foreground">${format(new Date(event.startDate), 'd MMM yyyy, HH:mm', { locale: pl })}</p>
          </div>
        `);

        const marker = new mapboxgl.Marker(el)
          .setLngLat([event.longitude, event.latitude])
          .setPopup(popup)
          .addTo(map.current!);

        // Navigate on click
        el.addEventListener('click', () => {
          navigate(`/oferta/${event.id}`);
        });

        // Show popup on hover
        el.addEventListener('mouseenter', () => {
          popup.addTo(map.current!);
        });

        el.addEventListener('mouseleave', () => {
          popup.remove();
        });
      });
    } else if (!showAllEvents && latitude && longitude) {
      // Single marker for event details page
      const el = document.createElement('div');
      el.className = 'w-8 h-8 rounded-full border-2 border-white shadow-lg';
      el.style.backgroundColor = 'hsl(var(--primary))';
      
      new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .addTo(map.current!);
    }

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude, mapboxToken, showAllEvents, events, navigate]);

  return <div ref={mapContainer} className="h-full w-full rounded-lg" />;
};

export default Map;
