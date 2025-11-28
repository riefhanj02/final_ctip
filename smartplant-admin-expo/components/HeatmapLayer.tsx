// components/HeatmapLayer.tsx
// Custom Heatmap Layer Component using leaflet.heat directly (React 19 + react-leaflet 5 compatible)

import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import type { LatLng } from 'leaflet';

interface HeatmapLayerProps {
  points: Array<{ lat: number; lng: number; weight?: number }>;
  radius?: number;
  blur?: number;
  max?: number;
  gradient?: { [key: number]: string };
}

export default function HeatmapLayer({ 
  points, 
  radius = 25, 
  blur = 15, 
  max = 1.0,
  gradient 
}: HeatmapLayerProps) {
  const map = useMap();

  useEffect(() => {
    // Check if leaflet.heat is available
    if (typeof window === 'undefined' || !window.L || !window.L.heatLayer) {
      console.warn('leaflet.heat is not loaded. Loading from CDN...');
      
      // Load from CDN if not available
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/leaflet.heat@0.2.0/dist/leaflet-heat.js';
      script.onload = () => {
        console.log('leaflet.heat loaded from CDN');
        createHeatmap();
      };
      script.onerror = () => {
        console.error('Failed to load leaflet.heat from CDN');
      };
      document.head.appendChild(script);
      return;
    }

    createHeatmap();

    function createHeatmap() {
      if (!window.L || !window.L.heatLayer) {
        console.warn('leaflet.heat still not available');
        return;
      }

      // Convert points to [lat, lng, intensity] format for leaflet.heat
      const heatPoints: [number, number, number][] = points.map(p => [
        p.lat,
        p.lng,
        p.weight || 1.0
      ]);

      // Default gradient if not provided
      const defaultGradient = gradient || {
        0.0: 'rgba(0,0,255,0)',
        0.1: 'rgba(128,0,255,0.1)',
        0.3: 'rgba(0,128,255,0.3)',
        0.5: 'rgba(0,255,128,0.5)',
        0.7: 'rgba(255,255,0,0.7)',
        1.0: 'rgba(255,0,0,1)'
      };

      // Create heat layer
      const heatLayer = window.L.heatLayer(heatPoints, {
        radius: radius,
        blur: blur,
        max: max,
        gradient: defaultGradient,
        maxZoom: 18
      });

      // Add to map
      heatLayer.addTo(map);

      // Cleanup function
      return () => {
        if (map && heatLayer) {
          map.removeLayer(heatLayer);
        }
      };
    }
  }, [map, points, radius, blur, max, gradient]);

  return null; // This component doesn't render anything
}

