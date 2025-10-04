import { useEffect, useRef, useState } from 'react';
import mapboxgl, { GeoJSONSource, Map as MapboxMap } from 'mapbox-gl'; // Import Map type
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

// Interfejsy bez zmian
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
  const map = useRef<MapboxMap | null>(null);
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const mapboxToken = 'pk.eyJ1IjoicmVpLW9rZWoiLCJhIjoiY21nY2Q0bXJqMTU5eDJpc2FodWszbzFzMiJ9.-14h-1T7nra54h4EL5z9hg';

  // 1. Pobieranie danych (bez zmian)
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
    } else {
      setEvents([]); // Wyczyść eventy, jeśli nie mamy pokazywać wszystkich
    }
  }, [showAllEvents]);

  // 2. Inicjalizacja mapy i konfiguracja jej struktury (źródła, warstwy, eventy)
  useEffect(() => {
    if (map.current || !mapContainer.current) return; // Inicjalizuj tylko raz

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

    const mapInstance = map.current;

    mapInstance.on('load', () => {
      // Gdy mapa jest gotowa, dodaj puste źródło danych i warstwę
      mapInstance.addSource('events', {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [],
        },
      });

      mapInstance.addLayer({
        id: 'event-points',
        type: 'circle',
        source: 'events',
        paint: {
          'circle-radius': 10,
          'circle-color': 'hsl(var(--primary))',
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });
      
      // Dodaj interaktywność (popup i nawigację)
      const popup = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false,
        className: 'event-popup'
      });

      mapInstance.on('mouseenter', 'event-points', (e) => {
        mapInstance.getCanvas().style.cursor = 'pointer';

        if (e.features && e.features.length > 0) {
            const feature = e.features[0];
            const coordinates = (feature.geometry as GeoJSON.Point).coordinates.slice();
            const properties = feature.properties;

            const popupHTML = `
              <div class="p-3 min-w-[200px]">
                <h3 class="font-semibold text-sm mb-1">${properties?.title}</h3>
                <p class="text-xs text-muted-foreground mb-1">${properties?.Organization?.name || 'Organizator'}</p>
                <p class="text-xs text-muted-foreground mb-1">${properties?.placeName}</p>
                <p class="text-xs text-muted-foreground">${format(new Date(properties?.startDate), 'd MMM yyyy, HH:mm', { locale: pl })}</p>
              </div>
            `;

            popup.setLngLat(coordinates as [number, number]).setHTML(popupHTML).addTo(mapInstance);
        }
      });

      mapInstance.on('mouseleave', 'event-points', () => {
        mapInstance.getCanvas().style.cursor = '';
        popup.remove();
      });

      mapInstance.on('click', 'event-points', (e) => {
        if (e.features && e.features.length > 0) {
          const eventId = e.features[0].properties?.id;
          if(eventId) {
            navigate(`/oferta/${eventId}`);
          }
        }
      });

      // Jeśli mamy do czynienia ze stroną szczegółów wydarzenia (nie `showAllEvents`)
      if (!showAllEvents && latitude && longitude) {
        new mapboxgl.Marker({ color: 'hsl(var(--primary))' })
          .setLngLat([longitude, latitude])
          .addTo(mapInstance);
      }
    });

    mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      mapInstance.remove();
      map.current = null;
    };
  }, []); // <-- Pusta tablica zależności gwarantuje uruchomienie tylko raz

  // 3. Aktualizuj dane na mapie, gdy zmieni się stan `events`
  useEffect(() => {
    // Upewnij się, że mapa istnieje i ma już źródło 'events'
    if (map.current && map.current.isStyleLoaded() && map.current.getSource('events')) {
      const source = map.current.getSource('events') as GeoJSONSource;
      
      const features = events.map((event) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [event.longitude, event.latitude],
        },
        properties: event, // Przekaż cały obiekt eventu
      }));

      source.setData({
        type: 'FeatureCollection',
        features,
      });
    }
  }, [events]); // <-- Ten hook zależy tylko od `events`

  return <div ref={mapContainer} className="h-full w-full rounded-lg" />;
};

export default Map;