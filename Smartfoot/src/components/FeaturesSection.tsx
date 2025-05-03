import React from 'react';
import FeatureCardFramer from './FeatureCardFramer';
import { Compass, BarChart, Bell, Users, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const FeaturesSection = () => {
  const features = [
    {
      icon: <Compass className="h-8 w-8" />,
      title: "Smart Destination Prediction",
      description: "AI-powered algorithms predict crowd density at your destination, helping you plan your visit during less congested times."
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "SafeFlow Pathfinding",
      description: "Our AI calculates the safest, fastest route by weighing distance, crowd density, and safety factors in real-time."
    },
    {
      icon: <Bell className="h-8 w-8" />,
      title: "SafeRoute Guardian",
      description: "Receive safety check notifications every 5 minutes with an emergency alert system if there's no response."
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Neighbourhood Events",
      description: "Discover or host group rides, carpools, and travel-based events nearby (within 10km)."
    },
    {
      icon: <BarChart className="h-8 w-8" />,
      title: "Civic Complaint System",
      description: "Report infrastructure issues like potholes and unsafe roads with precise location tagging on our interactive map."
    }
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.18,
        delayChildren: 0.2
      }
    }
  };

  return (
    <section id="features" className="section-padding bg-gradient-to-b from-white via-[#F5F9FF] to-[#EAF3FF] dark:from-[#0D0D0D] dark:via-[#181F2A] dark:to-[#0D0D0D]">
      <div className="container mx-auto px-4">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: -24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.7 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#007AFF] to-[#0D0D0D] bg-clip-text text-transparent">
            Smart City Features
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Explore how <span className="font-semibold text-[#007AFF]">SMARTFOOT</span> is revolutionizing urban mobility with these cutting-edge features.
          </p>
        </motion.div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {features.map((feature, index) => (
            <FeatureCardFramer
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
