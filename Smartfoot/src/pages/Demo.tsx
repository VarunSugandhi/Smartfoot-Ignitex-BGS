import React from 'react';
import Navbar from '@/components/Navbar';
import NavigatorSection from '@/components/NavigatorSection';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const Demo = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20">
        <NavigatorSection />
      </div>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Demo;
