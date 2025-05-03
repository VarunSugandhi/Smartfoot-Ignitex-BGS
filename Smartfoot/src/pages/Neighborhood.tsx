import React from 'react';
import Navbar from '@/components/Navbar';
import CommunitySection from '@/components/CommunitySection';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const Neighborhood = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-16">
        <CommunitySection />
      </main>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default Neighborhood;
