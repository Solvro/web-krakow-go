import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from '@/components/ui/input';

interface MapProps {
  onMarkerClick?: (offerId: string) => void;
}

const Map = ({ onMarkerClick }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapboxToken, setMapboxToken] = useState('');

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [19.9450, 50.0647], // Kraków coordinates
      zoom: 12,
    });

    // Mock markers for volunteer opportunities
    const markers = [
      { id: '1', lng: 19.9450, lat: 50.0647, color: '#9333ea' },
      { id: '2', lng: 19.9550, lat: 50.0747, color: '#3b82f6' },
      { id: '3', lng: 19.9350, lat: 50.0547, color: '#10b981' },
    ];

    markers.forEach((marker) => {
      const el = document.createElement('div');
      el.className = 'w-8 h-8 rounded-full cursor-pointer border-2 border-white shadow-lg';
      el.style.backgroundColor = marker.color;
      
      new mapboxgl.Marker(el)
        .setLngLat([marker.lng, marker.lat])
        .addTo(map.current!);
    });

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [mapboxToken, onMarkerClick]);

  if (!mapboxToken) {
    return (
      <div className="h-full flex items-center justify-center p-6 bg-muted/30">
        <div className="text-center max-w-md">
          <p className="text-sm text-muted-foreground mb-4">
            Wprowadź swój publiczny token Mapbox aby wyświetlić mapę
          </p>
          <Input
            type="text"
            placeholder="pk.eyJ1..."
            value={mapboxToken}
            onChange={(e) => setMapboxToken(e.target.value)}
            className="bg-card"
          />
          <p className="text-xs text-muted-foreground mt-2">
            Znajdź token na{' '}
            <a
              href="https://mapbox.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              mapbox.com
            </a>
          </p>
        </div>
      </div>
    );
  }

  return <div ref={mapContainer} className="h-full w-full" />;
};

export default Map;
