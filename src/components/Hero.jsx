import React from 'react';
import { 
  Sparkles, 
  ShieldCheck, 
  CreditCard, 
  ArrowRight, 
  Users, 
  CheckCircle2, 
  Search,
  Zap,
  Tag
} from 'lucide-react';

export default function Hero({ heroSettings, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory, categories }) {
  const hero = heroSettings || {};

  return (
    <section className="relative overflow-hidden pt-6 pb-12 sm:pt-10 sm:pb-16 bg-gradient-to-b from-orange-50/60 via-slate-50 to-white dark:from-slate-900/50 dark:via-slate-950 dark:to-slate-950">
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-r from-orange-300/15 via-amber-300/20 to-rose-300/15 dark:from-orange-500/10 dark:via-amber-500/5 dark:to-rose-500/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          
          {/* Left Column: Copy & Search */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            
            {/* Live CMS Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-orange-100/90 text-orange-800 dark:bg-orange-950/80 dark:text-orange-300 border border-orange-200/80 dark:border-orange-800/80 text-xs font-bold tracking-wide shadow-sm">
              <Zap className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span>{hero.badge || "⚡ HyperLocal Micro-Services & Skill Exchange Hub"}</span>
            </div>

            {/* Headline */}
            <h1 className="text-3xl sm:text-5xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              {hero.title || "Connect, Hire & Swap Skills with Trusted Local Experts"}
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {hero.subtitle || "Empowering hyper-local micro-services, task gig work, and peer-to-peer skill exchanges with instant Razorpay booking and a transparent 10% commission model."}
            </p>

            {/* Search and Filter Input */}
            <div className="pt-2 max-w-xl mx-auto lg:mx-0">
              <div className="relative flex items-center shadow-md rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1.5 focus-within:ring-2 focus-within:ring-orange-500/50 transition-all">
                <Search className="w-5 h-5 ml-3 text-slate-400" />
                <input
                  id="hero-search-input"
                  type="text"
                  placeholder="Search electricians, coders, AC repairs, tutors, designs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2.5 bg-transparent text-sm sm:text-base text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    onClick={() => setSearchQuery('')}
                    className="mr-2 text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    Clear
                  </button>
                )}
                <a
                  href="#services"
                  className="hidden sm:flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold transition-colors whitespace-nowrap shadow-sm"
                >
                  Find Pro
                </a>
              </div>

              {/* Quick Category Chips */}
              <div className="flex items-center gap-2 overflow-x-auto py-3 no-scrollbar text-xs">
                <span className="text-slate-400 font-medium whitespace-nowrap">Popular:</span>
                {categories && categories.slice(0, 5).map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(selectedCategory === cat ? 'All' : cat)}
                    className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition-colors border ${
                      selectedCategory === cat
                        ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                        : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:border-orange-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Trust Badges */}
            <div className="pt-2 grid grid-cols-3 gap-3 border-t border-slate-200/80 dark:border-slate-800/80 text-left">
              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400 mt-0.5">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">10% Platform Fee</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">90% directly to pros</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded-lg bg-orange-100 text-orange-700 dark:bg-orange-950/60 dark:text-orange-400 mt-0.5">
                  <CreditCard className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Razorpay Secure</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">UPI, Cards & NetBanking</div>
                </div>
              </div>

              <div className="flex items-start gap-2">
                <div className="p-1.5 rounded-lg bg-blue-100 text-blue-700 dark:bg-blue-950/60 dark:text-blue-400 mt-0.5">
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Skill Exchange</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Trade or pay cash</div>
                </div>
              </div>
            </div>

          </div>

          {/* Right Column: Dynamic Banner Visual & Quick Stat Overlay */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-slate-200/80 dark:border-slate-800 bg-slate-900 group">
              <img
                id="hero-banner-image"
                src={hero.bannerImage || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80"}
                alt="SkillSwap Micro Services Network"
                className="w-full h-80 sm:h-[420px] object-cover transition-transform duration-700 group-hover:scale-105 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />

              {/* Floating Stat Card 1 */}
              <div className="absolute top-4 left-4 p-3 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-lg border border-slate-200/60 dark:border-slate-700/60 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  10%
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900 dark:text-white">Automated Commission</div>
                  <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-semibold">Zero hidden fees for clients</div>
                </div>
              </div>

              {/* Floating Stat Card 2: Featured Badge Promotion */}
              <div className="absolute bottom-4 inset-x-4 p-3.5 rounded-2xl bg-white/95 dark:bg-slate-900/95 backdrop-blur-md shadow-xl border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
                    <Tag className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="text-xs font-bold text-slate-900 dark:text-white">Featured Badge For Pros</div>
                    <div className="text-[11px] text-slate-500 dark:text-slate-400">₹99/week via Razorpay to rank top</div>
                  </div>
                </div>
                <a
                  href="#featured-monetization"
                  className="text-xs font-bold text-orange-600 dark:text-orange-400 hover:underline flex items-center gap-1"
                >
                  Buy Badge
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
