import React from 'react';
import Navbar from '@/components/Navbar';
import CivicReportSection from '@/components/ComplaintSection';
import Footer from '@/components/Footer';
import ScrollToTopButton from '@/components/ScrollToTopButton';

const CivicReport = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="pt-20">
        <CivicReportSection />
      </div>
      <Footer />
      <ScrollToTopButton />
    </div>
  );
};

export default CivicReport;
