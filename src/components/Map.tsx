import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  latitude: number;
  longitude: number;
  placeName?: string;
}

const Map = ({ latitude, longitude, placeName }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const mapboxToken = 'pk.eyJ1IjoicmVpLW9rZWoiLCJhIjoiY21nY2Q0bXJqMTU5eDJpc2FodWszbzFzMiJ9.-14h-1T7nra54h4EL5z9hg';

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [longitude, latitude],
      zoom: 14,
    });

    // Add marker at event location
    const el = document.createElement('div');
    el.className = 'w-8 h-8 rounded-full cursor-pointer border-2 border-white shadow-lg';
    el.style.backgroundColor = 'hsl(var(--primary))';
    
    new mapboxgl.Marker(el)
      .setLngLat([longitude, latitude])
      .addTo(map.current!);

    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, [latitude, longitude, mapboxToken]);


  return <div ref={mapContainer} className="h-full w-full" />;
};

export default Map;
