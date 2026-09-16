import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Flame, 
  ShieldCheck, 
  Repeat, 
  CreditCard, 
  ArrowRight, 
  Filter, 
  CheckCircle2, 
  Award,
  Layers,
  HelpCircle,
  Zap,
  TrendingUp,
  MapPin,
  Laptop,
  Code2
} from 'lucide-react';
import Hero from '../components/Hero.jsx';
import ServiceCard from '../components/ServiceCard.jsx';
import PaymentModal from '../components/PaymentModal.jsx';
import ContactForm from '../components/ContactForm.jsx';
import { 
  subscribeToServices, 
  subscribeToHeroSettings 
} from '../firebase.js';

export default function Home({ showToast }) {
  const [services, setServices] = useState([]);
  const [heroSettings, setHeroSettings] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('featured'); // 'featured' | 'price-asc' | 'price-desc' | 'rating'
  
  // Payment Modal States
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [activePaymentItem, setActivePaymentItem] = useState(null);

  // Pre-fill contact form
  const [prefilledService, setPrefilledService] = useState(null);

  useEffect(() => {
    const unsubServices = subscribeToServices((data) => {
      setServices(data || []);
    });

    const unsubHero = subscribeToHeroSettings((data) => {
      setHeroSettings(data);
    });

    return () => {
      if (unsubServices) unsubServices();
      if (unsubHero) unsubHero();
    };
  }, []);

  const categories = [
    'All',
    'Tech & Coding',
    'Home Repairs',
    'Tutoring & Education',
    'Design & Creative',
    'Fitness & Health',
    'General Handyman'
  ];

  // Filtering & Sorting
  const filteredServices = services.filter((srv) => {
    const matchesCategory = selectedCategory === 'All' || srv.category === selectedCategory;
    const query = searchQuery.toLowerCase().trim();
    const matchesSearch = !query || 
      srv.title.toLowerCase().includes(query) ||
      srv.providerName.toLowerCase().includes(query) ||
      srv.description?.toLowerCase().includes(query) ||
      srv.skills?.some(s => s.toLowerCase().includes(query));
    return matchesCategory && matchesSearch;
  });

  const sortedServices = [...filteredServices].sort((a, b) => {
    if (sortBy === 'featured') {
      if (a.isFeatured && !b.isFeatured) return -1;
      if (!a.isFeatured && b.isFeatured) return 1;
      return (b.rating || 0) - (a.rating || 0);
    }
    if (sortBy === 'price-asc') return (a.price || 0) - (b.price || 0);
    if (sortBy === 'price-desc') return (b.price || 0) - (a.price || 0);
    if (sortBy === 'rating') return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  const featuredServices = services.filter(s => s.isFeatured);

  // Handler for booking a service with Razorpay
  const handleBookService = (service) => {
    setActivePaymentItem(service);
    setPaymentModalOpen(true);
  };

  // Handler for buying a Featured Badge for ₹99/week
  const handleBuyFeaturedBadge = (service) => {
    setActivePaymentItem({
      type: 'FEATURED_BADGE',
      service: service,
      price: 99
    });
    setPaymentModalOpen(true);
  };

  const handleContactPro = (service) => {
    setPrefilledService(service);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors">
      
      {/* Dynamic Hero Section (Controlled by Firestore CMS) */}
      <Hero
        heroSettings={heroSettings}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        categories={categories}
      />

      {/* FEATURED PROS SPOTLIGHT (Monetized Section via ₹99/week Razorpay) */}
      <section id="featured" className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-950/80 text-amber-800 dark:text-amber-300 text-xs font-extrabold tracking-wide mb-2 border border-amber-300 dark:border-amber-800">
              <Flame className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 fill-amber-500" />
              <span>Verified Top Ranked</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
              Featured Service Providers
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
              Top-rated pros who opted for the ₹99/week featured spotlight via Razorpay.
            </p>
          </div>

          <a
            href="#featured-monetization"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 dark:text-orange-400 hover:text-orange-700 dark:hover:text-orange-300 transition-colors"
          >
            <span>Promote your service for ₹99</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </a>
        </div>

        {featuredServices.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredServices.slice(0, 3).map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onBook={handleBookService}
                onPromote={handleBuyFeaturedBadge}
                onContact={handleContactPro}
              />
            ))}
          </div>
        ) : (
          <div className="p-8 text-center rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              No featured pros right now. Be the first to promote your service for ₹99!
            </p>
          </div>
        )}
      </section>

      {/* ALL LOCAL MICRO-SERVICES EXPLORER */}
      <section id="services" className="py-12 bg-white dark:bg-slate-900/50 border-y border-slate-200/80 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Section Header & Filters */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                Explore Micro-Services & Skill Swaps
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1">
                Showing {sortedServices.length} verified listings in your hyper-local neighborhood.
              </p>
            </div>

            {/* Category and Sort Controls */}
            <div className="flex flex-wrap items-center gap-3">
              
              {/* Category Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto p-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs">
                {['All', 'Tech & Coding', 'Home Repairs', 'Design & Creative'].map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? 'bg-white dark:bg-slate-900 text-orange-600 dark:text-orange-400 shadow-sm'
                        : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Sort Dropdown */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 hidden sm:inline">Sort:</span>
                <select
                  id="sort-select"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-xs font-bold py-2 px-3 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="featured">Featured First</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="rating">Top Rated</option>
                </select>
              </div>

            </div>
          </div>

          {/* Services Grid */}
          {services.length === 0 ? (
            <div className="py-16 text-center rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 p-8">
              <Sparkles className="w-12 h-12 mx-auto text-orange-500 mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Live Marketplace Ready</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                No services have been listed yet. Be the first to post a task inquiry below or publish a service via the Admin Console.
              </p>
              <div className="flex flex-wrap items-center justify-center gap-3">
                <a
                  href="#contact-section"
                  className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-sm hover:bg-orange-500"
                >
                  Post a Task Request
                </a>
              </div>
            </div>
          ) : sortedServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sortedServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  service={service}
                  onBook={handleBookService}
                  onPromote={handleBuyFeaturedBadge}
                  onContact={handleContactPro}
                />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-dashed border-slate-300 dark:border-slate-700 p-8">
              <HelpCircle className="w-12 h-12 mx-auto text-slate-400 mb-3" />
              <h3 className="text-base font-bold text-slate-900 dark:text-white">No services matched your filter</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto mt-1 mb-4">
                Try resetting your category or search query, or post a custom task request below.
              </p>
              <button
                onClick={() => { setSelectedCategory('All'); setSearchQuery(''); }}
                className="px-4 py-2 rounded-xl bg-orange-600 text-white text-xs font-bold shadow-sm hover:bg-orange-500"
              >
                Reset Filters
              </button>
            </div>
          )}

        </div>
      </section>

      {/* 10% AUTOMATED COMMISSION & MONETIZATION EXPLAINER */}
      <section id="commission-model" className="py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-white p-8 sm:p-12 border border-slate-800 shadow-2xl relative overflow-hidden">
          
          <div className="absolute -right-10 -bottom-10 w-80 h-80 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            
            <div className="lg:col-span-7 space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold border border-orange-500/30">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Fair & Transparent Platform Economics</span>
              </div>
              <h2 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
                Automated 10% Commission Engine
              </h2>
              <p className="text-sm text-slate-300 leading-relaxed">
                SkillSwap charges a transparent 10% platform fee on every completed booking.
                The remaining 90% is logged directly as a provider payout. Every split is computed automatically in real-time and tracked in the Admin Ledger.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-2xl font-black text-orange-400">10% Platform Fee</div>
                  <div className="text-xs text-slate-300">Covers escrow protection, Razorpay gateway fees, and admin dispute handling.</div>
                </div>
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-1">
                  <div className="text-2xl font-black text-emerald-400">90% Pro Payout</div>
                  <div className="text-xs text-slate-300">Paid out to verified local service pros, contractors, and freelancers upon job completion.</div>
                </div>
              </div>
            </div>

            {/* Example Calculation Box */}
            <div className="lg:col-span-5 bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/15 space-y-4">
              <div className="text-xs font-bold uppercase tracking-wider text-slate-400">Live Commission Example</div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center py-1 border-b border-white/10">
                  <span className="text-slate-300">Job Booking Price:</span>
                  <span className="font-bold text-white">₹1,000</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/10">
                  <span className="text-orange-400">Platform Commission (10%):</span>
                  <span className="font-bold text-orange-400">+ ₹100</span>
                </div>
                <div className="flex justify-between items-center py-1 border-b border-white/10">
                  <span className="text-emerald-400">Provider Net Payout (90%):</span>
                  <span className="font-bold text-emerald-400">₹900</span>
                </div>
                <div className="flex justify-between items-center pt-2 text-xs text-slate-400">
                  <span>Logged in Firestore:</span>
                  <span className="font-mono text-[11px] text-white">collection('transactions')</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* FEATURED BADGE PROMOTION UPSELL BANNER */}
      <section id="featured-monetization" className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-gradient-to-r from-amber-500 via-orange-500 to-rose-600 text-white p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-left">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-extrabold uppercase">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Provider Monetization</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black">
              Get 3X More Local Job Leads With a Featured Badge (₹99/week)
            </h3>
            <p className="text-xs sm:text-sm text-white/90 max-w-xl">
              Pay ₹99 securely via Razorpay to feature your listing directly in the top spotlight ribbon for 7 days.
            </p>
          </div>

          <button
            id="buy-featured-banner-btn"
            type="button"
            onClick={() => {
              // Pick first non-featured service or fallback
              const unfeatured = services.find(s => !s.isFeatured) || services[0];
              if (unfeatured) {
                handleBuyFeaturedBadge(unfeatured);
              }
            }}
            className="px-6 py-3.5 rounded-xl bg-white text-orange-700 hover:bg-orange-50 font-extrabold text-xs sm:text-sm shadow-md transition-all hover:scale-105 whitespace-nowrap"
          >
            Buy Featured Badge (₹99)
          </button>
        </div>
      </section>

      {/* REAL-TIME CONTACT & CUSTOM TASK FORM */}
      <ContactForm
        prefilledService={prefilledService}
        showToast={showToast}
      />

      {/* RAZORPAY PAYMENT MODAL (TRIGGERED FOR BOOKINGS & BADGES) */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        item={activePaymentItem}
        showToast={showToast}
        onPaymentSuccess={(tx) => {
          // Handled inside PaymentModal + fires toast
        }}
      />

      {/* FOOTER */}
      <footer className="bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-orange-600 flex items-center justify-center text-white font-black text-sm">
                S
              </div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white">
                Skill<span className="text-orange-600">Swap</span>
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                • HyperLocal Micro-Services Hub
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-6 text-xs text-slate-500 dark:text-slate-400 font-medium">
              <a href="#services" className="hover:text-orange-600">Services</a>
              <a href="#featured" className="hover:text-orange-600">Featured Pros</a>
              <a href="#commission-model" className="hover:text-orange-600">10% Commission</a>
              <a href="#contact-section" className="hover:text-orange-600">Post Task</a>
              <a href="/admin" className="text-orange-600 dark:text-orange-400 font-bold hover:underline">
                Admin Panel (/admin)
              </a>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 text-center sm:flex sm:justify-between text-xs text-slate-400">
            <p>© {new Date().getFullYear()} SkillSwap Hub. Pre-configured for Vercel deployment with zero 404 routing errors.</p>
            <p className="mt-2 sm:mt-0">Razorpay SDK • Firebase Firestore Real-Time • Tailwind CSS</p>
          </div>
        </div>
      </footer>

    </div>
  );
}
