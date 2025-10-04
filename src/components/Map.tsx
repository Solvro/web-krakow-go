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
  const mapboxToken = 'pk.eyJ1IjoicmVpLW9rZWoiLCJhIjoiY21nY2Q0bXJqMTU5eDJpc2FodWszbzFzMiJ9.-14h-1T7nra54h4EL5z9hg';

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


  return <div ref={mapContainer} className="h-full w-full" />;
};

export default Map;
