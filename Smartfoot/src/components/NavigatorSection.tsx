import React, { useState, useEffect, useCallback, useRef } from 'react';
import { MapPin, Navigation as NavigationIcon, Clock, Compass, ChevronRight, Loader2 } from 'lucide-react';
import MapView from './MapView';
import SafetyCheck from './SafetyCheck';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import EmergencySection from './EmergencySection';

interface Location {
  x: number;
  y: number;
}

interface Route {
  path: Location[];
  distance: number;
  duration: number;
}

interface EmergencyContact {
  name: string;
  phoneNumber: string;
  relationship: string;
}

const NavigatorSection: React.FC = () => {
  const [startLocation, setStartLocation] = useState<Location>();
  const [destination, setDestination] = useState<Location>();
  const [route, setRoute] = useState<Route>();
  const [isNavigating, setIsNavigating] = useState(false);
  const [startInput, setStartInput] = useState('');
  const [destinationInput, setDestinationInput] = useState('');
  const [startTime, setStartTime] = useState('');
  const [isLiveTime, setIsLiveTime] = useState(false);
  const [isStartLive, setIsStartLive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showEmergencyDialog, setShowEmergencyDialog] = useState(false);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([
    { name: 'Emergency Contact 1', phoneNumber: '911', relationship: 'Emergency Services' },
  ]);
  const { toast } = useToast();
  const [showSafetyCheck, setShowSafetyCheck] = useState(false);
  const safetyCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const lastSafetyCheck = useRef<number>(Date.now());
  const [hasEmergency, setHasEmergency] = useState(false);
  const [frozenStartTime, setFrozenStartTime] = useState<string>('');
  const [showRoute, setShowRoute] = useState(false);
  const [safetyChecksEnabled, setSafetyChecksEnabled] = useState(false);
  const [emergencyContactsEnabled, setEmergencyContactsEnabled] = useState(false);

  // Update live time
  useEffect(() => {
    if (isLiveTime && !isNavigating) {
      const updateTime = () => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        setStartTime(`${hours}:${minutes}`);
      };
      
      updateTime();
      const interval = setInterval(updateTime, 60000); // Update every minute
      return () => clearInterval(interval);
    }
  }, [isLiveTime, isNavigating]);

  // Add safety check interval when navigation starts
  useEffect(() => {
    if (isNavigating) {
      // Initial safety check after 30 seconds
      const initialTimeout = setTimeout(() => {
        setShowSafetyCheck(true);
        lastSafetyCheck.current = Date.now();
      }, 30000); // 30 seconds after journey starts

      return () => {
        clearTimeout(initialTimeout);
        if (safetyCheckInterval.current) {
          clearInterval(safetyCheckInterval.current);
        }
      };
    } else {
      if (safetyCheckInterval.current) {
        clearInterval(safetyCheckInterval.current);
      }
      setShowSafetyCheck(false);
    }
  }, [isNavigating]);

  const handleLocationSelect = useCallback((location: Location) => {
    if (isNavigating) return;

    if (!startLocation) {
      setStartLocation(location);
      setStartInput('Selected on map');
      setShowRoute(false);
      toast({
        title: 'Start Location Set',
        description: 'Click on the map again to set your destination.',
      });
    } else if (!destination) {
      setDestination(location);
      setDestinationInput('Selected on map');
      setShowRoute(false);
      toast({
        title: 'Destination Set',
        description: 'You can now find routes or click Reset to change locations.',
      });
    } else {
      // If both locations are set, update the destination
      setDestination(location);
      setDestinationInput('Selected on map');
      setShowRoute(false);
      toast({
        title: 'Destination Updated',
        description: 'Your destination has been updated on the map.',
      });
    }
  }, [startLocation, destination, isNavigating]);

  const handleStartLiveLocation = async () => {
    setIsLoading(true);
    try {
      const position = await getCurrentPosition();
    const mockLocation = {
        x: position ? 0.3 + Math.random() * 0.4 : 0.3 + Math.random() * 0.4,
        y: position ? 0.3 + Math.random() * 0.4 : 0.3 + Math.random() * 0.4
    };
    setStartLocation(mockLocation);
    setStartInput('Current Location');
      setIsStartLive(true);
      setShowRoute(false);
      toast({
        title: 'Using Live Location',
        description: 'Your current location has been placed on the map.',
      });
    } catch (error) {
      toast({
        title: 'Location Error',
        description: 'Failed to get current location. Please check your location settings.',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentPosition = (): Promise<GeolocationPosition> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject(new Error('Geolocation is not supported'));
        return;
      }

      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 0
      });
    });
  };

  const handleFindRoutes = () => {
    if (!startLocation || !destination) {
      toast({
        title: 'Cannot Find Routes',
        description: 'Please set both start and destination locations.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    // Simulate route calculation with mock data
    setTimeout(() => {
      const mockRoute: Route = {
        path: [
          startLocation,
          { x: (startLocation.x + destination.x) / 2, y: (startLocation.y + destination.y) / 2 },
          destination
        ],
        distance: Math.round(Math.random() * 5 * 10) / 10, // Random distance between 0-5km
        duration: Math.round(Math.random() * 30), // Random duration between 0-30 minutes
      };
      setRoute(mockRoute);
      setShowRoute(true);
      setIsLoading(false);
      toast({
        title: 'Route Found',
        description: 'The safest route has been calculated.',
      });
    }, 1500);
  };

  const handleReset = () => {
    setStartLocation(undefined);
    setDestination(undefined);
    setStartInput('');
    setDestinationInput('');
    setStartTime('');
    setIsLiveTime(false);
    setShowRoute(false);
    setRoute(undefined);
  };

  const checkEmergencyHours = () => {
    const now = new Date();
    const hours = now.getHours();
    return hours >= 23 || hours < 4;
  };

  const handleStartJourney = () => {
    if (!showRoute) {
      toast({
        title: "No Route Found",
        description: "Please find a route before starting your journey.",
        variant: "destructive",
      });
      return;
    }

    const isEmergencyTime = checkEmergencyHours();
    if (isEmergencyTime) {
      toast({
        title: "Emergency Hours Warning",
        description: "You are starting a journey during emergency hours (11 PM - 4 AM). Enhanced safety measures are active.",
        variant: "destructive",
        duration: 7000,
      });
      // Enable additional safety measures
      setSafetyChecksEnabled(true);
      setEmergencyContactsEnabled(true);
    }

    setIsNavigating(true);
    // Freeze the current time when starting journey
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}`;
    setFrozenStartTime(currentTime);
    setStartTime(currentTime);
    
    setHasEmergency(false);
    toast({
      title: 'Journey Started',
      description: 'Safety monitoring will begin in 60 seconds. Stay safe!',
      duration: 5000,
    });
  };

  const handleEndJourney = () => {
    setShowEmergencyDialog(true);
  };

  const confirmEndJourney = () => {
    setIsNavigating(false);
    setShowEmergencyDialog(false);
    
    // Reset frozen time
    setFrozenStartTime('');
    
    toast({
      title: 'Journey Ended',
      description: hasEmergency 
        ? 'Your journey has ended unsuccessfully. Emergency services have been notified.'
        : 'Your journey has been completed safely.',
      variant: hasEmergency ? 'destructive' : 'default',
    });
  };

  const handleEmergency = (data: any) => {
    setHasEmergency(true);
    toast({
      title: "Emergency Alert",
      description: "Emergency services have been notified of your location.",
      variant: "destructive",
      duration: 10000,
    });
    // Here you would typically make an API call to your emergency service
    console.log("Emergency triggered:", data);
  };

  const handleSafetyResponse = useCallback((isSafe: boolean) => {
    lastSafetyCheck.current = Date.now();
    setShowSafetyCheck(false);
    
    if (!isSafe) {
      handleEmergency({
        userId: "user123",
        timestamp: Date.now(),
        currentLocation: startLocation,
        pastLocation: startLocation,
      });
    }
  }, [startLocation]);

  // Update start location when input changes
  const handleStartInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setStartInput(value);
    if (value.trim()) {
      // Generate a mock location based on input
      const mockLocation = {
        x: 0.3 + Math.random() * 0.4,
        y: 0.3 + Math.random() * 0.4
      };
      setStartLocation(mockLocation);
      toast({
        title: 'Start Location Set',
        description: 'Start point has been placed on the map.',
      });
    } else {
      setStartLocation(undefined);
    }
    // Reset route when changing locations
    setShowRoute(false);
  };

  // Update destination when input changes
  const handleDestinationInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDestinationInput(value);
    if (value.trim()) {
      // Generate a mock location based on input
      const mockLocation = {
        x: 0.3 + Math.random() * 0.4,
        y: 0.3 + Math.random() * 0.4
      };
      setDestination(mockLocation);
      toast({
        title: 'Destination Set',
        description: 'Destination point has been placed on the map.',
      });
    } else {
      setDestination(undefined);
    }
    // Reset route when changing locations
    setShowRoute(false);
  };

  return (
    <div className="relative">
      <div className="w-full max-w-6xl mx-auto px-4 pt-28 pb-8">
      <div className="flex flex-col lg:flex-row gap-6">
          {/* Left Column - Navigation Controls */}
          <div className="w-full lg:w-1/3 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                <NavigationIcon className="h-7 w-7 text-primary" />
              Smart Navigator
            </h2>

            <div className="space-y-6">
              {/* Start Location */}
              <div>
                  <label className="block text-sm font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-between">
                    <span>Start Location</span>
                    <span className="text-xs text-gray-500 font-normal">Click on map or enter text</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <MapPin className="h-5 w-5 text-gray-600" />
                  </div>
                  <input
                    type="text"
                    value={startInput}
                      onChange={handleStartInputChange}
                      className="block w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-semibold placeholder:text-gray-500 placeholder:font-normal"
                      placeholder="Enter your starting point"
                      disabled={isNavigating}
                  />
                  <button
                    onClick={handleStartLiveLocation}
                      disabled={isNavigating || isLoading}
                    className={`absolute inset-y-0 right-0 px-3 flex items-center ${
                        isStartLive ? 'text-primary' : 'text-gray-600 hover:text-primary'
                      } disabled:opacity-50`}
                  >
                      {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                    <Compass className="h-5 w-5" />
                      )}
                  </button>
                </div>
              </div>

              {/* Destination */}
              <div>
                  <label className="block text-sm font-bold text-gray-800 dark:text-white mb-2 flex items-center justify-between">
                    <span>Destination</span>
                    <span className="text-xs text-gray-500 font-normal">Click on map or enter text</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <NavigationIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <input
                    type="text"
                    value={destinationInput}
                      onChange={handleDestinationInputChange}
                      className="block w-full pl-10 pr-3 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary text-gray-900 font-semibold placeholder:text-gray-500 placeholder:font-normal"
                      placeholder="Enter your destination"
                      disabled={isNavigating}
                  />
                </div>
              </div>

              {/* Time Selection */}
              <div>
                  <label className="block text-sm font-bold text-gray-800 mb-2">
                  Start Time
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Clock className="h-5 w-5 text-gray-600" />
                  </div>
                  <input
                    type="time"
                      value={isNavigating ? frozenStartTime : startTime}
                      onChange={(e) => !isNavigating && setStartTime(e.target.value)}
                      disabled={isLiveTime || isNavigating}
                      className="block w-full pl-10 pr-12 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary disabled:opacity-50 text-gray-900 font-semibold"
                  />
                  <button
                      onClick={() => !isNavigating && setIsLiveTime(!isLiveTime)}
                      disabled={isNavigating}
                    className={`absolute inset-y-0 right-0 px-3 flex items-center ${
                        isLiveTime ? 'text-primary' : 'text-gray-600 hover:text-primary'
                      } disabled:opacity-50`}
                  >
                    <Clock className="h-5 w-5" />
                  </button>
                </div>
              </div>

                {/* Action Buttons */}
                <div className="space-y-4 pt-2">
                  <Button
                onClick={handleFindRoutes}
                    disabled={isNavigating || isLoading || !startLocation || !destination}
                    className="w-full flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white py-3 px-4 rounded-lg font-bold transition-colors disabled:opacity-50"
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span className="font-bold">Calculating Route...</span>
                      </>
                    ) : (
                      <>
                        <span className="font-bold">Find Routes</span>
                <ChevronRight className="h-5 w-5" />
                      </>
                    )}
                  </Button>

                  {startLocation && destination && (
                    <Button
                      onClick={isNavigating ? handleEndJourney : handleStartJourney}
                      disabled={!showRoute && !isNavigating}
                      className={`w-full flex items-center justify-center gap-2 ${
                        isNavigating 
                          ? 'bg-red-500 hover:bg-red-600' 
                          : 'bg-green-500 hover:bg-green-600'
                      } text-white py-3 px-4 rounded-lg font-bold transition-colors disabled:opacity-50`}
                    >
                      <span>{isNavigating ? 'End Journey' : 'Start Journey'}</span>
                    </Button>
                  )}

                  {(startLocation || destination || startTime) && (
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      disabled={isNavigating}
                      className="w-full border-2 border-gray-300 text-gray-800 hover:bg-gray-50 disabled:opacity-50 font-bold"
                    >
                      Reset
                    </Button>
                  )}
                </div>
                    </div>
                  </div>
        </div>

          {/* Right Column - Map View */}
        <div className="w-full lg:w-2/3">
            {/* Google Maps Embed for Smart Navigator */}
            <div className="rounded-xl overflow-hidden shadow-lg mb-6">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m28!1m12!1m3!1d622.7072322075145!2d77.521654!3d13.0116666!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m13!3e0!4m3!3m2!1d13.0116945!2d77.5220557!4m3!3m2!1d13.0119921!2d77.5221362!4m3!3m2!1d13.0117565!2d77.5214722!5e0!3m2!1sen!2sin!4v1714459532005!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Smart Navigator Map"
              />
            </div>
          </div>
        </div>

        {/* Updated SafetyCheck component */}
        <SafetyCheck
          userId="user123"
          isJourneyActive={isNavigating}
          onEmergency={handleEmergency}
          emergencyContacts={emergencyContacts}
          showCheck={showSafetyCheck}
          onResponse={handleSafetyResponse}
        />

        {/* End Journey Confirmation Dialog */}
        <Dialog open={showEmergencyDialog} onOpenChange={setShowEmergencyDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-gray-900 font-bold text-lg">End Journey?</DialogTitle>
              <DialogDescription className="text-gray-800 font-medium">
                {hasEmergency 
                  ? 'Are you sure you want to end your journey? Emergency services have been notified.'
                  : 'Are you sure you want to end your journey? This will deactivate safety monitoring.'}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setShowEmergencyDialog(false)}
                className="font-bold text-gray-800"
              >
                Cancel
              </Button>
              <Button
                variant={hasEmergency ? 'destructive' : 'default'}
                onClick={confirmEndJourney}
                className="font-bold"
              >
                End Journey
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Emergency Section */}
      <EmergencySection />
    </div>
  );
};

export default NavigatorSection; 