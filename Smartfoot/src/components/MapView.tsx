import React, { useRef, useEffect, useState } from 'react';
import { MapPin, Navigation, AlertTriangle, Shield } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface Location {
  x: number;
  y: number;
}

interface Route {
  path: Location[];
  distance: number;
  duration: number;
}

interface MapViewProps {
  startLocation?: Location;
  destination?: Location;
  route?: Route;
  showRoute: boolean;
  isNavigating: boolean;
  hasEmergency: boolean;
  onLocationSelect: (location: Location) => void;
}

const MapView: React.FC<MapViewProps> = ({
  startLocation,
  destination,
  route,
  showRoute,
  isNavigating,
  hasEmergency,
  onLocationSelect
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hazards] = useState<Location[]>([]);
  const [safetyZones] = useState<Location[]>([]);
  const { toast } = useToast();

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isNavigating) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = Math.min(Math.max(0.1, (e.clientX - rect.left) / rect.width), 0.9);
    const y = Math.min(Math.max(0.1, (e.clientY - rect.top) / rect.height), 0.9);

    onLocationSelect({ x, y });
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw map background
    ctx.fillStyle = '#f3f4f6';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw route if available and should be shown
    if (showRoute && route && route.path.length > 0) {
      ctx.beginPath();
      ctx.moveTo(
        route.path[0].x * canvas.width,
        route.path[0].y * canvas.height
      );

      for (let i = 1; i < route.path.length; i++) {
        ctx.lineTo(
          route.path[i].x * canvas.width,
          route.path[i].y * canvas.height
        );
      }

      ctx.strokeStyle = hasEmergency ? '#ef4444' : isNavigating ? '#22c55e' : '#3b82f6';
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Draw start location
    if (startLocation) {
      ctx.beginPath();
      ctx.arc(
        startLocation.x * canvas.width,
        startLocation.y * canvas.height,
        8,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = '#22c55e';
      ctx.fill();
    }

    // Draw destination
    if (destination) {
      ctx.beginPath();
      ctx.arc(
        destination.x * canvas.width,
        destination.y * canvas.height,
        8,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = '#ef4444';
      ctx.fill();
    }

    // Draw hazards
    hazards.forEach(hazard => {
      ctx.beginPath();
      ctx.arc(
        hazard.x * canvas.width,
        hazard.y * canvas.height,
        6,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = '#f59e0b';
      ctx.fill();
    });

    // Draw safety zones
    safetyZones.forEach(zone => {
      ctx.beginPath();
      ctx.arc(
        zone.x * canvas.width,
        zone.y * canvas.height,
        6,
        0,
        2 * Math.PI
      );
      ctx.fillStyle = '#10b981';
      ctx.fill();
    });
  }, [startLocation, destination, route, showRoute, isNavigating, hasEmergency, hazards, safetyZones]);

  const getLocationStyle = (location: Location) => ({
    left: `${location.x * 100}%`,
    top: `${location.y * 100}%`,
  });

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg w-full aspect-[4/3]">
      <canvas
        ref={canvasRef}
        className={`w-full h-full rounded-lg ${isNavigating ? 'cursor-not-allowed' : 'cursor-crosshair'}`}
        width={800}
        height={600}
        onClick={handleCanvasClick}
      />

      {/* Only show route when showRoute is true */}
      {showRoute && route && route.path.length > 0 && (
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  <motion.path
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            d={`M ${route.path.map(p => `${p.x * 100} ${p.y * 100}`).join(' L ')}`}
                    fill="none"
            stroke={hasEmergency ? "#ef4444" : "#3b82f6"}
                    strokeWidth="3"
                    strokeLinecap="round"
            strokeDasharray={hasEmergency ? "10,5" : "5,5"}
            className={isNavigating ? 'animate-pulse' : ''}
                  />
        </svg>
            )}

      {/* Only show hazards and safety zones when route is shown */}
      {showRoute && (
        <>
          {/* Safety Zones */}
            <AnimatePresence>
            {safetyZones.map((zone, index) => (
              <motion.div
                key={`safety-${index}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-green-500"
                style={getLocationStyle(zone)}
              >
                <Shield className="w-6 h-6" />
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <div className="absolute inset-0 rounded-full bg-green-500 opacity-10" />
                </motion.div>
              </motion.div>
            ))}
            </AnimatePresence>

          {/* Hazard Markers */}
            <AnimatePresence>
            {hazards.map((hazard, index) => (
              <motion.div
                key={`hazard-${index}`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                className="absolute -translate-x-1/2 -translate-y-1/2 text-red-500"
                style={getLocationStyle(hazard)}
              >
                <AlertTriangle className="w-6 h-6" />
                <motion.div
                  className="absolute inset-0"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <div className="absolute inset-0 rounded-full bg-red-500 opacity-20" />
                </motion.div>
              </motion.div>
            ))}
          </AnimatePresence>
        </>
      )}

      {/* Start Location Marker */}
      <AnimatePresence>
        {startLocation && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={getLocationStyle(startLocation)}
          >
            <div className="relative">
              <MapPin className={`w-8 h-8 ${hasEmergency ? 'text-red-500' : 'text-blue-500'}`} />
              <div className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 ${
                hasEmergency ? 'bg-red-500' : 'bg-blue-500'
              } rounded-full`} />
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className={`absolute inset-0 rounded-full ${
                  hasEmergency ? 'bg-red-500' : 'bg-blue-500'
                } opacity-20`} />
              </motion.div>
            </div>
          </motion.div>
              )}
            </AnimatePresence>

      {/* Destination Marker */}
      <AnimatePresence>
        {destination && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ type: "spring", damping: 15 }}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={getLocationStyle(destination)}
          >
            <div className="relative">
              <Navigation className="w-8 h-8 text-green-500" />
              <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-green-500 rounded-full" />
              <motion.div
                className="absolute inset-0"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="absolute inset-0 rounded-full bg-green-500 opacity-20" />
              </motion.div>
            </div>
              </motion.div>
            )}
          </AnimatePresence>

      {/* Navigation Status Overlay */}
      {isNavigating && (
        <div className="absolute inset-0 bg-black/5 pointer-events-none">
          <div className={`absolute top-4 left-4 bg-white/90 rounded-lg px-4 py-2 shadow-lg ${
            hasEmergency ? 'border-2 border-red-500' : ''
          }`}>
            <p className={`text-sm font-semibold ${hasEmergency ? 'text-red-600' : 'text-gray-900'}`}>
              {hasEmergency ? 'Emergency Mode Active' : 'Navigation Active'}
            </p>
            <p className="text-xs text-gray-600">
              {hasEmergency ? 'Emergency services notified' : 'Following safest route'}
            </p>
      </div>
      </div>
      )}
    </div>
  );
};

export default MapView; 