import React, { useEffect } from 'react';
import HeroSection from '@/components/HeroSection';
import FeaturesSection from '@/components/FeaturesSection';
import NavigatorSection from '@/components/NavigatorSection';
import NeighborhoodSection from '@/components/NeighborhoodSection';
import ComplaintSection from '@/components/ComplaintSection';
import AboutSection from '@/components/AboutSection';
import ContactSection from '@/components/ContactSection';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const Index = () => {
  // Check for user's preferred color scheme
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const darkModeListener = (e: MediaQueryListEvent) => {
      if (e.matches) {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    };

    const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkModeMediaQuery.addEventListener('change', darkModeListener);

    return () => {
      darkModeMediaQuery.removeEventListener('change', darkModeListener);
    };
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      <HeroSection />
      <FeaturesSection />
      <NavigatorSection />
      <NeighborhoodSection />
      <ComplaintSection />
      <AboutSection />
      <ContactSection />
      <Footer />
      <ScrollToTopButton />
    </main>
  );
};

export default Index;
