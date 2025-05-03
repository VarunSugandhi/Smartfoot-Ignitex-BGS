
import React from 'react';
import Navbar from '@/components/Navbar';
import FeaturesSection from '@/components/FeaturesSection';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const Features = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20">
        <FeaturesSection />
      </div>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Features;
