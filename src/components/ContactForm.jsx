import React, { useState, useEffect } from 'react';
import { 
  Send, 
  Sparkles, 
  CheckCircle2, 
  Repeat, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  DollarSign, 
  HelpCircle 
} from 'lucide-react';
import { sendMessage } from '../firebase.js';

export default function ContactForm({ prefilledService, showToast }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    location: '',
    category: 'Tech & Coding',
    requestType: 'Task Request',
    budget: '',
    message: ''
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    if (prefilledService) {
      setFormData(prev => ({
        ...prev,
        category: prefilledService.category || prev.category,
        requestType: prefilledService.availableForSwap ? 'Skill Swap Proposal' : 'Task Request',
        budget: prefilledService.availableForSwap 
          ? `Swap for ${prefilledService.swapPreference || 'Skill Trade'}` 
          : `₹${prefilledService.price || ''}`,
        message: `Hi ${prefilledService.providerName || 'there'}, I am interested in your service: "${prefilledService.title}". `
      }));
      // Scroll to contact form smoothly
      const element = document.getElementById('contact-section');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [prefilledService]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      if (showToast) showToast("Please fill in your Name, Email, and Message.", "error");
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim() || 'Not specified',
        location: formData.location.trim() || 'Nearby',
        category: formData.category,
        requestType: formData.requestType,
        budget: formData.budget.trim() || 'Negotiable',
        message: formData.message.trim(),
        read: false
      };

      await sendMessage(payload);

      setSubmitted(true);
      if (showToast) {
        showToast("Message Sent Successfully! Synced real-time to Admin.", "success");
      }

      // Reset form after short delay
      setTimeout(() => {
        setFormData({
          name: '',
          email: '',
          phone: '',
          location: '',
          category: 'Tech & Coding',
          requestType: 'Task Request',
          budget: '',
          message: ''
        });
        setSubmitted(false);
      }, 3500);

    } catch (err) {
      console.error("Message send error:", err);
      if (showToast) showToast("Failed to send message: " + err.message, "error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section id="contact-section" className="py-16 sm:py-20 bg-slate-100/70 dark:bg-slate-900/60 border-t border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left Info Column */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-orange-600 dark:text-orange-400" />
              <span>Real-Time Messaging Center</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Request a Custom Task or Propose a Skill Swap
            </h2>

            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Have an urgent micro-task, home emergency, or want to barter your skills with a neighbour? Send your request below.
              Inquiries sync directly in real-time to the Admin Panel and notified local providers.
            </p>

            {/* Benefit Points */}
            <div className="space-y-4 pt-2">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400 shrink-0">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Instant Snapshot Sync</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Your message streams instantaneously to Firestore without page refresh.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 shrink-0">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Razorpay Secure Escrow</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    10% transparent platform fee, 90% paid to the service provider upon satisfaction.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700">
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 shrink-0">
                  <Repeat className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">Zero Cash Barter Option</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Trade your professional skills (coding, guitar, taxes, language) 1-on-1.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* Right Form Card */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl p-6 sm:p-8 relative">
              
              {submitted ? (
                <div className="py-12 text-center space-y-4 animate-in fade-in duration-300">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center ring-8 ring-emerald-50 dark:ring-emerald-900/40">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white">
                    Message Sent Successfully!
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md mx-auto">
                    Your message has been broadcast live to the Admin Message Center and matched service providers. Check back shortly!
                  </p>
                </div>
              ) : (
                <form id="contact-inquiry-form" onSubmit={handleSubmit} className="space-y-4 text-xs">
                  
                  {/* Request Type Selector */}
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                      Select Request Type
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Task Request', 'Skill Swap Proposal', 'General Inquiry'].map((type) => (
                        <button
                          key={type}
                          type="button"
                          onClick={() => setFormData(prev => ({ ...prev, requestType: type }))}
                          className={`py-2 px-2.5 rounded-xl font-bold text-center transition-colors border ${
                            formData.requestType === type
                              ? 'bg-orange-600 text-white border-orange-600 shadow-sm'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-orange-400'
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Name & Email */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-medium text-slate-700 dark:text-slate-300">
                        Full Name <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="contact-name"
                        type="text"
                        name="name"
                        required
                        placeholder="e.g. Satyendra Sharma"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-medium text-slate-700 dark:text-slate-300">
                        Email Address <span className="text-rose-500">*</span>
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        name="email"
                        required
                        placeholder="e.g. name@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Phone & Location */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-medium text-slate-700 dark:text-slate-300">
                        WhatsApp / Phone Number
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        name="phone"
                        placeholder="+91 98765 43210"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="font-medium text-slate-700 dark:text-slate-300">
                        Hyperlocal Location / Sector
                      </label>
                      <input
                        id="contact-location"
                        type="text"
                        name="location"
                        placeholder="e.g. Koramangala 4th Block"
                        value={formData.location}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Category & Budget */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="font-medium text-slate-700 dark:text-slate-300">
                        Service Category
                      </label>
                      <select
                        id="contact-category"
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      >
                        <option value="Tech & Coding">Tech & Coding</option>
                        <option value="Home Repairs">Home Repairs</option>
                        <option value="Tutoring & Education">Tutoring & Education</option>
                        <option value="Design & Creative">Design & Creative</option>
                        <option value="Fitness & Health">Fitness & Health</option>
                        <option value="General Handyman">General Handyman</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="font-medium text-slate-700 dark:text-slate-300">
                        Budget or Swap Offer
                      </label>
                      <input
                        id="contact-budget"
                        type="text"
                        name="budget"
                        placeholder="e.g. ₹1,200 or 'Will teach French'"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Message textarea */}
                  <div className="space-y-1">
                    <label className="font-medium text-slate-700 dark:text-slate-300">
                      Task Description / In-depth Requirements <span className="text-rose-500">*</span>
                    </label>
                    <textarea
                      id="contact-message"
                      name="message"
                      rows={4}
                      required
                      placeholder="Describe what needs fixing, timing, tools required, or your specific skill trade proposal..."
                      value={formData.message}
                      onChange={handleChange}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none resize-none"
                    />
                  </div>

                  {/* Submit Button */}
                  <button
                    id="submit-contact-button"
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-md shadow-orange-500/20 transition-all hover:scale-[1.01] disabled:opacity-50"
                  >
                    <Send className="w-4 h-4" />
                    <span>{submitting ? "Broadcasting to Live Firestore..." : "Send Request & Sync Live"}</span>
                  </button>

                  <p className="text-[10px] text-center text-slate-400 dark:text-slate-500">
                    🔒 Messages are saved in Firestore and instantly visible to administrators.
                  </p>

                </form>
              )}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
