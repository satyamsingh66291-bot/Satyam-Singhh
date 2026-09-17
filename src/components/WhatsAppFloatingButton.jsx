import React, { useState } from 'react';
import { MessageCircle, X, Send, Phone, ExternalLink } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function WhatsAppFloatingButton({ showToast }) {
  const [openBubble, setOpenBubble] = useState(false);
  const [quickText, setQuickText] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const phoneNumber = '9007355062';
  const rawWaNumber = '919007355062';

  // Do not show floating button if already on the /whatsapp full chat page
  if (location.pathname === '/whatsapp' || location.pathname === '/chat') {
    return null;
  }

  const handleLaunch = (text) => {
    const messageToSend = text || quickText || 'Hello, I would like to inquire about your services.';
    const url = `https://wa.me/${rawWaNumber}?text=${encodeURIComponent(messageToSend.trim())}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    setOpenBubble(false);
    setQuickText('');
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col items-end">
      
      {/* Mini Chat Popover */}
      {openBubble && (
        <div className="mb-3 w-80 sm:w-88 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-3 duration-200">
          
          {/* Header */}
          <div className="bg-emerald-600 text-white p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                </div>
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-emerald-300 rounded-full border-2 border-emerald-600"></span>
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">WhatsApp Direct</h4>
                <p className="text-[11px] text-emerald-100">+91 9007355062 • Online</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpenBubble(false)}
              className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Body */}
          <div className="p-4 space-y-3 bg-slate-50 dark:bg-slate-950/50">
            <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-700 dark:text-slate-300 space-y-1 shadow-sm">
              <p className="font-semibold text-slate-900 dark:text-white">
                👋 Need quick assistance or want to build a website/app?
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Message directly on WhatsApp for instant replies and custom project quotes.
              </p>
            </div>

            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => handleLaunch('Hi Satyam, I want to build a website (₹20,000 package).')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-800 dark:text-slate-200 flex items-center justify-between group transition-colors"
              >
                <span>🌐 Inquire about ₹20,000 Website</span>
                <span className="text-emerald-500 opacity-0 group-hover:opacity-100">Send →</span>
              </button>

              <button
                type="button"
                onClick={() => handleLaunch('Hello, I have an urgent task / service requirement.')}
                className="w-full text-left px-3 py-2 rounded-xl bg-white hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 text-[11px] font-medium text-slate-800 dark:text-slate-200 flex items-center justify-between group transition-colors"
              >
                <span>⚡ Custom Service / Task Request</span>
                <span className="text-emerald-500 opacity-0 group-hover:opacity-100">Send →</span>
              </button>
            </div>

            {/* Input & Send */}
            <div className="flex items-center gap-1.5 pt-1">
              <input
                type="text"
                value={quickText}
                onChange={(e) => setQuickText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handleLaunch();
                }}
                placeholder="Type a message..."
                className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => handleLaunch()}
                className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-md transition-colors"
                title="Send via WhatsApp"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Full page link */}
            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => {
                  setOpenBubble(false);
                  navigate('/whatsapp');
                }}
                className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 hover:underline"
              >
                Open Full WhatsApp Chat Page →
              </button>
            </div>

          </div>

        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        type="button"
        id="floating-whatsapp-btn"
        onClick={() => setOpenBubble(!openBubble)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 transition-all hover:scale-105 active:scale-95"
        aria-label="Chat on WhatsApp"
      >
        <div className="relative">
          <MessageCircle className="w-6 h-6 fill-white text-emerald-600" />
          <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-300 rounded-full animate-ping"></span>
        </div>
        <div className="flex flex-col items-start pr-1 text-left">
          <span className="text-[10px] font-medium leading-none text-emerald-100">WhatsApp</span>
          <span className="text-xs font-bold leading-tight">9007355062</span>
        </div>
      </button>

    </div>
  );
}
