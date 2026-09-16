import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Sparkles, 
  Sun, 
  Moon, 
  Menu, 
  X, 
  ShieldCheck, 
  ArrowRight,
  PlusCircle,
  Layers,
  PhoneCall,
  Search,
  MessageCircle
} from 'lucide-react';

export default function Navbar({ darkMode, setDarkMode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/90 dark:bg-slate-900/90 border-b border-slate-200/80 dark:border-slate-800 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <Link 
            to="/" 
            id="navbar-brand-logo"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 via-orange-500 to-rose-600 flex items-center justify-center text-white shadow-md shadow-orange-500/20 group-hover:scale-105 transition-transform">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">
                  Skill<span className="text-orange-600 dark:text-orange-400">Swap</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-orange-100 text-orange-700 dark:bg-orange-950/70 dark:text-orange-300 border border-orange-200 dark:border-orange-800/60">
                  Micro-Hub
                </span>
              </div>
              <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 hidden sm:block">
                Hyperlocal Skills & On-Demand Services
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-7">
            <Link
              to="/"
              id="nav-link-services"
              className={`text-sm font-semibold transition-colors ${
                !isAdmin && location.pathname === '/' ? 'text-orange-600 dark:text-orange-400' : 'text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white'
              }`}
            >
              Explore Services
            </Link>
            <Link
              to="/whatsapp"
              id="nav-link-whatsapp-chat"
              className={`text-xs font-bold transition-all px-3 py-1.5 rounded-full flex items-center gap-1.5 border shadow-sm ${
                location.pathname === '/whatsapp' || location.pathname === '/chat'
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-300 dark:border-emerald-800'
              }`}
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current text-emerald-500 dark:text-emerald-400" />
              <span>WhatsApp Chat</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-emerald-600 text-white font-mono">
                7091472879
              </span>
            </Link>
            <a
              href="/#featured"
              id="nav-link-featured"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Featured Pros
            </a>
            <a
              href="/#commission-model"
              id="nav-link-monetization"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              10% Commission
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
            </a>
            <a
              href="/#contact-section"
              id="nav-link-contact"
              className="text-sm font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Request Task
            </a>
          </nav>

          {/* Right Action Buttons */}
          <div className="flex items-center gap-3">
            
            {/* Dark Mode Toggle */}
            <button
              id="theme-toggle-button"
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500/40"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle Dark Mode"
            >
              {darkMode ? (
                <Sun className="w-4 h-4 text-amber-400 animate-in fade-in" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700 animate-in fade-in" />
              )}
            </button>

            {/* Admin Dashboard CTA */}
            <Link
              to="/admin"
              id="nav-admin-cta"
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold border transition-all shadow-sm ${
                isAdmin 
                  ? 'bg-slate-900 text-white border-slate-900 dark:bg-white dark:text-slate-900 dark:border-white' 
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 border-slate-200 dark:border-slate-700'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-orange-500" />
              <span>Admin Panel</span>
            </Link>

            {/* Post Task CTA */}
            <a
              href="/#contact-section"
              id="nav-post-task-button"
              className="hidden lg:flex items-center gap-2 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-semibold text-xs px-4 py-2.5 rounded-xl shadow-md shadow-orange-500/20 transition-all hover:scale-[1.02]"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Post Request</span>
            </a>

            {/* Mobile Menu Button */}
            <button
              id="mobile-menu-toggle"
              type="button"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              aria-label="Open Navigation Menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileOpen && (
        <div id="mobile-nav-drawer" className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 pt-3 pb-6 space-y-3">
          <Link
            to="/"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Explore Services
          </Link>
          <Link
            to="/whatsapp"
            onClick={() => setMobileOpen(false)}
            className="flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-bold bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300"
          >
            <div className="flex items-center gap-2.5">
              <MessageCircle className="w-5 h-5 fill-emerald-600 text-emerald-600" />
              <span>Direct WhatsApp Chat</span>
            </div>
            <span className="text-xs bg-emerald-600 text-white px-2.5 py-1 rounded-full font-mono font-bold">
              7091472879
            </span>
          </Link>
          <a
            href="/#featured"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Featured Listings
          </a>
          <a
            href="/#commission-model"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            10% Commission Engine
          </a>
          <a
            href="/#contact-section"
            onClick={() => setMobileOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            Post Quick Task / Skill Swap
          </a>
          <Link
            to="/admin"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 px-3 py-2 rounded-lg text-base font-semibold text-orange-600 dark:text-orange-400 hover:bg-orange-50 dark:hover:bg-orange-950/40"
          >
            <ShieldCheck className="w-4 h-4" />
            Admin Dashboard
          </Link>
        </div>
      )}
    </header>
  );
}
