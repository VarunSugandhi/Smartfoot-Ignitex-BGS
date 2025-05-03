import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from "./ui/button";
import { Menu, X, LogIn, UserPlus, ChevronDown, MoreHorizontal, LogOut, User, Navigation, Star } from "lucide-react";
import { cn } from '../lib/utils';
import LoginForm from './LoginForm';
import SignUpForm from './SignUpForm';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from "./ThemeToggle";
import Modal from './ui/modal';

interface UserData {
  name: string;
  email: string;
}

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignupModal, setShowSignupModal] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSwitchToSignup = () => {
    setShowLoginModal(false);
    setShowSignupModal(true);
  };

  const handleSwitchToLogin = () => {
    setShowSignupModal(false);
    setShowLoginModal(true);
  };

  const handleClickOutside = () => {
    setShowDropdown(false);
  };

  useEffect(() => {
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    // Add any additional logout logic here (e.g., clearing tokens, redirecting)
  };

  const handleLoginSuccess = (userData: UserData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setShowLoginModal(false);
  };

  const handleSignupSuccess = (userData: UserData) => {
    setIsAuthenticated(true);
    setUser(userData);
    setShowSignupModal(false);
  };

  const mainNavItems = [
    { path: '/', label: 'Home' },
    { 
      path: '/navigator', 
      label: 'Smart Navigator',
      icon: <Navigation className="h-4 w-4" />
    },
    { 
      path: '/features', 
      label: 'Features',
      icon: <Star className="h-4 w-4" />
    },
    { path: '/community', label: 'Community' },
  ];

  const dropdownItems = [
    { path: '/report', label: 'Civic Report' },
    { path: '/about', label: 'About' },
    { path: '/contact', label: 'Contact' },
  ];

  const itemVariants = {
    hidden: { opacity: 0, y: -12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 90,
        damping: 16
      }
    },
    hover: {
      scale: 1.025,
      y: -2,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10
      }
    },
    tap: {
      scale: 0.97,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 12
      }
    }
  };

  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -8,
      scale: 0.98,
      transition: {
        duration: 0.22,
        ease: "easeInOut"
      }
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 18,
        staggerChildren: 0.08
      }
    }
  };

  const mobileMenuVariants = {
    hidden: {
      opacity: 0,
      x: "100%",
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 22
      }
    },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        type: "spring",
        stiffness: 80,
        damping: 22,
        staggerChildren: 0.12
      }
    }
  };

  const mobileItemVariants = {
    hidden: {
      x: 24,
      opacity: 0,
      filter: 'blur(6px)'
    },
    visible: {
      x: 0,
      opacity: 1,
      filter: 'blur(0px)',
      transition: {
        duration: 0.28,
        ease: [0.22, 1, 0.36, 1]
      }
    },
    hover: {
      x: 8,
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10
      }
    }
  };

  const buttonVariants = {
    initial: {
      scale: 1,
      filter: 'brightness(1)'
    },
    hover: {
      scale: 1.03,
      filter: 'brightness(1.08)',
      transition: {
        type: "spring",
        stiffness: 120,
        damping: 10
      }
    },
    tap: {
      scale: 0.97,
      filter: 'brightness(0.98)',
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 12
      }
    }
  };

  return (
    <>
      <motion.nav
        className={cn(
          "fixed top-0 w-full z-50 transition-all duration-300",
          isScrolled 
            ? "bg-white/95 dark:bg-gray-900/95 backdrop-blur-lg shadow-md" 
            : "bg-white/80 dark:bg-gray-900/80 backdrop-blur-md"
        )}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <motion.div
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
              className="flex items-center"
            >
              <Link to="/" className="flex items-center space-x-2">
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  Smart<span className="text-primary">Foot</span>
                </span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <motion.div 
              className="hidden md:flex items-center gap-3"
            >
              {mainNavItems.map((item, index) => (
                <motion.div
                  key={item.path}
                  variants={itemVariants}
                  custom={index}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Link 
                    to={item.path}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2",
                      location.pathname === item.path
                        ? "bg-primary text-white"
                        : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                    )}
                  >
                    {item.icon && item.icon}
                    {item.label}
                  </Link>
                </motion.div>
              ))}

              {/* More Dropdown */}
              <motion.div className="relative">
                <motion.button
                  variants={itemVariants}
                  whileHover="hover"
                  whileTap="tap"
                  className={cn(
                    "flex items-center px-3 py-2 rounded-lg text-sm font-medium",
                    showDropdown 
                      ? "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white" 
                      : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowDropdown(!showDropdown);
                  }}
                >
                  More
                  <motion.div
                    animate={{ rotate: showDropdown ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="ml-1 h-4 w-4" />
                  </motion.div>
                </motion.button>

                <AnimatePresence>
                  {showDropdown && (
                    <motion.div
                      variants={dropdownVariants}
                      initial="hidden"
                      animate="visible"
                      exit="hidden"
                      className="absolute right-0 mt-2 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-lg ring-1 ring-black/5 overflow-hidden"
                    >
                      {dropdownItems.map((item, index) => (
                        <motion.div
                          key={item.path}
                          variants={mobileItemVariants}
                          custom={index}
                          whileHover="hover"
                        >
                          <Link
                            to={item.path}
                            className={cn(
                              "block px-4 py-2 text-sm transition-colors",
                              location.pathname === item.path
                                ? "bg-primary text-white"
                                : "text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                            )}
                            onClick={() => setShowDropdown(false)}
                          >
                            {item.label}
                          </Link>
                        </motion.div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>

              {/* Theme Toggle */}
              <ThemeToggle />

              {/* Auth Buttons */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
                  onClick={() => setShowLoginModal(true)}
                >
                  <LogIn className="h-4 w-4 mr-2" />
                  Login
                </Button>
                <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 text-white"
                  onClick={() => setShowSignupModal(true)}
                >
                  <UserPlus className="h-4 w-4 mr-2" />
                  Sign Up
                </Button>
              </div>
            </motion.div>

            {/* Mobile menu button */}
            <motion.button
              variants={itemVariants}
              whileHover="hover"
              whileTap="tap"
              className="md:hidden rounded-lg p-2 text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
              className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-800"
            >
              <div className="px-4 pt-2 pb-3 space-y-1">
                {[...mainNavItems, ...dropdownItems].map((item, index) => (
                  <motion.div
                    key={item.path}
                    variants={mobileItemVariants}
                    custom={index}
                  >
                    <Link
                      to={item.path}
                      className={cn(
                        "block px-3 py-2 rounded-lg text-base font-medium transition-colors",
                        location.pathname === item.path
                          ? "bg-primary text-white"
                          : "text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
                      )}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.label}
                    </Link>
                  </motion.div>
                ))}
                <div className="pt-4 flex gap-2">
                  {isAuthenticated ? (
                    <Button
                      variant="ghost"
                      className="flex-1 rounded-lg justify-center"
                      onClick={() => {
                        setMobileMenuOpen(false);
                        handleLogout();
                      }}
                    >
                      <User className="h-4 w-4 mr-2" />
                      <span className="mr-2">{user?.name || 'User'}</span>
                      <LogOut className="h-4 w-4" />
                    </Button>
                  ) : (
                    <>
                      <Button
                        variant="ghost"
                        className="flex-1 rounded-lg justify-center"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setShowLoginModal(true);
                        }}
                      >
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </Button>
                      <Button
                        className="flex-1 rounded-lg justify-center bg-primary hover:bg-primary/90 shadow-md shadow-primary/20"
                        onClick={() => {
                          setMobileMenuOpen(false);
                          setShowSignupModal(true);
                        }}
                      >
                        <UserPlus className="h-4 w-4 mr-2" />
                        Sign Up
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Modals */}
      <Modal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)}>
        <LoginForm 
          onClose={() => setShowLoginModal(false)} 
          onSwitchToSignup={handleSwitchToSignup}
          onSuccess={handleLoginSuccess}
        />
      </Modal>

      <Modal isOpen={showSignupModal} onClose={() => setShowSignupModal(false)}>
        <SignUpForm 
          onClose={() => setShowSignupModal(false)} 
          onSwitchToLogin={handleSwitchToLogin}
          onSuccess={handleSignupSuccess}
        />
      </Modal>
    </>
  );
};

export default Navbar;
