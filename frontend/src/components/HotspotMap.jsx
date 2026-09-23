import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_TOKEN;

const CITY_BOUNDS = [[125.7200, 7.3800], [125.8900, 7.5000]]; 
const SOURCE_ID = 'hotspots';

function toGeoJSON(hotspots) {
  return {
    type: 'FeatureCollection',
    features: hotspots.map((h) => ({
      type: 'Feature',
      geometry: { type: 'Point', coordinates: [h.lng, h.lat] },
      properties: { weight: h.weight, reportCount: h.reportCount },
    })),
  };
}

export default function HotspotMap({ hotspots = [] }) {
  const mapContainer = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    mapRef.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [125.8036, 7.4472],
      zoom: 8,
      minZoom: 2,
      maxBounds: CITY_BOUNDS,
    });

    mapRef.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    mapRef.current.on('load', () => {
      mapRef.current.addSource(SOURCE_ID, { type: 'geojson', data: toGeoJSON(hotspots) });

      // Changed from 'heatmap' layer to 'circle' layer for solid dots
      mapRef.current.addLayer({
        id: 'hotspots-dots',
        type: 'circle',
        source: SOURCE_ID,
        paint: {
          // Solid dot color
          'circle-color': '#dc2626', // Solid red
          
          // Optionally scale dot size based on weight (or set to a fixed number like 8)
          'circle-radius': [
            'interpolate',
            ['linear'],
            ['get', 'weight'],
            0, 6,
            25, 14
          ],
          
          // Fully solid opacity
          'circle-opacity': 1,
          
          // Crisp white border around each dot
          'circle-stroke-width': 2,
          'circle-stroke-color': '#ffffff',
        },
      });
    });

    return () => mapRef.current?.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const source = mapRef.current?.getSource(SOURCE_ID);
    if (source) source.setData(toGeoJSON(hotspots));
  }, [hotspots]);

  return <div ref={mapContainer} style={{ width: '100%', height: '480px' }} />;
}