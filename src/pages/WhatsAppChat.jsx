import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  MessageCircle, 
  Send, 
  Phone, 
  Copy, 
  Check, 
  ExternalLink, 
  ShieldCheck, 
  Clock, 
  Sparkles, 
  ArrowLeft,
  Smartphone,
  CheckCheck,
  UserCheck
} from 'lucide-react';

export default function WhatsAppChat({ showToast }) {
  const phoneNumber = '7091472879';
  const internationalNumber = '+91 7091472879';
  const rawWaNumber = '917091472879';

  const [messageText, setMessageText] = useState(
    'Hello, I visited your platform and want to discuss a project / service with you.'
  );
  const [copied, setCopied] = useState(false);

  // Quick message templates
  const templates = [
    {
      title: '🌐 Website Building (₹20,000)',
      text: 'Hi Satyam, I want to build a complete website (₹20,000 package). Can we discuss my requirements?'
    },
    {
      title: '📱 Mobile / Web App Development',
      text: 'Hello, I have a custom web / mobile application project I would like to build with you.'
    },
    {
      title: '⚡ Custom Task / Urgent Service',
      text: 'Hi, I need assistance with an urgent service / task. Are you currently available?'
    },
    {
      title: '🤝 Skill Swap / Barter Inquiry',
      text: 'Hello, I would like to propose a 1-on-1 skill exchange / service collaboration.'
    }
  ];

  const handleCopyNumber = () => {
    navigator.clipboard.writeText(phoneNumber);
    setCopied(true);
    if (showToast) showToast('Phone number 7091472879 copied to clipboard!', 'success');
    setTimeout(() => setCopied(false), 2500);
  };

  const handleOpenWhatsApp = (customText) => {
    const textToSend = customText || messageText;
    const encodedText = encodeURIComponent(textToSend.trim());
    const waUrl = `https://wa.me/${rawWaNumber}?text=${encodedText}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 py-10 px-4 sm:px-6 lg:px-8">
      
      {/* Container */}
      <div className="max-w-4xl mx-auto">
        
        {/* Back navigation */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Link>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-xs font-bold border border-emerald-300 dark:border-emerald-800">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Direct WhatsApp Channel</span>
          </div>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl overflow-hidden">
          
          {/* Header Bar styled like WhatsApp */}
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-teal-800 text-white p-6 sm:p-8 relative overflow-hidden">
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
              
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white shadow-inner">
                    <MessageCircle className="w-9 h-9 fill-white/20 text-white" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-emerald-800 rounded-full"></span>
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
                      Direct WhatsApp Chat
                    </h1>
                    <UserCheck className="w-4 h-4 text-emerald-300" />
                  </div>
                  <p className="text-xs text-emerald-100 mt-0.5 font-medium">
                    Verified Number: <span className="font-bold text-white tracking-wider">{internationalNumber}</span>
                  </p>
                  <p className="text-[11px] text-emerald-200/80 mt-1 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>Typically replies instantly or within a few minutes</span>
                  </p>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-sm border border-white/20 flex items-center gap-1.5 transition-all"
                  title="Copy 7091472879"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-200" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Number</span>
                    </>
                  )}
                </button>

                <a
                  href={`tel:${phoneNumber}`}
                  className="px-3.5 py-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white text-xs font-bold backdrop-blur-sm border border-white/20 flex items-center gap-1.5 transition-all"
                  title="Direct Call"
                >
                  <Phone className="w-4 h-4" />
                  <span>Call</span>
                </a>
              </div>

            </div>
          </div>

          {/* Chat Body & Quick Options */}
          <div className="p-6 sm:p-8 space-y-8">
            
            {/* Quick-send message presets */}
            <div>
              <label className="block text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                Choose a Topic / Quick Starter:
              </label>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {templates.map((tpl, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setMessageText(tpl.text);
                      if (showToast) showToast('Template selected! Click "Start WhatsApp Chat" to send.', 'info');
                    }}
                    className={`text-left p-3.5 rounded-2xl border transition-all text-xs ${
                      messageText === tpl.text
                        ? 'border-emerald-500 bg-emerald-50/70 dark:bg-emerald-950/40 text-emerald-950 dark:text-emerald-200 ring-2 ring-emerald-500/20'
                        : 'border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 bg-slate-50/50 dark:bg-slate-800/40 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="font-bold text-slate-900 dark:text-white mb-1">
                      {tpl.title}
                    </div>
                    <div className="line-clamp-2 text-slate-500 dark:text-slate-400 text-[11px]">
                      {tpl.text}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Message Editor Box */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Your Message to <span className="text-emerald-600 dark:text-emerald-400 font-bold">+91 7091472879</span>:
                </label>
                <span className="text-[11px] text-slate-400">
                  Will open in your WhatsApp app or WhatsApp Web
                </span>
              </div>

              <div className="relative">
                <textarea
                  rows={4}
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type your message here..."
                  className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-emerald-500 focus:outline-none resize-none leading-relaxed"
                />
              </div>

              {/* Big Green WhatsApp Launch Button */}
              <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                <button
                  type="button"
                  id="start-whatsapp-chat-button"
                  onClick={() => handleOpenWhatsApp()}
                  className="flex-1 py-4 px-6 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-sm sm:text-base shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-3 transition-all hover:scale-[1.01]"
                >
                  <MessageCircle className="w-5 h-5 fill-white text-emerald-600" />
                  <span>Start WhatsApp Chat Now</span>
                  <ExternalLink className="w-4 h-4 text-emerald-100" />
                </button>

                <button
                  type="button"
                  onClick={handleCopyNumber}
                  className="py-4 px-5 rounded-2xl border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs sm:text-sm flex items-center justify-center gap-2"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  <span>{copied ? 'Copied 7091472879' : 'Copy 7091472879'}</span>
                </button>
              </div>
            </div>

            {/* How it works info */}
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
              <div className="flex items-start gap-2.5">
                <Smartphone className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Mobile Devices</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Opens the official WhatsApp application directly.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <CheckCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Desktop / Laptop</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Opens WhatsApp Web in your browser or desktop client.</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800 dark:text-slate-200 block">Zero Spam Guarantee</span>
                  <span className="text-slate-500 dark:text-slate-400 text-[11px]">Direct 1-on-1 discussion strictly for your project inquiry.</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
