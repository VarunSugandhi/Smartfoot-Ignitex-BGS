import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Sparkles, Users } from 'lucide-react';

const steps = [
  {
    icon: <MapPin className="h-8 w-8 text-[#007AFF]" />,
    title: 'Enter Your Destination',
    description: 'Type or select where you want to go. SMARTFOOT instantly gets to work.'
  },
  {
    icon: <Sparkles className="h-8 w-8 text-[#007AFF]" />,
    title: 'Get AI-Safe Route with Prediction',
    description: 'See the safest, fastest route with live crowd and safety prediction.'
  },
  {
    icon: <Users className="h-8 w-8 text-[#007AFF]" />,
    title: 'Travel Confidently + Connect',
    description: 'Move smart, get live updates, and join community events as you go.'
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

const cardVariants = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, type: 'spring', stiffness: 80, damping: 16 } },
  hover: { scale: 1.04, boxShadow: '0 8px 32px 0 rgba(0,122,255,0.10)', transition: { type: 'spring', stiffness: 120, damping: 10 } }
};

const HowItWorksSection = () => (
  <section className="section-padding bg-gradient-to-b from-[#EAF3FF] to-white dark:from-[#181F2A] dark:to-[#0D0D0D]">
    <div className="container mx-auto px-4">
      <motion.div
        className="text-center mb-16"
        initial={{ opacity: 0, y: -24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.2 }}
        transition={{ duration: 0.7 }}
      >
        <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-[#007AFF] to-[#0D0D0D] bg-clip-text text-transparent">
          How It Works
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Getting started with <span className="font-semibold text-[#007AFF]">SMARTFOOT</span> is as easy as 1-2-3.
        </p>
      </motion.div>
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.1 }}
      >
        {steps.map((step, idx) => (
          <motion.div
            key={idx}
            className="glass-card rounded-xl p-8 flex flex-col items-center text-center"
            variants={cardVariants}
            whileHover="hover"
          >
            <div className="mb-4 flex items-center justify-center w-16 h-16 rounded-full bg-[#007AFF]/10">
              {step.icon}
            </div>
            <h3 className="text-xl font-semibold mb-2 text-[#0D0D0D] dark:text-white">{step.title}</h3>
            <p className="text-gray-600 dark:text-gray-300">{step.description}</p>
          </motion.div>
        ))}
      </motion.div>
    </div>
  </section>
);

export default HowItWorksSection; 