import React from 'react';
import { 
  Star, 
  Clock, 
  MapPin, 
  Sparkles, 
  Repeat, 
  CreditCard, 
  CheckCircle, 
  MessageSquare,
  Flame,
  ArrowUpRight,
  MessageCircle
} from 'lucide-react';

export default function ServiceCard({ service, onBook, onPromote, onContact }) {
  const {
    id,
    title,
    providerName,
    providerAvatar,
    category,
    price = 0,
    rating = 5.0,
    reviewCount = 1,
    duration = "1-2 Days",
    location = "Local Hub",
    description,
    skills = [],
    isFeatured = false,
    availableForSwap = false,
    swapPreference = "",
    whatsappNumber = ""
  } = service;

  // 10% commission calculations
  const platformFee = Math.round(price * 0.10);
  const providerEarns = price - platformFee;

  return (
    <div 
      id={`service-card-${id}`}
      className={`group relative flex flex-col justify-between rounded-2xl bg-white dark:bg-slate-900 border transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isFeatured 
          ? 'border-amber-400/90 dark:border-amber-500/80 ring-1 ring-amber-400/40 shadow-md shadow-amber-500/5' 
          : 'border-slate-200 dark:border-slate-800 hover:border-orange-300 dark:hover:border-orange-900/60'
      }`}
    >
      
      {/* Featured Header Ribbon */}
      {isFeatured && (
        <div className="absolute -top-3 left-4 z-10 inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-extrabold uppercase tracking-wider shadow-sm">
          <Sparkles className="w-3 h-3 fill-white text-white" />
          <span>Featured Pro</span>
        </div>
      )}

      {/* Top Card Section */}
      <div className="p-5 sm:p-6 space-y-4">
        
        {/* Provider Profile Info */}
        <div className="flex items-start justify-between gap-3 pt-1">
          <div className="flex items-center gap-3">
            <img
              src={providerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80"}
              alt={providerName}
              className="w-11 h-11 rounded-full object-cover border-2 border-orange-500/30"
            />
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                {providerName}
              </h4>
              <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <span className="flex items-center text-amber-500 font-semibold">
                  <Star className="w-3.5 h-3.5 fill-amber-400 mr-0.5" />
                  {rating.toFixed(1)}
                </span>
                <span>•</span>
                <span>{reviewCount} jobs done</span>
              </div>
            </div>
          </div>

          {/* Category Chip */}
          <span className="text-[11px] font-semibold px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700/60 whitespace-nowrap">
            {category}
          </span>
        </div>

        {/* Service Title & Description */}
        <div className="space-y-1.5">
          <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug line-clamp-2">
            {title}
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
            {description}
          </p>
        </div>

        {/* Meta tags: Location & Duration */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 pt-1">
          <div className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" />
            <span>{duration}</span>
          </div>
          <span>•</span>
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[130px]">{location}</span>
          </div>
        </div>

        {/* Skill Swap Flag if enabled */}
        {availableForSwap && (
          <div className="p-2.5 rounded-xl bg-orange-50 dark:bg-orange-950/40 border border-orange-200/80 dark:border-orange-800/60 text-xs text-orange-900 dark:text-orange-200 flex items-start gap-2">
            <Repeat className="w-4 h-4 text-orange-600 dark:text-orange-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-tight">
              <span className="font-bold">Open to Skill Swap:</span> {swapPreference || "Open to skill trade or bartering"}
            </div>
          </div>
        )}

        {/* Skills Tag Pills */}
        <div className="flex flex-wrap gap-1.5 pt-1">
          {skills && skills.map((skill, idx) => (
            <span
              key={idx}
              className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300"
            >
              #{skill}
            </span>
          ))}
        </div>

      </div>

      {/* Bottom Card Section: Price, Commission & CTAs */}
      <div className="p-5 sm:p-6 pt-0 space-y-3 mt-2 border-t border-slate-100 dark:border-slate-800/80">
        
        {/* Transparent Price & 10% Breakdown */}
        <div className="flex items-baseline justify-between pt-3">
          <div>
            <span className="text-2xl font-black text-slate-900 dark:text-white">
              ₹{price.toLocaleString()}
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">/ task</span>
          </div>

          <div className="text-right">
            <div className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
              10% fee (₹{platformFee})
            </div>
            <div className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
              Pro earns ₹{providerEarns}
            </div>
          </div>
        </div>

        {/* Action Button Grid */}
        <div className={`grid ${whatsappNumber ? 'grid-cols-3' : 'grid-cols-2'} gap-2 pt-1`}>
          
          {/* Direct Message / Contact */}
          <button
            id={`service-contact-${id}`}
            type="button"
            onClick={() => onContact && onContact(service)}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-bold transition-colors"
          >
            <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
            <span>Chat</span>
          </button>

          {/* WhatsApp Direct */}
          {whatsappNumber && (
            <a
              id={`service-whatsapp-${id}`}
              href={`https://wa.me/91${whatsappNumber}?text=${encodeURIComponent(`Hi ${providerName}, I am interested in your service "${title}". Can we chat?`)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              title={`WhatsApp ${whatsappNumber}`}
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white text-emerald-600" />
              <span>WhatsApp</span>
            </a>
          )}

          {/* Book with Razorpay */}
          <button
            id={`service-book-${id}`}
            type="button"
            onClick={() => onBook && onBook(service)}
            className="flex items-center justify-center gap-1.5 px-2.5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-md shadow-orange-600/20 transition-all hover:scale-[1.02]"
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Book</span>
          </button>
        </div>

        {/* Featured Badge Upsell if not already featured */}
        {!isFeatured && (
          <button
            id={`service-promote-${id}`}
            type="button"
            onClick={() => onPromote && onPromote(service)}
            className="w-full text-center text-[11px] font-semibold text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 hover:underline flex items-center justify-center gap-1 pt-1"
          >
            <Flame className="w-3 h-3" />
            <span>Promote as Featured (₹99/week via Razorpay)</span>
          </button>
        )}

      </div>

    </div>
  );
}
