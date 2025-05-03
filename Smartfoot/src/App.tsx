import React, { Suspense, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from 'next-themes';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { toast } from "@/components/ui/use-toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import ErrorBoundary from '@/components/ErrorBoundary';
import LoadingSpinner from '@/components/LoadingSpinner';
import Navbar from '@/components/Navbar';
import SignUpForm from '@/components/SignUpForm';
import LoginForm from '@/components/LoginForm';
import HeroSection from '@/components/HeroSection';
import NavigatorSection from '@/components/NavigatorSection';

// Lazy load other pages
const Features = React.lazy(() => import('./pages/Features'));
const Demo = React.lazy(() => import('./pages/Demo'));
const Community = React.lazy(() => import('./pages/Neighborhood'));
const Report = React.lazy(() => import('./pages/Report'));
const About = React.lazy(() => import('./pages/About'));
const Contact = React.lazy(() => import('./pages/Contact'));
const NotFound = React.lazy(() => import('./pages/NotFound'));

const queryClient = new QueryClient();

// Protected Route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
  
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const App: React.FC = () => {
  useEffect(() => {
    if ('Notification' in window && Notification.permission !== 'granted') {
      Notification.requestPermission();
    }
  }, []);

  return (
    <ErrorBoundary>
      <ThemeProvider
        attribute="class"
        defaultTheme="system"
        enableSystem
        disableTransitionOnChange
      >
        <QueryClientProvider client={queryClient}>
          <Router>
            <div className="min-h-screen bg-white dark:bg-gray-950 transition-colors">
              <Navbar />
              <TooltipProvider>
                <Toaster />
                <Suspense fallback={<LoadingSpinner />}>
                  <Routes>
                    {/* Public routes */}
                    <Route path="/login" element={<LoginForm onClose={() => {}} onSwitchToSignup={() => {}} onSuccess={() => {}} />} />
                    <Route path="/signup" element={<SignUpForm onClose={() => {}} onSwitchToLogin={() => {}} onSuccess={() => {}} />} />
                    
                    {/* Protected routes */}
                    <Route path="/" element={
                      <ProtectedRoute>
                        <HeroSection />
                      </ProtectedRoute>
                    } />
                    <Route path="/navigator" element={
                      <ProtectedRoute>
                        <NavigatorSection />
                      </ProtectedRoute>
                    } />
                    <Route path="/features" element={
                      <ProtectedRoute>
                        <Features />
                      </ProtectedRoute>
                    } />
                    <Route path="/demo" element={
                      <ProtectedRoute>
                        <Demo />
                      </ProtectedRoute>
                    } />
                    <Route path="/community" element={
                      <ProtectedRoute>
                        <Community />
                      </ProtectedRoute>
                    } />
                    <Route path="/report" element={
                      <ProtectedRoute>
                        <Report />
                      </ProtectedRoute>
                    } />
                    <Route path="/about" element={
                      <ProtectedRoute>
                        <About />
                      </ProtectedRoute>
                    } />
                    <Route path="/contact" element={
                      <ProtectedRoute>
                        <Contact />
                      </ProtectedRoute>
                    } />
                    <Route path="*" element={<NotFound />} />
                  </Routes>
                </Suspense>
              </TooltipProvider>
            </div>
          </Router>
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
};

export default App;
