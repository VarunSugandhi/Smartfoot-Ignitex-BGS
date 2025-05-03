import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Info, Mail, Twitter, Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const year = new Date().getFullYear();
  return (
    <footer className="relative bg-white/80 dark:bg-[#0D0D0D]/80 backdrop-blur-md border-t border-primary/10 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-8 mb-8">
          {/* Logo and tagline */}
          <div className="flex flex-col items-center md:items-start">
            <Link to="/" className="flex items-center space-x-2 mb-2">
              <span className="text-2xl font-bold bg-gradient-to-r from-[#007AFF] to-[#0D0D0D] bg-clip-text text-transparent tracking-tight">SMARTFOOT</span>
            </Link>
            <span className="inline-block px-3 py-1 rounded-full bg-[#007AFF]/10 text-[#007AFF] font-semibold text-xs tracking-wide mb-2">
              100% FREE FOREVER
            </span>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Built for smart cities. Free for everyone.</p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start gap-2">
            <h3 className="text-base font-semibold mb-1 text-[#007AFF]">Quick Links</h3>
            <nav className="flex flex-col gap-1">
              <Link to="/" className="text-gray-600 dark:text-gray-300 hover:text-[#007AFF] transition-colors flex items-center">
                <Home className="h-4 w-4 mr-2" /> Home
              </Link>
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-[#007AFF] transition-colors flex items-center">
                <Info className="h-4 w-4 mr-2" /> Features
              </a>
              <a href="#contact" className="text-gray-600 dark:text-gray-300 hover:text-[#007AFF] transition-colors flex items-center">
                <Mail className="h-4 w-4 mr-2" /> Contact
              </a>
            </nav>
          </div>

          {/* Social Icons */}
          <div className="flex flex-col items-center md:items-end gap-2">
            <h3 className="text-base font-semibold mb-1 text-[#007AFF]">Connect</h3>
            <div className="flex gap-4 mt-1">
              <motion.a
                href="https://twitter.com/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.18, color: '#007AFF' }}
                className="text-gray-500 hover:text-[#007AFF] transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://linkedin.com/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.18, color: '#007AFF' }}
                className="text-gray-500 hover:text-[#007AFF] transition-colors"
              >
                <Linkedin className="h-5 w-5" />
              </motion.a>
              <motion.a
                href="https://github.com/"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.18, color: '#007AFF' }}
                className="text-gray-500 hover:text-[#007AFF] transition-colors"
              >
                <Github className="h-5 w-5" />
              </motion.a>
            </div>
            <div className="mt-2 text-xs text-gray-400">info@smartfoot.com</div>
          </div>
        </div>
        <div className="pt-4 border-t border-primary/10 text-center text-gray-500 dark:text-gray-400 text-xs">
          <span>© {year} SMARTFOOT. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
