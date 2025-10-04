import { useEffect, useRef, useState } from 'react';
import mapboxgl, { GeoJSONSource } from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { pl } from 'date-fns/locale';

// Keep the interfaces the same
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
  // Use a state to track if the map is loaded
  const [mapIsLoaded, setMapIsLoaded] = useState(false);
  const mapboxToken = 'pk.eyJ1IjoicmVpLW9rZWoiLCJhIjoiY21nY2Q0bXJqMTU5eDJpc2FodWszbzFzMiJ9.-14h-1T7nra54h4EL5z9hg'; // It's better to store this in an env variable

  // 1. Fetch data (same as before)
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

  // 2. Initialize the map ONCE
  useEffect(() => {
    if (map.current || !mapContainer.current) return; // Initialize map only once

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

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    map.current.on('load', () => {
      setMapIsLoaded(true);
    });

    // Cleanup function to remove the map on component unmount
    return () => {
      map.current?.remove();
    };
  }, []); // <-- Empty dependency array ensures this runs only once

  // 3. Add data and layers to the map when data or map readiness changes
  useEffect(() => {
    if (!mapIsLoaded || !map.current) return;

    const mapInstance = map.current;

    if (showAllEvents) {
      // Format events data into a GeoJSON FeatureCollection
      const features = events.map((event) => ({
        type: 'Feature' as const,
        geometry: {
          type: 'Point' as const,
          coordinates: [event.longitude, event.latitude],
        },
        properties: { // Pass all event data to properties
          ...event,
          organizationName: event.Organization?.name || 'Organizator',
        },
      }));

      const geoJsonData: GeoJSON.FeatureCollection<GeoJSON.Point> = {
        type: 'FeatureCollection',
        features,
      };

      // Add or update the GeoJSON source
      const source = mapInstance.getSource('events') as GeoJSONSource;
      if (source) {
        source.setData(geoJsonData);
      } else {
        mapInstance.addSource('events', {
          type: 'geojson',
          data: geoJsonData,
        });
      }

      // Add a layer to render the points, if it doesn't exist
      if (!mapInstance.getLayer('event-points')) {
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
      }

      // Handle Interactivity
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

            // Ensure coordinates are numbers
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
                coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            const popupHTML = `
              <div class="p-3 min-w-[200px]">
                <h3 class="font-semibold text-sm mb-1">${properties?.title}</h3>
                <p class="text-xs text-muted-foreground mb-1">${properties?.organizationName}</p>
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

    } else if (latitude && longitude) {
      // Handle the single marker case (can still use a layer for consistency or keep the marker)
      const el = document.createElement('div');
      el.className = 'w-8 h-8 rounded-full border-2 border-white shadow-lg';
      el.style.backgroundColor = 'hsl(var(--primary))';
      
      new mapboxgl.Marker(el)
        .setLngLat([longitude, latitude])
        .addTo(mapInstance);
    }

  }, [mapIsLoaded, events, showAllEvents, navigate, latitude, longitude]);


  return <div ref={mapContainer} className="h-full w-full rounded-lg" />;
};

export default Map;