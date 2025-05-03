import React, { useEffect, useRef, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import { services } from '@tomtom-international/web-sdk-services';

interface TomTomMapProps {
  className?: string;
  center?: [number, number];
  zoom?: number;
  apiKey: string;
  destination?: [number, number];
  onLocationUpdate?: (location: [number, number]) => void;
  onRouteUpdate?: (routeInfo: {
    distance: number;
    duration: number;
    geometry: any;
  }) => void;
  travelMode?: 'car' | 'pedestrian' | 'bicycle';
}

const TomTomMap: React.FC<TomTomMapProps> = ({
  className,
  center = [77.5946, 12.9716], // Default to Bangalore
  zoom = 12,
  apiKey,
  destination,
  onLocationUpdate,
  onRouteUpdate,
  travelMode = 'car'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<tt.Map | null>(null);
  const userMarker = useRef<tt.Marker | null>(null);
  const destinationMarker = useRef<tt.Marker | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Initialize TomTom map
      map.current = tt.map({
        key: apiKey,
        container: mapContainer.current,
        center: center,
        zoom: zoom,
        language: 'en-GB',
        stylesVisibility: {
          trafficFlow: true,
          trafficIncidents: true
        }
      });

      // Add navigation controls
      map.current.addControl(new tt.NavigationControl());
      map.current.addControl(new tt.FullscreenControl());

      // Initialize user marker
      userMarker.current = new tt.Marker({
        color: '#4B9CD3',
        scale: 0.8
      });

      // Add geolocation control
      map.current.addControl(
        new tt.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserLocation: true,
          onLocationUpdate: (e: any) => {
            const userLocation: [number, number] = [e.coords.longitude, e.coords.latitude];
            if (onLocationUpdate) {
              onLocationUpdate(userLocation);
            }

            // Update user marker
            if (userMarker.current && map.current) {
              userMarker.current.setLngLat(userLocation).addTo(map.current);
            }

            // If destination exists, update route
            if (destination) {
              updateRoute(userLocation, destination);
            }
          }
        })
      );

      // Handle map load
      map.current.on('load', () => {
        // Add traffic flow layer
        map.current?.setLayoutProperty('traffic-flow', 'visibility', 'visible');
        // Add traffic incidents layer
        map.current?.setLayoutProperty('traffic-incidents', 'visibility', 'visible');
      });

      // Error handling
      map.current.on('error', (e) => {
        console.error('TomTom map error:', e);
        setError(`Map Error: ${e.error || 'Error loading map'}`);
      });

    } catch (err) {
      console.error('Map initialization error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to initialize map';
      setError(`Initialization Error: ${errorMessage}`);
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
      if (userMarker.current) {
        userMarker.current.remove();
        userMarker.current = null;
      }
      if (destinationMarker.current) {
        destinationMarker.current.remove();
        destinationMarker.current = null;
      }
    };
  }, [apiKey, center, zoom, onLocationUpdate]);

  // Update destination marker and route when destination changes
  useEffect(() => {
    if (!map.current || !destination) return;

    // Update or create destination marker
    if (!destinationMarker.current) {
      destinationMarker.current = new tt.Marker({
        color: '#FF4B4B',
        scale: 0.8
      });
    }

    destinationMarker.current.setLngLat(destination).addTo(map.current);

    // If we have user location, update route
    if (userMarker.current) {
      const userLocation = userMarker.current.getLngLat();
      updateRoute([userLocation.lng, userLocation.lat], destination);
    }

    // Fit bounds to include both markers
    const bounds = new tt.LngLatBounds();
    if (userMarker.current) {
      bounds.extend(userMarker.current.getLngLat());
    }
    bounds.extend(destination);
    map.current.fitBounds(bounds, { padding: 100 });

  }, [destination, travelMode]);

  // Function to update route
  const updateRoute = async (start: [number, number], end: [number, number]) => {
    if (!map.current) return;

    try {
      const routeResponse = await services.calculateRoute({
        key: apiKey,
        locations: [
          { lat: start[1], lng: start[0] },
          { lat: end[1], lng: end[0] }
        ],
        travelMode: travelMode
      });

      const route = routeResponse.routes[0];
      
      // Remove existing route layer if it exists
      if (map.current.getLayer('route')) {
        map.current.removeLayer('route');
        map.current.removeSource('route');
      }

      // Add new route layer
      map.current.addLayer({
        id: 'route',
        type: 'line',
        source: {
          type: 'geojson',
          data: {
            type: 'Feature',
            properties: {},
            geometry: route.geometry
          }
        },
        paint: {
          'line-color': '#4B9CD3',
          'line-width': 4,
          'line-opacity': 0.8
        }
      });

      if (onRouteUpdate) {
        onRouteUpdate({
          distance: route.summary.lengthInMeters,
          duration: route.summary.travelTimeInSeconds,
          geometry: route.geometry
        });
      }
    } catch (err) {
      console.error('Error fetching route:', err);
    }
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (map.current) {
        map.current.resize();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (error) {
    return (
      <div className={`w-full h-[600px] rounded-lg shadow-lg overflow-hidden bg-gray-100 dark:bg-gray-800 flex items-center justify-center ${className || ''}`}>
        <div className="text-center p-4 max-w-md">
          <p className="text-red-500 font-medium mb-2">Map Error</p>
          <p className="text-sm text-gray-600 dark:text-gray-300">{error}</p>
          <p className="text-xs text-gray-500 mt-2">Please check your TomTom API key and internet connection.</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainer}
      className={`w-full h-[600px] rounded-lg shadow-lg overflow-hidden ${className || ''}`}
      style={{ position: 'relative' }}
    />
  );
};

export default TomTomMap; 