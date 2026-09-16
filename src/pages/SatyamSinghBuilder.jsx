import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  CheckCircle2, 
  Sparkles, 
  Code2, 
  Smartphone, 
  Globe, 
  ShieldCheck, 
  Zap, 
  CreditCard, 
  Clock, 
  Award, 
  Mail, 
  Phone, 
  ArrowRight, 
  Check, 
  Send, 
  Layers, 
  Star,
  ExternalLink,
  Laptop,
  Database,
  Rocket,
  MessageCircle
} from 'lucide-react';
import PaymentModal from '../components/PaymentModal.jsx';
import { sendMessage } from '../firebase.js';

export default function SatyamSinghBuilder({ showToast }) {
  // Payment Modal State for ₹20,000 package
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [selectedServiceItem, setSelectedServiceItem] = useState(null);

  // Inquiry Form State
  const [inquiryForm, setInquiryForm] = useState({
    name: '',
    email: '',
    phone: '',
    projectType: 'Business Website (₹20,000)',
    budget: '₹20,000',
    timeline: '5-7 Days',
    message: ''
  });
  const [submittingInquiry, setSubmittingInquiry] = useState(false);
  const [inquirySubmitted, setInquirySubmitted] = useState(false);

  // Pre-configured Satyam Singh standard package
  const websiteServiceItem = {
    id: 'satyam-singh-website-20k',
    title: 'Complete Custom Website / Web App by Satyam Singh',
    price: 20000,
    providerName: 'Satyam Singh',
    category: 'App & Website Building',
    duration: '5-7 Days',
    location: 'Remote / Pan India',
    description: '1 Complete Professional Website or Web Application. Includes modern responsive UI, Razorpay payment gateway, custom domain setup, admin dashboard, and 1 month free support.'
  };

  const appServiceItem = {
    id: 'satyam-singh-app-custom',
    title: 'Custom Mobile / Web App Development by Satyam Singh',
    price: 20000,
    providerName: 'Satyam Singh',
    category: 'Full-Stack App Development',
    duration: '7-10 Days',
    location: 'Remote / Pan India',
    description: 'Custom React / Next.js / PWA full-stack web application with database, authentication, responsive interface, and payment processing.'
  };

  const handleBookPackage = (item) => {
    setSelectedServiceItem(item);
    setPaymentModalOpen(true);
  };

  const handleInquirySubmit = async (e) => {
    e.preventDefault();
    if (!inquiryForm.name.trim() || !inquiryForm.email.trim() || !inquiryForm.message.trim()) {
      if (showToast) showToast('Please fill in your name, email, and project details.', 'error');
      return;
    }

    setSubmittingInquiry(true);
    try {
      await sendMessage({
        name: inquiryForm.name.trim(),
        email: inquiryForm.email.trim(),
        phone: inquiryForm.phone.trim() || 'Not provided',
        location: 'Satyam Singh Builder Inquiry',
        category: 'App & Website Building',
        requestType: `Builder Order: ${inquiryForm.projectType}`,
        budget: inquiryForm.budget || '₹20,000',
        message: `[Satyam Singh App & Website Builder Inquiry]\nTimeline: ${inquiryForm.timeline}\nRequirements: ${inquiryForm.message}`
      });

      setInquirySubmitted(true);
      if (showToast) {
        showToast('Inquiry received! Satyam Singh will review and reach out promptly.', 'success');
      }
      setInquiryForm({
        name: '',
        email: '',
        phone: '',
        projectType: 'Business Website (₹20,000)',
        budget: '₹20,000',
        timeline: '5-7 Days',
        message: ''
      });
    } catch (err) {
      console.error('Failed to submit inquiry:', err);
      if (showToast) showToast('Could not send message. Please check connection.', 'error');
    } finally {
      setSubmittingInquiry(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      
      {/* Top Banner / Breadcrumb */}
      <div className="border-b border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400">
            <Link to="/" className="hover:text-orange-600 dark:hover:text-orange-400 font-medium">
              Home
            </Link>
            <span>/</span>
            <span className="text-slate-900 dark:text-white font-semibold">
              Satyam Singh • App & Website Builder
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-300 font-bold text-[11px] border border-emerald-200 dark:border-emerald-800">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Available for New Projects
            </span>
          </div>
        </div>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-16 lg:pb-24 border-b border-slate-200 dark:border-slate-800 bg-gradient-to-b from-orange-50/40 via-white to-slate-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-950">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            {/* Left Column: Bio & Value Proposition */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-orange-800 dark:text-orange-300 text-xs font-bold border border-orange-200 dark:border-orange-800/60">
                <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
                <span>Verified Full-Stack App & Website Architect</span>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
                Build Your Dream App & Website with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 via-amber-600 to-rose-600">
                  Satyam Singh
                </span>
              </h1>

              {/* Special Offer Highlight Pill */}
              <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 border border-orange-200 dark:border-orange-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="text-[11px] font-black uppercase tracking-wider text-orange-600 dark:text-orange-400">
                    Transparent Fixed Pricing
                  </div>
                  <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-0.5">
                    1 Website Ka ₹20,000 Only
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
                    End-to-end modern, responsive website. Complete with design, payment gateway, SEO & hosting.
                  </p>
                </div>

                <button
                  type="button"
                  id="hero-book-now-20k"
                  onClick={() => handleBookPackage(websiteServiceItem)}
                  className="shrink-0 px-5 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-extrabold text-sm shadow-lg shadow-orange-500/25 transition-transform hover:scale-[1.02] flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Book for ₹20,000</span>
                </button>
              </div>

              <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
                Whether you need a high-converting business portal, an interactive SaaS web app, an e-commerce platform with Razorpay checkout, or a custom cross-platform application—get enterprise-grade code crafted with care and delivered on time.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => handleBookPackage(websiteServiceItem)}
                  className="px-6 py-3.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold text-sm hover:bg-slate-800 dark:hover:bg-slate-100 shadow-md transition-all flex items-center gap-2"
                >
                  <Rocket className="w-4 h-4 text-orange-500" />
                  <span>Start Website Order (₹20,000)</span>
                </button>

                <a
                  href="https://wa.me/917091472879?text=Hi%20Satyam%2C%20I%20am%20interested%20in%20your%201%20Website%20Ka%20%E2%82%B920%2C000%20package."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-3.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                  <span>Chat on WhatsApp (7091472879)</span>
                </a>

                <a
                  href="#inquiry-form-section"
                  className="px-5 py-3.5 rounded-xl bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700 font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all flex items-center gap-2"
                >
                  <Mail className="w-4 h-4 text-orange-500" />
                  <span>Request Consultation</span>
                </a>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-200 dark:border-slate-800">
                <div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white">5-7 Days</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Rapid Delivery</div>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white">100%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Code Ownership</div>
                </div>
                <div>
                  <div className="text-xl font-extrabold text-slate-900 dark:text-white">5.0 ★</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Client Rating</div>
                </div>
              </div>

            </div>

            {/* Right Column: Satyam Singh Profile Card */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
                
                {/* Profile Header */}
                <div className="flex items-center gap-4 pb-6 border-b border-slate-100 dark:border-slate-800">
                  <div className="relative">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center text-white font-black text-2xl shadow-md">
                      SS
                    </div>
                    <div className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full border-2 border-white dark:border-slate-900" title="Online & Ready"></div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-lg font-bold text-slate-900 dark:text-white">Satyam Singh</h2>
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                    </div>
                    <p className="text-xs text-orange-600 dark:text-orange-400 font-semibold">Lead Full-Stack & App Engineer</p>
                    <div className="flex items-center gap-1 text-[11px] text-amber-500 mt-0.5">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span className="text-slate-500 dark:text-slate-400 ml-1">(5.0 Verified)</span>
                    </div>
                  </div>
                </div>

                {/* Direct Contact Info */}
                <div className="py-4 space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-orange-50 dark:bg-orange-950/40 text-orange-600 dark:text-orange-400">
                      <Mail className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Direct Email</span>
                      <a href="mailto:satyamsingh66291@gmail.com" className="font-semibold text-slate-900 dark:text-white hover:underline">
                        satyamsingh66291@gmail.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                      <Globe className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] block">Delivery Guarantee</span>
                      <span className="font-semibold text-slate-900 dark:text-white">
                        5-7 Working Days • 100% Satisfaction
                      </span>
                    </div>
                  </div>
                </div>

                {/* Core Stack Tags */}
                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2.5">
                    Engineering Stack
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {['React.js', 'Next.js', 'Tailwind CSS', 'Node.js', 'Firebase', 'Razorpay', 'TypeScript', 'PWA / Mobile', 'Vercel / Cloud'].map((tech) => (
                      <span
                        key={tech}
                        className="px-2 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 text-[11px] font-semibold"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Instant Action CTA Card */}
                <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => handleBookPackage(websiteServiceItem)}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
                  >
                    <span>Instant Razorpay Checkout (₹20,000)</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                  <p className="text-[10px] text-center text-slate-400 mt-2">
                    Secured by Razorpay • 10% Platform Commission Protected
                  </p>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* The ₹20,000 Website Package Breakdown */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 dark:text-orange-400">
              Complete Deliverable
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              What You Get in the ₹20,000 Website Package
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              No hidden fees, no unnecessary subscriptions. One clean, fixed price of ₹20,000 for your complete online presence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 flex items-center justify-center">
                <Laptop className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">5-8 Custom Designed Pages</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Home, About, Services/Products, Portfolio, Customer Testimonials, Dynamic Contact Form, and Privacy/Terms pages built to reflect your brand.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Smartphone className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">100% Mobile & Tablet Responsive</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Flawless layout across iPhone, Android phones, iPads, MacBooks, and 4K desktop screens. Tested across all major modern browsers.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CreditCard className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Razorpay & Payment Gateway</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Integrated UPI, Google Pay, PhonePe, Debit/Credit cards, and Net Banking payment gateway with live checkout and transaction receipts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Ultra-Fast Speed (95+ Lighthouse)</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Engineered using React and modern Vite bundling for near-instant sub-second load times, smooth route transitions, and low bandwidth usage.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">Domain & Hosting Deployment</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Free SSL certificate setup, automated Vercel/Cloud deployment pipeline, DNS configuration for your custom domain (.com, .in, .co).
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">30 Days Support & Source Code</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Complete GitHub repository handover with full code ownership, plus 30 days of free bug fixes and minor content updates post-launch.
              </p>
            </div>

          </div>

          {/* Pricing Highlight Banner */}
          <div className="mt-12 p-8 rounded-3xl bg-slate-900 text-white relative overflow-hidden shadow-2xl">
            <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">
                  Ready to launch your project?
                </span>
                <h3 className="text-2xl sm:text-3xl font-black mt-1">
                  1 Website Ka ₹20,000 • Get Started Today
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 max-w-xl">
                  Satyam Singh handles everything from design to code, payment gateway setup, and cloud hosting. Direct communication with the developer with zero middleman markups.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => handleBookPackage(websiteServiceItem)}
                  className="px-6 py-3.5 rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-extrabold text-sm shadow-lg shadow-orange-500/30 flex items-center justify-center gap-2"
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Book for ₹20,000</span>
                </button>
                <a
                  href="#inquiry-form-section"
                  className="px-6 py-3.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm text-center"
                >
                  Ask Question First
                </a>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Services Portfolio / What Satyam Singh Builds */}
      <section className="py-16 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 dark:text-orange-400">
              Solutions & Expertise
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              Custom Applications & Portals Built by Satyam Singh
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
              From corporate websites to dynamic booking engines, here are the types of digital platforms you can build.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Service 1 */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400">
                    <Globe className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-orange-600 dark:text-orange-400 px-2.5 py-1 rounded-full bg-orange-50 dark:bg-orange-950/40">
                    ₹20,000 Flat
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Company & Business Websites
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Professional credibility websites for consultancies, agencies, clinics, legal firms, and local businesses with lead capture and WhatsApp integration.
                </p>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Lead generation forms</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Google Maps & WhatsApp click-to-chat</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>High Google PageSpeed score</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleBookPackage(websiteServiceItem)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-orange-600 hover:text-white dark:bg-slate-800 dark:hover:bg-orange-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
              >
                Order Website (₹20,000)
              </button>
            </div>

            {/* Service 2 */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
                    <CreditCard className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-emerald-600 dark:text-emerald-400 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40">
                    ₹20,000 Flat
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  E-Commerce & Online Storefronts
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Sell physical products, digital downloads, or service packages online with automated Razorpay payments and order notification system.
                </p>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Product catalog with search & filter</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Razorpay UPI / Card checkout</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Customer invoices & receipt generation</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleBookPackage(websiteServiceItem)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-orange-600 hover:text-white dark:bg-slate-800 dark:hover:bg-orange-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
              >
                Order Storefront (₹20,000)
              </button>
            </div>

            {/* Service 3 */}
            <div className="rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between hover:shadow-lg transition-shadow">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2.5 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
                    <Smartphone className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-black text-blue-600 dark:text-blue-400 px-2.5 py-1 rounded-full bg-blue-50 dark:bg-blue-950/40">
                    ₹20,000 Flat
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2">
                  Full-Stack Web App & Portal
                </h3>
                <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mb-4">
                  Custom portals with user accounts, database management, interactive dashboards, and cloud storage powered by React & Firebase.
                </p>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 mb-6">
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>User authentication & profiles</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Real-time database (Firestore / SQL)</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                    <span>Admin analytics & control center</span>
                  </li>
                </ul>
              </div>
              <button
                type="button"
                onClick={() => handleBookPackage(appServiceItem)}
                className="w-full py-2.5 rounded-xl bg-slate-100 hover:bg-orange-600 hover:text-white dark:bg-slate-800 dark:hover:bg-orange-600 text-slate-800 dark:text-slate-200 text-xs font-bold transition-colors"
              >
                Order Web App (₹20,000)
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* How the Process Works */}
      <section className="py-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-12">
            <span className="text-xs font-extrabold uppercase tracking-widest text-orange-600 dark:text-orange-400">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              From Idea to Live Website in 5-7 Days
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-orange-600 text-white font-extrabold text-sm flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Brief & Requirement</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Share your business details, design preferences, and content. Satyam Singh outlines the architecture within 24 hours.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-orange-600 text-white font-extrabold text-sm flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Design & Prototype</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Get a clean modern preview of your pages with custom branding, responsive layouts, and interactive components.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-orange-600 text-white font-extrabold text-sm flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Coding & Integrations</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Full-stack coding with React, Razorpay payment gateway integration, database setup, and speed optimizations.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
              <div className="w-8 h-8 rounded-lg bg-orange-600 text-white font-extrabold text-sm flex items-center justify-center mb-4">
                4
              </div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">Launch & Support</h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                Deployment to your custom domain, SSL certification, full source code handover, and 30 days of free support.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* Inquiry & Project Consultation Form Section */}
      <section id="inquiry-form-section" className="py-16 bg-slate-50 dark:bg-slate-950">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-8 sm:p-12 shadow-xl">
            
            <div className="text-center max-w-2xl mx-auto mb-8">
              <span className="text-xs font-extrabold uppercase tracking-wider text-orange-600 dark:text-orange-400">
                Direct Developer Contact
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
                Tell Satyam Singh About Your Project
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
                Fill in the details below to schedule a quick call or discuss your website/app specifications directly.
              </p>
            </div>

            {inquirySubmitted ? (
              <div className="p-6 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-900 text-emerald-600 dark:text-emerald-300 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-base font-bold text-emerald-800 dark:text-emerald-200">
                  Thank you! Your inquiry has been sent to Satyam Singh.
                </h3>
                <p className="text-xs text-emerald-700 dark:text-emerald-300 max-w-md mx-auto">
                  Satyam Singh will review your project details and respond to your email shortly. You can also reach out directly via email at <span className="font-semibold underline">satyamsingh66291@gmail.com</span>.
                </p>
                <button
                  type="button"
                  onClick={() => setInquirySubmitted(false)}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleInquirySubmit} className="space-y-4">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Your Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Rahul Sharma"
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. rahul@example.com"
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Phone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      placeholder="+91 98765 43210"
                      value={inquiryForm.phone}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Project Type
                    </label>
                    <select
                      value={inquiryForm.projectType}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, projectType: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      <option value="Business Website (₹20,000)">Business Website (₹20,000)</option>
                      <option value="E-Commerce Store (₹20,000)">E-Commerce Store (₹20,000)</option>
                      <option value="Full-Stack Web App (₹20,000)">Full-Stack Web App (₹20,000)</option>
                      <option value="Mobile / PWA Application">Mobile / PWA Application</option>
                      <option value="Custom Software Development">Custom Software Development</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                      Expected Timeline
                    </label>
                    <select
                      value={inquiryForm.timeline}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, timeline: e.target.value })}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    >
                      <option value="5-7 Days (Standard)">5-7 Days (Standard)</option>
                      <option value="3-4 Days (Express Rush)">3-4 Days (Express Rush)</option>
                      <option value="2-3 Weeks (Large Scope)">2-3 Weeks (Large Scope)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    Describe Your Requirements *
                  </label>
                  <textarea
                    required
                    rows={4}
                    placeholder="Tell Satyam Singh about what features your website needs, your industry, reference websites you like, etc."
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                  ></textarea>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">
                    Directly delivered to <span className="font-semibold text-slate-700 dark:text-slate-300">satyamsingh66291@gmail.com</span>
                  </div>

                  <button
                    type="submit"
                    disabled={submittingInquiry}
                    className="w-full sm:w-auto px-6 py-3 rounded-xl bg-orange-600 hover:bg-orange-500 disabled:opacity-50 text-white text-xs font-bold shadow-md shadow-orange-500/20 flex items-center justify-center gap-2"
                  >
                    {submittingInquiry ? (
                      <span>Sending inquiry...</span>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Project Inquiry</span>
                      </>
                    )}
                  </button>
                </div>

              </form>
            )}

          </div>

        </div>
      </section>

      {/* Razorpay Payment Modal for Satyam Singh's ₹20,000 package */}
      <PaymentModal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        item={selectedServiceItem || websiteServiceItem}
        showToast={showToast}
        onPaymentSuccess={(receipt) => {
          if (showToast) {
            showToast(`Order confirmed! Receipt: ${receipt?.transactionId}`, 'success');
          }
        }}
      />

    </div>
  );
}
