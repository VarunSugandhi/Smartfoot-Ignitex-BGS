import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapBoxProps {
  className?: string;
  center?: [number, number];
  zoom?: number;
  accessToken: string;
  destination?: [number, number];
  onLocationUpdate?: (location: [number, number]) => void;
  onRouteUpdate?: (routeInfo: {
    distance: number;
    duration: number;
    geometry: any;
  }) => void;
  travelMode?: 'driving' | 'walking' | 'cycling';
}

const MapBox: React.FC<MapBoxProps> = ({ 
  className, 
  center = [77.5946, 12.9716], // Default to Bangalore
  zoom = 12,
  accessToken,
  destination,
  onLocationUpdate,
  onRouteUpdate,
  travelMode = 'driving'
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const userMarker = useRef<mapboxgl.Marker | null>(null);
  const destinationMarker = useRef<mapboxgl.Marker | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Validate token format (Mapbox tokens start with 'pk.eyJ1')
      if (!accessToken.startsWith('pk.eyJ1')) {
        throw new Error('Invalid Mapbox access token format. Token should start with "pk.eyJ1"');
      }

      mapboxgl.accessToken = accessToken;

      // Create new map instance
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12', // Changed to a default Mapbox style
        center: center,
        zoom: zoom,
        attributionControl: true,
        antialias: true,
        pitch: 45,
        bearing: 0,
        preserveDrawingBuffer: true,
        maxZoom: 18,
        minZoom: 3
      });

      // Add navigation controls
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
          showZoom: true,
          showCompass: true,
        }),
        'top-right'
      );

      // Add scale control
      map.current.addControl(
        new mapboxgl.ScaleControl({
          maxWidth: 150,
          unit: 'metric'
        }),
        'bottom-left'
      );

      // Initialize user marker
      userMarker.current = new mapboxgl.Marker({
        color: '#4B9CD3',
        scale: 0.8,
      });

      // Add geolocation control with callback
      const geolocate = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      });

      map.current.addControl(geolocate, 'top-right');

      // Handle user location updates
      geolocate.on('geolocate', (e: any) => {
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
      });

      // Add fullscreen control
      map.current.addControl(
        new mapboxgl.FullscreenControl(),
        'top-right'
      );

      // Handle map load
      map.current.on('load', () => {
        if (map.current) {
          map.current.resize();
          
          // Add route layer
          map.current.addSource('route', {
            type: 'geojson',
            data: {
              type: 'Feature',
              properties: {},
              geometry: {
                type: 'LineString',
                coordinates: []
              }
            }
          });

          map.current.addLayer({
            id: 'route',
            type: 'line',
            source: 'route',
            layout: {
              'line-join': 'round',
              'line-cap': 'round'
            },
            paint: {
              'line-color': '#4B9CD3',
              'line-width': 4,
              'line-opacity': 0.8
            }
          });

          // Add 3D buildings
          if (!map.current.getLayer('3d-buildings')) {
            map.current.addLayer({
              'id': '3d-buildings',
              'source': 'composite',
              'source-layer': 'building',
              'filter': ['==', 'extrude', 'true'],
              'type': 'fill-extrusion',
              'minzoom': 15,
              'paint': {
                'fill-extrusion-color': '#aaa',
                'fill-extrusion-height': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'height']
                ],
                'fill-extrusion-base': [
                  'interpolate',
                  ['linear'],
                  ['zoom'],
                  15,
                  0,
                  15.05,
                  ['get', 'min_height']
                ],
                'fill-extrusion-opacity': 0.6
              }
            });
          }

          // Trigger geolocation on load
          geolocate.trigger();
        }
      });

      // Error handling
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e);
        const errorMessage = e.error ? e.error.message : 'Error loading map';
        setError(`Map Error: ${errorMessage}`);
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
  }, [accessToken, center, zoom, onLocationUpdate]);

  // Update destination marker and route when destination changes
  useEffect(() => {
    if (!map.current || !destination) return;

    // Update or create destination marker
    if (!destinationMarker.current) {
      destinationMarker.current = new mapboxgl.Marker({
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
    const bounds = new mapboxgl.LngLatBounds();
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
      const query = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/${travelMode}/${start[0]},${start[1]};${end[0]},${end[1]}?steps=true&geometries=geojson&access_token=${accessToken}`
      );
      const json = await query.json();

      if (json.routes && json.routes[0]) {
        const route = json.routes[0];
        const routeSource = map.current.getSource('route') as mapboxgl.GeoJSONSource;
        
        if (routeSource) {
          routeSource.setData({
            type: 'Feature',
            properties: {},
            geometry: route.geometry
          });
        }

        if (onRouteUpdate) {
          onRouteUpdate({
            distance: route.distance,
            duration: route.duration,
            geometry: route.geometry
          });
        }
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
          <p className="text-xs text-gray-500 mt-2">Please check your Mapbox access token and internet connection.</p>
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

export default MapBox; 