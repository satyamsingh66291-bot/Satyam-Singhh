import React, { useState, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';
import Navbar from './components/Navbar.jsx';
import Home from './pages/Home.jsx';
import AdminDashboard from './pages/AdminDashboard.jsx';
import SatyamSinghBuilder from './pages/SatyamSinghBuilder.jsx';
import WhatsAppChat from './pages/WhatsAppChat.jsx';
import WhatsAppFloatingButton from './components/WhatsAppFloatingButton.jsx';

export default function App() {
  // Theme State
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('skillswap_theme');
      if (stored) return stored === 'dark';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Global Toast Alert State
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add('dark');
      localStorage.setItem('skillswap_theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('skillswap_theme', 'light');
    }
  }, [darkMode]);

  const showToast = (message, type = 'success', duration = 4000) => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast(prev => prev && prev.id ? null : prev);
    }, duration);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      
      {/* Top Universal Navbar */}
      <Navbar darkMode={darkMode} setDarkMode={setDarkMode} />

      {/* Main Application Routes */}
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<Home showToast={showToast} />} />
          <Route path="/satyam-singh" element={<SatyamSinghBuilder showToast={showToast} />} />
          <Route path="/builder" element={<SatyamSinghBuilder showToast={showToast} />} />
          <Route path="/satyam" element={<SatyamSinghBuilder showToast={showToast} />} />
          <Route path="/whatsapp" element={<WhatsAppChat showToast={showToast} />} />
          <Route path="/chat" element={<WhatsAppChat showToast={showToast} />} />
          <Route path="/admin" element={<AdminDashboard showToast={showToast} />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>

      {/* Floating Persistent WhatsApp Chat Button (9007355062) */}
      <WhatsAppFloatingButton showToast={showToast} />

      {/* Floating Interactive Toast Alert */}
      {toast && (
        <div 
          id="global-toast-alert"
          className="fixed bottom-20 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl animate-in slide-in-from-bottom-5 duration-300 max-w-md"
        >
          {toast.type === 'success' && (
            <div className="p-1.5 rounded-xl bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 shrink-0">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          )}
          {toast.type === 'error' && (
            <div className="p-1.5 rounded-xl bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 shrink-0">
              <AlertCircle className="w-4 h-4" />
            </div>
          )}
          {toast.type === 'info' && (
            <div className="p-1.5 rounded-xl bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 shrink-0">
              <Info className="w-4 h-4" />
            </div>
          )}

          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-snug">
            {toast.message}
          </p>

          <button
            type="button"
            onClick={() => setToast(null)}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 ml-2"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}
