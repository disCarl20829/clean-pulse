import { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

mapboxgl.accessToken = 'YOUR_MAPBOX_ACCESS_TOKEN';

export default function MapView({ coords, onPick }) {
  const mapContainer = useRef(null);
  const map = useRef(null);
  const marker = useRef(null);

  useEffect(() => {
    if (map.current) return; // Prevent map from initializing more than once

    const initialLng = coords?.lng ?? 120.9842;
    const initialLat = coords?.lat ?? 14.5995;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [initialLng, initialLat], // Mapbox takes [lng, lat]
      zoom: 12,
    });

    // Click handler to pick location
    map.current.on('click', (e) => {
      const { lng, lat } = e.lngLat;
      if (onPick) {
        onPick({ lat, lng });
      }
    });

    // Cleanup on component unmount
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  // Update marker & fly to center when `coords` prop updates from parent
  useEffect(() => {
    if (!map.current || !coords) return;

    const { lat, lng } = coords;

    // Fly to updated coordinates
    map.current.flyTo({ center: [lng, lat], zoom: 14 });

    // Update or add marker
    if (marker.current) {
      marker.current.setLngLat([lng, lat]);
    } else {
      marker.current = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map.current);
    }
  }, [coords]);

  return (
    <div
      ref={mapContainer}
      style={{ width: '100%', height: '300px', borderRadius: '8px' }}
    />
  );
}