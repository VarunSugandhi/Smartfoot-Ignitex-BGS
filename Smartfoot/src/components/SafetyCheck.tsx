import React, { useEffect, useRef, useState, useCallback } from 'react';
import { AlertTriangle, CheckCircle, Shield, Bell, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

interface Location {
  lat: number;
  lng: number;
  timestamp: number;
}

interface EmergencyContact {
  name: string;
  phoneNumber: string;
  relationship: string;
}

interface EmergencyData {
  userId: string;
  timestamp: number;
  currentLocation: any;
  pastLocation: any;
  batteryLevel?: number;
  emergencyContact: EmergencyContact;
}

interface SafetyCheckProps {
  userId: string;
  isJourneyActive: boolean;
  onEmergency: (data: EmergencyData) => void;
  emergencyContacts?: EmergencyContact[];
  showCheck?: boolean;
  onResponse?: (isSafe: boolean) => void;
}

const SafetyCheck: React.FC<SafetyCheckProps> = ({
  userId,
  isJourneyActive,
  onEmergency,
  emergencyContacts = [],
  showCheck = false,
  onResponse
}) => {
  const [showModal, setShowModal] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'check' | 'emergency' | 'auto-emergency'>('idle');
  const [batteryLevel, setBatteryLevel] = useState<number | null>(null);
  const [hasNotificationPermission, setHasNotificationPermission] = useState(false);
  const [audioReady, setAudioReady] = useState(false);
  const [buzzingSoundStarted, setBuzzingSoundStarted] = useState(false);
  const audioContext = useRef<AudioContext | null>(null);
  const oscillator = useRef<OscillatorNode | null>(null);
  const gainNode = useRef<GainNode | null>(null);
  const phaseTimeout = useRef<NodeJS.Timeout | null>(null);
  const safetyCheckInterval = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  // Defensive fallback for mainContact
  const mainContact = emergencyContacts && emergencyContacts.length > 0
    ? emergencyContacts[0]
    : { name: 'Unknown', phoneNumber: '', relationship: '' };

  // 1. Define handleEmergencyResponse as a useCallback
  const handleEmergencyResponse = useCallback(() => {
    if (safetyCheckInterval.current) clearTimeout(safetyCheckInterval.current);
    // Get user's current location
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLocation = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
          timestamp: Date.now()
        };

        const emergencyData: EmergencyData = {
          userId,
          timestamp: Date.now(),
          currentLocation,
          pastLocation: null,
          batteryLevel: batteryLevel || undefined,
          emergencyContact: mainContact
        };

        onEmergency(emergencyData);

        if (hasNotificationPermission) {
          new Notification('Emergency Alert Sent', {
            body: `Emergency contact ${mainContact.name} has been notified.`,
            icon: '/emergency-icon.png'
          });
        }

        toast({
          title: "Emergency Alert Sent",
          description: `Emergency contact ${mainContact.name} has been notified.`,
          variant: "destructive",
          duration: 5000,
        });
      },
      (error) => {
        console.error('Geolocation error:', error);
        
        const emergencyData: EmergencyData = {
          userId,
          timestamp: Date.now(),
          currentLocation: null,
          pastLocation: null,
          batteryLevel: batteryLevel || undefined,
          emergencyContact: mainContact
        };

        onEmergency(emergencyData);

        toast({
          title: "Emergency Alert Sent",
          description: "Unable to get location, but emergency contact has been notified.",
          variant: "destructive",
          duration: 5000,
        });
      }
    );

    if (onResponse) {
      onResponse(false);
    }
  }, [userId, batteryLevel, mainContact, onEmergency, hasNotificationPermission, toast, onResponse]);

  // 2. Then define handleEmergency
  const handleEmergency = useCallback(() => {
    if (phaseTimeout.current) clearTimeout(phaseTimeout.current);
    setBuzzingSoundStarted(false);
    stopEmergencySound();
    setShowModal(false);
    setPhase('idle');
    // Send emergency
    handleEmergencyResponse();
  }, [handleEmergencyResponse]);

  // Start safety check 30s after journey starts
  useEffect(() => {
    if (isJourneyActive) {
      setPhase('idle');
      setShowModal(false);
      if (phaseTimeout.current) clearTimeout(phaseTimeout.current);
      phaseTimeout.current = setTimeout(() => {
        setShowModal(true);
        setPhase('check');
      }, 30000); // 30 seconds
    } else {
      setPhase('idle');
      setShowModal(false);
      if (phaseTimeout.current) clearTimeout(phaseTimeout.current);
      if (safetyCheckInterval.current) clearTimeout(safetyCheckInterval.current);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isJourneyActive]);

  // Phase transitions
  useEffect(() => {
    if (phaseTimeout.current) clearTimeout(phaseTimeout.current);
    if (phase === 'check') {
      // Show notification
      if (hasNotificationPermission) {
        new Notification('Safety Check Required', {
          body: 'Please confirm your safety status within 30 seconds.',
          icon: '/safety-icon.png'
        });
      }
      toast({
        title: 'Safety Check Required',
        description: 'Please confirm your status within 30 seconds.',
        duration: 10000,
      });
      // After 30s, go to emergency if no response
      phaseTimeout.current = setTimeout(() => {
        setPhase('emergency');
      }, 30000);
    } else if (phase === 'emergency') {
      setBuzzingSoundStarted(true);
      playEmergencySound();
      // Show emergency notification
      if (hasNotificationPermission) {
        new Notification('Emergency Alert', {
          body: 'Please respond immediately! Emergency mode will activate in 30 seconds.',
          icon: '/emergency-icon.png'
        });
      }
      toast({
        title: 'Emergency Mode Activated',
        description: 'Please respond immediately. Emergency services will be notified in 30 seconds.',
        variant: 'destructive',
        duration: 0,
      });
      // After 30s, auto emergency
      phaseTimeout.current = setTimeout(() => {
        setPhase('auto-emergency');
      }, 30000);
    } else if (phase === 'auto-emergency') {
      setBuzzingSoundStarted(false);
      stopEmergencySound();
      setShowModal(false);
      // Send emergency
      handleEmergencyResponse();
      toast({
        title: 'Emergency Alert Sent',
        description: 'No response received. Emergency contacts have been notified.',
        variant: 'destructive',
        duration: 5000,
      });
    } else if (phase === 'idle') {
      setBuzzingSoundStarted(false);
      stopEmergencySound();
      setShowModal(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase]);

  // Initialize Web Audio API
  useEffect(() => {
    const setupAudio = async () => {
      try {
        audioContext.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        
        gainNode.current = audioContext.current.createGain();
        gainNode.current.connect(audioContext.current.destination);
        gainNode.current.gain.value = 0;
        
        oscillator.current = audioContext.current.createOscillator();
        oscillator.current.type = 'triangle';
        oscillator.current.frequency.value = 440;
        oscillator.current.connect(gainNode.current);
        oscillator.current.start();
        
        setAudioReady(true);
        
        if ('Notification' in window) {
          const permission = await Notification.requestPermission();
          setHasNotificationPermission(permission === 'granted');
        }
      } catch (error) {
        console.error('Audio setup error:', error);
        toast({
          title: "Audio System Error",
          description: "Please enable audio for emergency alerts to work.",
          variant: "destructive",
        });
      }
    };

    if (isJourneyActive) {
      setupAudio();
    }

    return () => {
      stopEmergencySound();
      if (oscillator.current) {
        oscillator.current.stop();
      }
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, [isJourneyActive]);

  // Monitor battery level
  useEffect(() => {
    const getBatteryLevel = async () => {
      try {
        if ('getBattery' in navigator) {
          const battery: any = await (navigator as any).getBattery();
          setBatteryLevel(battery.level * 100);
          
          battery.addEventListener('levelchange', () => {
            setBatteryLevel(battery.level * 100);
          });
        }
      } catch (error) {
        console.error('Battery API error:', error);
      }
    };

    getBatteryLevel();
  }, []);

  const playEmergencySound = () => {
    if (!gainNode.current || !audioReady || !audioContext.current) return;

    if (audioContext.current.state === 'suspended') {
      audioContext.current.resume();
    }

    gainNode.current.gain.cancelScheduledValues(audioContext.current.currentTime);
    gainNode.current.gain.setValueAtTime(0, audioContext.current.currentTime);
    gainNode.current.gain.linearRampToValueAtTime(0.5, audioContext.current.currentTime + 0.5);

    if (oscillator.current) {
      oscillator.current.frequency.setValueAtTime(440, audioContext.current.currentTime);
      const frequencyInterval = setInterval(() => {
        if (oscillator.current && audioContext.current) {
          oscillator.current.frequency.setValueAtTime(
            oscillator.current.frequency.value === 440 ? 880 : 440,
            audioContext.current.currentTime
          );
        }
      }, 500);

      return () => clearInterval(frequencyInterval);
    }
  };

  const stopEmergencySound = () => {
    if (!gainNode.current || !audioReady || !audioContext.current) return;
    gainNode.current.gain.linearRampToValueAtTime(0, audioContext.current.currentTime + 0.5);
    setBuzzingSoundStarted(false);
  };

  // User confirms safe
  const handleSafetyConfirm = () => {
    if (phaseTimeout.current) clearTimeout(phaseTimeout.current);
    setBuzzingSoundStarted(false);
    stopEmergencySound();
    setShowModal(false);
    setPhase('idle');
    if (onResponse) onResponse(true);
    toast({
      title: 'Safety Confirmed',
      description: 'Thank you for confirming your safety.',
      duration: 3000,
    });

    // Schedule next safety check in 1 minute if journey is still active
    if (isJourneyActive) {
      if (safetyCheckInterval.current) clearTimeout(safetyCheckInterval.current);
      safetyCheckInterval.current = setTimeout(() => {
        setShowModal(true);
        setPhase('check');
      }, 60000); // 1 minute
    }
  };

  // UI
  return (
    <AnimatePresence>
      {showModal && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 z-50"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 max-w-md w-full">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <AlertTriangle className="h-6 w-6 text-red-500" />
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Safety Check
                </h3>
              </div>
              <button
                onClick={() => {
                  if (phase !== 'emergency') handleSafetyConfirm();
                }}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                disabled={phase === 'emergency'}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <p className="text-gray-600 dark:text-gray-300">
                {phase === 'check' && 'Safety check initiated. Please confirm your status.'}
                {phase === 'emergency' && (
                  <>
                    <Bell className="inline-block h-5 w-5 text-red-500 animate-bounce mr-2" />
                    Please confirm: Are you safe or is this an emergency?
                  </>
                )}
                {phase === 'auto-emergency' && 'Emergency triggered. Contacts have been notified.'}
              </p>
              {(phase === 'check' || phase === 'emergency') && (
                <div className="flex gap-3">
                  <Button
                    variant="default"
                    className="flex-1 bg-green-500 hover:bg-green-600"
                    onClick={handleSafetyConfirm}
                  >
                    I'm Safe
                  </Button>
                  <Button
                    variant="destructive"
                    className="flex-1"
                    onClick={handleEmergency}
                  >
                    Emergency
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SafetyCheck; 