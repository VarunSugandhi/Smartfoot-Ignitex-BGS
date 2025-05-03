import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

const EmergencySection: React.FC = () => {
  const [isEmergencyHours, setIsEmergencyHours] = useState(false);
  const [showMessage, setShowMessage] = useState(true);
  const { toast } = useToast();

  const checkEmergencyHours = () => {
    const now = new Date();
    const hours = now.getHours();
    // Check if time is between 11 PM (23:00) and 4 AM (04:00)
    return hours >= 23 || hours < 4;
  };

  useEffect(() => {
    // Initial check
    setIsEmergencyHours(checkEmergencyHours());
    setShowMessage(true);

    // Set up interval to check every minute
    const interval = setInterval(() => {
      const isEmergency = checkEmergencyHours();
      setIsEmergencyHours(isEmergency);
      if (isEmergency) {
        setShowMessage(true); // Show message again when entering emergency hours
      }
    }, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  const handleEmergencyAlert = () => {
    if (isEmergencyHours) {
      toast({
        title: "Emergency Mode Active",
        description: "You are traveling during emergency hours (11 PM - 4 AM). Extra safety measures are enabled.",
        variant: "destructive",
        duration: 5000,
      });
      setShowMessage(false); // Hide the message after viewing measures
    }
  };

  return (
    <AnimatePresence>
      {isEmergencyHours && showMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 right-4 z-50"
        >
          <div className="bg-red-500 text-white p-4 rounded-lg shadow-lg max-w-sm">
            <div className="flex items-center gap-3 mb-2">
              <AlertTriangle className="h-6 w-6" />
              <h3 className="font-semibold text-lg">Emergency Hours Active</h3>
            </div>
            <p className="mb-3 text-sm">
              You are currently in emergency hours (11 PM - 4 AM). Enhanced safety features are enabled.
            </p>
            <div className="flex items-center gap-2 text-sm">
              <Clock className="h-4 w-4" />
              <span>Current safety status: Active</span>
            </div>
            <Button
              className="w-full mt-3 bg-white text-red-500 hover:bg-red-50"
              onClick={handleEmergencyAlert}
            >
              View Safety Measures
            </Button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default EmergencySection; 