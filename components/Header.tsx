
import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Radio, Menu, X, Sun, Moon, AlertTriangle } from 'lucide-react';
import { useTheme } from '../ThemeContext';

const Header: React.FC = () => {
  const location = useLocation();
  const isDemo = location.pathname === '/demo';
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Hide header completely in demo mode for full screen emergency UI
  if (isDemo) return null;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="bg-rose-500 text-white p-2 rounded-xl shadow-lg shadow-rose-200 dark:shadow-rose-900/20 group-hover:scale-105 transition-transform duration-300">
              <Radio size={20} strokeWidth={2.5} />
            </div>
            <span className="font-bold text-xl tracking-tight text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors">
              HyperAlert
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            {['Why Us', 'How it Works', 'Business'].map((item) => (
              <a 
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, '-')}`} 
                className="text-sm font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
              >
                {item}
              </a>
            ))}
            
            <Link 
              to="/report" 
              className="flex items-center gap-2 text-sm font-bold text-rose-600 dark:text-rose-400 hover:text-rose-700 dark:hover:text-rose-300 transition-colors px-2"
            >
              <AlertTriangle size={16} />
              Report Incident
            </Link>
            
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700 mx-2"></div>

            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle Dark Mode"
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <Link 
              to="/demo"
              className="px-6 py-2.5 rounded-full font-semibold text-sm transition-all duration-300 bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-100 hover:shadow-lg hover:shadow-slate-200 dark:hover:shadow-slate-800/50 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              Launch Simulator
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-4 md:hidden">
            <button 
              onClick={toggleTheme} 
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
               {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800 shadow-xl p-4 space-y-2 animate-in slide-in-from-top-5">
          <a href="#why-us" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">Why Us</a>
          <a href="#how-it-works" onClick={() => setIsMenuOpen(false)} className="block px-4 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-medium">How it Works</a>
          <Link 
            to="/report"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-2 px-4 py-3 rounded-xl hover:bg-rose-50 dark:hover:bg-rose-900/20 text-rose-600 dark:text-rose-400 font-bold"
          >
            <AlertTriangle size={18} />
            Report Incident
          </Link>
          <Link 
            to="/demo"
            onClick={() => setIsMenuOpen(false)}
            className="block w-full text-center mt-4 px-6 py-3 rounded-xl font-bold bg-rose-500 text-white shadow-md shadow-rose-200 dark:shadow-rose-900/20"
          >
            Launch Simulator
          </Link>
        </div>
      )}
    </header>
  );
};

export default Header;
