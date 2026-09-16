import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Lock, 
  Unlock, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Users, 
  MessageSquare, 
  Trash2, 
  CheckCircle, 
  Circle, 
  Edit3, 
  Plus, 
  Sparkles, 
  ExternalLink, 
  Image as ImageIcon, 
  Save, 
  RefreshCw,
  Search,
  Flame,
  AlertCircle,
  Clock,
  MapPin,
  FileText
} from 'lucide-react';
import { 
  subscribeToMessages, 
  toggleMessageRead, 
  deleteMessage, 
  subscribeToTransactions, 
  subscribeToHeroSettings, 
  updateHeroSettings, 
  subscribeToServices, 
  saveService, 
  deleteService, 
  toggleFeaturedService 
} from '../firebase.js';

export default function AdminDashboard({ showToast }) {
  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return sessionStorage.getItem('skillswap_admin_authed') === 'true';
  });
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState('');

  // Active Tab: 'FINANCES' | 'MESSAGES' | 'CMS_HERO' | 'SERVICES'
  const [activeTab, setActiveTab] = useState('FINANCES');

  // Real-time Data
  const [messages, setMessages] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [services, setServices] = useState([]);
  const [heroSettings, setHeroSettings] = useState({
    title: '',
    subtitle: '',
    badge: '',
    bannerImage: ''
  });

  // CMS Form States
  const [heroForm, setHeroForm] = useState({
    title: '',
    subtitle: '',
    badge: '',
    bannerImage: ''
  });
  const [savingHero, setSavingHero] = useState(false);

  // Service Edit / Create Modal State
  const [serviceModalOpen, setServiceModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceFormData, setServiceFormData] = useState({
    title: '',
    providerName: '',
    category: 'Tech & Coding',
    price: '',
    duration: '',
    location: '',
    description: '',
    skills: '',
    isFeatured: false,
    availableForSwap: false,
    swapPreference: ''
  });

  // Filter in Messages
  const [messageFilter, setMessageFilter] = useState('ALL'); // 'ALL' | 'UNREAD'

  // Authenticate Admin
  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput.trim() === '9771264784') {
      setIsAuthenticated(true);
      sessionStorage.setItem('skillswap_admin_authed', 'true');
      setAuthError('');
      if (showToast) showToast("Admin authenticated successfully.", "success");
    } else {
      setAuthError('Incorrect password. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    sessionStorage.removeItem('skillswap_admin_authed');
    setPasswordInput('');
  };

  // Subscriptions
  useEffect(() => {
    if (!isAuthenticated) return;

    const unsubMessages = subscribeToMessages((data) => {
      setMessages(data || []);
    });

    const unsubTxs = subscribeToTransactions((data) => {
      setTransactions(data || []);
    });

    const unsubHero = subscribeToHeroSettings((data) => {
      if (data) {
        setHeroSettings(data);
        setHeroForm(data);
      }
    });

    const unsubServices = subscribeToServices((data) => {
      setServices(data || []);
    });

    return () => {
      if (unsubMessages) unsubMessages();
      if (unsubTxs) unsubTxs();
      if (unsubHero) unsubHero();
      if (unsubServices) unsubServices();
    };
  }, [isAuthenticated]);

  // Financial Calculations
  const grossRevenue = transactions.reduce((sum, tx) => sum + (Number(tx.totalAmount) || 0), 0);
  const totalCommissionEarned = transactions.reduce((sum, tx) => sum + (Number(tx.commissionEarned) || 0), 0);
  const totalProviderPayouts = transactions.reduce((sum, tx) => sum + (Number(tx.providerPayout) || 0), 0);
  const unreadMessagesCount = messages.filter(m => !m.read).length;

  // Save CMS Hero Settings
  const handleSaveHero = async (e) => {
    e.preventDefault();
    setSavingHero(true);
    try {
      await updateHeroSettings(heroForm);
      if (showToast) showToast("CMS Hero content updated and broadcast live!", "success");
    } catch (err) {
      if (showToast) showToast("Failed to update Hero CMS: " + err.message, "error");
    } finally {
      setSavingHero(false);
    }
  };

  // Save Service
  const handleSaveService = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...serviceFormData,
        id: editingService?.id,
        price: Number(serviceFormData.price) || 0,
        skills: typeof serviceFormData.skills === 'string' 
          ? serviceFormData.skills.split(',').map(s => s.trim()).filter(Boolean)
          : serviceFormData.skills,
        providerAvatar: editingService?.providerAvatar || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&q=80",
        rating: editingService?.rating || 5.0,
        reviewCount: editingService?.reviewCount || 1
      };

      await saveService(payload);
      setServiceModalOpen(false);
      setEditingService(null);
      if (showToast) showToast("Service listing saved and synced to homepage!", "success");
    } catch (err) {
      if (showToast) showToast("Failed to save service: " + err.message, "error");
    }
  };

  const handleOpenEditService = (service) => {
    setEditingService(service);
    setServiceFormData({
      title: service.title || '',
      providerName: service.providerName || '',
      category: service.category || 'Tech & Coding',
      price: service.price || 499,
      duration: service.duration || '1 Day',
      location: service.location || 'Local Hub',
      description: service.description || '',
      skills: Array.isArray(service.skills) ? service.skills.join(', ') : (service.skills || ''),
      isFeatured: Boolean(service.isFeatured),
      availableForSwap: Boolean(service.availableForSwap),
      swapPreference: service.swapPreference || ''
    });
    setServiceModalOpen(true);
  };

  const handleOpenNewService = () => {
    setEditingService(null);
    setServiceFormData({
      title: '',
      providerName: '',
      category: 'Tech & Coding',
      price: '',
      duration: '',
      location: '',
      description: '',
      skills: '',
      isFeatured: false,
      availableForSwap: false,
      swapPreference: ''
    });
    setServiceModalOpen(true);
  };

  // PASSWORD GATE LOGIN SCREEN
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-slate-900 via-slate-950 to-slate-900 text-slate-100">
        <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden backdrop-blur-md">
          
          <div className="w-14 h-14 mx-auto rounded-2xl bg-orange-600/20 text-orange-500 border border-orange-500/30 flex items-center justify-center shadow-inner">
            <Lock className="w-7 h-7" />
          </div>

          <div className="text-center space-y-1">
            <h2 className="text-2xl font-black tracking-tight text-white">
              SkillSwap Admin Portal
            </h2>
            <p className="text-xs text-slate-400">
              Restricted dashboard for financial metrics, live messaging & CMS management.
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Security Password:
              </label>
              <input
                id="admin-password-input"
                type="password"
                required
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                placeholder="Enter Admin Password"
                className="w-full px-4 py-3 rounded-xl bg-slate-800/80 border border-slate-700 text-white text-sm focus:ring-2 focus:ring-orange-500 focus:outline-none transition-all"
              />
            </div>

            {authError && (
              <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800/80 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <span>{authError}</span>
              </div>
            )}

            <button
              id="admin-login-button"
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold text-sm shadow-lg shadow-orange-600/25 transition-all hover:scale-[1.01]"
            >
              Authenticate & Enter
            </button>
          </form>

          <div className="pt-4 border-t border-slate-800 text-center">
            <Link to="/" className="text-xs text-slate-400 hover:text-white flex items-center justify-center gap-1">
              <span>← Back to Public Hub</span>
            </Link>
          </div>

        </div>
      </div>
    );
  }

  // AUTHENTICATED ADMIN PANEL
  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors">
      
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-30 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-orange-600 flex items-center justify-center text-white font-black text-sm shadow-sm">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-extrabold text-base text-slate-900 dark:text-white">
                    SkillSwap Admin Console
                  </h1>
                  <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-700 dark:text-emerald-400 border border-emerald-300 dark:border-emerald-800">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    Live Sync
                  </span>
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Password Protected Administrator Access
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <span>Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-900 text-xs font-bold hover:bg-rose-100 transition-colors"
              >
                Sign Out
              </button>
            </div>

          </div>

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto py-2.5 border-t border-slate-100 dark:border-slate-800/80 text-xs">
            <button
              onClick={() => setActiveTab('FINANCES')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${
                activeTab === 'FINANCES'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              <span>Revenue & Commission (10%)</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/20">
                ₹{totalCommissionEarned.toLocaleString()}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('MESSAGES')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${
                activeTab === 'MESSAGES'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>Live Message Center</span>
              {unreadMessagesCount > 0 && (
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-rose-500 text-white">
                  {unreadMessagesCount} new
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('CMS_HERO')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${
                activeTab === 'CMS_HERO'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Edit3 className="w-4 h-4" />
              <span>CMS: Homepage Hero</span>
            </button>

            <button
              onClick={() => setActiveTab('SERVICES')}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl font-bold whitespace-nowrap transition-colors ${
                activeTab === 'SERVICES'
                  ? 'bg-orange-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Manage Services & Badges</span>
              <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-200 dark:bg-slate-700">
                {services.length}
              </span>
            </button>
          </div>

        </div>
      </header>

      {/* Main Admin Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* ==================================================== */}
        {/* TAB 1: REVENUE & FINANCIAL OVERVIEW (10% COMMISSION) */}
        {/* ==================================================== */}
        {activeTab === 'FINANCES' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            
            {/* Top Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              
              {/* Gross Revenue */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                  <span>Gross Processed Volume</span>
                  <div className="p-2 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
                    <DollarSign className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  ₹{grossRevenue.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Via Razorpay gateway checkout
                </div>
              </div>

              {/* 10% Platform Commission */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-900/60 shadow-sm space-y-2 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-xl pointer-events-none" />
                <div className="flex items-center justify-between text-orange-600 dark:text-orange-400 text-xs font-bold">
                  <span>Platform Commission (10%)</span>
                  <div className="p-2 rounded-xl bg-orange-500/10 text-orange-600 dark:text-orange-400">
                    <Percent className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-orange-600 dark:text-orange-400">
                  ₹{totalCommissionEarned.toLocaleString()}
                </div>
                <div className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">
                  Net Platform Revenue Earned
                </div>
              </div>

              {/* 90% Provider Payouts */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                  <span>Provider Payouts (90%)</span>
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                    <Users className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-emerald-600 dark:text-emerald-400">
                  ₹{totalProviderPayouts.toLocaleString()}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Direct to verified local gig pros
                </div>
              </div>

              {/* Total Transactions */}
              <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-2">
                <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs font-semibold">
                  <span>Completed Transactions</span>
                  <div className="p-2 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
                    <CheckCircle className="w-4 h-4" />
                  </div>
                </div>
                <div className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                  {transactions.length}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">
                  Firestore collection: `transactions`
                </div>
              </div>

            </div>

            {/* Transactions Ledger Table */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    Razorpay Transaction Audit Ledger
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Every payment split (10% fee / 90% payout) automatically captured in real-time.
                  </p>
                </div>
                <span className="text-xs font-semibold text-slate-500">
                  {transactions.length} Total Records
                </span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">Transaction ID</th>
                      <th className="px-6 py-3.5">Service / Item</th>
                      <th className="px-6 py-3.5">Customer</th>
                      <th className="px-6 py-3.5">Gross Amount</th>
                      <th className="px-6 py-3.5 text-orange-600 dark:text-orange-400">10% Platform Fee</th>
                      <th className="px-6 py-3.5 text-emerald-600 dark:text-emerald-400">90% Provider Payout</th>
                      <th className="px-6 py-3.5">Status</th>
                      <th className="px-6 py-3.5">Date & Time</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {transactions.length > 0 ? (
                      transactions.map((tx) => (
                        <tr key={tx.id || tx.transactionId} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                          <td className="px-6 py-4 font-mono font-bold text-slate-800 dark:text-slate-200">
                            {tx.transactionId}
                          </td>
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-900 dark:text-white line-clamp-1 max-w-[200px]">
                              {tx.serviceTitle || "Micro-Service"}
                            </div>
                            <span className="text-[10px] text-slate-400">
                              {tx.type === 'FEATURED_BADGE' ? 'Featured Badge (₹99)' : 'Job Booking'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                            <div className="font-medium">{tx.customerName || "Customer"}</div>
                            <div className="text-[11px] text-slate-400">{tx.customerEmail || ""}</div>
                          </td>
                          <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white">
                            ₹{Number(tx.totalAmount).toLocaleString()}
                          </td>
                          <td className="px-6 py-4 font-bold text-orange-600 dark:text-orange-400">
                            ₹{Number(tx.commissionEarned).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400">
                            ₹{Number(tx.providerPayout).toFixed(2)}
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                              {tx.status || 'SUCCESS'}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-slate-400 whitespace-nowrap">
                            {tx.timestamp ? new Date(tx.timestamp).toLocaleString() : 'Recent'}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={8} className="px-6 py-8 text-center text-slate-400">
                          No transactions recorded yet. Book a service on the homepage to see live logging!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 2: LIVE MESSAGE CENTER (SNAPSHOT LISTENERS) */}
        {/* ==================================================== */}
        {activeTab === 'MESSAGES' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Live Message & Task Request Center
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Real-time sync from Firestore `messages` collection. Automatically reflects inquiries across all devices.
                </p>
              </div>

              {/* Filter pills */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setMessageFilter('ALL')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    messageFilter === 'ALL'
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  All ({messages.length})
                </button>
                <button
                  onClick={() => setMessageFilter('UNREAD')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-colors ${
                    messageFilter === 'UNREAD'
                      ? 'bg-orange-600 text-white'
                      : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  Unread ({unreadMessagesCount})
                </button>
              </div>
            </div>

            {/* Message Cards List */}
            <div className="space-y-3">
              {messages
                .filter(m => messageFilter === 'ALL' || !m.read)
                .map((msg) => (
                  <div
                    key={msg.id}
                    className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border transition-all ${
                      !msg.read 
                        ? 'border-orange-400/80 dark:border-orange-500/80 ring-1 ring-orange-400/20 shadow-sm' 
                        : 'border-slate-200 dark:border-slate-800 opacity-90'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                      
                      <div className="space-y-2 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wide ${
                            !msg.read 
                              ? 'bg-orange-600 text-white' 
                              : 'bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}>
                            {!msg.read ? 'New Inquiry' : 'Read'}
                          </span>

                          <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700">
                            {msg.requestType || 'Task Request'}
                          </span>

                          <span className="text-[11px] font-semibold text-orange-600 dark:text-orange-400">
                            Category: {msg.category}
                          </span>

                          <span className="text-xs text-slate-400">
                            • {msg.timestamp ? new Date(msg.timestamp).toLocaleString() : 'Just now'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-baseline gap-3">
                          <h4 className="text-base font-bold text-slate-900 dark:text-white">
                            {msg.name}
                          </h4>
                          <span className="text-xs text-slate-500 dark:text-slate-400">
                            {msg.email}
                          </span>
                          {msg.phone && (
                            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
                              Tel: {msg.phone}
                            </span>
                          )}
                          {msg.location && (
                            <span className="flex items-center gap-1 text-xs text-slate-400">
                              <MapPin className="w-3 h-3" />
                              {msg.location}
                            </span>
                          )}
                        </div>

                        {/* Budget or proposal */}
                        {msg.budget && (
                          <div className="inline-block px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-xs font-semibold border border-emerald-200 dark:border-emerald-800/60">
                            Budget / Swap Offer: {msg.budget}
                          </div>
                        )}

                        <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200/80 dark:border-slate-700 leading-relaxed whitespace-pre-wrap">
                          {msg.message}
                        </p>
                      </div>

                      {/* Action buttons */}
                      <div className="flex sm:flex-col items-center gap-2 self-end sm:self-start shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            toggleMessageRead(msg.id, msg.read);
                            if (showToast) showToast(`Message marked as ${!msg.read ? 'read' : 'unread'}.`, 'success');
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors flex items-center gap-1.5 ${
                            msg.read
                              ? 'border-slate-300 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                              : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-600'
                          }`}
                        >
                          <CheckCircle className="w-3.5 h-3.5" />
                          <span>{msg.read ? 'Mark Unread' : 'Mark Read'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm("Are you sure you want to delete this message?")) {
                              deleteMessage(msg.id);
                              if (showToast) showToast("Message deleted from Firestore.", "success");
                            }
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-bold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
                        </button>

                        {msg.email && (
                          <a
                            href={`mailto:${msg.email}?subject=Regarding your SkillSwap Task Request`}
                            className="px-3 py-1.5 rounded-xl text-xs font-bold text-orange-600 hover:underline"
                          >
                            Reply Email →
                          </a>
                        )}
                      </div>

                    </div>
                  </div>
                ))}

              {messages.length === 0 && (
                <div className="p-12 text-center rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                  <MessageSquare className="w-10 h-10 mx-auto text-slate-400 mb-2" />
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">No messages yet</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Send a task inquiry or message from the homepage form to see real-time sync in action.
                  </p>
                </div>
              )}
            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 3: DYNAMIC CMS FOR HOMEPAGE HERO & BANNER */}
        {/* ==================================================== */}
        {activeTab === 'CMS_HERO' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Dynamic Content Management System (CMS)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Update homepage hero headlines, badge text, subtext, and banner imagery in real-time.
                </p>
              </div>

              <Link
                to="/"
                target="_blank"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-orange-600 hover:underline"
              >
                <span>Preview Changes on Live Site</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Column: CMS Edit Form */}
              <div className="lg:col-span-7">
                <form onSubmit={handleSaveHero} className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-5 text-xs">
                  
                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                      Top Badge Label
                    </label>
                    <input
                      type="text"
                      value={heroForm.badge || ''}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, badge: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                      Hero Main Headline Title
                    </label>
                    <textarea
                      rows={2}
                      value={heroForm.title || ''}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, title: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                      Hero Subtitle Description
                    </label>
                    <textarea
                      rows={3}
                      value={heroForm.subtitle || ''}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, subtitle: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                      Banner Imagery URL
                    </label>
                    <input
                      type="url"
                      value={heroForm.bannerImage || ''}
                      onChange={(e) => setHeroForm(prev => ({ ...prev, bannerImage: e.target.value }))}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-orange-500 focus:outline-none"
                    />

                    {/* Quick Preset Imagery Options */}
                    <div className="flex items-center gap-2 pt-1 text-[11px]">
                      <span className="text-slate-400">Presets:</span>
                      <button
                        type="button"
                        onClick={() => setHeroForm(prev => ({ ...prev, bannerImage: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=1600&q=80" }))}
                        className="text-orange-600 hover:underline font-semibold"
                      >
                        Team Collab
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => setHeroForm(prev => ({ ...prev, bannerImage: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1600&q=80" }))}
                        className="text-orange-600 hover:underline font-semibold"
                      >
                        Home Repair
                      </button>
                      <span>•</span>
                      <button
                        type="button"
                        onClick={() => setHeroForm(prev => ({ ...prev, bannerImage: "https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1600&q=80" }))}
                        className="text-orange-600 hover:underline font-semibold"
                      >
                        Tech Workspace
                      </button>
                    </div>
                  </div>

                  <button
                    id="save-cms-hero-btn"
                    type="submit"
                    disabled={savingHero}
                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    <span>{savingHero ? "Publishing Changes to Firestore..." : "Save & Broadcast to Live Site"}</span>
                  </button>

                </form>
              </div>

              {/* Right Column: Live Visual Preview */}
              <div className="lg:col-span-5 space-y-3">
                <div className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Live Preview on Desktop
                </div>

                <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md space-y-4">
                  <div className="inline-block px-2.5 py-0.5 rounded-full bg-orange-100 dark:bg-orange-950 text-orange-800 dark:text-orange-300 text-[10px] font-bold">
                    {heroForm.badge || 'Badge Text'}
                  </div>

                  <h3 className="text-xl font-black text-slate-900 dark:text-white leading-tight">
                    {heroForm.title || 'Headline'}
                  </h3>

                  <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-3">
                    {heroForm.subtitle || 'Subtext description'}
                  </p>

                  <div className="rounded-2xl overflow-hidden h-40 bg-slate-950">
                    <img
                      src={heroForm.bannerImage || "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&w=800&q=80"}
                      alt="Banner Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

            </div>

          </div>
        )}

        {/* ==================================================== */}
        {/* TAB 4: SERVICE LISTINGS & FEATURED BADGE MANAGER */}
        {/* ==================================================== */}
        {activeTab === 'SERVICES' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">
                  Local Service Listings CMS
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Add new services, update prices, toggle ₹99 Featured Badges, or remove inactive offerings.
                </p>
              </div>

              <button
                type="button"
                onClick={handleOpenNewService}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Service</span>
              </button>
            </div>

            {/* Services Table */}
            <div className="rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 dark:text-slate-400 uppercase tracking-wider font-semibold border-b border-slate-200 dark:border-slate-800">
                    <tr>
                      <th className="px-6 py-3.5">Service Title & Category</th>
                      <th className="px-6 py-3.5">Provider</th>
                      <th className="px-6 py-3.5">Price (₹)</th>
                      <th className="px-6 py-3.5">10% Platform Fee</th>
                      <th className="px-6 py-3.5">Featured (₹99)</th>
                      <th className="px-6 py-3.5">Skill Swap</th>
                      <th className="px-6 py-3.5 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {services.length > 0 ? (
                      services.map((s) => (
                        <tr key={s.id} className="hover:bg-slate-50/70 dark:hover:bg-slate-800/40 transition-colors">
                          
                          <td className="px-6 py-4">
                            <div className="font-bold text-slate-900 dark:text-white line-clamp-1 max-w-[220px]">
                              {s.title}
                            </div>
                            <span className="text-[10px] text-slate-500 dark:text-slate-400">
                              {s.category} • {s.location}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-800 dark:text-slate-200">
                              {s.providerName}
                            </div>
                            <div className="text-[10px] text-amber-500">★ {s.rating || 5.0}</div>
                          </td>

                          <td className="px-6 py-4 font-black text-slate-900 dark:text-white">
                            ₹{Number(s.price).toLocaleString()}
                          </td>

                          <td className="px-6 py-4 font-semibold text-orange-600 dark:text-orange-400">
                            ₹{(Number(s.price) * 0.10).toFixed(0)}
                          </td>

                          <td className="px-6 py-4">
                            <button
                              type="button"
                              onClick={() => {
                                toggleFeaturedService(s.id, !s.isFeatured);
                                if (showToast) showToast(`Featured badge ${!s.isFeatured ? 'activated' : 'deactivated'} for ${s.title}`, 'success');
                              }}
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1 ${
                                s.isFeatured
                                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border border-amber-300'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <Flame className={`w-3 h-3 ${s.isFeatured ? 'fill-amber-500 text-amber-500' : ''}`} />
                              <span>{s.isFeatured ? 'Active (₹99)' : 'Standard'}</span>
                            </button>
                          </td>

                          <td className="px-6 py-4">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                              s.availableForSwap 
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300' 
                                : 'text-slate-400'
                            }`}>
                              {s.availableForSwap ? 'Swap Ready' : 'Cash Only'}
                            </span>
                          </td>

                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button
                                type="button"
                                onClick={() => handleOpenEditService(s)}
                                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                                title="Edit Listing"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  if (window.confirm(`Delete service: "${s.title}"?`)) {
                                    deleteService(s.id);
                                    if (showToast) showToast("Service deleted from hub.", "success");
                                  }
                                }}
                                className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/50"
                                title="Delete Listing"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>

                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-6 py-10 text-center text-slate-400">
                          <div className="max-w-xs mx-auto space-y-2">
                            <p className="font-semibold text-slate-500 dark:text-slate-400">No services listed yet</p>
                            <p className="text-[11px] text-slate-400">Click &quot;Add New Service&quot; above to create your first verified offering.</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* SERVICE EDIT/CREATE MODAL */}
      {serviceModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in">
          <div className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-6 sm:p-8 space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex justify-between items-center pb-2 border-b border-slate-200 dark:border-slate-800">
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                {editingService ? "Edit Service Listing" : "Add New Local Micro-Service"}
              </h3>
              <button
                onClick={() => setServiceModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveService} className="space-y-3.5 text-xs">
              
              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Service Title</label>
                <input
                  type="text"
                  required
                  value={serviceFormData.title}
                  onChange={(e) => setServiceFormData(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  placeholder="e.g. Rapid Plumbing & Drain Unclogging"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Provider Name</label>
                  <input
                    type="text"
                    required
                    value={serviceFormData.providerName}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, providerName: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    placeholder="e.g. Ramesh Kumar"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Category</label>
                  <select
                    value={serviceFormData.category}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, category: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  >
                    <option value="Tech & Coding">Tech & Coding</option>
                    <option value="Home Repairs">Home Repairs</option>
                    <option value="Tutoring & Education">Tutoring & Education</option>
                    <option value="Design & Creative">Design & Creative</option>
                    <option value="Fitness & Health">Fitness & Health</option>
                    <option value="General Handyman">General Handyman</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Price (₹)</label>
                  <input
                    type="number"
                    required
                    value={serviceFormData.price}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, price: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white font-bold"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Duration</label>
                  <input
                    type="text"
                    value={serviceFormData.duration}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, duration: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    placeholder="e.g. 1-2 Hours"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Location</label>
                  <input
                    type="text"
                    value={serviceFormData.location}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, location: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    placeholder="e.g. Koramangala"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Description</label>
                <textarea
                  rows={3}
                  value={serviceFormData.description}
                  onChange={(e) => setServiceFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  placeholder="Details about what is covered in this service..."
                />
              </div>

              <div className="space-y-1">
                <label className="font-semibold text-slate-700 dark:text-slate-300">Skills / Tags (comma-separated)</label>
                <input
                  type="text"
                  value={serviceFormData.skills}
                  onChange={(e) => setServiceFormData(prev => ({ ...prev, skills: e.target.value }))}
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                  placeholder="e.g. Fast, Safe, Tools Included"
                />
              </div>

              <div className="flex items-center gap-6 pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={serviceFormData.isFeatured}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, isFeatured: e.target.checked }))}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span>Featured Pro Badge (₹99/wk)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={serviceFormData.availableForSwap}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, availableForSwap: e.target.checked }))}
                    className="w-4 h-4 rounded text-orange-600 focus:ring-orange-500"
                  />
                  <span>Skill Swap Allowed</span>
                </label>
              </div>

              {serviceFormData.availableForSwap && (
                <div className="space-y-1">
                  <label className="font-semibold text-slate-700 dark:text-slate-300">Swap Preference</label>
                  <input
                    type="text"
                    value={serviceFormData.swapPreference}
                    onChange={(e) => setServiceFormData(prev => ({ ...prev, swapPreference: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white"
                    placeholder="e.g. Will swap for UI Design or Language Tutoring"
                  />
                </div>
              )}

              <div className="flex justify-end gap-2 pt-3 border-t border-slate-200 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setServiceModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-xs font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-500 text-white text-xs font-bold"
                >
                  Save Service
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
}
