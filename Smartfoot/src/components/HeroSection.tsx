import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Navigation, ChevronRight, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

const HeroSection: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-950">
      {/* Background Pattern */}
      <div className="absolute inset-0 z-0 opacity-40 dark:opacity-20">
        <div className="absolute inset-0 bg-grid-black/[0.2] dark:bg-grid-white/[0.2] bg-center [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-4xl mx-auto space-y-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400">
            Navigate Smart,{' '}
            <span className="text-primary">Travel Safe</span>
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience intelligent urban navigation with real-time safety alerts and smart routing. Your safety companion in the city.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                className="bg-primary hover:bg-primary/90 text-white px-8 py-6 rounded-xl shadow-lg shadow-primary/30 flex items-center gap-3 text-lg font-semibold"
                onClick={() => navigate('/navigator')}
              >
                <Navigation className="h-5 w-5" />
                Start Navigating
                <ChevronRight className="h-5 w-5" />
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                size="lg"
                variant="outline"
                className="bg-white hover:bg-gray-50 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-900 dark:text-white border-2 px-8 py-6 rounded-xl shadow-lg flex items-center gap-3 text-lg font-semibold"
                onClick={() => navigate('/features')}
              >
                <Star className="h-5 w-5" />
                Features
                <ChevronRight className="h-5 w-5" />
              </Button>
            </motion.div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-xl"
            >
              <h3 className="text-xl font-semibold mb-2">Smart Routing</h3>
              <p className="text-gray-600 dark:text-gray-300">
                AI-powered routes considering safety, time, and accessibility.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-xl"
            >
              <h3 className="text-xl font-semibold mb-2">Safety Alerts</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Real-time notifications about potential hazards and safety checks.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="p-6 rounded-2xl bg-white dark:bg-gray-800 shadow-xl"
            >
              <h3 className="text-xl font-semibold mb-2">Emergency Support</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Quick access to emergency contacts and automated safety responses.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default HeroSection;
